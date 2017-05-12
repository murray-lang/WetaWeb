/**
 * Created by murray on 8/03/17.
 */

function SimpleGauge()
{
    //this.gauge       = null;
    this.restrict    = 'A'; // Must be an attribute (for now)
    this.scope =
        {
            gaugeId:    '@',
            gaugeRelativeSize: '@',
            gaugeWidth: '@',
            gaugeHeight: '@',
            gaugeLabel: '@',
            gaugeMin:   '@',
            gaugeMax:   '@',
            gaugeValue: '@',
            gaugeColour: '@',
            gaugeFontColourValue: '@',
            gaugeFontFamilyValue: '@',
            gaugeFontColourLabel: '@',
            gaugeShowPointer: '@',
            gaugeSymbol: '@'
        };
}

SimpleGauge.prototype.link =
    function ($scope, $element, $attrs)
    {
        var self = this;
        $element[0].id = $scope.gaugeId;
        config = {};
            // Need to do this for relative sizing
        config.parentNode = $element[0];
        config.id    = $scope.gaugeId;
        config.value = Number($scope.gaugeValue);
        config.min   = Number($scope.gaugeMin);
        config.max   = Number($scope.gaugeMax);

        if ($scope.gaugeWidth)
            config.width = $scope.gaugeWidth;
        if ($scope.gaugeHeight)
            config.height = $scope.gaugeHeight;
        if ($scope.gaugeRelativeSize !== undefined)
            config.relativeGaugeSize = $scope.gaugeRelativeSize;

        if ($scope.gaugeLabel)
            config.label = $scope.gaugeLabel;
        if ($scope.gaugeColour)
            config.gaugeColor = $scope.gaugeColour;
        if ($scope.gaugeFontColourValue)
            config.valueFontColor = $scope.gaugeFontColourValue;
        if ($scope.gaugeFontFamilyValue)
            config.valueFontFamily = $scope.gaugeFontFamilyValue;
        if ($scope.gaugeFontColourLabel)
            config.labelFontColor = $scope.gaugeFontColourLabel;
        if ($scope.gaugeShowPointer)
            config.pointer = $scope.gaugeShowPointer;
        if ($scope.gaugeSymbol)
            config.symbol = $scope.gaugeSymbol;

        //self.gauge = new JustGage(config);
        $scope.gauge = new JustGage(config);

        $scope.$watch(
            function(scope)
            {
                return scope.gaugeValue;
            },
            function (newVal, oldVal, scope)
            {
                if (scope.gauge) {
                    if (newVal != oldVal)
                        scope.gauge.refresh(newVal, null);
                }
            },
            true
        );
        //self.refresh = function(amt, max) { self.gauge.refresh(amt, max)};
    };
