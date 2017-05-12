Blockly.Logo['control_forever'] = function(block) {
  var statements_code_block = Blockly.Logo.statementToCode(block, 'CODE_BLOCK');
  // TODO: Assemble Logo into code variable.
  var code = 'loop\n[\n' + statements_code_block +']\n';
  return code;
};

Blockly.Logo['controls_repeat_ext'] = function(block) {
  //var repeats = Number(block.getFieldValue("TIMES"));
  var repeats = block.getField("TIMES")?String(Number(block.getFieldValue("TIMES"))):Blockly.Logo.valueToCode(block,"TIMES",Blockly.Logo.ORDER_ASSIGNMENT)||"0"
  var statements_do = Blockly.Logo.statementToCode(block, 'DO');
  // TODO: Assemble Logo into code variable.
  var code = 'repeat ' + repeats + '\n[\n' + statements_do +']\n';
  return code;
};

Blockly.Logo['controls_whileUntil'] = function(block)
{
    var until = "UNTIL" == block.getFieldValue("MODE");
    var expression = Blockly.Logo.valueToCode(block,"BOOL", until ? Blockly.Logo.ORDER_LOGICAL_NOT : Blockly.Logo.ORDER_NONE)||"false";
    var code_block = Blockly.Logo.statementToCode(block,"DO");
    code_block = Blockly.Logo.addLoopTrap(code_block, block.id);

    var code = until ? "do.while " : "while ";

    return code + expression + "\n[\n" + code_block + "]\n";
}

Blockly.Logo["controls_for"] = function(block)
{
    var counter = Blockly.Logo.variableDB_.getName(block.getFieldValue("VAR"),Blockly.Variables.NAME_TYPE);
    var from = Blockly.Logo.valueToCode(block,"FROM",Blockly.Logo.ORDER_ASSIGNMENT)||"0";
    var to = Blockly.Logo.valueToCode(block,"TO",Blockly.Logo.ORDER_ASSIGNMENT)||"0";
    var by = Blockly.Logo.valueToCode(block,"BY",Blockly.Logo.ORDER_ASSIGNMENT)||"1";
    var statements = Blockly.Logo.statementToCode(block,"DO");
    statements = Blockly.Logo.addLoopTrap(statements, block.id);

    var code = "for [" + counter + " " + from + " " + to + " " + by + "]\n";
    code += "[\n" + statements + "]\n";
    return code;
};

Blockly.Logo["controls_forEach"] = function(block)
{
    var iterator = Blockly.Logo.variableDB_.getName(block.getFieldValue("VAR"),Blockly.Variables.NAME_TYPE);
    var list = Blockly.Logo.valueToCode(block,"LIST",Blockly.Logo.ORDER_ASSIGNMENT)||"[]";
    var statements = Blockly.Logo.statementToCode(block,"DO");
    statements = Blockly.Logo.addLoopTrap(statements, block.id);

    return "foreach" + iterator + " " + list + "\n[\n" + statements + "\n]\n";
};
