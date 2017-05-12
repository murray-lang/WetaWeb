Blockly.Logo["text"] = function() {
  // Text value.
  var code = Blockly.Logo.quote_(this.getFieldValue('TEXT'));
  return [code, Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo['text_string_of_length'] = function(block) {
  var number_length = block.getFieldValue('LENGTH');
    return ["(string " + number_length + ")", Blockly.Logo.ORDER_ASSIGNMENT];
};

Blockly.Logo['text_to_string'] = function(block) {
  var value_name = Blockly.Logo.valueToCode(block, 'NAME', Blockly.Logo.ORDER_ATOMIC);
  return ["tostring " + value_name, Blockly.Logo.ORDER_ATOMIC];
};
