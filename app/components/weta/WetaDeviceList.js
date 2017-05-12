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
 * @fileOverview Custom Angular directive for displaying/configuring electronic
 * devices. This is common code for all devices (at the moment), with variations
 * determined by "profile" information read from a JSON file. Device profiles
 * have their own JSON file, which should be the same across target platforms
 * because their I/O requirements are in terms of abstract "peripheral" items
 * rather than MCU pins. This JavaScript file has a corresponding HTML template
 * file WetaDeviceList.html.
 *
 * @author Murray Lang (murray@wetaproject.org)
 *
 */
/**
 * Constructor for the directive
 * @constructor
 */
function WetaDeviceList() {
  'use strict';
  this.restrict = 'A'; // Must be an attribute (for now)
  this.templateUrl = 'components/weta/WetaDeviceList.html';
  this.scope =
      {
        device: '@',      // Name of the device
        deviceUtils: '='  // WetaDeviceUtils object
      };
}

/**
 * Angular custom directive link function
 * @param $scope
 * @param $element
 * @param $attrs
 */
WetaDeviceList.prototype.link =
    function($scope, $element, $attrs) {
      'use strict';
      var self = this;
        // Create a 2D array structure to describe the device and its variations
        // This simplifies binding within the HTML, and also other operations
      $scope.deviceUtils.initHeaderStructure($scope.device);
        // Put the information into the scope for binding
      $scope.headers = $scope.deviceUtils.getHeaders($scope.device);
        // Get a convenient pointer to the current configuration from the utils
      $scope.config = $scope.deviceUtils.config.config;

      /**
       * This function is called by ng-class in the HTML and facilitates having
       * a common HTML template file for all devices.
       * @param args
       * @returns {{weta: boolean}}
       */
      $scope.getClass =
      function(args) {
        var result = {weta: true};    // Always 'weta'
        result[$scope.device] = true; // Always '<devicename>'
          // Add any extras supplied as arguments
        for (var i = 0; i < arguments.length; i++) {
          result[arguments[i]] = true;
        }
        return result;
      };

      /**
       * Determine if a device has all of its requirements fulfilled
       * @param {Object} item Device configuration
       * @param {Object} parts Device profile information
       * @returns {boolean} true if the device is completely configured
       */
      $scope.isItemValid =
          function(item, parts) {
            for (var i = 0; i < parts.length; i++) {
              if (parts[i].type === 'ref') {
                if (item[parts[i].name] === -1) {
                  return false;
                }
              }
            }
            return true;
          };

      /**
       * Get a class name for ng-class based on the item
       * @param {Object} item Device configuration item
       * @param {Object[]} parts Device profile information
       * @returns {Object} object for consumption by ng-class
       */
      $scope.getItemClass =
          function(item, parts) {
              // Start with the common classes
            var result = $scope.getClass();
              // Now add a class if the item is not complete
            if (!$scope.isItemValid(item, parts)) {
              result.invalid = true;
            }
              // Add a class if this item refers to a peripheral that is already
              // claimed by another device. The 'clash' attribute is added when
              // the configuration is first loaded from a file or a target.
              // Clashes shouldn't occur with configurations created with the
              // web interface.
            if ('clash' in item) {
              result.clash = true;
            }
            return result;
          };

      /**
       * Get a class name for ng-class based on the item and a particular
       * attribute.
       * @param {Object} item Device configuration item
       * @param {Object} part Profile information for a particular part
       * @returns {Object} object for consumption by ng-class
       */
      $scope.getPartClass =
          function(item, part) {
              // Start with the common classes
            var result = $scope.getClass();
              // If this part refers to another device or peripheral...
            if (part.type === 'ref') {
                //...and no ID is provided then...
              if (item[part.name] === -1) {
                result.invalid = true; // This part of the device is invalid
              }
            }
            return result;
          };

      /**
       * Respond to a message indicating that device profiles have been loaded
       */
      $scope.$on(
          'weta-devices-loaded',
          function(event) {
              // Recreate the header structure with the new profile
            $scope.deviceUtils.initHeaderStructure($scope.device);
            $scope.headers = $scope.deviceUtils.getHeaders($scope.device);
            //$scope.config = $scope.deviceUtils.config;
          }
      );

      /**
       * Add a new device to the collection
       * @param {number} varIndex Index for the new item
       */
      $scope.onClickAddDevice =
          function(varIndex) {
            $scope.deviceUtils.addDevice($scope.device, varIndex);
          };

      /**
       * Remove a device from the collection
       * @param {Object} item Item to be removed (only the id is required)
       * @param {Object[]} parts Device profile information
       */
      $scope.onClickRemoveDevice =
          function(item, parts) {
            $scope.deviceUtils.removeDevice($scope.device, item.id, parts);
          };

      /**
       * This is called when the user selects a different peripheral ID for
       * part of the device. Note that logic called by the display prevents
       * peripherals that are already owned from being selected.
       * @param {Object} item Device configuration item (only the id required)
       * @param {Object} part Profile information for the device part
       * @param {Number | String} oldValue Previous reference
       */
      $scope.onChangeRef =
          function(item, part, oldValue) {
              // Create a token to represent the new ownership
            var me = $scope.deviceUtils.config.createOwnershipToken(
                $scope.device,
                item.id,
                part.name
            );
              // Create keys from the space-delimited list in the profile
            var keys = part.ref.split(' ');
              // -1 means no previous reference to release
            if (oldValue !== -1) {
                // Remove the ownership from the previous reference
              $scope.deviceUtils.config.releaseOwnershipOfItem(
                  keys,
                  oldValue,
                  me
              );
            }
              // Request ownership of the replacement item
            var id = item[part.name];
            if (!$scope.deviceUtils.config.requestOwnershipOfItem(keys, id, me)) {
              item[part.name] = -1;
            }
          };

      /**
       * Find all items identified by the keys from the profile.
       * This is used to list items available for selection within the HTML
       * @param {String} periphInfo Space-delimited list of keys
       */
      $scope.findItems =
          function(periphInfo) {
            var keys = periphInfo.split(' ');
            return $scope.deviceUtils.config.findItems(keys);
          };

      /**
       * Determine whether an item is available to be claimed
       * @param {Object} periphItem Configuration item being checked
       * @param {Object} device Configuration for a device entry
       * @param {String} attr The name of the part of the device requiring item
       * @returns {boolean} True if the item is available for this device entry
       */
      $scope.itemAvailable =
          function(periphItem, device, attr) {
            if ('owner' in periphItem) {
                // The item has owner(s)
                // Create a token that would be used to claim the item if it
                // were being claimed now (which it's not)
              var me = $scope.deviceUtils.config.createOwnershipToken(
                  $scope.device, device.id, attr);
                // Look for ourself in the owner list
              var i = periphItem.owner.findIndex(
                  function(next) {
                    return angular.equals(next, me);
                  }
                  );
                // We are already an owner so it is available to us
              return i !== -1;
            } else {
                // No existing owner means it's up for grabs
              return true;
            }

          };
    };

