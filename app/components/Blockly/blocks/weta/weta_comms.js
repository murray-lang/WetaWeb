Blockly.defineBlocksWithJsonArray(
[
  {
    "type": "weta_send",
    "message0": "%{BKY_WETA_SEND_MSG0}",
    "args0": [
      {
        "type": "input_value",
        "name": "DATA"
      }
    ],
    "inputsInline": false,
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_WETA_COMMS_HUE}",
    "tooltip": "%{BKY_WETA_SEND_TOOLTIP}",
    "helpUrl": ""
  },
  {
    "type": "weta_send_array",
    "message0": "%{BKY_WETA_SEND_ARRAY_MSG0}",
    "args0": [
      {
        "type": "field_number",
        "name": "PORT",
        "value": 0,
        "min": 1,
        "max": 4
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "BUFF",
        "check": "Array"
      },
      {
        "type": "input_value",
        "name": "LENGTH",
        "check": "Number"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_WETA_COMMS_HUE}",
    "tooltip": "%{BKY_WETA_SEND_ARRAY_TOOLTIP}",
    "helpUrl": ""
  },
  {
    "type": "weta_receive",
    "message0": "%{BKY_WETA_RECEIVE_MSG0}",
    "inputsInline": false,
    "output": null,
    "colour": 20,
    "tooltip": "%{BKY_WETA_RECEIVE_TOOLKIT}",
    "helpUrl": ""
  },
  {
    "type": "weta_receive_array",
    "message0": "%{BKY_WETA_RECEIVE_ARRAY_MSG0}",
    "args0": [
      {
        "type": "field_number",
        "name": "PORT",
        "value": 0
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "BUFF",
        "check": "Array"
      },
      {
        "type": "input_value",
        "name": "LENGTH",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "TIMEOUT",
        "check": "Number"
      }
    ],
    "inputsInline": true,
    "output": null,
    "colour": "%{BKY_WETA_COMMS_HUE}",
    "tooltip": "%{BKY_WETA_RECEIVE_ARRAY_TOOLTIP}",
    "helpUrl": ""
  },
  {
    "type": "weta_available_from",
    "message0": "%{BKY_WETA_AVAILABLE_FROM_MSG0}",
    "args0": [
      {
        "type": "field_number",
        "name": "PORT",
        "value": 0,
        "min": 1,
        "max": 4
      },
      {
        "type": "input_dummy"
      }
    ],
    "inputsInline": true,
    "output": "Boolean",
    "colour": "%{BKY_WETA_COMMS_HUE}",
    "tooltip": "%{BKY_WETA_AVAILABLE_FROM_TOOLTIP}",
    "helpUrl": ""
  },
  {
    "type": "weta_available",
    "message0": "%{BKY_WETA_AVAILABLE_MSG0}",
    "inputsInline": true,
    "output": "Boolean",
    "colour": "%{BKY_WETA_COMMS_HUE}",
    "tooltip": "%{BKY_WETA_AVAILABLE_TOOLTIP}",
    "helpUrl": ""
  }
]
);
