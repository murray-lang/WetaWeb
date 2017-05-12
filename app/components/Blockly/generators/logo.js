/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Helper functions for generating Logo for blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Logo');

goog.require('Blockly.Generator');


/**
 * Logo code generator.
 * @type {!Blockly.Generator}
 */
Blockly.Logo = new Blockly.Generator('Logo');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.Logo.addReservedWords(
    'to','end','output','repeat','if','ifelse','beep','while','waituntil',
    'loop','forever','wait','stop','reset','send','make', 'resetdp','record',
    'erase','on','onfor','off','thisway','thatway','rd','brake','setsvh','svr',
    'svl','setpower','ledon','ledoff',	'i2c_start','i2c_stop','i2c_read',
    'i2c_write','show','and','or','xor','not','timer','serial','newir?',
    'random','recall',	'sensor1','sensor2','sensor3','sensor4','sensor5',
    'sensor6','sensor7','sensor8','switch1','switch2','switch3','switch4',
    'switch5','switch6','switch7','switch8', 'highbyte','lowbyte','bsend',
    'bsr','when','whenoff','setdp','fastsend', 'item', 'error');

/**
 * Order of operation ENUMs.
 * https://developer.mozilla.org/en/JavaScript/Reference/Operators/Operator_Precedence
 */
Blockly.Logo.ORDER_ATOMIC = 0;           // 0 "" ...
Blockly.Logo.ORDER_NEW = 1.1;            // new
Blockly.Logo.ORDER_MEMBER = 1.2;         // . []
Blockly.Logo.ORDER_FUNCTION_CALL = 2;    // ()
Blockly.Logo.ORDER_INCREMENT = 3;        // ++
Blockly.Logo.ORDER_DECREMENT = 3;        // --
Blockly.Logo.ORDER_BITWISE_NOT = 4.1;    // ~
Blockly.Logo.ORDER_UNARY_PLUS = 4.2;     // +
Blockly.Logo.ORDER_UNARY_NEGATION = 4.3; // -
Blockly.Logo.ORDER_LOGICAL_NOT = 4.4;    // !
Blockly.Logo.ORDER_TYPEOF = 4.5;         // typeof
Blockly.Logo.ORDER_VOID = 4.6;           // void
Blockly.Logo.ORDER_DELETE = 4.7;         // delete
Blockly.Logo.ORDER_DIVISION = 5.1;       // /
Blockly.Logo.ORDER_MULTIPLICATION = 5.2; // *
Blockly.Logo.ORDER_MODULUS = 5.3;        // %
Blockly.Logo.ORDER_SUBTRACTION = 6.1;    // -
Blockly.Logo.ORDER_ADDITION = 6.2;       // +
Blockly.Logo.ORDER_BITWISE_SHIFT = 7;    // << >> >>>
Blockly.Logo.ORDER_RELATIONAL = 8;       // < <= > >=
Blockly.Logo.ORDER_IN = 8;               // in
Blockly.Logo.ORDER_INSTANCEOF = 8;       // instanceof
Blockly.Logo.ORDER_EQUALITY = 9;         // == != === !==
Blockly.Logo.ORDER_BITWISE_AND = 10;     // &
Blockly.Logo.ORDER_BITWISE_XOR = 11;     // ^
Blockly.Logo.ORDER_BITWISE_OR = 12;      // |
Blockly.Logo.ORDER_LOGICAL_AND = 13;     // &&
Blockly.Logo.ORDER_LOGICAL_OR = 14;      // ||
Blockly.Logo.ORDER_CONDITIONAL = 15;     // ?:
Blockly.Logo.ORDER_ASSIGNMENT = 16;      // = += -= *= /= %= <<= >>= ...
Blockly.Logo.ORDER_COMMA = 17;           // ,
Blockly.Logo.ORDER_NONE = 99;            // (...)

/**
 * List of outer-inner pairings that do NOT require parentheses.
 * @type {!Array.<!Array.<number>>}
 */
