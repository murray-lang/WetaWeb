'use strict';

angular.module('wetaApp.monitor', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/monitor', {
    templateUrl: 'monitor/monitor.html',
    controller: 'MonitorCtrl'
  });
}])

.service('WetaService', ['$http', '$log', WetaService])

.directive ('simpleGauge', [ function() { return new SimpleGauge();}])

.controller(
    'MonitorCtrl',
    ['$scope', '$interval', 'WetaService', function($scope, $interval, weta) {
        var self = this;

        var stop = null;
        self.modelOptions =
            {
                    // Need getterSetter for Angular to recognise changes.
                getterSetter: true
            };
        self.address = "10.1.1.9"; // For debugging
        //self.selection = { all: true };
        self.status = function()
        {
            return weta.getStatus();
        };
        self.config = function()
        {
            return weta.getConfiguration();
        };
        self.get = function()
        {
                // If no interval is set then set it now.
                // Set it to call this function.
            //if (self.stop == null)
            //    self.stop = $interval(function() { self.get(); }, 1000);
            weta.queryConfiguration(self.address);
            weta.queryStatus(self.address);
        };

        $scope.$watch("queryForm.$invalid",
            function(invalid)
            {
                if (invalid)
                    self.stopInterval();
            }
        );

        self.stopInterval = function()
        {
            if (self.stop != null)
            {
                $interval.cancel(self.stop);
                self.stop = null;
            }
        }
    }]
);