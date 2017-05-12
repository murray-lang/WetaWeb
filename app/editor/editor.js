'use strict';

angular.module('wetaApp.editor', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/editor', {
    templateUrl: 'editor/editor.html',
    controller: 'EditorCtrl'
  });
}])

.controller(
    'EditorCtrl',
    ['Blockly', function(blockly) {
        var self = this;
        self.code = blockly.Blockly.Logo.workspaceToCode(blockly.Blockly.mainWorkspace);
    }]
);