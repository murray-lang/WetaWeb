'use strict';

// Declare app level module which depends on views, and components
angular.module('wetaApp', [
    'ngRoute',
    'wetaApp.blockly',
    'wetaApp.editor',
    'wetaApp.configure',
    'wetaApp.monitor'
])
.config(['$locationProvider', '$routeProvider',
    function($locationProvider, $routeProvider)
    {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/monitor'});
    }
]);

