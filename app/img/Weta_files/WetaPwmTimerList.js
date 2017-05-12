/**
 * Created by murray on 28/03/17.
 */
function WetaPwmTimerList() {
    this.restrict = 'A'; // Must be an attribute (for now)
    this.templateUrl = "components/weta/WetaPwmTimerList.html"
    this.scope =
        {
            timers: '=',
            config: '='
        };
}

WetaPwmTimerList.prototype.link =
    function ($scope, $element, $attrs) {
        var self = this;
        $scope.angular = angular;
        $scope.items = [{id:0, frequency: 100, width:10}];

        $scope.equals = function(actual, expected) {
            return angular.equals(actual, expected);
        };

    };


