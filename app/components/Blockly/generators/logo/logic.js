Blockly.Logo["controls_if"] = function(block)
{
    var depth = 0;
    var argument = Blockly.Logo.valueToCode(block,"IF" + depth, Blockly.Logo.ORDER_NONE)||"false";
    var statements = Blockly.Logo.statementToCode(block,"DO" + depth);
    var code;
    if (block.elseCount_ || block.elseifCount_)
        code = "ifelse ";
    else
        code = "if ";
    code += argument + "\n[\n" + statements + "\n]\n";
        // Repeatedly nest if statements within else blocks to implement the
        // else if construct
    for(depth = 1; depth <= block.elseifCount_; depth++)
    {
        code += "[\n";  // in another else block now
        argument = Blockly.Logo.valueToCode(block,"IF" + depth, Blockly.Logo.ORDER_NONE)||"false";
        statements = Blockly.Logo.statementToCode(block,"DO"+depth);
            // Firstly deal with the next if
            // (but we first need to determine if it's an if or ifelse in logo)
        if (depth == block.elseifCount_ && block.elseCount_ == 0)
            code = "if ";
        else
            code = "ifelse ";
        code += argument + "\n[\n" + statements + "\n]\n"; // The if part
        // The else block will be commenced at the top of the loop if required
    }
    if (block.elseCount_)
    {
        statements = Blockly.Logo.statementToCode(block,"ELSE");
        code += "[\n" + statements + "\n]\n";
    }
        // Now close off any nested else blocks
    for (depth = 1; depth <= block.elseifCount_; depth++)
    {
        code += "n]\n";
    }
    return code + "\n"
};

Blockly.Logo["logic_compare"] = function(block)
{
    var operator = {
        EQ:"==",
        NEQ:"!=",
        LT:"<",
        LTE:"<=",
        GT:">",
        GTE:">="
    }[block.getFieldValue("OP")];
    var order = "==" == operator || "!=" == operator ? Blockly.Logo.ORDER_EQUALITY : Blockly.Logo.ORDER_RELATIONAL;
    var lhs = Blockly.Logo.valueToCode(block,"A",order) || "0";
    var rhs = Blockly.Logo.valueToCode(block,"B",order)||"0";
    return [(operator == "!=" ? "not " : "") + lhs + " " + operator + " " + rhs, order];
};

Blockly.Logo["logic_operation"] = function(block)
{
    var operator;

    var op = block.getFieldValue("OP");
    if (op == "AND")
    {
        operator = "and";
    }
    else if (op == "OR")
    {
        operator = "or";
    }
    else
    {
        operator = "xor";
    }
    var order = op == "AND" ? Blockly.Logo.ORDER_LOGICAL_AND : Blockly.Logo.ORDER_LOGICAL_OR;
    var lhs = Blockly.Logo.valueToCode(block,"A",order);
    var rhs = Blockly.Logo.valueToCode(block,"B",order);
        // and and or are prefix in Logo
    return[operator + " " + lhs + " " + rhs, order]
};

Blockly.Logo["logic_negate"] = function(block)
{
    var order = Blockly.Logo.ORDER_LOGICAL_NOT;
    var code = "not " + Blockly.Logo.valueToCode(block,"BOOL", order)||"true";
    return [code, order];
};

Blockly.Logo["logic_boolean"] = function(a)
{
    return["TRUE" == a.getFieldValue("BOOL") ? "true" : "false", Blockly.Logo.ORDER_ATOMIC];
};

