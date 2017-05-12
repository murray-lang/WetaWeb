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
 * @fileOverview Utilities and wrapper service for a Weta target configuration.
 *
 * @author Murray Lang (murray@wetaproject.org)
 *
 */
'use strict';
/**
 * Utilities and wrapper service for a Weta target configuration
 * @param {WetaConfigProvider} globalConfig Current configuration
 * @param {WetaProfileUtils} profileUtils Target hardware info
 * @constructor
 */
function WetaConfigUtils(globalConfig, profileUtils) {
  this.profile       = profileUtils;
  this.pinSelections = [];
  this.config        = globalConfig.config;

  Object.defineProperty(this, 'profileName',
      {
        get: function() {
          if ('profile' in this.config) {
            return this.config.profile;
          } else {
            return null;
          }
        }
      }
  );
  /**
   * Allow access to digital as though this was the config object
   */
  Object.defineProperty(this, 'digital',
      {
        get: function() {
          if (this.config === null) {
            return null;
          }
          if (!('digital' in this.config)) {
            this.config.digital = [];
            return this.config.digital;
          }
        }
      }
  );

  /**
   * Allow access to adc as though this was the config object
   */
  Object.defineProperty(this, 'adc',
      {
        get: function() {
          if (this.config === null) {
            return null;
          }
          this.initAdc();
          return this.config.adc;
        },
      }
  );

  /**
   * Allow access to dac as though this was the config object
   */
  Object.defineProperty(this, 'dac',
      {
        get: function() {
          if (this.config === null) {
            return null;
          }
          this.initDac();
          return this.config.dac;
        },
      }
  );

  /**
   * Allow access to dac as though this was the config object
   */
  Object.defineProperty(this, 'uart',
      {
        get: function() {
          if (this.config === null) {
            return null;
          }
          this.initUart();
          return this.config.uart;
        },
      }
  );

  /**
   * Allow access to motors as though this was the config object
   */
  /*
  Object.defineProperty(this, 'motor',
      {
        get: function() {
          if (this.config === null) {
            return null;
          }
          this.initMotor();
          return this.config.motor;
        }
      }
  );
*/
  /**
   * Allow access to steppers as though this was the config object
   */
  Object.defineProperty(this, 'stepper',
      {
        get: function() {
          if (this.config === null) {
            return null;
          }
          this.initStepper();
          return this.config.stepper;
        }
      }
  );

  /**
   * Allow access to shifters as though this was the config object
   */
  Object.defineProperty(this, 'shifter',
      {
        get: function() {
          if (this.config === null) {
            return null;
          }
          this.initShifter();
          return this.config.shifter;
        }
      }
  );
}

/**
 * Set a new configuration by copying over the existing one. This ensures that
 * any binding to the configuration is maintained. The object is shared
 * throughout the application.
 * @param {Object} config New configuration information
 */
WetaConfigUtils.prototype.setConfig =
    function(config) {
      this.clearConfig();
      if (config) {
        angular.copy(config, this.config);
      }
    };

/**
 * Empty the configuration
 */
WetaConfigUtils.prototype.clearConfig =
    function() {
      angular.copy({}, this.config);
    };

/**
 * Initialise the digital part of the configuration
 */
WetaConfigUtils.prototype.initDigital =
    function() {
      if (this.config === null) {
        return;
      }
      if (!('digital' in this.config)) {
        this.config.digital = [];
      }
    };

/**
 * Initialise the PWM part of the configuration
 */
WetaConfigUtils.prototype.initPwm =
    function() {
      if (this.config === null) {
        return;
      }
      if (!('pwm' in this.config)) {
        this.config.pwm = {};
      }
      if (!('timers' in this.config.pwm)) {
        this.config.pwm.timers = [];
      }
      if (!('channels' in this.config.pwm)) {
        this.config.pwm.channels = [];
      }
    };

/**
 * Initialise the ADC part of the configuration
 */
