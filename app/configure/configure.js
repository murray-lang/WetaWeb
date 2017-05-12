/*
 * Copyright (c) 2017, Murray Lang
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/**
 * @fileOverview Angular partial for displaying and setting the current Weta
 * configuration.
 * @author Murray Lang (murray@wetaproject.org)
 *
 */
'use strict';

angular.module('wetaApp.configure', ['ngRoute', 'ngMaterial', 'ngMessages']).
    config([
      '$routeProvider', function($routeProvider) {
        $routeProvider.when('/configure', {
          templateUrl: 'configure/configure.html'//,
          //controller: 'ConfigCtrl',
        });
      }])

    .filter('selectVariation', function() {
          return function(items, parts) {
            var filtered = [];
            if (items === undefined) {
                // Undefined items means that the config has no entry for a
                // given device
              return filtered;
            }
            for (var i = 0; i < items.length; i++) {
              var match = true;
              for (var j = 0; j < parts.length; j++) {
                if (!(parts[j].name in items[i])) {
                  match = false;
                  break;
                }
              }
              if (match) {
                filtered.push(items[i]);
              }
            }
            return filtered;
          };
        }
    )

    .directive('wetaPinList', [function() { return new WetaPinList();}])
    .directive('wetaPeriphList', [function() { return new WetaPeriphList();}])
    .directive('wetaDeviceList', [function() { return new WetaDeviceList();}])
    .controller(
        'ConfigCtrl',
        [
          '$rootScope',
          '$scope',
          '$interval',
          'ToolbarContext',
          'WetaProfileService',
          'WetaCommService',
          'WetaConfigUtils',
          'WetaDeviceUtils',
          'WetaCompilerService',
          'WetaCommDlg',
          function(
              $rootScope, $scope, $interval, toolbarContext, profileService, comms, configUtils,
              deviceUtils, compiler, commDlg) {
            var self = this;
            self.context = toolbarContext;
              // profileService reads target information from the local system
            self.profileService = profileService;
              // configUtils = helps with target configuration using a profile
            self.configUtils = configUtils;
            self.deviceUtils = deviceUtils;
              //self.configUtils.profile.profile = self.profileService.profile;
            self.profileService.urlBase = 'profiles/'; // It knows the rest
            self.profileName = '';

            self.onConfigQueryResult =
                function(config) {
                  if (config !== undefined) {
                    self.configUtils.setConfig(config);
                    self.profileName = self.configUtils.profileName;
                    self.onProfileSelected();
                    self.deviceUtils.onNewConfig();
                  }
                };

            self.onClickQuery = function(ev) {
              self.configUtils.clearConfig();
              commDlg.showQueryConfig(
                  ev,
                  self.context.address,
                  self.onConfigQueryResult);
            };

            /**
             * Handler for Save button in the toolbar
             * TODO: rewrite in Angular paradigm
             */
            self.onClickSave =
                function() {
                  var downloadUrl = null;
                  var filename = 'wetaconfig.json';
                  var jsonTxt;
                  try {
                    jsonTxt = angular.toJson(
                        self.configUtils.config,
                        function(key, value) {
                            // Filtering out owners
                          if (key === 'owner') {
                            return undefined;
                          }
                          return value;
                        },
                        4);
                  } catch (e) {
                    //TODO: display message
                    return;
                  }
                  var blob = new Blob([jsonTxt], {type: 'text/json'});
                  if (window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveBlob(blob, filename);
                  } else {
                    var elem = window.document.createElement('a');
                    // Release any previous url resources
                    if (downloadUrl) {
                      window.URL.revokeObjectURL(downloadUrl);
                    }
                    downloadUrl = window.URL.createObjectURL(blob);
                    elem.href = downloadUrl;
                    elem.download = filename;
                    document.body.appendChild(elem);
                    elem.click();
                    document.body.removeChild(elem);
                  }
                };

            self.onFileSelected =
                function(fileList) {
                  // Assume only one file selected
                  var jsonFile = fileList[0];
                  var reader = new FileReader();
                  // Callback for FileReader.readAsText() below
                  reader.onload = function(e) {
                    var jsonText = e.target.result;
                    try {
                      var config = JSON.parse(jsonText);
                      self.onConfigQueryResult(config);
                    } catch (e) {
                      //TODO: display such errors nicely
                    }
                  };
                  reader.readAsText(jsonFile);
                };

            self.equals = function(actual, expected) {
              return angular.equals(actual, expected);
            };

            self.onCapsChanged =
                function(pin) {
                  $rootScope.$broadcast('weta-pin-change', pin);
                };

            /**
             *Initialise pin capability selections
             *
             * Copy the pin capabilities array, but then interpret the boolean values of the
             * attributes as whether the user selected them, instead of their original
             * purpose of indicating whether the capability is supported.
             * @param pins Pin capability array
             * @param selections Object to initialise as the model for selections
             */
            self.initSelections =
                function(pins, selections) {
                  selections.length = 0;
                  // Copy the pin information, but set all capabilities to false
                  var anyLocked = false;
                  for (var i = 0; i < pins.length; i++) {
                    var newLength = selections.push({});
                    selections[newLength - 1].lock = 'lock' in pins[i];
                    for (var cap in pins[i]) {
                      if (cap === 'pin') {
                        selections[newLength - 1].pin = pins[i].pin;
                      } else if (cap !== 'lock') {
                        if (selections[newLength - 1].lock && cap in pins[i].lock) {
                          selections[newLength - 1][cap] = pins[i].lock[cap] === 1;
                          anyLocked = true;
                        } else {
                          selections[newLength - 1][cap] = false;
                        }
                      }
                    }
                  }
                };

            self.onProfilesLoaded =
                function(profiles, msg) {
                  if (profiles !== null) {
                    if (profiles.length > 0) {
                      if (self.profileName.length === 0) {
                        self.profileName = profiles[0].name;
                        self.onProfileSelected();
                      }
                    }
                  }
                };

            self.onProfileLoaded =
                function(profile, msg) {
                  if (profile !== null) {
                    self.configUtils.profile.profile = profile;
                    self.initSelections(self.configUtils.profile.caps.pins,
                        self.configUtils.pinSelections);
                    self.configUtils.profile.createHeaders();
                    self.configUtils.updateAllPinSelections();
                    $rootScope.$broadcast('weta-profile-change');
                  } else {
                    //TODO: display message
                  }
                };

            self.onDevicesLoaded =
                function(devices, msg) {
                  if (devices !== null) {
                    self.deviceUtils.devices = devices;
                    $rootScope.$broadcast('weta-devices-loaded');
                    //var headers = self.deviceUtils.getHeaderStructure('motors');
                  }
                };

            self.profileService.loadProfiles(self.onProfilesLoaded);
            self.profileService.loadDevices(self.onDevicesLoaded);

            self.onProfileSelected =
                function() {
                  if (self.profileName.length > 0) {
                    self.profileService.loadProfile(self.profileName,
                        self.onProfileLoaded);
                  }
                };

            self.onProgramResponse =
                function(success, msg) {

                };

            self.onClickProgram =
                function(ev) {
                  commDlg.showProgramConfig(
                      ev,
                      self.context.address,
                      self.configUtils.config,
                      'en',
                      self.onProgramResponse);
                };

            self.context.onChangeProfile = self.onProfileSelected.bind(self);
            self.context.onQuery = self.onClickQuery.bind(self, null);
            self.context.onProgram = self.onClickProgram.bind(self, null);
            self.context.onFileSelected = self.onFileSelected.bind(self);
            self.context.onSave = self.onClickSave.bind(self);

            $scope.$on(
                'weta-owner-notify',
                function(event, owner, newId) {
                  self.deviceUtils.notifyOwner(owner, newId);
                }
            );

            $scope.$on(
                '$destroy',
                function() {
                  self.context.clear();
              }
            );
          }]
    );
