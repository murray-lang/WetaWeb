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
 * @fileOverview Main application file.
 *
 * @author Murray Lang (murray@wetaproject.org)
 */

// Declare app level module which depends on views, and components
angular.module('wetaApp', [
    'ngRoute',
    'ngMaterial',
    'wetaApp.blockly',
    'wetaApp.editor',
    'wetaApp.configure',
    'wetaApp.monitor',
    'pascalprecht.translate'
])
    // Share the global configuration via injection
.provider('GlobalConfig', function() {
  'use strict';
  var self = this;
  self.config = {};
  this.$get = [
    function() {
      return new WetaConfigProvider(self.config);
    }
  ];
})
  // Share the global hardware profiles via injection
.provider('GlobalProfiles', function() {
  'use strict';
  var self = this;
  self.profiles = [];
  self.current = {};
  self.$get = [
    function() {
      return new WetaProfilesProvider(self.profiles, self.current);
    }
  ];
})
// Share the toolbar context via injection
.provider('ToolbarContext', function() {
  'use strict';
  var self = this;
  self.address = '';
  self.onQuery = null;
  self.onProgram = null;
  self.rom = false;
  self.onChangeProfile = null;
  self.onChangeLanguage = null;
  self.onFileSelected = null;
  self.onSave = null;
  self.onStop = null;
  self.$get = [
    function() {
      return new WetaToolbarContextProvider(
          self.address,
          self.onQuery,
          self.onProgram,
          self.rom,
          self.onChangeProfile,
          self.onChangeLanguage,
          self.onFileSelected,
          self.onSave,
          self.onStop);
    }
  ];
})
// Share the Blockly via injection
.provider('Blockly', function() {
  this.$get = [
    function() {
      return new WetaBlocklyProvider();
    }
  ];
})
.config(
    [
      '$locationProvider',
      '$routeProvider',
      '$translateProvider',
      function(
          $locationProvider,
          $routeProvider,
          $translateProvider
      ) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/blockly'});
      $translateProvider.useStaticFilesLoader({
        files: [{
          prefix: 'i18n/weta-locale-',
          suffix: '.json'
        }, {
          prefix: 'blockly/msg/json/blockly-',
          suffix: '.json'
        }, {
          prefix: 'blockly/msg/json/weta-',
          suffix: '.json'
        }]
      });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escape');
    }
])
.service('WetaLocaleService', ['$translate', 'Blockly', WetaLocaleService])
.service('WetaProfileService', ['GlobalProfiles', '$http', '$log', WetaProfileService])
.service('WetaProfileUtils', ['GlobalProfiles', WetaProfileUtils])
.service('WetaConfigUtils', ['GlobalConfig', 'WetaProfileUtils', WetaConfigUtils])
.service('WetaDeviceUtils', ['WetaConfigUtils', WetaDeviceUtils])
.service('WetaCommService', ['$http', '$log', WetaCommService])
.service('WetaCompilerService', [WetaCompilerService])
.service('WetaCommDlg', [
      '$mdDialog', 'WetaLocaleService', 'WetaCompilerService', 'WetaCommService',
      WetaCommDlg
    ])
.directive('wetaCommonToolbar',
    [
      'GlobalProfiles',
      'ToolbarContext',
      'WetaLocaleService',
      function(profiles, context, locales) {
        return new WetaCommonToolbar(profiles, context, locales);
      }
    ]
)
.controller('NavCtrl',
    [
      '$location',
      function($location) {
        var self = this;
          // Get the path from the location to initialise md-nav-bar
          // Remove the initial '/'
        self.currentNavItem = $location.$$path.substr(1);
      }
    ]
);