WetaConfigUtils.prototype.initAdc =
    function() {
      if (this.config === null) {
        return;
      }
      if (!('adc' in this.config)) {
        this.config.adc = {};
      }
      if (!('depth' in this.config.adc)) {
        this.config.adc.depth =
            [
              {
                depth: this.profile.getDefaultValue('adc', 'depth', 'depth')
              }
            ];
      }
      if (!('channels' in this.config.adc)) {
        this.config.adc.channels = [];
      }
    };

/**
 * Initialise the DAC part of the configuration
 */
WetaConfigUtils.prototype.initDac =
    function() {
      if (this.config === null) {
        return;
      }
      if (!('dac' in this.config)) {
        this.config.dac = [];
      }
    };

/**
 * Initialise the UART part of the configuration
 */
WetaConfigUtils.prototype.initUart =
    function() {
      if (this.config === null) {
        return;
      }
      if (!('uart' in this.config)) {
        this.config.uart = [];
      }
    };

/**
 * Initialise the motor part of the configuration
 */
WetaConfigUtils.prototype.initMotor =
    function() {
      if (this.config === null) {
        return;
      }
      if (!('motor' in this.config)) {
        this.config.motor = [];
      }
    };

/**
 * Initialise the stepper part of the configuration
 */
WetaConfigUtils.prototype.initStepper =
    function() {
      if (this.config === null) {
        return;
      }
      if (!('stepper' in this.config)) {
        this.config.stepper = [];
      }
    };

/**
 * Initialise the shifter part of the configuration
 */
WetaConfigUtils.prototype.initShifter =
    function() {
      if (this.config === null) {
        return;
      }
      if (!('shifter' in this.config)) {
        this.config.shifter = [];
      }
    };

/**
 * Given a GPIO pin selection, determine whether any selections correspond to
 * the given peripheral.
 * @param {Object} pin Peripheral selections for a GPIO pin
 * @param {String} periph Name of a peripheral
 * @returns {boolean} True if a selection corresponds to the peripheral
 */
WetaConfigUtils.prototype.isPeripheralSelected =
    function(pin, periph) {
      switch (periph) {
        case 'digital':
          return pin.din || pin.dout;

        case 'adc':
          return pin.adc;

        case 'dac':
          return pin.dac;

        case 'pwm':
          return pin.pwm;

        case 'uart':
          return pin.uart_rx || pin.uart_tx || pin.uart_rts || pin.uart_cts;
      }
      return false;
    };
/**
 * Make sure that we have a basic configuration for the given peripheral
 * @param {String} periph Name of the peripheral
 */
WetaConfigUtils.prototype.initPeripheral =
    function(periph) {
      switch (periph) {
        case 'digital':
          this.initDigital();
          break;

        case 'adc':
          this.initAdc();
          break;

        case 'dac':
          this.initDac();
          break;

        case 'pwm':
          this.initPwm();
          break;

        case 'uart':
          this.initUart();
          break;

        case 'motor':
          this.initMotor();
          break;

        case 'stepper':
          this.initStepper();
          break;

        case 'shifter':
          this.initShifter();
          break;
      }
    };

/**
 * Find the collection related to the given peripheral
 * @param {String} periph Name of the peripheral
 * @param {String} part Name of a part of the the peripheral
 * @returns {Object[] | null} An array of settings from the configuration
 */
WetaConfigUtils.prototype.getCollection =
    function(periph, part) {
      if (this.config === null) {
        return null;
      }
      if (!(periph in this.config)) {
        return null;
      }
      switch (periph) {
        case 'digital':
        case 'dac':
        case 'uart':
        case 'motor':
        case 'stepper':
        case 'shifter':
        case 'servo':
          return this.config[periph];

        case 'adc':
        case 'pwm':
          if (part === undefined || part.length === 0) {
            return this.config[periph].channels;
          } else {
            return this.config[periph][part];
          }
          break;
      }
      return null;
    };

/**
 * Get the value of the given attribute from every entry for a given peripheral
 * @param {String} periph Name of the peripheral of interest
 * @param {String} part Name of the peripheral part of interest
 * @param {String} attr Name of the attribute of interest
 * @returns {*[]}
 */
