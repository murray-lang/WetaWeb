Blockly.defineBlocksWithJsonArray(
[
  {
    "type": "weta_beep",
    "message0": "%{BKY_WETA_BEEP_MSG0}",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_WETA_IO_HUE}",
    "tooltip": "%{BKY_WETA_BEEP_TOOLTIP}",
    "helpUrl": ""
  },
  {
    "type": "weta_led",
    "message0": "%{BKY_WETA_LED_MSG0}",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "ONOFF",
        "options": [
          [
            "%{BKY_WETA_ON}",
            "on"
          ],
          [
            "%{BKY_WETA_OFF}",
            "off"
          ]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_WETA_IO_HUE}",
    "tooltip": "%{BKY_WETA_LED_TOOLTIP}",
    "helpUrl": ""
  },
  {
    "type": "weta_digital_in",
    "message0": "%{BKY_WETA_DIGITAL_IN_MSG0}",
    "args0": [
      {
        "type": "input_value",
        "name": "INPUT",
        "check": "Number"
      }
    ],
    "output": "Boolean",
    "colour": "%{BKY_WETA_IO_HUE}",
    "tooltip": "%{BKY_WETA_DIGITAL_IN_TOOLTIP}",
    "helpUrl": ""
  },
  {
    "type": "weta_digital_out",
    "message0": "%{BKY_WETA_DIGITAL_OUT_MSG0}",
    "args0": [
      {
        "type": "input_value",
        "name": "OUTPUT",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "VALUE",
        "check": "Boolean"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_WETA_IO_HUE}",
    "tooltip": "%{BKY_WETA_DIGITAL_OUT_TOOLTIP}",
    "helpUrl": ""
  },
  {
    "type": "weta_analog_in",
    "message0": "%{BKY_WETA_ANALOG_IN_MSG0}",
    "args0": [
      {
        "type": "input_value",
        "name": "INPUT",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": "%{BKY_WETA_IO_HUE}",
    "tooltip": "{BKY_WETA_ANALOG_IN_TOOLTIP}",
    "helpUrl": ""
  },
  {
    "type": "weta_analog_out",
    "message0": "%{BKY_WETA_ANALOG_OUT_MSG0}",
    "args0": [
      {
        "type": "input_value",
        "name": "OUTPUT",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "VALUE",
        "check": "Number"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_WETA_IO_HUE}",
    "tooltip": "%{BKY_WETA_ANALOG_OUT_TOOLTIP}",
    "helpUrl": ""
  },
  {
    "type": "weta_switch",
    "message0": "%{BKY_WETA_SWITCH_MSG0}",
    "args0": [
      {
        "type": "field_number",
        "name": "NUM",
        "value": 0,
        "min": 1,
        "max": 8
      }
    ],
    "inputsInline": true,
    "output": "Boolean",
    "colour": "%{BKY_WETA_IO_HUE}",
    "tooltip": "%{BKY_WETA_SWITCH_TOOLTIP}",
    "helpUrl": ""
  },
  {
    "type": "weta_sensor",
    "message0": "%{BKY_WETA_SENSOR_MSG0}",
    "args0": [
      {
        "type": "field_number",
        "name": "NUM",
        "value": 0,
        "min": 1,
        "max": 8
      }
    ],
    "inputsInline": true,
    "output": "Number",
    "colour": "%{BKY_WETA_IO_HUE}",
    "tooltip": "%{BKY_WETA_SENSOR_TOOLTIP}",
    "helpUrl": ""
  }
]
);
