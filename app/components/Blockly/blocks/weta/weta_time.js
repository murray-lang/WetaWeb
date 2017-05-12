Blockly.defineBlocksWithJsonArray(
[
  {
    "type": "weta_get_timer",
    "message0": "%{BKY_WETA_GET_TIMER_MSG0}",
    "output": "Number",
    "colour": "%{BKY_WETA_TIME_HUE}",
    "tooltip": "%{BKY_WETA_GET_TIMER_TOOLTIP}",
    "helpUrl": ""
  },
  {
    "type": "weta_reset_timer",
    "message0": "%{BKY_WETA_RESET_TIMER_MSG0}",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_WETA_TIME_HUE}",
    "tooltip": "%{BKY_WETA_RESET_TIMER_TOOLTIP}",
    "helpUrl": ""
  },
  {
    "type": "weta_wait_millis",
    "message0": "%{BKY_WETA_WAIT_MILLIS_MSG0}",
    "args0": [
      {
        "type": "input_value",
        "name": "VAL",
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_WETA_TIME_HUE}",
    "tooltip": "%{BKY_WETA_WAIT_MILLIS_TOOLTIP}",
    "helpUrl": ""
  },
  {
    "type": "weta_wait_tenths",
    "message0": "%{BKY_WETA_WAIT_TENTHS_MSG0}",
    "args0": [
      {
        "type": "input_value",
        "name": "VAL",
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_WETA_TIME_HUE}",
    "tooltip": "%{BKY_WETA_WAIT_TENTHS_TOOLTIP}",
    "helpUrl": ""
  },
  {
    "type": "weta_wait_until",
    "message0": "%{BKY_WETA_WAIT_UNTIL_MSG0}",
    "args0": [
      {
        "type": "input_value",
        "name": "NAME",
        "check": "Boolean"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_WETA_TIME_HUE}",
    "tooltip": "%{BKY_WETA_WAIT_UNTIL_TOOLTIP}",
    "helpUrl": ""
  }
]
);