WetaConfigUtils.prototype.getColumn =
    function(periph, part, attr) {
      var collection = this.getCollection(periph, part);
      if (collection === null) {
        return null;
      }
      var result = [];
      for (var i = 0; i < collection.length; i++) {
        if (attr in collection[i]) {
          result.push(collection[i][attr]);
        }
      }
      return result;
    };

/**
 * Create a configuration item based on the pin information
 * @param {Object} pin GPIO pin peripheral selections
 * @returns {*}
 */
WetaConfigUtils.prototype.createItemForPin =
    function(pin) {
      if (this.isPeripheralSelected(pin, 'digital')) {
        return {
          id: 0,  // This will be reassigned later
          io: pin.pin,
          in: pin.din ? 1 : 0,
          out: pin.dout ? 1 : 0 //,
        };
      } else if (this.isPeripheralSelected(pin, 'adc')) {
        return this.createAdcItemForPin(pin);
      } else if (this.isPeripheralSelected(pin, 'pwm')) {
        // Make sure there's at least one timer
        var timerIds = this.getColumn('pwm', 'timers', 'id');
        if (timerIds.length === 0) {
          this.addItem('pwm', 'timers');
        }
        return {
          id: 0,  // This will be reassigned later
          io: pin.pin,
          timer: 0  // TODO: Make sure a timer is available
        };
      } else if (this.isPeripheralSelected(pin, 'dac')) {
        return this.createDacItemForPin(pin);
      } else if (this.isPeripheralSelected(pin, 'dac')) {
        return this.createUartItemForPin(pin);
      }
    };

/**
 * Create an ADC entry based on the ADC profile and the given pin. The ADC
 * numbers/ids might be fixed for a given GPIO pin.
 * @param {Object} pin GPIO pin information
 * @returns {*}
 */
WetaConfigUtils.prototype.createAdcItemForPin =
    function(pin) {
      // Get the position of this gpio number in the ADC order
      var pinIndex = this.profile.getOrderIndexOfItem('adc', 'channels', 'io',
          pin.pin);
      if (pinIndex === -1) {
        return null;
      }
      // Now get the channel number at the same index (might not be contiguous)
      var channel = this.profile.getItemFromOrderIndex('adc', 'channels', 'id',
          pinIndex);
      if (channel === -1) {
        return null;
      }
      return {
        id: channel,
        io: pin.pin,
        gain: this.profile.getDefaultValue('adc', 'channel', 'gain')
      };
    };

/**
 * Create a DAC entry based on the DAC profile and the given pin. The DAC
 * numbers/ids might be fixed for a given GPIO pin.
 * @param {Object} pin GPIO pin information
 * @returns {*}
 */
WetaConfigUtils.prototype.createDacItemForPin =
    function(pin) {
      // Get the position of this gpio number in the ADC order
      var pinIndex = this.profile.getOrderIndexOfItem('dac', '', 'io', pin.pin);
      if (pinIndex === -1) {
        return null;
      }
      // Now get the channel number at the same index (might not be contiguous)
      var channel = this.profile.getItemFromOrderIndex('dac', '', 'id',
          pinIndex);
      if (channel === -1) {
        return null;
      }
      return {
        id: channel,
        io: pin.pin
      };
    };

/**
 * Create a UART configuration entry
 * @param {Object} pin Currently not used, but UARTs can be bound to pins
 * @returns {Object} UART entry
 */
WetaConfigUtils.prototype.createUartItemForPin =
    function(pin) {
      // TODO: create this object properly with pin information
      return {
        id: 0,  // This will be reassigned later
        baud: 115200,
        databits: 8,
        parity: 'none',
        stopbits: 1
      };
    };

/**
 * Update a configuration entry based on a pin GPIO selection. Currently
 * only digital I/O can have different selections for the same peripheral.
 * @param {Object} item Configuration entry
 * @param {Object} pin A pin's GPIO selections
 */
WetaConfigUtils.prototype.updateItemForPin =
    function(item, pin) {
      if (pin.din || pin.dout) {
        item.in = pin.din ? 1 : 0;
        item.out = pin.dout ? 1 : 0;
      }
    };

