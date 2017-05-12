Blockly.defineBlocksWithJsonArray(
[
  {
    "type": "logic_operation",
    "message0": "%1 %2 %3",
    "args0": [
      {
        "type": "input_value",
        "name": "A"
      },
      {
        "type": "field_dropdown",
        "name": "OP",
        "options": [
          [
            "%{BKY_WETA_LOGIC_AND}",
            "AND"
          ],
          [
            "%{BKY_WETA_LOGIC_OR}",
            "OR"
          ],
          [
            "%{BKY_WETA_LOGIC_XOR}",
            "XOR"
          ]
        ]
      },
      {
        "type": "input_value",
        "name": "B"
      }
    ],
    "inputsInline": true,
    "output": "Boolean",
    "colour": "%{BKY_LOGIC_HUE}",
    "tooltip": "%{BKY_WETA_LOGIC_OPERATION_TOOLTIP}",
    "helpUrl": "https://github.com/google/blockly/wiki/Logic#logical-operations"
  }
]
);
