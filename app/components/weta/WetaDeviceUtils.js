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
 * @fileOverview An Angular service for manipulating device configurations.
 *
 * @author Murray Lang (murray@wetaproject.org)
 *
 */

/**
 * Service Constructor
 * @param {WetaConfigUtils} configUtils Injected configuration utilities
 * @constructor
 */
function WetaDeviceUtils(configUtils) {
  'use strict';
  this.configUtils   = configUtils;  // WetaConfigUtils with global config contained
  this._devices = {};   // Device profile information will go here
  this.headers  = {};   // Device info rearranged as 2D arrays for convenience
  this.nextIds  = {};   // An object with a counter for each device type for IDs

  /**
   * Use a setter to ensure that device profiles are copied into the persistent
   * member object rather replacing it. This means that data binding is not
   * broken.
   */
  Object.defineProperty(this, 'devices',
      {
        get: function() {
          return this._devices;
        },
        set: function(val) {
          angular.copy(val, this._devices);
        }
      }
  );

  /**
   * Define a getter but not a setter for the configuration. For the sake of
   * data binding the member must not be replaced by a new reference.
   */
  Object.defineProperty(this, 'config',
      {
        get: function() {
          return this.configUtils;
        }
      }
  );
}

/**
 * Get the headers for the given device. If it doesn't exist then create a
 * new empty one.
 * @param {String} deviceName Name of the device (eg. 'motor')
 * @returns {Object[][]} 2D header structure
 */
WetaDeviceUtils.prototype.getHeaders =
    function(deviceName) {
      'use strict';
      if (!(deviceName in this.headers)) {
        this.headers[deviceName] = [];
      }
      return this.headers[deviceName];
    };

/**
 * Get the profile information for the given device
 * @param {String} deviceName Name of the device
 * @returns {Object | null} Device information or null if not found
 */
WetaDeviceUtils.prototype.getDevice =
    function(deviceName) {
      'use strict';
      if (deviceName in this._devices) {
        return this._devices[deviceName];
      }
      return null;
    };

/**
 * Get the next ID for the given device then increment for next time. If a
 * counter doesn't exist for the given device the create a new one.
 * @param {String} deviceName Device name
 * @returns {number} The next available ID
 */
WetaDeviceUtils.prototype.getNextId =
    function(deviceName) {
      'use strict';
      if (!(deviceName in this.nextIds)) {
          // Not there. Create a new one and initialise it
        this.nextIds[deviceName] = 0;
      }
      return this.nextIds[deviceName]++;
    };

/**
 * Reset the ID counter for the given device.
 * @param {String} deviceName Device name
 */
WetaDeviceUtils.prototype.resetNextId =
    function(deviceName) {
      'use strict';
      this.nextIds[deviceName] = 0;
    };

/**
 * Calculate the next ID for each device and set the relevant counters. This
 * is necessary to deal with fragmentation created when devices are deleted.
 */
WetaDeviceUtils.prototype.setNextIds =
    function() {
        // For each device in the profile
      for (var deviceName in this._devices) {
        var maxId = 0;  // Initialise the next ID
          // Get the items of this device in the configuration
        var items = this.config.config[deviceName];
        if (items !== undefined) {
            // Bump up maxId every time an existing ID is higher
          for (var i = 0; i < items.length; i++) {
            if (items[i].id > maxId) {
              maxId = items[i].id;
            }
          }
          this.nextIds[deviceName] = maxId + 1; // Our new counter value
        }
      }
    };

/**
 * Get the parts from a device profile
 * @param {Object} device Profile object previously found by name
 * @returns {Object[] | null} Parts of the given device profile
 */
WetaDeviceUtils.prototype.getPartsInDevice =
    function(device) {
      'use strict';
      if ('parts' in device) {
        return device.parts;
      }
      return null;
    };

/**
 * Get the parts of the device profile with the given name
 * @param {String} deviceName Device name
 * @returns {Object[] | null} Parts of the device profile with the given name
 */
WetaDeviceUtils.prototype.getParts =
    function(deviceName) {
      'use strict';
      var device = this.getDevice(deviceName);
      if (device === null) {
        return null;
      }
      return this.getPartsInDevice(device);
    };

