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
 * @fileOverview Angular partial for displaying Google Blockly
 * @author Murray Lang (murray@wetaproject.org)
 *
 */
'use strict';

angular.module('wetaApp.blockly', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/blockly', {
    templateUrl: 'blockly/blockly.html'//,
  });
}])
    // Blockly displayed by this directive
.directive('wetaBlockly', [function() { return new WetaBlockly();}])
.controller(
    'BlocklyCtrl',
    [
      '$scope',
      '$timeout',
      'Blockly',            //Access to global Blockly object
      'WetaLocaleService',  //Manage change of locale/language
      'ToolbarContext',     //Callbacks for the toolbar
      'WetaCommService',    //Communicate with Weta device
      'WetaCommDlg',        //Dialog boxes for Weta communication
  function($scope, $timeout, blockly, locales, context, comms, commDlg) {
    var self = this;
    self.blockly        = blockly;
    self.context        = context;
    self.comms          = comms;
      // This is provided as something for the WetaBlockly directive to $watch
      // and reload when the language changes. For some reason $watch ignores
      // changes to a simple string, but works for objects.
    self.lang = {lang: locales.getCurrentLanguage()};

    /**
     * Callback function for use by onClickProgram()
     * @param {boolean} success true if operation successful
     * @param {string} msg message if above is false
     */
    self.onProgramResponse =
      function(success, msg) {

      };

    /**
     * Handler for user clicking Program button in the toolbar
     */
    self.onClickProgram =
      function() {
          //Get logo code for the current blocks
        var logo = self.blockly.Blockly.Logo.workspaceToCode(
            self.blockly.Blockly.mainWorkspace
        );
          //All work done in the dialog
        commDlg.showProgramCode(
            null,                 // No Event object
            self.context.address, // IP address
            logo,                 // Source code
            self.context.rom,     // Non-volatile?
            self.onProgramResponse.bind(self));
      };

    /**
     * Callback function for use by onClickStop()
     */
    self.onStopResponse =
      function() {

      };

    /**
     * Handler for Stop button in the toolbar. Uses WetaCommService directly
     * rather than via a dialog box because it's more or less atomic.
     */
    self.onClickStop =
      function() {
        self.comms.stopCode(
            self.context.address,
            self.onStopResponse.bind(self)
        );
      };

    /**
     * Handler for user selection of block file for upload. Called as a
     * consequence of the Open button in the toolbar being clicked.
     * TODO: rewrite in Angular paradigm
     */
    self.onFileSelected =
      function(fileList) {
           // Assume only one file selected
        var xmlFile = fileList[0];
        var reader = new FileReader();
          // Callback for FileReader.readAsText() below
        reader.onload = function(e) {
          var xmlText = e.target.result;
          var xml = self.blockly.Blockly.Xml.textToDom(xmlText);
          self.blockly.Blockly.mainWorkspace.clear();
          self.blockly.Blockly.Xml.domToWorkspace(xml, self.blockly.Blockly.mainWorkspace);
        };
        reader.readAsText(xmlFile);
      };

    /**
     * Handler for Save button in the toolbar
     * TODO: rewrite in Angular paradigm
     */
    self.onClickSave =
      function() {
        var downloadUrl = null;
        var filename = 'wetablocks.xml';
        var xmlDom = self.blockly.Blockly.Xml.workspaceToDom(
            self.blockly.Blockly.getMainWorkspace()
        );
        var xmlText = self.blockly.Blockly.Xml.domToPrettyText(xmlDom);

        var blob = new Blob([xmlText], {type: 'text/xml'});
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

    /**
     * Handler for language selection in the toolbar
     * @param {Object} lang
     */
    self.onChangeLanguage =
      function(lang) {
        self.lang.lang = lang;
      };

      // Give the toolbar access to the callbacks here
    self.context.onChangeLanguage = self.onChangeLanguage.bind(self);
    self.context.onProgram = self.onClickProgram.bind(self);
    self.context.onFileSelected = self.onFileSelected.bind(self);
    self.context.onSave = self.onClickSave.bind(self);
    self.context.onStop = self.onClickStop.bind(self);

    /**
     * Clear the association with the toolbar
     */
    $scope.$on(
        '$destroy',
        function() {
          self.context.clear();
        }
    );

  }]);
