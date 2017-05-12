goog.provide('Blockly.Logo.math');

goog.require('Blockly.Logo');

Blockly.Logo["math_number"] = function(block) {
    // Numeric value.
    var code = parseFloat(block.getFieldValue('NUM'));
    return [code, Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo["math_arithmetic"] = function(block)
{
    var operation =
    {
        ADD: [" + ",Blockly.Logo.ORDER_ADDITION],
        MINUS:[" - ",Blockly.Logo.ORDER_SUBTRACTION],
        MULTIPLY:[" * ",Blockly.Logo.ORDER_MULTIPLICATION],
        DIVIDE:[" / ",Blockly.Logo.ORDER_DIVISION],
        POWER:[null,Blockly.Logo.ORDER_COMMA]
    }[block.getFieldValue("OP")];
    var symbol = operation[0];
    var order = operation[1];
    var lhs = Blockly.Logo.valueToCode(block,"A", order)||"0";
    var rhs = Blockly.Logo.valueToCode(block,"B", order)||"0";

    return symbol ? [lhs + symbol + rhs, order] : ["pow " + lhs + " " + rhs + " ",Blockly.Logo.ORDER_FUNCTION_CALL];
};

// Nore that math_trig and math_round generators get equated to the following math_single
// in the Blockly core library
Blockly.Logo["math_single"] = function(block)
{
    var operator = block.getFieldValue("OP");
    var arg;
    if("NEG" == operator)
    {
        arg = Blockly.Logo.valueToCode(block,"NUM",Blockly.Logo.ORDER_UNARY_NEGATION)||"0";
            // The following is to avoid --n, which is not a double negative, but decrementing in JS
        //if ("-" == a[0])
        //    a = " " + a;
        return ["-" + arg, Blockly.Logo.ORDER_UNARY_NEGATION];
    }
    if ("SIN"== operator ||"COS"== operator ||"TAN"== operator)
        arg = Blockly.Logo.valueToCode(block,"NUM",Blockly.Logo.ORDER_DIVISION)||"0";
    else
        arg = Blockly.Logo.valueToCode(block,"NUM",Blockly.Logo.ORDER_NONE)||"0";
    var code;
    switch(operator)
    {
    case "ABS":
        code = "abs " + arg;
        break;
    case "ROOT":
        code = "sqrt " + arg;
        break;
    case "LN":
        code = "ln " + arg;
        break;
    case "EXP":
        code = "exp " + arg;
        break;
    //case "POW10":
    //    code ="Math.pow(10,"+arg;
     //   break;
    case "ROUND":
        code = "round " + arg;
        break;
    case "ROUNDUP":
        code = "ceil " + arg;
        break;
    case "ROUNDDOWN":
        code ="floor " + arg;
        break;
    case "SIN":
        code = "sin " + arg; //+" / 180 * Math.PI)";
        break;
    case "COS":
        code = "cos " + arg; //+" / 180 * Math.PI)";
        break;
    case "TAN":
        code = "tan " + arg; //+" / 180 * Math.PI)"
    }
    if(code)
        return [code, Blockly.Logo.ORDER_FUNCTION_CALL];

    switch(operator)
    {
    case "LOG10":
        code = "log10 " + arg; //+") / Math.log(10)";
        break;
    case "ASIN":
        code = "asin " +arg; //+") / Math.PI * 180";
        break;
    case "ACOS":
        code = "acos " +arg; //+") / Math.PI * 180";
        break;
    case "ATAN":
        code = "atan " +arg; //+") / Math.PI * 180";
        break;
    default:
        throw "Unknown math operator: " + operator;
    }
    return[code ,Blockly.Logo.ORDER_DIVISION]
};

Blockly.Logo["math_constant"] = function(block)
{
    var constant = {
        PI:["PI",Blockly.Logo.ORDER_MEMBER],
        E:["E",Blockly.Logo.ORDER_MEMBER],
        SQRT2:["SQRT2",Blockly.Logo.ORDER_MEMBER],
        SQRT1_2:["SQRT1_2",Blockly.Logo.ORDER_MEMBER]
    }[block.getFieldValue("CONSTANT")];
    return constant;

};

Blockly.Logo["math_modulo"] = function(block)
{
    var dividend = Blockly.Logo.valueToCode(block,"DIVIDEND",Blockly.Logo.ORDER_MODULUS)||"0";
    var divisor = Blockly.Logo.valueToCode(a,"DIVISOR",Blockly.Logo.ORDER_MODULUS)||"0";
    return[dividend + " % " + divisor, Blockly.Logo.ORDER_MODULUS]
};

Blockly.Logo["math_random_int"] = function(a)
{
    var from = Blockly.Logo.valueToCode(a,"FROM",Blockly.Logo.ORDER_COMMA)||"0";
    var to = Blockly.Logo.valueToCode(a,"TO",Blockly.Logo.ORDER_COMMA)||"0";
    return ["random " + from + " " + to + "\n", Blockly.Logo.ORDER_FUNCTION_CALL];
};


