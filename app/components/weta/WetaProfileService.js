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
 * @fileOverview An Angular service for loading target "profile" files.
 *
 * @author Murray Lang (murray@wetaproject.org)
 *
 */

/**
 * Service constructor
 * @param {WetaProfilesProvider} profiles Injected global profile
 * @param {$http} http Angular $http service
 * @param {$log} log Angular $log service
 * @constructor
 */
function WetaProfileService(profiles, http, log) {
  this.http = http;
  this.log = log;
  this.urlBase = '';
  this.profiles = profiles.profiles;
}

/**
 * Load the JSON file for the given profile. The file information will come
 * from the overall JSON profile file previously loaded.
 * @param {String} name Name of the required profile
 * @param {function} callback Callback function for success or failure
 */
WetaProfileService.prototype.loadProfile =
    function(name, callback) {
      'use strict';
      for (var i = 0; i < this.profiles.length; i++) {
        if (this.profiles[i].name === name) {
          this.loadFile(
              this.profiles[i].file,
              this.loadProfileSuccess.bind(this, callback),
              this.loadProfileFailure.bind(this, callback)
          );
          return;
        }
      }
      callback(null, name + ' not found in profiles');
    };

/**
 * Load the given local file
 * @param {String} file Name of the file
 * @param {function} onSuccess Callback for success
 * @param {function} onFailure Callback for failure
 */
WetaProfileService.prototype.loadFile =
    function(file, onSuccess, onFailure) {
      'use strict';
      this.http.get(this.urlBase + file).then(onSuccess, onFailure);
    };

/**
 * Load the overall profile JSON file
 * @param {function} callback Callback for success or failure
 */
WetaProfileService.prototype.loadProfiles =
    function(callback) {
      'use strict';
      this.loadFile(
          'profiles.json',
          this.loadProfilesSuccess.bind(this, callback),
          this.loadProfilesFailure.bind(this, callback)
      );
    };

/**
 * Callback function for success in loading overall profiles file
 * @param {function} callback Callback bound to this call in loadProfiles()
 * @param {Object} response HTTP response object
 */
WetaProfileService.prototype.loadProfilesSuccess =
    function(callback, response) {
      'use strict';
      angular.copy(response.data.profiles, this.profiles);
      callback(this.profiles, response.statusText);
    };

/**
 * Callback function for failure in loading overall profiles file
 * @param {function} callback Callback bound to this call in loadProfiles()
 * @param {Object} response HTTP response object
 */
WetaProfileService.prototype.loadProfilesFailure =
    function(callback, response) {
      'use strict';
      callback(null, 'Error reading profiles:' + response.statusText);

    };

/**
 * Callback function for success in loading a profile file
 * @param {function} callback Callback bound to this call in loadProfile()
 * @param {Object} response HTTP response object
 */
WetaProfileService.prototype.loadProfileSuccess =
    function(callback, response) {
      'use strict';
      //Object.assign(this.profile, response.data);
      callback(response.data, response.statusText);
    };

/**
 * Callback function for failure in loading a profile file
 * @param {function} callback Callback bound to this call in loadProfile()
 * @param {Object} response HTTP response object
 */
WetaProfileService.prototype.loadProfileFailure =
    function(callback, response) {
      'use strict';
      callback(null, 'Error reading target file:' + response.statusText);
    };

/**
 * Load the single JSON file than describes electronic devices that can
 * attach to a Weta MCU
 * @param {function} callback Callback for success or failure
 */
WetaProfileService.prototype.loadDevices =
    function(callback) {
      'use strict';
      this.loadFile(
          'devices.json',
          this.loadDevicesSuccess.bind(this, callback),
          this.loadDevicesFailure.bind(this, callback)
      );
    };

/**
 * Callback function for success in loading the devices file
 * @param {function} callback Callback bound to this call in loadProfile()
 * @param {Object} response HTTP response object
 */
WetaProfileService.prototype.loadDevicesSuccess =
    function(callback, response) {
      'use strict';
      //Object.assign(this.devices, response.data);
      callback(response.data, response.statusText);
    };

/**
 * Callback function for failure in loading the devices file
 * @param {function} callback Callback bound to this call in loadProfile()
 * @param {Object} response HTTP response object
 */
WetaProfileService.prototype.loadDevicesFailure =
    function(callback, response) {
      'use strict';
      callback(null, 'Error reading devices:' + response.statusText);

    };
