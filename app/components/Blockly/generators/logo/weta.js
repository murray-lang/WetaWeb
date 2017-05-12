
Blockly.Logo['weta_motors_select'] = function(block) {
    var code = '';

    if(block.getFieldValue('MOTOR_A') == 'TRUE')
        code += "a";
    if(block.getFieldValue('MOTOR_B') == 'TRUE')
        code += "b";
    if(block.getFieldValue('MOTOR_C') == 'TRUE')
        code += "c";
    if(block.getFieldValue('MOTOR_D') == 'TRUE')
        code += "d";
    if(block.getFieldValue('MOTOR_E') == 'TRUE')
        code += "e";
    if(block.getFieldValue('MOTOR_F') == 'TRUE')
        code += "f";
    if(block.getFieldValue('MOTOR_G') == 'TRUE')
        code += "g";
    if(block.getFieldValue('MOTOR_H') == 'TRUE')
        code += "h";

    if (code.length > 0)
        code += ",\n";
    return code;
};

Blockly.Logo['weta_motors_control'] = function(block) {
    var code = block.getFieldValue('OP');

    if (code.length > 0)
        code += "\n";
    return code;
};

Blockly.Logo['weta_motors_power'] = function(block) {
  var value_power = Blockly.Logo.valueToCode(block, 'POWER', Blockly.Logo.ORDER_ATOMIC);
  // TODO: Assemble Logo into code variable.
  var code = 'setpower ' + value_power + '\n';
  return code;
};

Blockly.Logo['weta_motors_on_for'] = function(block) {
    var period = Blockly.JavaScript.valueToCode(block, 'PERIOD', Blockly.JavaScript.ORDER_ATOMIC);
    return "onfor " + period + "\n";
};

Blockly.Logo['weta_servo_select'] = function(block) {
    var code = '';

    if(block.getFieldValue('SERVO_N') == 'TRUE')
        code += "n";
    if(block.getFieldValue('SERVO_O') == 'TRUE')
        code += "o";
    if(block.getFieldValue('SERVO_P') == 'TRUE')
        code += "p";
    if(block.getFieldValue('SERVO_Q') == 'TRUE')
        code += "q";
    if(block.getFieldValue('SERVO_R') == 'TRUE')
        code += "r";
    if(block.getFieldValue('SERVO_S') == 'TRUE')
        code += "s";
    if(block.getFieldValue('SERVO_T') == 'TRUE')
        code += "t";
    if(block.getFieldValue('SERVO_U') == 'TRUE')
        code += "u";

    if (code.length > 0)
        code += ",\n";
    return code;
};

Blockly.Logo['weta_servo_heading'] = function(block) {
    var heading = Blockly.JavaScript.valueToCode(block, 'HEADING', Blockly.JavaScript.ORDER_ATOMIC);
    return "setsvh " + heading + "\n";
};

Blockly.Logo['weta_servo_left_right'] = function(block) {
    var dir = block.getFieldValue('DIR');
    var steps = Blockly.JavaScript.valueToCode(block, 'STEPS', Blockly.JavaScript.ORDER_ATOMIC);

    return "sv" + dir + " " + steps + "\n";
};

Blockly.Logo['weta_get_timer'] = function(block) {
    return ['timer', Blockly.JavaScript.ORDER_ASSIGNMENT];
};

Blockly.Logo['weta_reset_timer'] = function(block) {
    return 'resett\n';
};

Blockly.Logo['weta_wait_millis'] = function(block) {
    var val = Blockly.JavaScript.valueToCode(block, 'VAL', Blockly.JavaScript.ORDER_ATOMIC);
    return "waitms " + val +"\n";
};

Blockly.Logo['weta_wait_tenths'] = function(block) {
    var val = Blockly.JavaScript.valueToCode(block, 'VAL', Blockly.JavaScript.ORDER_ATOMIC);
    return "wait " + val +"\n";
};

Blockly.Logo['weta_wait_until'] = function(block) {
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    return "waituntil " + value_name + "\n";
};
Blockly.Logo['weta_beep'] = function(block) {
    return "beep\n";
};

