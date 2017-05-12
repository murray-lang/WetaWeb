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
 * @fileOverview Angular directive for displaying Google Blockly
 * @author Murray Lang (murray@wetaproject.org)
 *
 */
/**
 * Custom Angular directive for displaying Google Blockly.
 *
 * @constructor
 */
function WetaBlockly() {
  'use strict';
  this.restrict = 'A'; // Must be an attribute (for now)
  this.templateUrl = 'components/weta/WetaBlockly.html';
  this.scope =
      {
        blockly: '=',   /** @see WetaBlocklyProvider*/
        lang: '='
      };
}

/**
 * Angular custom directive link function
 * @param $scope
 * @param $element
 * @param $attrs
 */
WetaBlockly.prototype.link =
    function($scope, $element, $attrs) {
      'use strict';
      var self = this;
      $scope.workspace = null;
      $scope.Blockly = $scope.blockly.Blockly;
      $scope.BlocklyStorage = $scope.blockly.BlocklyStorage;
      /**
       * Inject Blockly into the div
       * TODO: try to use Angular paradigm for DOM access
       */
      $scope.reloadBlockly =
          function() {
            if ($scope.workspace) {
              $scope.workspace.dispose();
            }
              // Interpolate translated messages into toolbox.
            var toolboxText = document.getElementById('toolbox').outerHTML;
            toolboxText = toolboxText.replace(/{(\w+)}/g,
                function(m, p1) {return $scope.Blockly.Msg[p1];});
            var toolboxXml = $scope.Blockly.Xml.textToDom(toolboxText);

            var blocklyDiv = document.getElementById('blocklyDiv');

            $scope.workspace = $scope.Blockly.inject(
                blocklyDiv,
                {
                  toolbox: toolboxXml,
                  grid: {
                    spacing: 25,
                    length: 3,
                    colour: '#ccc',
                    snap: true
                  },
                  scrollbars: true,
                  zoom: {
                    controls: true,
                    wheel: true
                  }
                }
            );
            $scope.Blockly.svgResize($scope.workspace);
            $scope.BlocklyStorage.restoreBlocks($scope.workspace);
          };

      /**
       * Look for changes to the current locale/language to trigger a reloading
       * of Blockly. Strings will be replaced in that process
       */
      $scope.$watch(
          'lang',
          function(newValue, oldValue) {
            $scope.reloadBlockly();
          },
          true
      );

      /**
       * Backup any blocks before leaving the page
       */
      $scope.$on(
          '$destroy',
          function() {
            $scope.BlocklyStorage.backupBlocks_($scope.workspace);
          }
      );
    };

