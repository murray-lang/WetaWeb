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
 * @fileOverview A service for injecting the Weta compiler and assembler.
 *
 * @author Murray Lang (murray@wetaproject.org)
 *
 */
'use strict';

/**
 * Nothing to do in the constructor at present
 * @constructor
 */
function WetaCompilerService() {
}

/**
 * Compile the given configuration object into assembly language text
 * @param {Object} config Configuration object
 * @param {String} lang Locale/language for messages
 */
WetaCompilerService.prototype.compileConfig =
    function(config, lang) {
      var cc = new WetaConfigCompiler();
      return cc.compile(config, lang);
    };

/**
 * Assemble the given text into byte codes
 * @param {String} wasm Assembly language text
 * @param {String} lang Locale/Language for messages
 * @param {function} progressCallback
 * @returns {Object} Object containing assembler output and any error info
 */
WetaCompilerService.prototype.assemble =
    function(wasm, lang, progressCallback) {
      var result = {errors: 1, codes: null};
      var logMsg;
      if (progressCallback === undefined) {
        result.msg = '';
        logMsg =
            function(txt) {
              result.msg += txt;
            };
      } else {
        logMsg = progressCallback;
      }
      var formatter = new MessageFormatter('./i18n', lang, logMsg, logMsg, logMsg, logMsg);
      var wa = new WetaAssembler(formatter);
      result.codes = wa.assemble(wasm);
      result.errors = formatter.errors;
      return result;
    };

/**
 * Compile the Logo text into assembly language text
 * @param {String} logo Logo souece text
 * @param {String} lang Locale/language for messages
 * @param {function} progressCallback
 * @returns {Object} Object containing assembly text and any error info
 */
WetaCompilerService.prototype.compileLogo =
    function(logo, lang, progressCallback) {
      var result = {errors: 1, wasm: ''};

      var output =
          function(str) {
            result.wasm += str;
          };

      var logMsg;
      if (progressCallback === undefined) {
        result.msg = '';
        logMsg =
            function(txt) {
              result.msg += txt;
            };
      } else {
        logMsg = progressCallback;
      }
      var formatter = new MessageFormatter('./i18n', lang, logMsg, logMsg, logMsg, logMsg);
      var wl = new WetaLogo(output, formatter);
      result.errors = wl.compile(logo);
      return result;
    };