Blockly.Logo['weta_led'] = function(block) {
    var dropdown_onoff = block.getFieldValue('ONOFF');
    return "led" + dropdown_onoff + "\n";
};

Blockly.Logo['weta_digital_in'] = function(block) {
    var input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ATOMIC);
    return ["digitalin " + input, Blockly.JavaScript.ORDER_ASSIGNMENT];
};

Blockly.Logo['weta_digital_out'] = function(block) {
    var output = Blockly.JavaScript.valueToCode(block, 'OUTPUT', Blockly.JavaScript.ORDER_ATOMIC);
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    return "digitalout " + output + " " + value + "\n";
};

Blockly.Logo['weta_analog_in'] = function(block) {
    var input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ATOMIC);
    return ["analogin " + input, Blockly.JavaScript.ORDER_ASSIGNMENT];
};

Blockly.Logo['weta_analog_out'] = function(block) {
    var output = Blockly.JavaScript.valueToCode(block, 'OUTPUT', Blockly.JavaScript.ORDER_ATOMIC);
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    return "analogout " + output + " " + value + "\n";
};

Blockly.Logo['weta_switch'] = function(block) {
    var num = block.getFieldValue('NUM');
    return ["switch" + num, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Logo['weta_sensor'] = function(block) {
    var num = block.getFieldValue('NUM');
    return ["sensor" + num, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Logo['weta_send'] = function(block) {
    var data = Blockly.JavaScript.valueToCode(block, 'DATA', Blockly.JavaScript.ORDER_ATOMIC);
    return "send " + data + "\n";
};

Blockly.Logo['weta_send_array'] = function(block) {
    var port = block.getFieldValue('PORT');
    var buff = Blockly.JavaScript.valueToCode(block, 'BUFF', Blockly.JavaScript.ORDER_ATOMIC);
    var length = Blockly.JavaScript.valueToCode(block, 'LENGTH', Blockly.JavaScript.ORDER_ATOMIC);
    return "send " + port + " \"" + buff + " " + length + "\n";
};

Blockly.Logo['weta_receive'] = function(block) {
    return ["receive", Blockly.JavaScript.ORDER_NONE];
};

Blockly.Logo['weta_receive_array'] = function(block) {
    var port = block.getFieldValue('PORT');
    var buff = Blockly.JavaScript.valueToCode(block, 'BUFF', Blockly.JavaScript.ORDER_ATOMIC);
    var length = Blockly.JavaScript.valueToCode(block, 'LENGTH', Blockly.JavaScript.ORDER_ATOMIC);
    var timeout = Blockly.JavaScript.valueToCode(block, 'TIMEOUT', Blockly.JavaScript.ORDER_ATOMIC);
    var code = "receive " + port + " \"" + buff + " " + length + " " + timeout + "\n";
    return [code, Blockly.JavaScript.ORDER_ASSIGNMENT];
};

Blockly.Logo['weta_available_from'] = function(block) {
    var port = block.getFieldValue('PORT');
    return ["received? " + port, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Logo['weta_available'] = function(block) {
    return ["received?", Blockly.JavaScript.ORDER_NONE];
};

Blockly.Logo['weta_turtle_forward_backward'] = function(block) {
    var dir = block.getFieldValue('DIR');
    var mm = Blockly.JavaScript.valueToCode(block, 'VAL', Blockly.JavaScript.ORDER_ATOMIC);
    return dir + " " + mm +"\n";
};

Blockly.Logo['weta_turtle_turn'] = function(block) {
    var dir = block.getFieldValue('DIR');
    var degrees = Blockly.JavaScript.valueToCode(block, 'DEGREES', Blockly.JavaScript.ORDER_ATOMIC);
    return dir + " " + degrees + "\n";
};

Blockly.Logo['weta_turtle_pen'] = function(block) {
    var updown = block.getFieldValue('NAME');
    return "pen" + updown + "\n";
};