/**
 * Find any variations defined for the device parts.
 *
 * Variations are described for each of the different ways a device might use
 * peripherals (or other devices). For example a motor might have full h-bridge
 * control, requiring two digital outputs, or it might require only a single
 * digital output for direction control. Stepper motors might use two digital
 * outputs, four digital outputs, or a shift register.
 * @param {Object[]} parts Parts previously located in the profile
 * @returns {Object} The variations object or null if there is none
 */
WetaDeviceUtils.prototype.getVariationsInParts =
    function(parts) {
      'use strict';
      for (var i = 0; i < parts.length; i++) {
        if ('variations' in parts[i]) {
          return parts[i].variations;
        }
      }
      return null;
    };

/**
 * Get the maximum number of parts to device variations. Used for calculating
 * table layouts.
 * @param {Object} variations Variations object previously obtained
 * @returns {number} The most number of parts amongst the variations
 */
WetaDeviceUtils.prototype.getMaxVariationWidth =
    function(variations) {
      'use strict';
      if (variations === null) {
        return 0;
      }
      var result = 0;
      for (var i = 0; i < variations.length; i++) {
        var nextWidth = variations[i].parts.length;
        if (nextWidth > result) {
          result = nextWidth;
        }
      }
      return result;
    };

/**
 * Get the number of parts to a device that are present in al variations.
 * Assumes that the variations are placed after the fixt parts in the
 * profile.
 * @param {Object[]} parts Parts for a device
 * @returns {number} The number of fixed parts to the device.
 */
WetaDeviceUtils.prototype.getNumFixedParts =
    function(parts) {
      'use strict';
      var result = 0;
      for (var i = 0; i < parts.length; i++) {
        if ('variations' in parts[i]) {
          break;
        }
        result++;
      }
      return result;
    };

/**
 * Find information about an attribute (using headers because it's easier)
 * Assumes headers already created.
 * @param {String} deviceName Device name
 * @param {String} attr Device attribute (described by a part)
 */
WetaDeviceUtils.prototype.findPart =
    function(deviceName, attr) {
      var headers = this.getHeaders(deviceName);
        // Each row in the header is a variation of the device config.
        // However, skip first row because it's just a title.
      for (var i = 1; i < headers.length; i++) {
          // Step through the parts in this row/variation
        for (var j = 0; j < headers[i].length; j++) {
          var part = headers[i][j];
          if (part.name === attr) {
            return part;
          }
        }
      }
      return null;
    };

/**
 * Create the 2D header structure for a device using the profile and save it
 * for later use.
 * @param {String} deviceName Device name
 */
WetaDeviceUtils.prototype.initHeaderStructure =
    function(deviceName) {
      'use strict';
      this.headers[deviceName] = this.getHeaderStructure(deviceName);
    };

/**
 * Get the 2D header structure for a device
 * @param {String} deviceName Device name
 * @returns {Object[][] | null} Header structure or null if not possible
 */
WetaDeviceUtils.prototype.getHeaderStructure =
    function(deviceName) {
      'use strict';
      var device = this.getDevice(deviceName);
      if (device === null) {
        return null;
      }
      var parts = this.getPartsInDevice(device);
      if (parts === null) {
        return null;
      }
      var variations = this.getVariationsInParts(parts);
      var numVariations = variations === null ? 1 : variations.length;
      var maxVariationWidth = this.getMaxVariationWidth(variations);
      var numFixedParts = this.getNumFixedParts(parts);
        // Initialise result with main header row
      var result = [
          [
              {
                title: device.description,
                span: numFixedParts + maxVariationWidth// + 1 //+1 for add button
              }
          ]
      ];
        //Add a header row for each variation
      for (var i = 0; i < numVariations; i++) {
        var thisRow = []; //Initialise row
          // Assume fixed parts are always first.
          // Duplicated for each variation row
        for (var j = 0; j < numFixedParts; j++) {
          thisRow.push(parts[j]);
        }
          // Now add the columns for the current variation
        if (numVariations > 1) {
          var varParts = variations[i].parts;
          for (var k = 0; k < varParts.length; k++) {
            thisRow.push(varParts[k]);
          }
          // If this isn't the widest variation then add padding to the end
          // of this row to make all the same width
          //if (varParts.length < maxVariationWidth) {
          //  thisRow.push({title: '', span: maxVariationWidth - varParts.length});
          //}
        }
        result.push(thisRow);
      }
      return result;
    };

