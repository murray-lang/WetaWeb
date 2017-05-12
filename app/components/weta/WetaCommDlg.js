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
 * @fileOverview Angular Material Dialog boxes for communication with a
 * Weta device. The name is slightly deceptive because the Weta logo compiler
 * and assembler are also invoked within the dialog to facilitate using
 * progress indicators. At some point I will focus on ways to separate the
 * compiler and assembler from the dialogs.
 *
 * @author Murray Lang (murray@wetaproject.org)
 *
 */

/**
 * Constructor for the WetaCommDlg service
 * @param {$mdDialog} mdDialog  Angular Material $mdDialog object
 * @param {WetaLocaleService} locales  Locale information
 * @param {WetaCompilerService} compiler  Compilers and assemblers
 * @param {WetaCommService} comms  For communication with Weta devices
 * @constructor
 */
function WetaCommDlg(mdDialog, locales, compiler, comms) {
  'use strict';
  this.mdDialog = mdDialog;
  this.locales  = locales;
  this.compiler = compiler;
  this.comms    = comms;
}

/**
 * Invoke a dialog for programming the configuration of a Weta device
 * @param {Object} ev Event associated with user click
 * @param {string} address IP address of Weta device
 * @param {Object} config Configuration object
 * @param {function} callback
 */
WetaCommDlg.prototype.showProgramConfig =
    function(ev, address, config, callback) {
      'use strict';
      this.show(
          this.programConfigController.bind(this, address, config),
          ev,
          callback);
    };

/**
 * Invoke a dialog for programming the a Weta device
 * @param {Object} ev Event associated with user click
 * @param {string} address IP address of Weta device
 * @param {string} code Source code (currently only Logo)
 * @param {boolean} rom Should the program go to ROM/Flash
 * @param {function}callback
 */
WetaCommDlg.prototype.showProgramCode =
    function(ev, address, code, rom, callback) {
      'use strict';
      this.show(
          this.programCodeController.bind(this, address, code, rom),
          ev,
          callback);
    };

/**
 * Invoke a dialog for querying the configuration of a Weta device
 * @param {Object} ev Event associated with user click
 * @param {string} address IP address of Weta device
 * @param {function}callback
 */
WetaCommDlg.prototype.showQueryConfig =
    function(ev, address, callback) {
      'use strict';
      this.show(
          this.queryConfigController.bind(this, address),
          ev,
          callback);
    };

/**
 * Generic code for invoking an Angular Material dialog box
 * @param {Object} controller Angular controller for the required purpose
 * @param {Object} ev Event associated with user click
 * @param callback
 */
WetaCommDlg.prototype.show =
    function(controller, ev, callback) {
      'use strict';
      var self = this;
        // Common wrapper function for the controller
      var dlgController =
          function($scope, $mdDialog) {
            controller($scope, $mdDialog);
          };

      this.mdDialog.show({
        controller: dlgController, // The wrapper above
        templateUrl: 'components/weta/WetaCommDlg.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        fullscreen: false
      })
      .then(callback, callback);
    };

/**
 * Controller for programming the configuration of a Weta device
 * @param {String} address IP address bound in showProgramConfig()
 * @param {Object} config Bound in showProgramConfig()
 * @param $scope Passed by Angular Material
 * @param $mdDialog Passed by Angular Material
 */
