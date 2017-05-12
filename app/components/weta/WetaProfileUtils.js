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
 * @fileOverview An Angular service for manipulating hardware profile
 * information.
 *
 * @author Murray Lang (murray@wetaproject.org)
 */

/**
 * Service constructor
 * @param {WetaProfilesProvider} profiles Injected global profiles
 * @constructor
 */
function WetaProfileUtils(profiles) {
  this.current = profiles.current; // Only interested in the current profile
  this.headers = {};

  /**
   * Make sure assigned profile has the basics. Also prevent replacing the
   * member variable so that data binding is not broken.
   */
  Object.defineProperty(this, 'profile',
      {
        get: function() {
          return this.current;
        },
        set: function(val) {
          angular.copy(val, this.current);
          if (!('name' in this.current)) {
            this.current.name = '';
          }
          if (!('caps' in this.current)) {
            this.current.caps = {order: [], info: {}};
          }
          if (!('functions' in this.current)) {
            this.current.functions = {};
          }
        }
      }
  );

  /**
   * Allow access to profile name as though this was the profile object
   */
  Object.defineProperty(this, 'name',
      {
        get: function() {
          if (this.current === null) {
            return null;
          }
          return this.current.name;
        }
      }
  );

  /**
   * @brief Allow access to profile caps as though this was the profile object
   */
  Object.defineProperty(this, 'caps',
      {
        get: function() {
          if (this.current === null) {
            return null;
          }
          return this.current.caps;
        }
      }
  );

  /**
   * @brief Allow access to profile functions as though this was the profile object
   */
  Object.defineProperty(this, 'functions',
      {
        get: function() {
          if (this.current === null) {
            return null;
          }
          return this.current.functions;
        }
      }
  );
}

/**
 * Create 2D header structures for each of the available peripheral types.
 * These greatly simplify the generation of tables using angular in HTML.
 */
WetaProfileUtils.prototype.createHeaders =
    function() {
      'use strict';
      this.deleteHeaders();
      this.headers.caps = this.getCapsHeaderStructure();
      for (var periph in this.current.functions) {
        this.headers[periph] = this.getHeaderStructure(periph);
      }
    };

/**
 * Delete the header structures previously created
 */
WetaProfileUtils.prototype.deleteHeaders =
    function() {
      for (var header in this.headers) {
        delete this.headers[header];
      }
    };

/**
 * Determine whether the given peripheral has different parts to it.
 * e.g. Digital has no parts, but PWM does (timers and channels)
 * @param {String} periph Name of the peripheral
 * @returns {boolean} True if there are parts
 */
WetaProfileUtils.prototype.hasParts =
    function(periph) {
      'use strict';
      if (periph in this.current.functions) {
        if ('parts' in this.current.functions[periph]) {
          return true;
        }
      }
      return false;
    };

/**
 * Find a part in the given array of parts
 * @param {Object[]} parts Array of parts
 * @param {String} name name of the required part
 * @returns {Object|null} The part object or null if not found
 */
WetaProfileUtils.prototype.getPartInParts =
    function(parts, name) {
      'use strict';
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].name === name) {
          return parts[i];
        }
      }
      return null;
    };

/**
 * Find a part in the given peripheral
 * @param {String} periph Name of the peripheral
 * @param {String} part Name of the part in the above peripheral
 * @returns {Object|null} The part or null if not found
 */
WetaProfileUtils.prototype.getPart =
    function(periph, part) {
      'use strict';
      if (!part || part.length === 0) {
        return this.current.functions[periph];
      }
      else if ('parts' in this.current.functions[periph]) {
        return this.getPartInParts(this.current.functions[periph].parts, part);
      }
      return null;
    };

/**
 * Get the options array for the given part of the given peripheral
 * @param {String} periph eg. "digital", "pwm", "adc" etc.
 * @param {String} part [optional] Name of part if any
 * @returns {Object[]|null} Array of relevant options or null if none
 */
WetaProfileUtils.prototype.getOptions =
    function(periph, part) {
      'use strict';
      if (this.current) {
        if ('functions' in this.current) {
          if (periph in this.current.functions) {
            if (part && part.length > 0) {
              var partObj = this.getPart(periph, part);
              if (partObj && 'options' in partObj) {
                return partObj.options;
              }
            } else {
              if ('options' in this.current.functions[periph]) {
                return this.current.functions[periph].options;
              }
            }
          }
        }
      }
      return null;
    };

/**
 * Find the option with the given name in the given peripheral
 * @param {String} periph eg. "digital", "pwm", "adc" etc.
 * @param {String} opt Name of the required option
 * @returns {Object|null} The option or null if not found
 */