Blockly.Logo.ORDER_OVERRIDES = [
  // (foo()).bar -> foo().bar
  // (foo())[0] -> foo()[0]
  [Blockly.Logo.ORDER_FUNCTION_CALL, Blockly.Logo.ORDER_MEMBER],
  // (foo())() -> foo()()
  [Blockly.Logo.ORDER_FUNCTION_CALL, Blockly.Logo.ORDER_FUNCTION_CALL],
  // (foo.bar).baz -> foo.bar.baz
  // (foo.bar)[0] -> foo.bar[0]
  // (foo[0]).bar -> foo[0].bar
  // (foo[0])[1] -> foo[0][1]
  [Blockly.Logo.ORDER_MEMBER, Blockly.Logo.ORDER_MEMBER],
  // (foo.bar)() -> foo.bar()
  // (foo[0])() -> foo[0]()
  [Blockly.Logo.ORDER_MEMBER, Blockly.Logo.ORDER_FUNCTION_CALL],

  // !(!foo) -> !!foo
  [Blockly.Logo.ORDER_LOGICAL_NOT, Blockly.Logo.ORDER_LOGICAL_NOT],
  // a * (b * c) -> a * b * c
  [Blockly.Logo.ORDER_MULTIPLICATION, Blockly.Logo.ORDER_MULTIPLICATION],
  // a + (b + c) -> a + b + c
  [Blockly.Logo.ORDER_ADDITION, Blockly.Logo.ORDER_ADDITION],
  // a && (b && c) -> a && b && c
  [Blockly.Logo.ORDER_LOGICAL_AND, Blockly.Logo.ORDER_LOGICAL_AND],
  // a || (b || c) -> a || b || c
  [Blockly.Logo.ORDER_LOGICAL_OR, Blockly.Logo.ORDER_LOGICAL_OR]
];

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.Logo.init = function(workspace) {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.Logo.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.Logo.functionNames_ = Object.create(null);

  if (!Blockly.Logo.variableDB_) {
    Blockly.Logo.variableDB_ =
        new Blockly.Names(Blockly.Logo.RESERVED_WORDS_);
  } else {
    Blockly.Logo.variableDB_.reset();
  }

  var defvars = [];
  var variables = workspace.variableList;
  if (variables.length) {
    for (var i = 0; i < variables.length; i++) {
      defvars[i] = Blockly.Logo.variableDB_.getName(variables[i],
          Blockly.Variables.NAME_TYPE);
    }
    Blockly.Logo.definitions_['variables'] =
        'var ' + defvars.join(', ') + ';';
  }
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Logo.finish = function(code) {
  // Convert the definitions dictionary into a list.
  /*
  var definitions = [];
  for (var name in Blockly.Logo.definitions_) {
    definitions.push(Blockly.Logo.definitions_[name]);
  }
  // Clean up temporary data.
  delete Blockly.Logo.definitions_;
  delete Blockly.Logo.functionNames_;
  Blockly.Logo.variableDB_.reset();
  return definitions.join('\n\n') + '\n\n\n' + code;
  */
  return code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Logo.scrubNakedValue = function(line) {
  return line; // + ";\n";
};

/**
 * Encode a string as a properly escaped JavaScript string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} JavaScript string.
 * @private
 */
Blockly.Logo.quote_ = function(string) {
  // Can't use goog.string.quote since Google's style guide recommends
  // JS string literals use single quotes.
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

/**
 * Common tasks for generating Logo from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Logo code created for this block.
 * @return {string} Logo code with comments and subsequent blocks added.
 * @private
 */
Blockly.Logo.scrub_ = function(block, code) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    comment = Blockly.utils.wrap(comment, Blockly.Logo.COMMENT_WRAP - 3);
    if (comment) {
      if (block.getProcedureDef) {
        // Use a comment block for function comments.
        commentCode += Blockly.Logo.prefixLines(comment + '\n', '; ');
      } else {
        commentCode += Blockly.Logo.prefixLines(comment + '\n', '; ');
      }
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          var comment = Blockly.Logo.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.Logo.prefixLines(comment, '; ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = Blockly.Logo.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

/**
 * Gets a property and adjusts the value while taking into account indexing.
 * @param {!Blockly.Block} block The block.
 * @param {string} atId The property ID of the element to get.
 * @param {number=} opt_delta Value to add.
 * @param {boolean=} opt_negate Whether to negate the value.
 * @param {number=} opt_order The highest order acting on this value.
 * @return {string|number}
 */
Blockly.Logo.getAdjusted = function(block, atId, opt_delta, opt_negate,
    opt_order) {
  var delta = opt_delta || 0;
  var order = opt_order || Blockly.Logo.ORDER_NONE;
  if (block.workspace.options.oneBasedIndex) {
    delta--;
  }
  var defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';
  if (delta > 0) {
    var at = Blockly.Logo.valueToCode(block, atId,
        Blockly.Logo.ORDER_ADDITION) || defaultAtIndex;
  } else if (delta < 0) {
    var at = Blockly.Logo.valueToCode(block, atId,
        Blockly.Logo.ORDER_SUBTRACTION) || defaultAtIndex;
  } else if (opt_negate) {
    var at = Blockly.Logo.valueToCode(block, atId,
        Blockly.Logo.ORDER_UNARY_NEGATION) || defaultAtIndex;
  } else {
    var at = Blockly.Logo.valueToCode(block, atId, order) ||
        defaultAtIndex;
  }

  if (Blockly.isNumber(at)) {
    // If the index is a naked number, adjust it right now.
    at = parseFloat(at) + delta;
    if (opt_negate) {
      at = -at;
    }
  } else {
    // If the index is dynamic, adjust it in code.
    if (delta > 0) {
      at = at + ' + ' + delta;
      var innerOrder = Blockly.Logo.ORDER_ADDITION;
    } else if (delta < 0) {
      at = at + ' - ' + -delta;
      var innerOrder = Blockly.Logo.ORDER_SUBTRACTION;
    }
    if (opt_negate) {
      if (delta) {
        at = '-(' + at + ')';
      } else {
        at = '-' + at;
      }
      var innerOrder = Blockly.Logo.ORDER_UNARY_NEGATION;
    }
    innerOrder = Math.floor(innerOrder);
    order = Math.floor(order);
    if (innerOrder && order >= innerOrder) {
      at = '(' + at + ')';
    }
  }
  return at;
};