/**
 * Get a default value based on the part type.
 * TODO: The default values should really come from the profile
 * @param {Object} part A part of a device
 * @returns {number | boolean} The default value
 */
WetaDeviceUtils.prototype.getDefaultPartValue =
    function(part) {
      'use strict';
      switch (part.type) {
        case 'id':
        case 'ref':
        case 'enum':
          return -1;
          break;

        case 'bool':
          return false;
          break;
      }
      return 0;
    };

/**
 * Create a new configuration entry for a device of the given type, with the
 * variation identified by the given index.
 * @param {String} deviceName Device name
 * @param {number} varIndex The index of the required variation
 * @returns {Object} A configuration entry of the given device type.
 */
WetaDeviceUtils.prototype.createDevice =
    function(deviceName, varIndex) {
      'use strict';
      var deviceInfo = this.getDevice(deviceName);
      if (deviceInfo === null) {
        return null;
      }
      var parts = this.getPartsInDevice(deviceInfo);
      if (parts === null) {
        return null;
      }
      var variations = this.getVariationsInParts(parts);
      if (variations === null) {
        if (varIndex > 0) {
            // If a variation index was provided but there are no variations
            // for the device then we have confusion somewhere.
          return null;
        }
      } else if (varIndex >= variations.length) {
        return null; // Invalid variation index
      }
      var device = {};
      var numFixedParts = this.getNumFixedParts(parts);
        // Add attributes for the new device configuration.
        // Start with the fixed parts. Assume that they precede any variations
      for (var i = 0; i < numFixedParts; i++) {
        device[parts[i].name] = this.getDefaultPartValue(parts[i]);
      }
        // If there are no variations then that's it.
      if (variations !== null) {
          // Now add attributes for the selected variation
        var variation = variations[varIndex];
        var varParts = variation.parts;
        for (var j = 0; j < varParts.length; j++) {
          device[varParts[j].name] = this.getDefaultPartValue(varParts[j]);
        }
      }
      return device;
    };

/**
 * Add a new entry for a device to the configuration
 * @param {String} deviceName Device name
 * @param {number} varIndex The index of the required variation
 * @returns {boolean} True if a new entry was added to the configurations for
 * a device
 */
WetaDeviceUtils.prototype.addDevice =
    function(deviceName, varIndex) {
      'use strict';
        // Create an entry based on the profile for a device
      var device = this.createDevice(deviceName, varIndex);
      if (device === null) {
        return false;
      }
        // Get the next ID for this device type
      device.id = this.getNextId(deviceName);
        // If there is no collection for this device then add one.
      if (!(deviceName in this.config.config)) {
        this.config.config[deviceName] = [];
      }
      this.config.config[deviceName].push(device);
      return true;
    };

/**
 * Start again with the IDs for this device. Normally called after
 * fragmentation caused by devices being removed from the collection.
 * @param {String} deviceName Device name
 */
WetaDeviceUtils.prototype.reassignIds =
    function(deviceName) {
      'use strict';
        // Start at 0 again
      this.resetNextId(deviceName);
      var items = this.config.config[deviceName];
        // Easier to get profile information from the header
      var headers = this.getHeaders(deviceName);
      for (var i = 0; i < items.length; i++) {
        var parts = headers[i + 1];
        if (items[i].id !== i) {
          var oldId = items[i].id;
          items[i].id = this.getNextId(deviceName);
            // Make sure ownership information reflects the new IDs
          this.updateOwnership(deviceName, items[i], oldId, parts);
        }
      }
    };

/**
 * Remove a device entry from the configuration
 * @param {String} deviceName Device name
 * @param {number} id ID of the item
 * @param {Object[]} parts Part information for the item
 */
WetaDeviceUtils.prototype.removeDevice =
    function(deviceName, id, parts) {
      'use strict';
      var items = this.config.config[deviceName];
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === id) {
          this.releaseOwnership(deviceName, items[i], parts);
          items.splice(i, 1);
          this.reassignIds(deviceName);
          return;
        }
      }
    };

/**
 * Request ownership of a GPIO peripheral or another device. If it's a device
 * check whether it can allow multiple owners
 * @param {String[]} keys Hierarchy to find the item being claimed
 * @param {number} id The ID of the item being claimed
 * @param {Object} hopeful The ownership key of the device making the claim
 * @returns {boolean} True if ownership
 */
