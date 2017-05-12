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
 * @fileOverview An Angular service for propagating locale/language information.
 * The need for this service comes about due to the presence of three different
 * i18n schemes in this project:
 *
 *  1) Angular Translate
 *  2) Google Blockly's own i18n scheme
 *  3) locale-js for the compiler and assembler
 *
 * Angular Translate and Blockly *almost* work together because they both use
 * JSON files for translation tables. Unfortunately Blockly does processing
 * of these in build.py to create JavaScript files, and the translations in
 * JSON are fragmented. Also, Blockly loads all the translations into a member
 * object (Blockly.Msg) at initialisation. Furthermore Blockly's scheme works
 * on the basis that the entire page will be reloaded when the language
 * changes, so all initialisation is done on the page load. That's not the
 * Angular approach. Getting Angular Translate and Blockly i18n to work
 * together has involved a number of steps:
 *
 *  - Node JavaScript scripts convert Blockly's JavaScript translation
 *    tables to JSON. The general Blockly translation tables and the user
 *    application tables are both JavaScript. The script is applied to
 *    selected language files and they are all copied to blockly/msg/json/.
 *
 *  - Angular Translate loads these Blockly JSON files along with the ones in
 *    i18n/ which were created for Angular Translate and this web app.
 *
 *  - The language JS files normally loaded for Blockly are not included.
 *
 *  - Instead, all of the translations in Angular Translate are copied into
 *    Blockly.Msg when a language is selected
 *
 * The current locale/language is supplied to the compiler and assembler each
 * time they are used. They have not been tested with different languages in
 * a web app, and only English is likely to work at the moment. I still need to
 * integrate the locale-js JSON files for the compiler and assembler into
 * this web app.
 *
 * @author Murray Lang (murray@wetaproject.org)
 *
 */

/**
 * Constructor for Locale service
 * @param {Object} translate Angular Translate $translate service
 * @param {WetaBlocklyProvider} blockly provider of reference to global Blockly
 * @constructor
 */
function WetaLocaleService(translate, blockly) {
  'use strict';
  this.Msg = blockly.Blockly.Msg;
  this.translate = translate;
  this.language = this.getCurrentLanguage();
    // Only Spanish has full translations at the moment
  this.languageNames = {
    /*
    'ar': 'العربية',
    'be-tarask': 'Taraškievica',
    'br': 'Brezhoneg',
    'ca': 'Català',
    'cs': 'Česky',
    'da': 'Dansk',
    'de': 'Deutsch',
    'el': 'Ελληνικά',
    */
    'en': 'English',
    'es': 'Español'//,
    /*
    'et': 'Eesti',
    'fa': 'فارسی',
    'fr': 'Français',
    'he': 'עברית',
    'hrx': 'Hunsrik',
    'hu': 'Magyar',
    'ia': 'Interlingua',
    'is': 'Íslenska',
    'it': 'Italiano',
    'ja': '日本語',
    'ko': '한국어',
    'mk': 'Македонски',
    'ms': 'Bahasa Melayu',
    'nb': 'Norsk Bokmål',
    'nl': 'Nederlands, Vlaams',
    'oc': 'Lenga d\'òc',
    'pl': 'Polski',
    'pms': 'Piemontèis',
    'pt-br': 'Português Brasileiro',
    'ro': 'Română',
    'ru': 'Русский',
    'sc': 'Sardu',
    'sk': 'Slovenčina',
    'sr': 'Српски',
    'sv': 'Svenska',
    'ta': 'தமிழ்',
    'th': 'ภาษาไทย',
    'tlh': 'tlhIngan Hol',
    'tr': 'Türkçe',
    'uk': 'Українська',
    'vi': 'Tiếng Việt',
    'zh-hans': '简体中文',
    'zh-hant': '正體中文'
    */
  };
}

/**
 * Set everything for the current language to initialise.
 * A callback function is accepted, which takes a single boolean argument
 * indicating success or failure.
 * @param {function} callback Callback for notifying when completed.
 */
WetaLocaleService.prototype.init =
    function(callback) {
      'use strict';
      var lang = this.getCurrentLanguage();
      this.setCurrentLanguage(lang, callback);
    };

/**
 * Do everything necessary to propagate a change of language to the
 * application. TODO: Integrate locale-js for the compiler/assembler
 * @param {String} lang Language to use
 * @param {function} callback Callback taking a single boolean argument
 */
WetaLocaleService.prototype.setCurrentLanguage =
  function(lang, callback) {
    'use strict';
    var self = this;
    self.translate.use(lang).then(
        function(data) {
            // Get the translation table from Angular Translate.
            // This has the Blockly tables included
          var table = self.translate.getTranslationTable(lang);
            // Copy the table to Blockly
          angular.copy(table, self.Msg);
            // Inform the caller so that subsequent initialisations can occur.
          callback(true);
        },
        function(data) {
          callback(false);
        }
    );
  };

/**
 * Get the current language. Where it comes from depends on the progress of
 * the loading of Angular Translate
 * @returns {string}
 */
WetaLocaleService.prototype.getCurrentLanguage =
    function() {
      'use strict';
      return this.translate.proposedLanguage() || this.translate.use();
    };

/**
 * Get a list of supported languages (for a user selection)
 * @returns {Object}
 */
WetaLocaleService.prototype.getLanguages =
    function() {
      'use strict';
      return this.languageNames;
    };