WetaProfileUtils.prototype.findOption =
    function(periph, opt) {
      'use strict';
        // Is there even a profile?
      if (this.current) {
          // Is it valid?
        if ('functions' in this.current) {
            // Is the given peripheral represented?
          if (periph in this.current.functions) {
              // Does the peripheral come in parts?
            if ('parts' in this.current.functions[periph]) {
                // Search through the parts for an option with the
                // given name.
              for (var i = 0; i < this.current.functions[periph].parts.length; i++) {
                  // Are there options defined for this part
                if ('options' in this.current.functions[periph].parts[i]) {
                    // Linear search of the options for the given option
                  for (var j = 0; j < this.current.functions[periph].parts[i].options.length; j++) {
                    if (this.current.functions[periph].parts[i].options[j].name === opt) {
                      return {
                        part: this.current.functions[periph].parts[i].name,
                        option: this.current.functions[periph].parts[i].options[j]
                      };
                    }
                  }
                }
              }
            } else { // No "parts"
                // Are there options in the main part of the definition
              if ('options' in this.current.functions[periph]) {
                  // Linear search of the options for the given option
                for (var k = 0; k < this.current.functions[periph].options.length; k++) {
                  if (this.current.functions[periph].options[k].name === opt) {
                    return {
                      part: '',
                      option: this.current.functions[periph].options[k]
                    };
                  }
                }
              }
            }
          }
        }
      }
      return null;
    };

/**
 * Find an option object with the given name in the given array of options
 * @param {Object[]} options Array of options
 * @param {String} name Name of the option of interest
 * @returns {Object|null} The found option object or null if not found
 */
WetaProfileUtils.prototype.getOptionInOptions =
    function(options, name) {
      'use strict';
      return options.find(function(option) { return option.name === name;});
    };

/**
 * Find an option with the given name from the given peripheral/part
 * @param {String} periph eg. "digital", "pwm", "adc" etc.
 * @param {String} part Name of the required part
 * @param {String} name Name of the required option
 * @returns {Object|null} The found option object, or null if not found
 */
WetaProfileUtils.prototype.getOption =
    function(periph, part, name) {
      'use strict';
      var options = this.getOptions(periph, part);
      if (options !== null) {
        return this.getOptionInOptions(options, name);
      }
      return null;
    };

/**
 * Get the default value for the given option
 * @param {Object[]} options Relevant options array
 * @param {String} name Name of the required option
 * @returns {Object|Number} The default value, or 0 if not found.
 */
WetaProfileUtils.prototype.getDefaultValueInOptions =
    function(options, name) {
      'use strict';
      var option = this.getOptionInOptions(options, name);
      if (option === null) {
        return 0;
      }
      if (!('default' in option)) {
        return 0;
      }
      return option.default;
    };

/**
 * Get the default value for the given option
 * @param {String} periph Name of peripheral (eg. "pwm")
 * @param {String} part [optional] Part of peripheral (eg. "channel")
 * @param {String} name Name of the required option
 * @returns {Number|String|boolean}The default value, or 0 if not found.
 */
WetaProfileUtils.prototype.getDefaultValue =
    function(periph, part, name) {
      'use strict';
      var options = this.getOptions(periph, part);
      if (options !== null) {
        return this.getDefaultValueInOptions(options, name);
      }
      return 0;
    };

/**
 * Find the 'order' attribute of an option then get the item at the given index.
 * @param {Object[]} options Array of options
 * @param {String} name Name of the required option
 * @param {Number} index Place in the 'order'array
 * @returns {Number} Item at index, or -1 if not found or index invalid
 */
WetaProfileUtils.prototype.getItemFromOrderIndexInOptions =
    function(options, name, index) {
      'use strict';
        // Find the option with the given name
      var option = this.getOptionInOptions(options, name);
      if (option === null) {
        return -1;
      }
        // Make sure it has an "order" attribute
      if (!('order' in option)) {
        return -1;
      }
      if (index >= option.order.length) {
        return -1;
      }
      return option.order[index];
    };

/**
 * Using the 'order' attribute of an option, get the item at the given index.
 * @param {String} periph Name of peripheral (eg. "pwm")
 * @param {String} part [optional] Part of peripheral (eg. "channel")
 * @param {String} name Name of the required option
 * @param {Number} index Place in the 'order'array
 * @returns {Number} Item at index, or -1 if not found or index invalid
 */
WetaProfileUtils.prototype.getItemFromOrderIndex =
    function(periph, part, name, index) {
      'use strict';
      var options = this.getOptions(periph, part);
      if (options === null) {
        return -1;
      }
      return this.getItemFromOrderIndexInOptions(options, name, index);
    };

/**
 * Find the 'order' attribute of an option then find the index of a value in it.
 * @param {Object[]} options array of options
 * @param {String} name Name of the required option
 * @param {Number} item The item to search for in the 'order' array
 * @returns {Number} Index of the item, or -1 if not found
 */
