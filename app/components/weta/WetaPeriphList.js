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
 * @fileOverview An Angular directive for configuring GPIO peripherals. This is
 * (currently) common code for all peripheral types, with differences described
 * in the JSON "profile" file created for each target hardware.
 * This JavaScript is accompanied by an HTML template file WetaPeriphList.html
 *
 * @author Murray Lang (murray@wetaproject.org)
 *
 */

/**
 * Custom Angular directive for displaying/configuring MCU peripherals.
 *
 * @constructor
 */
function WetaPeriphList() {
  'use strict';
  this.restrict = 'A'; // Must be an attribute (for now)
  this.templateUrl = 'components/weta/WetaPeriphList.html';
  this.scope =
      {
        periph: '@',
        config: '='     ///Configuration from a Weta machine
      };
}

/**
 * Angular custom directive link function
 * @param $scope
 * @param $element
 * @param $attrs
 */
WetaPeriphList.prototype.link =
    function($scope, $element, $attrs) {
      'use strict';
      var self = this;

        // Get the headers directly into the scope for convenience
      $scope.headers = $scope.config.profile.headers; //getHeaderStructure($scope.periph);

      /**
       * Get the class string for ng-class.
       * @param {String[]} args Varargs list of additional classes
       * @returns {{weta: boolean}}
       */
      $scope.getClass =
          function(args) {
              // Always 'weta'
            var result = {weta: true};
              // Always '<periph>'
            result[$scope.periph] = true;
              // Add any extras provided as arguments
            for (var i = 0; i < arguments.length; i++) {
              result[arguments[i]] = true;
            }
            return result;
          };

      /**
       * Get the collection of configuration items associated with this
       * peripheral
       * @param {Object} part Selected part
       * @returns {Object[]|null} Array of items for display
       */
      $scope.getCollection =
          function(part) {
            return $scope.config.getCollection($scope.periph, part);
          };

      /**
       * Get the options for the selected part of this peripheral from the
       * profile.
       * @param {Object} part Selected part
       * @returns {Object[]|null} The associated options
       */
      $scope.getOptions =
          function(part) {
            return $scope.config.profile.getOptions($scope.periph, part);
          };

      /**
       * Get the option information for the specified attribute
       * @param {Object} part Selected part
       * @param {String} attr Name of the attribute
       * @returns {Object|null} Information about the attribute
       */
      $scope.getOption =
          function(part, attr) {
            return $scope.config.profile.getOption($scope.periph, part, attr);
          };

      /**
       * Get all of the values for the given attribute in the collection of
       * items.
       * @param {Object} part Selected part
       * @param {String} attr Name of the attribute
       * @returns {Object[]|null} Collection of values for the attribute
       */
      $scope.getColumn =
          function(part, attr) {
            return $scope.config.getColumn($scope.periph, part, attr);
          };

      /**
       * Get the configured default value for an attribute
       * @param {Object} part Selected part
       * @param {String} name Name of the attribute
       * @returns {Number|String|boolean}
       */
      $scope.getDefaultValue =
          function(part, name) {
            return $scope.config.profile.getDefaultValue($scope.periph, part, name);
          };

      /**
       * Add a new item to the list for the specified part
       * @param {Object} part Selected part
       */
      $scope.addItem =
          function(part) {
            $scope.config.addItem($scope.periph, part);
          };

      /**
       * Remove the selected item from the collection
       * @param {Object} part Selected part
       * @param {Number} id ID of the item to remove
       */
      $scope.removeItem =
          function(part, id) {
            $scope.config.removeItem($scope.periph, part, id);
          };

      /**
       * This is a callback function provided when a list of items is being
       * adjusted for new pin selection information. It broadcasts a message
       * for consumption by whatever device has the given ownership token,
       * telling it that the ID of the item has changed.
       *
       * @param {Object} owner Ownership token attached to the item
       * @param {Number} newId The new ID of the item
       */
      $scope.notifyOwner =
          function(owner, newId) {
            $scope.$emit('weta-owner-notify', owner, newId);
          };

      /**
       * Listen for broadcasts relating to changed pin information
       */
      $scope.$on(
          'weta-pin-change',
          function(event, pin) {
            if (pin === null) {
              $scope.config.adjustItemsForAllPins(
                  $scope.periph,
                  $scope.notifyOwner.bind($scope)
              );
            } else {
              $scope.config.adjustItems(
                  $scope.periph,
                  pin,
                  $scope.notifyOwner.bind($scope)
              );
            }
          }
      );

      /**
       * Check whether an option would be relevant given other options.
       * @param {Object} item Selected item containing all options
       * @param {String} attr The option that is to be checked for relevance
       * @returns {boolean} True if OK to select/enable the option
       */
      $scope.checkRequirements =
          function(item, option) {
            return $scope.config.checkOptionInterdependencies(item, option);
          };

      /**
       * A user has clicked a checkbox in the table of items. Make any
       * necessary adjustments to the MCU pin selections as a result of
       * the change. (eg. a change to digital direction)
       * @param {Object} $event
       * @param {Object} item Item being changed
       * @param {String} attr The attribute associated with the checkbox
       */
      $scope.onClickCheckbox =
          function($event, item, attr) {
              // Attempt to change pin selection information
            if (!$scope.config.setPinSelection($scope.periph, item)) {
                // Invalid selection. Reverse the change
              item[attr] = item[attr] == 0 ? 1 : 0;
            }
          };
    };



