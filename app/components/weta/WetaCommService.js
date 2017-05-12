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
 * @fileOverview A service for communicating with a Weta device.
 *
 * @author Murray Lang (murray@wetaproject.org)
 *
 */
'use strict';

/**
 * Communication service constructor
 * @param http
 * @param log
 * @constructor
 */
function WetaCommService(http, log) {
  this.http = http;
  this.log = log;
  this.address = null;
  this.select = null;
  this.status = null;
  //this.configuration = {};
}

/**
 * Set the IP address
 * @param {String} addr IP address
 */
WetaCommService.prototype.setAddress =
    function(addr) {
      this.address = addr;
    };

/**
 * Get the IP address
 * @returns {String|*|null} IP address
 */
WetaCommService.prototype.getAddress =
    function() {
      return this.address;
    };

/**
 * Get last response status
 * @returns {null}
 */
WetaCommService.prototype.getStatus =
    function() {
      return this.status;
    };
/*
WetaCommService.prototype.getConfiguration =
    function() {
      return this.configuration;
    };

WetaCommService.prototype.getCapabilities =
    function() {
      return this.capabilities;
    };
*/

/**
 * Convert an object to a query string for a URL
 * @param {Object} selection Object ith attributes corresponding to parameters
 * @returns {String} Query string for URL
 */
WetaCommService.prototype.toQuery =
    function(selection) {
      var query = null;
      for (var item in selection) {
        if (selection[item]) {
          if (query) {
            query += ',';
          } else {
            query = 'query=';
          }
          query += item;
        }
      }
      return query;
    };

/**
 * Perform an HTTP GET call
 * @param {String} address IP address
 * @param {Object} selection Object with attributes corresponding to query
 * @param {function} onsuccess Callback function for success
 * @param {function} onfailure Callback function for failure
 */
WetaCommService.prototype.GET =
    function(address, selection, onsuccess, onfailure) {
      this.address = address.trim();
      // Call toQuery() with all the arguments we received.
      var query = this.toQuery(selection);
      var config =
          {
            method: 'GET',
            url: 'http://' + this.address + '/weta?' + query

          };
      this.http(config).then(onsuccess, onfailure);
    };

/**
 * Perform an HTTP POST call
 * @param {String} address IP address
 * @param {String} command Command name
 * @param {Object} JSON object to POST as content
 * @param {function} onsuccess Callback function for success
 * @param {function} onfailure Callback function for failure
 */
WetaCommService.prototype.POST =
    function(address, command, json, onsuccess, onfailure) {
      this.address = address.trim();
      var config =
          {
            method: 'POST',
            url: 'http://' + this.address + '/weta?cmd=' + command
           };
      if (json) {
        config.data = json;
        config.headers = {'Content-type': 'application/json'};
      }
      this.http(config).then(onsuccess, onfailure);
    };

/**
 * Query the configuration of the Weta device at the given IP address
 * @param {String} address IP address
 * @param {function} callback Callback function for result
 */
WetaCommService.prototype.queryConfig =
    function(address, callback) {
      this.GET(
          address,
          {config: true},
          this.configQuerySuccess.bind(this, callback),
          this.queryError.bind(this, callback)
      );
    };

/**
 * Program the Weta device at the given IP address with the given configuration
 * byte codes.
 * @param {String} address IP address
 * @param {Object} config Assembler output with byte codes for configuration
 * @param {function} callback Callback function for result
 */
WetaCommService.prototype.programConfig =
    function(address, config, callback) {
      this.POST(
          address,
          'configure',
          config,
          this.postSuccess.bind(this, callback),
          this.postFailure.bind(this, callback)
      );
    };

/**
 * Program the Weta device at the given IP address with the given byte codes
 * @param {String} address IP address
 * @param {Object} code Weta assembler output
 * @param {boolean} rom Store in non-volatile memory?
 * @param {function} callback Callback function for result
 */
WetaCommService.prototype.programCode =
    function(address, code, rom, callback) {
      this.POST(
          address,
          rom ? 'program' : 'interpret',
          code,
          this.postSuccess.bind(this, callback),
          this.postFailure.bind(this, callback)
      );
    };

/**
 * Stop the program running on the Weta device at the given IP address
 * @param {String} address IP address
 * @param {function} callback Callback function for result
 */
WetaCommService.prototype.stopCode =
    function(address, callback) {
      this.POST(
          address,
          'stop',
          null,
          this.postSuccess.bind(this, callback),
          this.postFailure.bind(this, callback)
      );
    };

/**
 * Query the I/O values from the Weta device at the given IP address
 * @param {String} address IP address
 */
WetaCommService.prototype.queryStatus =
    function(address) {
      this.GET(
          address,
          {status: true},
          this.statusQuerySuccess.bind(this),
          this.queryError.bind(this)
      );
    };

/**
 * Callback function for queryStatus() success
 * @param {Object} response HTTP response object
 */
WetaCommService.prototype.statusQuerySuccess =
    function(response) {
      //this.log.log("Query success!");
      Object.assign(this.status, response.data);
    };

/**
 * Callback function for queryConfig() success
 * @param {function} callback User callback (bound by queryConfig())
 * @param {Object} response HTTP response object
 */
WetaCommService.prototype.configQuerySuccess =
    function(callback, response) {
      //this.log.log("Query success!");
      //Object.assign(this.configuration, response.data);
      callback(response.data, response.statusText);
    };

/**
 * Callback function for query failure
 * @param {function} callback User callback
 * @param {Object} response HTTP response object
 */
WetaCommService.prototype.queryError =
    function(callback, response) {
      //this.log.log('Query error:' + response.statusText);
      callback(null, response.statusText);
    };
/**
 * Callback function for POST success
 * @param {function} callback User callback
 * @param {Object} response HTTP response object
 */
WetaCommService.prototype.postSuccess =
    function(callback, response) {
      callback(true, response.statusText);
    };

/**
 * Callback function for POST failure
 * @param {function} callback User callback
 * @param {Object} response HTTP response object
 */
WetaCommService.prototype.postFailure =
    function(callback, response) {
      callback(false, 'Device not found at ' + this.address);
    };

