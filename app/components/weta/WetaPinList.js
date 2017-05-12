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
 * @fileOverview An Angular directive for displaying and selecting GPIO pin
 * capabilities. The details of the display are all based on the currently
 * loaded target "profile" (from JSON files). This JavaScript file is
 * accompanied by an HTML template file WetaPinList.html
 *
 * @author Murray Lang (murray@wetaproject.org)
 *
 */

/**
 * Custom directive for GPIO selections
 * @constructor
 */
function WetaPinList() {
    this.restrict = 'A'; // Must be an attribute (for now)
    this.templateUrl = 'components/weta/WetaPinList.html';
    this.scope =
      {
          config: '=',        ///A Weta machine configuration
          onSelChange: '&'    ///Callback function to notify of changes
      };
}

/**
 * Angular directive link function
 * @param $scope
 * @param $element
 * @param $attrs
 */
WetaPinList.prototype.link =
    function($scope, $element, $attrs) {
        'use strict';
        var self = this;
        $scope.angular = angular; /// Using angular.equals() in html
         /**
         * Handler for user clicks on capability checkboxes
         * @param $event Event object from Angular
         * @param pin The full object of the changed pin
         * @param cap The name of the capability that changed
         */
        $scope.onCapClick =
            function ($event, pin, cap) {
                var checkbox = $event.target;
                $scope.config.deselectIncompatibleCaps(pin, cap, checkbox.checked);
                var selection = $scope.config.findSelection(pin);
                if (selection) {
                  $scope.onSelChange()(selection); ///Notify the controller
                }
            };
    };







