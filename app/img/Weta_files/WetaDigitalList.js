/**
 * Created by murray on 28/03/17.
 */
function WetaDigitalList() {
    this.restrict = 'A'; // Must be an attribute (for now)
    this.templateUrl = "components/weta/WetaDigitalList.html"
    this.scope =
        {
            digital: '=',
            config: '='
        };
}

WetaDigitalList.prototype.link =
    function ($scope, $element, $attrs) {
        var self = this;

        $scope.items = [];
        $scope.tempMsg = {};
        $scope.$on(
            "weta-pin-change",
            function (event, pin) {
                $scope.tempMsg = pin;
                $scope.adjustItems(pin);
            }
        );
        $scope.checkRequirements =
            function (item, attr) {
                var option = $scope.findOption($scope.digital.options, attr.name);
                if (!option)
                    return false; // attribute not recognised
                if ('requires' in option) {
                        // Attribute has requirements
                        // Return false if any not satisfied
                    for (var i = 0; i < option.requires.length; i++) {
                            // See if this required attribute is true
                        if (item[option.requires[i]] == 0)
                            return false;   // Not set. Requirement not met
                    }
                    return true; //
                }
                return true;    // No requirements
            },
        $scope.findOption =
            function (options, name) {
                for (var i = 0; i < options.length; i++) {
                    if (options[i].name == name)
                        return options[i];
                }
                return null;
            },
        $scope.createItemFromPin =
            function (pin) {
                if (!pin.din && !pin.dout)
                    return null;
                return {
                    io:  pin.pin,
                    in:  pin.din ? 1 : 0,
                    out: pin.dout ? 1 : 0,
                    pullup: 0,
                    pulldown: 0,
                    opendrain: 0,
                    invert: 0,
                    debounce: 0
                };
            };
        $scope.adjustItems =
            function (pin) {
                    // Search for an item with this pin
                var found = false;
                for (var i = 0; i < $scope.items.length; i++) {
                    if ($scope.items[i].io == pin.pin) {
                        found = true;
                            // Remove the item if the new pin information
                            // indicates neither din nor dout
                        if (!pin.din && !pin.dout) {
                            $scope.items.splice(i, 1); // Remove the item
                        } else {
                                // Otherwise just update
                                // Using 1 and 0 to reduce data size for
                                // uploading to the robot
                            $scope.items[i].in = pin.din ? 1 : 0;
                            $scope.items[i].out = pin.dout ? 1 : 0;
                        }
                    }
                }
                    // If the pin wasn't found, and it is digital, then add it
                if (!found && (pin.din || pin.dout)) {
                    var newItem = $scope.createItemFromPin(pin);
                        // Above returns null if not digital
                    if (newItem) {
                        //For now just stuff it in.
                        $scope.items.push(newItem);
                    }
                }
            },
        $scope.onPinClick =
            function ($event, pin, cap) {
                var checkbox = $event.target;

            };

        $scope.equals = function(actual, expected) {
            return angular.equals(actual, expected);
        };

    };