WetaCommDlg.prototype.programConfigController =
    function(address, config, $scope, $mdDialog) {
      'use strict';
      var self = this;
      $scope.progressMsg = '';
      $scope.progress = 0;
      $scope.journal = '';
      $scope.longOperation = false;

      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      var updateJournal =
          function(txt) {
            $scope.journal += txt;
          };

      var setProgressMsg =
          function(msg) {
            $scope.progressMsg = msg;
            updateJournal(msg + '\n');
          };

      var onProgramResponse =
          function(success, msg) {
            $scope.longOperation = false;
            if (success) {
              $scope.progress = 100;
              setProgressMsg('Done');
              $mdDialog.hide(true);
            } else {
              setProgressMsg('Error: ' + msg);
            }
          };
      var lang = this.locales.getCurrentLanguage();
      setProgressMsg('Compiling...');
        // Compile the configuration object into assembly text
      var wasm = this.compiler.compileConfig(config, lang);
      $scope.progress = 33;
      if (wasm.errors === 0) {
        setProgressMsg('Assembling...');
          // Assemble the text into JSON with byte codes
        var codes = this.compiler.assemble(wasm.wasm, lang, updateJournal);
        $scope.progress = 66;
        if (codes.errors === 0) {
          setProgressMsg('Uploading...');
          $scope.longOperation = true;
            // Send the configuration codes to the device
          this.comms.programConfig(address, codes.codes, onProgramResponse);
        }
      } else {
        $scope.progressMsg = 'Error compiling configuration: ' + wasm.msg;
      }
    };

/**
 * Controller for querying the configuration of a Weta device
 * @param {String} address IP address bound in showProgramConfig()
 * @param $scope Passed by Angular Material
 * @param $mdDialog Passed by Angular Material
 */
WetaCommDlg.prototype.queryConfigController =
    function(address, $scope, $mdDialog) {
      'use strict';
      var self = this;
      $scope.progressMsg = '';
      $scope.progress = 0;
      $scope.journal = '';
      $scope.longOperation = false;

      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      var updateJournal =
          function(txt) {
            $scope.journal += txt;
          };

      var setProgressMsg =
          function(msg) {
            $scope.progressMsg = msg;
            updateJournal(msg + '\n');
          };

      var onQueryResponse =
          function(newConfig, msg) {
            $scope.longOperation = false;
            if (newConfig) {
              $scope.progress = 100;
              setProgressMsg('Done');
              $mdDialog.hide(newConfig);
            } else {
              setProgressMsg('Error: ' + msg);
            }
          };
      setProgressMsg('Querying...');
      $scope.longOperation = true;
      this.comms.queryConfig(address, onQueryResponse);
    };

/**
 * Controller for programming a Weta device
 * @param {String} address IP address bound in showProgramCode()
 * @param {String} code Bound in showProgramCode()
 * @param {boolean} rom Bound in showProgramCode()
 * @param $scope Passed by Angular Material
 * @param $mdDialog Passed by Angular Material
 */
WetaCommDlg.prototype.programCodeController =
    function(address, code, rom, $scope, $mdDialog) {
      'use strict';
      var self = this;
      $scope.progressMsg = '';
      $scope.progress = 0;
      $scope.journal = '';
      $scope.longOperation = false;

      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      var updateJournal =
          function(txt) {
            $scope.journal += txt;
          };

      var setProgressMsg =
          function(msg) {
            $scope.progressMsg = msg;
            updateJournal(msg + '\n');
          };

      var onProgramResponse =
          function(success, msg) {
            $scope.longOperation = false;
            if (success) {
              $scope.progress = 100;
              setProgressMsg('Done');
              $mdDialog.hide(true);
            } else {
              setProgressMsg('Error: ' + msg);
            }
          };
      var lang = this.locales.getCurrentLanguage();
      setProgressMsg('Compiling...');
        // Compile Logo code into assembly text
      var wasm = this.compiler.compileLogo(code, lang);
      $scope.progress = 33;
      if (wasm.errors === 0) {
        setProgressMsg('Assembling...');
          // Assemble the text into byte codes in JSON
        var codes = this.compiler.assemble(wasm.wasm, lang, updateJournal);
        $scope.progress = 66;
        if (codes.errors === 0) {
          setProgressMsg('Uploading...');
          $scope.longOperation = true;
            // Send the codes to the device
          this.comms.programCode(address, codes.codes, rom, onProgramResponse);
        }
      } else {
        $scope.progressMsg = 'Error compiling logo: ' + wasm.msg;
      }
    };
