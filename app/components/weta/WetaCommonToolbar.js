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
 * @fileOverview An angular directive to display a common toolbar.
 *
 * @author Murray Lang (murray@wetaproject.org)
 *
 */

/**
 * Constructor for the directive
 * @param {WetaProfilesProvider} profiles Global Weta device profile information
 * @param {WetaToolbarContextProvider} context Links toolbar to current display
 * @param {WetaLocaleService} locales For managing locale/language changes
 * @constructor
 */
function WetaCommonToolbar(profiles, context, locales) {
  'use strict';
  this.profiles    = profiles;
  this.context     = context;
  this.locales     = locales;
  this.restrict    = 'A'; // Must be an attribute (for now)
  this.templateUrl = 'components/weta/WetaCommonToolbar.html';
  this.scope =
    {
      // Everything required is already injected
    };
}

/**
 * Angular custom directive link function
 * @param $scope
 * @param $element
 * @param $attrs
 */
WetaCommonToolbar.prototype.link =
    function($scope, $element, $attrs) {
      'use strict';
      var self = this;
      $scope.profiles = self.profiles.profiles;
      $scope.context = self.context;
      $scope.current = self.profiles.current;
      $scope.locales = self.locales;
      $scope.currentLanguage = self.locales.getCurrentLanguage();
      $scope.context.address = '10.1.1.9'; // For debugging

      /**
       * Get a list of available languages for a selection list
       */
      $scope.getLanguages =
          function() {
            return self.locales.getLanguages();
          };

      /**
       * Handle user selection of a language
       */
      $scope.onLanguageChange =
          function() {
              // Tell the locale service so that it can inform the world
            $scope.locales.setCurrentLanguage(
                $scope.currentLanguage,
                function(success) {
                  if (success) {
                      // Invoke any handler supplied by the current page
                    if ($scope.context.onChangeLanguage) {
                      $scope.context.onChangeLanguage($scope.currentLanguage);
                    }
                  }

                }
            );
          };

      /**
       * Handle a click of the Query button
       */
      $scope.onClickQuery = function() {
        // Invoke any handler supplied by the current page
        if ($scope.context.onQuery) {
          $scope.context.onQuery();
        }
      };

      $scope.onFileSelected = function() {
        var fileList = document.getElementById('uploadEl').files;
        if (fileList.length === 0) {
          return;
        }
          // Invoke any handler supplied by the current page
        if ($scope.context.onFileSelected) {
          $scope.context.onFileSelected(fileList);
        }
        document.body.removeChild(fileList); //Clean up created element
      };

      /**
       * Handle a click of the Open button
       */
      $scope.onClickOpen = function(resp) {
        var uploadEl = document.getElementById('uploadEl');
        uploadEl.onchange = $scope.onFileSelected.bind($scope);
        uploadEl.click();
      };

      /**
       * Handle a click of the Save button
       */
      $scope.onClickSave = function() {
        // Invoke any handler supplied by the current page
        if ($scope.context.onSave) {
          $scope.context.onSave();
        }
      };

      /**
       * Handle a click of the Program button
       */
      $scope.onClickProgram = function() {
        // Invoke any handler supplied by the current page
        if ($scope.context.onProgram) {
          $scope.context.onProgram();
        }
      };

      /**
       * Handle a click of the Stop button
       */
      $scope.onClickStop = function() {
        // Invoke any handler supplied by the current page
        if ($scope.context.onStop) {
          $scope.context.onStop();
        }
      };
      /*
      $scope.onLocalesInit =
          function(success) {
            $scope.currentLanguage = self.locales.getCurrentLanguage();
          };
      */

      $scope.onLanguageChange(); // Initialise with the current language
    };