WetaDeviceUtils.prototype.requestOwnershipOfItem =
    function(keys, id, hopeful) {
      var allowMultiple = false;
        // If requesting a device then check whether it allows multiple owners
        // eg a shift register can be used by multiple devices.
      var device = this.getDevice(keys[0]);
      if (device !== null) {
        if ('multipleOwners' in device) {
          allowMultiple = device.multipleOwners;
        }
      }
      return this.config.requestOwnershipOfItem(keys, id, hopeful, allowMultiple);
    };

/**
 * Release ownership of an item
 * @param {String} deviceName Device name
 * @param {Object} item Configuration item releasing ownership
 * @param {Object[]} parts Profile information about the owner
 */
WetaDeviceUtils.prototype.releaseOwnership =
    function(deviceName, item, parts) {
      'use strict';
        // Need to release ownership for all parts that refer to other items
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].type === 'ref') {
          var ref = item[parts[i].name];
          if (ref !== -1) {
            var me = this.config.createOwnershipToken(deviceName, item.id, parts[i].name);
            var keys = parts[i].ref.split(' ');
            this.config.releaseOwnershipOfItem(keys, ref, me);
          }
        }
      }
    };

/**
 * Attempt to claim ownership of GPIO peripherals (or other devices) for each
 * device in a configuration. This would typically be called when a
 * configuration is uploaded from a file or a target.
 */
WetaDeviceUtils.prototype.requestOwnershipForAll =
    function() {
      for (var deviceName in this._devices) {
        if (!(deviceName in this.config.config)) {
          continue; // No such device in the configuration
        }
          // Step through the items and look for attributes with the type 'ref'
        var items = this.config.config[deviceName];
        for (var i = 0; i < items.length; i++) {
          for (var attr in items[i]) {
            if (attr === 'id') {
              continue; // Skip the id
            }
              // Get the information for this attribute
            var part = this.findPart(deviceName, attr);
            if (part === null) {
              continue; // Attribute not found. Must be management blod.
            }
            if (part.type === 'ref') {
                //Found a reference. Now attempt to obtain ownership.
              var token = this.config.createOwnershipToken(deviceName, items[i].id, attr);
              var keys = part.ref.split(' ');
              if (!this.requestOwnershipOfItem(keys, items[i][part.name], token)) {
                items[i].clash = true;
              }
            }
          }
        }
      }
    };

/**
 * Update ownership information to reflect a change in ID of an owner
 * @param {String} deviceName Device name
 * @param {Object} item Configuration item updating ownership
 * @param {number} oldId The old ID that will be in any ownership token
 * @param {Object[]} parts Profile information about the owner
 */
WetaDeviceUtils.prototype.updateOwnership =
    function(deviceName, item, oldId, parts) {
      'use strict';
        // Do it for all parts that are a reference to another item
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].type === 'ref') {
          var ref = item[parts[i].name];
          if (ref !== -1) {
            var oldToken = this.config.createOwnershipToken(
                deviceName,
                oldId,
                parts[i].name
            );
            var newToken = this.config.createOwnershipToken(
                deviceName,
                item.id,
                parts[i].name
            );
              // Get the keys to find the item from the part info
            var keys = parts[i].ref.split(' ');
            this.config.updateOwnershipOfItem(keys, ref, oldToken, newToken);
          }
        }
      }
    };

/**
 * Notify the owner of an item that the item's ID has changed
 * @param {Object[]} owner Ownership tokens identifying the owner(s)
 * @param {Number} newId The new ID of the owned item
 */
WetaDeviceUtils.prototype.notifyOwner =
    function(owner, newId) {
      'use strict';
        // Step through the owner tokens and look for owners
      for (var i = 0; i < owner.length; i++) {
        var items = this.config.config[owner[i].device];
          // (Getters in the config can return null)
        if (items === null) {
            // Device not found - strange - bug?
          return;
        }
        for (var j = 0; j < items.length; j++) {
          if (items[j].id === owner.id) {
            items[j][owner.attr] = newId;
            return;
          }
        }
      }
    };

/**
 * A new configuration has been loaded. Initially there will be no ownership
 * information and the ID counters will be zero (or something from the previous
 * configuration). So update this information.
 */
WetaDeviceUtils.prototype.onNewConfig =
    function() {
      this.requestOwnershipForAll();
      this.setNextIds();
    };

