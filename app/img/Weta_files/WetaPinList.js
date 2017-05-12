/**
 * Created by murray on 28/03/17.
 */
function WetaPinList() {
    this.restrict = 'A'; // Must be an attribute (for now)
    this.templateUrl = "components/weta/WetaPinList.html"
    this.scope =
        {
            caps: '=',
            config: '=',
            onSelChange: '&'
        };
}

WetaPinList.prototype.link =
    function ($scope, $element, $attrs) {
        var self = this;
        $scope.header = self.getHeaderStructure($scope.caps);
        $scope.selections = self.initSelections($scope.caps.pins);

        $scope.onCapClick =
            function ($event, pin, cap) {
                var checkbox = $event.target;
                $scope.deselectIncompatibleCaps(pin, cap, checkbox.checked);
                var selection = $scope.findSelection(pin);
                if (selection)
                    $scope.onSelChange()(selection);
            };

        $scope.equals = function(actual, expected) {
            return angular.equals(actual, expected);
        };
        $scope.findSelection =
            function(pin) {
                for (var i = 0; i < $scope.selections.length; i++) {
                    if ($scope.selections[i].pin == pin.pin)
                        return $scope.selections[i];
                }
                return null;
            };
        $scope.deselectIncompatibleCaps =
            function(pin, cap, newValue) {
                // Search for the pin
                var selection = $scope.findSelection(pin)
                if (selection) {
                    if (selection.pin == pin.pin) {
                        // Found the pin
                        if (newValue) {
                            // It's selected, so do any necessary deselection
                            // Find the info for the capability to determine
                            // compatibility between capabilities (!)
                            var capInfo = $scope.caps.info[cap]; // Assume consistency

                            for (var next in selection) {
                                if (next.localeCompare("pin") != 0) {
                                    // Don't check against itself
                                    if (next.localeCompare(cap) != 0) {
                                        // Is next in the array of ones allowed?
                                        if (   !("allowedWith" in capInfo)
                                            || capInfo.allowedWith.indexOf(next) == -1) {
                                            // No. Deselect
                                            selection[next] = false;
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
            }

    };
/*
 WetaPinList.prototype.onCapClick =
 function (cap)
 {
 this.scope.onChange(cap);
 };
 */
/**
 * @brief Create an object that directly reflects the required structure of the
 * list header (presumably HTML table).
 * @param caps
 */
WetaPinList.prototype.getHeaderStructure =
    function (caps) {
            // An array for each row of the header. Each item in the first row
            // has a span for the number of columns it spans.
            // Start off with the column for the GPIO pin number.
        var result = {
            row1: [{span: 1}],
            row2: ["GPIO"]
        };
        var currGroup = null;
        // Step through the pins in the order they should be displayed in
        for (var i = 0; i < caps.order.length; i++) {
            var cap = caps.order[i];
            result.row2.push(caps.info[cap].heading);
            // If this pin belongs to a group then check if it's a new
            // group.
            if ("group" in caps.info[cap]) {
                if (currGroup) {
                    if (currGroup.name == caps.info[cap].group) {
                        // It's a member of a group already started...
                        currGroup.span++;  //...so increment the width
                    } else {
                        // It's a new group. Add it to the list
                        currGroup = {span: 1};
                        currGroup.name = caps.info[cap].group;
                        result.row1.push(currGroup);
                    }
                } else {
                    // It's a new group. Add it to the list
                    currGroup = {span: 1};
                    currGroup.name = caps.info[cap].group;
                    result.row1.push(currGroup);
                }
            } else {
                if (currGroup)
                    currGroup = null;
                result.row1.push({span: 1});
            }
        }
        return result;
    };

/**
 * @brief Initialise pin capability selections
 *
 * Copy the pin capabilities array, but then interpret the boolean values of the
 * attributes as whether the user selected them, rather than their original
 * purpose of whether the capability is supported.
 * @param caps
 */
WetaPinList.prototype.initSelections =
    function (pins) {
        // Nasty verbatim copy
        var result = JSON.parse(JSON.stringify(pins));
        // Now set all of the values to 0 (false)
        for (var i = 0; i < result.length; i++) {
            for (var cap in result[i]) {
                if (cap !== "pin") {
                    result[i][cap] = false;
                }
            }
        }
        return result;
    };

