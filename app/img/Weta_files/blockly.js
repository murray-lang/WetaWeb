'use strict';

angular.module('wetaApp.blockly', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/blockly', {
    templateUrl: 'blockly/blockly.html',
    controller: 'BlocklyCtrl'
  });
}])

.controller('BlocklyCtrl', [function() {

}]);