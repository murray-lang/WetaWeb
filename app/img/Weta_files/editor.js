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
    ['$scope', function($scope) {
        var self = this;
    }]
);