WetaProfileUtils.prototype.getOrderIndexOfItemInOptions =
    function(options, name, item) {
      'use strict';
      // Find the option with the given name
      var option = this.getOptionInOptions(options, name);
      if (option === null) {
        return -1;
      }
      // Make sure it has an "order" attribute
      if (!('order' in option)) {
        return -1;
      }
      // Find the index of the given item in the order
      return option.order.findIndex(function(val) { return val === item;});
    };

/**
 * Find the 'order' attribute of an option then find the index of a value in it.
 * @param {String} periph Name of peripheral (eg. "pwm")
 * @param {String} part [optional] Part of peripheral (eg. "channel")
 * @param {String} name Name of the required option
 * @param {Number} item The item to search for in the 'order' array
 * @returns {Number} Index of the item, or -1 if not found
 */
WetaProfileUtils.prototype.getOrderIndexOfItem =
    function(periph, part, name, item) {
      'use strict';
      var options = this.getOptions(periph, part);
      if (options === null) {
        return -1;
      }
      return this.getOrderIndexOfItemInOptions(options, name, item);
    };

/**
 * Get the maximum number of items allowed in the given part of the given
 * peripheral.
 * @param {String} periph Name of peripheral (eg. "pwm")
 * @param {String} part [optional] Part of peripheral (eg. "channel")
 * @returns {number} The maximum number of parts, or -1 if no limit
 */
WetaProfileUtils.prototype.getMaxItems =
    function(periph, part) {
      'use strict';
      var partObj = this.getPart(periph, part);
      if (partObj !== null) {
        if ('max' in partObj) {
          return partObj.max;
        }
      }
      return -1;
    };

/**
 * Create a two-dimensional array representing a header structure for
 * displaying the given peripheral in tabular form
 * @param {String} periph Name of peripheral (eg. "pwm")
 * @returns {Object[][]|null} 2D header structure or null if there's a problem
 */
WetaProfileUtils.prototype.getHeaderStructure =
    function(periph) {
      'use strict';
      if (!(periph in this.current.functions)) {
        return null;
      }
      var peripheral = this.current.functions[periph];
      var result = [];
      // Push the overall title as the first row. The span will be
      // calculated and updated later.
      result.push([{title: peripheral.description, name: periph, span: 0}]);
      if ('parts' in peripheral) {
        var parts = [];
        var overallSpan = 0;
        for (var i = 0; i < peripheral.parts.length; i++) {
          var part = {
            title: peripheral.parts[i].description,
            name: peripheral.parts[i].name,
            span: peripheral.parts[i].options.length,
            items: [],
          };
          overallSpan += part.span;
          for (var j = 0; j < peripheral.parts[i].options.length; j++) {
            part.items.push(
                {
                  title: peripheral.parts[i].options[j].description,
                  name: peripheral.parts[i].options[j].name,
                  span: 1,
                }
            );
          }
          parts.push(part);
        }
        result[0][0].span = overallSpan;
        result.push(parts);

      } else {
        result[0][0].span = peripheral.options.length;

        var onlyPart = {
          title: '',
          name: '',
          span: peripheral.options.length,
          items: [],
        };
        for (var i = 0; i < peripheral.options.length; i++) {
          onlyPart.items.push({
            title: peripheral.options[i].description,
            name: peripheral.options[i].name,
            span: 1,
          });
        }
        result.push([onlyPart]);
      }
      return result;
    };

/**
 * Get the header structure for the GPIO capabilities table
 * @returns {Object[][]} 2D header or null if there was a problem
 */
WetaProfileUtils.prototype.getCapsHeaderStructure =
    function() {
      'use strict';
      if (this.caps === null) {
        return null;
      }
      // An array for each row of the header. Each item in the first row
      // has a span for the number of columns it spans.
      // Start off with the column for the GPIO pin number.
      var result = {
        row0: {title: 'GPIO_CAPABILITIES', span: 1},
        row1: [{span: 1}],
        row2: ['GPIO']
      };
      var caps = this.caps;
      var currGroup = null;
      // Step through the pins in the order they should be displayed in
      for (var i = 0; i < caps.order.length; i++) {
        var cap = caps.order[i];
        result.row2.push(caps.info[cap].heading);
        result.row0.span++;
        // If this pin belongs to a group then check if it's a new
        // group.
        if ('group' in caps.info[cap]) {
          if (currGroup) {
            if (currGroup.name === caps.info[cap].group) {
              // It's a member of a group already started...
              currGroup.span++;  //...so increment the width
            } else {
                // Start a new group
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
          if (currGroup) {
            currGroup = null;
          }
          result.row1.push({span: 1});
        }
      }
      return result;
    };