/**
 * Add a new initialised item to a configuration collection
 * @param {String} periph Name of the peripheral
 * @param {String} part Name of the part of the peripheral
 */
WetaConfigUtils.prototype.addItem =
    function(periph, part) {
      var collection = this.getCollection(periph, part);
      if (collection === null) {
        return;
      }
        // Lookup the maximum number allowed of these items
        // (-1 means no limit)
      var max = this.profile.getMaxItems(periph, part);
      if (max !== -1 && collection.length >= max) {
        return;
      }
        //Lookup the applicable settings
      var options = this.profile.getOptions(periph, part);
      var newItem = {};
        //For each setting, add a default entry to the item
      for (var i = 0; i < options.length; i++) {
        // Options with "button" type are not for storing data
        if (options[i].type === 'button') {
          continue;
        }
        var name = options[i].name;
          // assign any default value for this attribute
        if ('default' in options[i]) {
          newItem[name] = options[i].default;
        } else {
          newItem[name] = null;
        }
      }
        //Item is at the end, so has the previous length as its ID
      newItem.id = collection.length;
      collection.push(newItem);
    };

/**
 * Reallocate IDs based on current place in the collection. This is called
 * after items are deleted. If an item has an owner (eg. Motor, servo etc.)
 * then a callback is invoked, presumably to notify the owner of a change to
 * one of its peripheral items.
 * @param {Object[]} collection All of the items for a peripheral
 * @param {function} ownerCallback Called when an item has an owner
 */
WetaConfigUtils.prototype.reassignIdsInCollection =
    function(collection, ownerCallback) {
      for (var i = 0; i < collection.length; i++) {
        if (collection[i].id !== i) {
          collection[i].id = i;
          if ('owner' in collection[i]) {
            ownerCallback(collection[i].owner, i);
          }
        }
      }

    };

/**
 * Remove the item with the given ID from the given collection
 * @param {String} periph Name of the peripheral
 * @param {String} part Name of a part of the peripheral
 * @param {Number} id ID of the item to remove
 */
WetaConfigUtils.prototype.removeItem =
    function(periph, part, id) {
      var collection = this.getCollection(periph, part);
      if (collection === null) {
        return;
      }
      for (var i = 0; i < collection.length; i++) {
        if (collection[i].id === id) {
          collection.splice(i, 1); // Remove the item
          this.reassignIdsInCollection(collection);
        }
      }
    };

WetaConfigUtils.prototype.adjustItemsForAllPins =
    function(periph, ownerCallback) {
      for (var i = 0; i < this.pinSelections.length; i++) {
        this.adjustItems(periph, this.pinSelections[i], ownerCallback);
      }
    };

/**
 * Go through the configuration entries for a peripheral and modify, add, or
 * remove items based on the GPIO selection(s) for the given pin. A callback is
 * invoked to notify owners of any modified or deleted items.
 * @param {String} periph Name of the peripheral
 * @param {Object} pin The GPIO selection(s) for a pin
 * @param {function} ownerCallback
 */
