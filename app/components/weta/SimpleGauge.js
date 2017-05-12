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
 * @fileOverview Angular directive for displaying a JustGage gauge
 * @author Murray Lang (murray@wetaproject.org)
 *
 */

/**
 * SimpleGauge directive constructor
 * @constructor
 */
function SimpleGauge() {
    //this.gauge       = null;
    this.restrict    = 'A'; // Must be an attribute (for now)
    this.scope =
        {   // These settings all correspond to JustGage settings
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

/**
 * Link function for the directive
 * @param $scope
 * @param $element
 * @param $attrs
 */
SimpleGauge.prototype.link =
    function ($scope, $element, $attrs)
    {
        var self = this;
        $element[0].id = $scope.gaugeId;
        config = {};
            // Need to do this for relative sizing
        config.parentNode = $element[0];
          // Transfer configuration values to JustGage
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

      /**
       * Watch for changes in the gauge value to trigger a refresh
       */
      $scope.$watch(
            function(scope) {
                return scope.gaugeValue;
            },
            function (newVal, oldVal, scope) {
                if (scope.gauge) {
                    if (newVal != oldVal)
                        scope.gauge.refresh(newVal, null);
                }
            },
            true
        );
        //self.refresh = function(amt, max) { self.gauge.refresh(amt, max)};
    };
