Blockly.defineBlocksWithJsonArray(
[
  {
    "type": "math_single",
    "message0": "%1 %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "OP",
        "options": [
          ["%{BKY_MATH_SINGLE_OP_ROOT}", "ROOT"],
          ["%{BKY_MATH_SINGLE_OP_ABSOLUTE}", "ABS"],
          ["-", "NEG"],
          ["ln", "LN"],
          ["log10", "LOG10"],
          ["e^", "EXP"]//,
          //["10^", "POW10"]
        ]
      },
      {
        "type": "input_value",
        "name": "NUM",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": "%{BKY_MATH_HUE}",
    "helpUrl": "%{BKY_MATH_SINGLE_HELPURL}"
  },
  {
    "type": "math_constant",
    "message0": "%1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "CONSTANT",
        "options": [
          ["\u03c0", "PI"],
          ["e", "E"],
          //[ "\u03c6", "GOLDEN_RATIO"],
          [ "sqrt(2)", "SQRT2"],
          [ "sqrt(\u00bd)", "SQRT1_2"]
          //[ "\u221e", "INFINITY"]
        ]
      }
    ],
    "output": "Number",
    "colour": "%{BKY_MATH_HUE}",
    "tooltip": "%{BKY_MATH_CONSTANT_TOOLTIP}",
    "helpUrl": "%{BKY_MATH_CONSTANT_HELPURL}"
  }
]);