WetaConfigUtils.prototype.adjustItems =
    function(periph, pin, ownerCallback) {
      this.initPeripheral(periph); //Only touches if empty
      var reassignIds = true; // Default behaviour
        // Find the part and option with "io"
        // Only collections with peripheral pins are modified
      var partOption = this.profile.findOption(periph, 'io');
      if (partOption === null) {
        return; // This peripheral is not associated with a pin
      }
        // See if this peripheral has prescribed IDs
      if ('order' in partOption.option) {
        reassignIds = false;  // Yes - don't reassign IDs
      }
        // Get the entries for the part of the peripheral associated with
        // GPIO pins
      var collection = this.getCollection(periph, partOption.part);
      if (collection === null) {
        return; // Shouldn't reach this unless there's a bug
      }
        // Determine whether this peripheral is represented by the pin's
        // GPIO selection. If not then any item matching this pin will need
        // to be deleted. If so then any item matching this pin might need to
        // be modified. If so but no item found, then add a new item.
      var keep = this.isPeripheralSelected(pin, periph);
        // Search for an item with this pin
      var found = false;
      for (var i = 0; i < collection.length; i++) {
          // Compare the item's GPIO number with the pin's
        if (collection[i].io === pin.pin) {
          found = true;

          if (keep) {
              // The pin is still related to this peripheral.
              // However, more than one pin capability might be
              // involved so make any necessary adjustments.
            this.updateItemForPin(collection[i], pin);
          } else {
              // Remove the item if the new pin information
              // indicates a different peripheral
              // Firstly notify any owner
            if ('owner' in collection[i]) {
                // Tell the owner that the item is not available by specifying
                // the new id as -1
              ownerCallback(collection[i].owner, -1);
            }
            collection.splice(i, 1); // Remove the item
            if (reassignIds) {
              this.reassignIdsInCollection(collection, ownerCallback);
            }
          }
          break; // There can only be one match, so exit the loop
        }
      }
        // If the pin wasn't found, but is relevant, then add it
      if (!found && keep) {
        var newItem = this.createItemForPin(pin);
          // Above returns null if not possible (maybe maximum reached)
        if (newItem) {
            //For now just shove it at the end.
          collection.push(newItem);
          if (reassignIds) {
            this.reassignIdsInCollection(collection, ownerCallback);
          }
        }
      }
    };

/**
 * Check whether a configuration attribute has any unsatisfied dependencies on
 * any other attributes. (eg. debounce is only relevant to digital input, not
 * output).
 * @param {Object} configItem Entry in a configuration collection
 * @param {Object} option The profile entry for an option relevant to this item
 * @returns {boolean} True if satisfied
 */
WetaConfigUtils.prototype.checkOptionInterdependencies =
    function(configItem, option) {
      if ('requires' in option) {
        // Attribute has requirements
        // Return false if any not satisfied
        for (var i = 0; i < option.requires.length; i++) {
          // See if this required attribute is true
          if (configItem[option.requires[i]] === 0) {
            return false;
          }   // Not set. Requirement not met
        }
        return true; //
      }
      return true;    // No requirements
    };

/**
 * Update any GPIO pin selection relevant to the given configuration item
 * belonging to the given peripheral. This is called after a new configuration
 * has been loaded (eg. by querying a device or opening a file) so that the
 * relevant pin selections can be indicated. (Pin selections are not saved as
 * part of the configuration).
 * @param {String} periph Name of the peripheral
 * @param {Object} item An item in the associated configuration
 * @returns {boolean} True if a pin selection was found and updated
 */
WetaConfigUtils.prototype.setPinSelection =
    function(periph, item) {
      for (var i = 0; i < this.pinSelections.length; i++) {
        if (this.pinSelections[i].pin === item.io) {
          switch (periph) {
            case 'digital':
              // If neither in nor out is selected then ignore
              // the change.
              if (item.in === 1 || item.out === 1) {
                this.pinSelections[i].din = item.in === 1;
                this.pinSelections[i].dout = item.out === 1;
              } else {
                return false;
              }
              break;
            case 'pwm':
              this.pinSelections[i].pwm = true;
              break;
            case 'adc':
              this.pinSelections[i].adc = true;
              break;
          }

          return true;
        }
      }
      return false;
    };

/**
 * Update any GPIO pin selections relevant to the items associated with
 * the given peripheral. This is called after a new configuration
 * has been loaded (eg. by querying a device or opening a file) so that the
 * relevant pin selections can be indicated. (Pin selections are not saved as
 * part of the configuration).
 * @param {String} periph Name of the peripheral
 */
WetaConfigUtils.prototype.updatePinSelections =
    function(periph) {
      var collection = null;
      switch (periph) {
        case 'digital':
          collection = this.getCollection(periph, '');
          break;
        case 'pwm':
        case 'adc':
          collection = this.getCollection(periph, 'channels');
          break;
      }
      if (collection !== null) {
        for (var i = 0; i < collection.length; i++) {
          this.setPinSelection(periph, collection[i]);
        }
      }
    };

