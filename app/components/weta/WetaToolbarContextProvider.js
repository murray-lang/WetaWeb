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
 * @fileOverview A provider for sharing the toolbar between pages.
 * The toolbar has a number of user input controls that fire events that
 * need to be routed to the current page. This provider contains a number of
 * callback function references that need to be set by each page when it is
 * loaded. If the page doesn't set a callback then the corresponding control in
 * the toolbar is hidden. Thus the toolbar adapts to each page. The pages need
 * to clear all the callbacks as they are unloaded.
 *
 * @author Murray Lang (murray@wetaproject.org)
 *
 */

/**
 * A provider of callbacks for use by the toolbar and its clients
 * @param {String} address Current IP address
 * @param {function} onQuery  Query a target Weta device
 * @param {function} onProgram Program a Weta device
 * @param {boolean} rom Whether to store a program in ROM/Flash or just RAM
 * @param {function} onChangeProfile Select a different hardware platform
 * @param {function} onChangeLanguage User selectes a locale/language
 * @param {function} onOpen Open a file (e.g. Blocks, configuration)
 * @param {function} onSave Save a file (e.g. Blocks, configuration)
 * @param {function} onStop Stop a currently running program
 * @constructor
 */
function WetaToolbarContextProvider(
    address,
    onQuery,
    onProgram,
    rom,
    onChangeProfile,
    onChangeLanguage,
    onOpen,
    onSave,
    onStop) {
  'use strict'
  this.address          = address;
  this.onQuery          = onQuery;
  this.onProgram        = onProgram;
  this.rom              = rom;
  this.onChangeProfile  = onChangeProfile;
  this.onChangeLanguage = onChangeLanguage;
  this.onOpen           = onOpen;
  this.onSave           = onSave;
  this.onStop           = onStop;
}

/**
 * Clear all the callbacks. Called by client pages when they are destroyed.
 */
WetaToolbarContextProvider.prototype.clear =
    function() {
      'use strict';
      //this.address persists
      this.onQuery = null;
      this.onProgram = null;
      //this.rom persists
      this.onChangeProfile  = null;
      this.onChangeLanguage = null;
      this.onOpen = null;
      this.onSave = null;
      this.onStop = null;
    };
