Blockly.defineBlocksWithJsonArray(
[
  {
    "type": "text_string_of_length",
    "message0": "%{BKY_WETA_STRING_OF_LENGTH_MSG0}",
    "args0": [
      {
        "type": "field_number",
        "name": "LENGTH",
        "value": 0,
        "min": 1,
        "max": 255
      }
    ],
    "output": "String",
    "colour": "%{BKY_TEXTS_HUE}",
    "tooltip": "%{BKY_WETA_STRING_OF_LENGTH_TOOLTIP}",
    "helpUrl": "http://www.example.com/"
  },
  {
    "type": "text_to_string",
    "message0": "%{BKY_WETA_TO_STRING_MSG0}",
    "args0": [
      {
        "type": "input_value",
        "name": "NAME"
      }
    ],
    "inputsInline": true,
    "output": "String",
    "colour": "%{BKY_TEXTS_HUE}",
    "tooltip": "%{BKY_WETA_TO_STRING_TOOLTIP",
    "helpUrl": "http://www.example.com/"
  }
]);