/**
 * Update pin selections based on the current configuration.
 * This is called after a new configuration has been loaded (eg. by querying a
 * device or opening a file) so that the relevant pin selections can be
 * indicated. (Pin selections are not saved as part of the configuration).
 */
WetaConfigUtils.prototype.updateAllPinSelections =
    function() {
      if (this.profile.functions !== null) {
        for (var periph in this.profile.functions) {
          if (this.profile.functions.hasOwnProperty(periph)) {
            this.updatePinSelections(periph);
          }
        }
      }
    };

/**
 * Find the item in the pinSelections that corresponds to a given pin's ID
 * @param {Object} pin Pin GPIO information
 * @returns {Object | null} Matching pin in the collection
 */
WetaConfigUtils.prototype.findSelection =
    function(pin) {
      for (var i = 0; i < this.pinSelections.length; i++) {
        if (this.pinSelections[i].pin === pin.pin) {
          return this.pinSelections[i];
        }
      }
      return null;
    };

/**
 * Deselect any capabilities that are incompatible with the new one.
 * For example a pin cannot be both digital and PWM. However, a
 * digital pin could be both input and output.
 * @param {Object} pin The pin object with all of its GPIO capabilities
 * @param {String} cap The GPIO capability that is being changed.
 * @param {boolean} newValue The new value (boolean) for the capability
 */
WetaConfigUtils.prototype.deselectIncompatibleCaps =
    function(pin, cap, newValue) {
      // Search for the pin
      var selection = this.findSelection(pin);
      if (selection) {
        if (selection.pin === pin.pin && !selection.lock) {
          // Found the pin
          if (newValue) {
            // It's selected, so do any necessary deselection
            // Find the info for the capability to determine
            // compatibility between capabilities (!)
            var capInfo = this.profile.caps.info[cap]; // Assume consistency

            for (var next in selection) {
              if (next.localeCompare('pin') !== 0) {
                // Don't check against itself
                if (next.localeCompare(cap) !== 0) {
                  // Is next in the array of ones allowed?
                  if (!('allowedWith' in capInfo) ||
                      capInfo.allowedWith.indexOf(next) === -1) {
                    // No. Deselect
                    selection[next] = false;
                  }
                }
              }
            }
          }
        }
      }
    };

/**
 * Find a list of items that correspond to the given pattern.
 *
 * The given pattern is a space-separated list of keys to step into the items.
 * The first key identifies the peripheral, but the interpretation of the
 * remaining keys depends on whether the peripheral has "parts". If it has no
 * parts then the remaining keys identify attributes, one at least of which must
 * be true. If the peripheral has parts then the second key identifies the part
 * and the remaining keys identify attributes. The keys are part of the profile
 * for a "device", being an electronic wotsit that connects to GPIO. This search
 * is to populate a list of GPIO items that can be used for an input or output
 * of the device. (eg. a DC motor needs one or two digital outputs and a PWM).
 *
 * @param {String[]} keys The hierarchy of the relevant items.
 */
WetaConfigUtils.prototype.findItems =
    function(keys) {
      var result = [];
      var collection = this.getCollection.apply(this, keys);
      if (collection === null) {
        return result;
      }
        //  Remove the peripheral name from the keys
      var periph = keys.shift();
        // If it has parts then remove that key too
      if (this.profile.hasParts(periph)) {
        keys.shift();
      }
        // The keys array will now be the argument array to itemMatchesKeys().
        // Put an empty object at the front as a place holder for the current
        // item in the collection, being the first argument.
      keys.unshift({});
        // Now the keys are all attributes of an item
      for (var i = 0; i < collection.length; i++) {
        keys[0] = collection[i];
        if (this.itemMatchesKeys.apply(this, keys)) {
          result.push(collection[i]);
        }
      }
      return result;
    };

/**
 * Return true if the item has at least one attribute true that is identified
 * by the given keys. If there are no keys then return true.
 * @param {Object} item An item from a collection of items in a configuration
 * @param {...} args varargs being strings forming keys
 * @returns {boolean} True if the item has at least one attribute matching keys
 */
