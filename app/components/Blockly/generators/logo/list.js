Blockly.Logo["lists_create_with"] = function() {
    // Create a list with any number of elements of any type.
    var code = new Array(this.itemCount_);
    for (var n = 0; n < this.itemCount_; n++) {
        code[n] = Blockly.Logo.valueToCode(this, 'ADD' + n,
                Blockly.Logo.ORDER_COMMA) || 'null';
    }
    code = '[' + code.join(' ') + ']';
    return [code, Blockly.Logo.ORDER_ATOMIC];
};