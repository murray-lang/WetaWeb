Blockly.Logo["variables_get"] = function(block)
{
    return [":" + Blockly.Logo.variableDB_.getName(block.getFieldValue("VAR"),Blockly.Variables.NAME_TYPE),Blockly.Logo.ORDER_ATOMIC]
};

Blockly.Logo["variables_set"] = function(block)
{
    var arg = Blockly.Logo.valueToCode(block,"VALUE",Blockly.Logo.ORDER_ASSIGNMENT)||"0";
    return "make \"" + Blockly.Logo.variableDB_.getName(block.getFieldValue("VAR"),Blockly.Variables.NAME_TYPE) + " " + arg + "\n";
};

Blockly.Logo['variables_declare_array'] = function(block) {
  var variable_name = Blockly.Logo.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
  var value_size = Blockly.Logo.valueToCode(block, 'SIZE', Blockly.Logo.ORDER_ATOMIC);

  var code = "array [" + variable_name + " " + value_size + "]\n";
  return code;
};

Blockly.Logo['variables_declare_typed_array'] = function(block) {
  var variable_name = Blockly.Logo.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
  var dropdown_type = block.getFieldValue('TYPE');
  var value_size = Blockly.Logo.valueToCode(block, 'SIZE', Blockly.Logo.ORDER_ATOMIC);

  var code = "array [" + variable_name + " ";
  switch (dropdown_type)
  {
  case "byte":
    code = "byte" + code;
    break;
  case "short":
    code += "% ";
    break;
  case "int":
      code += "& ";
      break;
  case "float":
      code += "! ";
      break;
  case "double":
      code += "# ";
      break;
  }
  return code + value_size + "]\n";
};

Blockly.Logo['variables_reference'] = function(block) {
  var variable_name = Blockly.Logo.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
  return ['"' + variable_name, Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo['variables_dereference'] = function(block) {
  var value_name = Blockly.Logo.valueToCode(block, 'NAME', Blockly.Logo.ORDER_ATOMIC);
  return ["(thing " + value_name + ")", Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo['variables_set_referenced_by'] = function(block) {
  var variable_name = Blockly.Logo.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
  var value_val = Blockly.Logo.valueToCode(block, 'VAL', Blockly.Logo.ORDER_ATOMIC);

  return "make :" + variable_name + " " + value_val + "\n";
};

Blockly.Logo['variables_set_array'] = function(block) {
  var value_item = Blockly.Logo.valueToCode(block, 'ITEM', Blockly.Logo.ORDER_ATOMIC);
  var dropdown_dereference = block.getFieldValue('DEREFERENCE');
  var variable_name = Blockly.Logo.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
  var value_val = Blockly.Logo.valueToCode(block, 'VAL', Blockly.Logo.ORDER_ATOMIC);
  if (dropdown_dereference == "true")
    variable_name = "(thing :" + variable_name + ")";
  else
    variable_name = ":" + variable_name;

  return "aset " + variable_name + " " + value_item + " " + value_val + "\n";
};

Blockly.Logo['variables_get_array'] = function(block) {
  var value_item = Blockly.Logo.valueToCode(block, 'ITEM', Blockly.Logo.ORDER_ATOMIC);
  var dropdown_dereference = block.getFieldValue('DEREFERENCE');
  var variable_name = Blockly.Logo.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
  if (dropdown_dereference == "true")
      variable_name = "(thing :" + variable_name + ")";
    else
      variable_name = ":" + variable_name;

  var code = "aget " + variable_name + " " + value_item + "\n";
  return [code, Blockly.Logo.ORDER_ASSIGNMENT];
};