WetaConfigUtils.prototype.itemMatchesKeys =
    function(item, args) {
        // If there's only one argument then it's the item and there are no
        // keys. In this circumstance return everything
      if (arguments.length === 1) {
        return true;
      }
      for (var i = 1; i < arguments.length; i++) {
        if (item[arguments[i]] === 1)
          return true;  // Only one needs to match
      }
      return false;
    };

/**
 * Create an ownership object for attaching to a configuration item
 * @param {String} deviceName Name of the device type (eg 'motor')
 * @param {Number} id ID of the device
 * @param {String} attr The relevant attribute within the device
 * @returns {{device: *, id: *, attr: *}}
 */
WetaConfigUtils.prototype.createOwnershipToken =
    function(deviceName, id, attr) {
      return {
        device: deviceName,
        id: id,
        attr: attr
      };
    };

/**
 * A device wants to claim a configuration item. A device can claim another
 * device, for example a stepper motor claiming a shift register. Because one
 * shift register can be used by several devices, multiple owners are allowed.
 * GPIO items such as digital and PWM can only have one owning device.
 *
 * @param {String[]} keys The hierarchy identifying the item's location
 * @param {Number} id The item's ID
 * @param {Object} hopeful An ownership token of the requesting device
 * @param {boolean} allowMultiple True if multiple owners allowed
 * @returns {boolean}
 */
WetaConfigUtils.prototype.requestOwnershipOfItem =
    function(keys, id, hopeful, allowMultiple) {
      var items = this.findItems(keys);
      if (items.length === 0) {
        return false;
      }
      var item = items.find(function (next) { return next.id === id;});
      if (item === undefined) {
        return false;
      }
      if ('owner' in item) {
        if (allowMultiple) {
            // See if this hopeful is already an owner (don't add twice)
          var i = item.owner.findIndex(function(next) { return angular.equals(next, hopeful);});
          if (i === -1) {
            item.owner.push(hopeful);
          }
          return true;
        } else {
            // Return true if already the owner, otherwise false
          return angular.equals(item.owner[0], hopeful);
        }
      } else {
        item.owner = [hopeful];
        return true;
      }
    };

/**
 * A device no longer requires ownership due to being either modified or
 * deleted.
 * @param {String[]} keys keys The hierarchy identifying the item's location
 * @param {Number} id The item's ID
 * @param {Object} owner Ownership token of the device (must match existing)
 * @returns {boolean} True if the item's ownership was modified
 */
WetaConfigUtils.prototype.releaseOwnershipOfItem =
    function(keys, id, owner) {
      var items = this.findItems(keys);
      if (items.length === 0) {
        return false;
      }
      var item = items.find(function (next) { return next.id === id;});
      if (item === undefined) {
        return false;
      }
      if ('owner' in item) {
        var i = item.owner.findIndex(function(next) { return angular.equals(next, owner);});
        if (i !== -1) {
          item.owner.splice(i, 1);
          return true;
        }
      }
      return false;
    };

/**
 * A device that owns a configuration item has had it's ID changed, so the
 * ownership token attached to the item needs to be updated with the new ID.
 * @param {String[]} keys keys The hierarchy identifying the item's location
 * @param {Number} id The item's ID
 * @param {Object} oldToken The previous ownership token with the old ID
 * @param {Object} newToken The new ownership token with the new ID
 * @returns {boolean} True if the item's ownership was updated
 */
WetaConfigUtils.prototype.updateOwnershipOfItem =
    function(keys, id, oldToken, newToken) {
      var items = this.findItems(keys);
      if (items.length === 0) {
        return false;
      }
      var item = items.find(function (next) { return next.id === id;});
      if (item === undefined) {
        return false;
      }
      if ('owner' in item) {
          // Look for the oldToken and replace it if found
        var i = item.owner.findIndex(function(next) { return angular.equals(next, oldToken);});
        if (i !== -1) {
          item.owner[i] = newToken;
          return true;
        }
      } else {
        item.owner = newToken;
        return true;
      }
      return false;
    };
