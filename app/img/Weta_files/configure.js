'use strict';

angular.module('wetaApp.configure', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/configure', {
            templateUrl: 'configure/configure.html',
            controller: 'ConfigCtrl'
        });
    }])

    .service('WetaService', ['$http', '$log', WetaService])

    .directive ('wetaPinList', [ function() { return new WetaPinList();}])
    .directive ('wetaDigitalList', [ function() { return new WetaDigitalList();}])
    .directive ('wetaPwmTimerList', [ function() { return new WetaPwmTimerList();}])

    .controller(
        'ConfigCtrl',
        ['$rootScope','$scope', '$interval', 'WetaService', function ($rootScope, $scope, $interval, weta) {
            var self = this;

            var stop = null;
            self.modelOptions =
                {
                    // Need getterSetter for Angular to recognise changes.
                    //getterSetter: true
                };
            self.address = "10.1.1.9"; // For debugging
            self.config = weta.getConfiguration();
            self.caps = weta.getCapabilities();
            self.tempConfig = tempConfig;
            self.clickMsg = null; // Debugging
            /*
             self.config = function()
             {
             return self._config; //weta.getConfiguration();
             };
             self.caps = function()
             {
             return self._caps; //weta.getCapabilities();
             };
             */
            self.get = function () {
                weta.queryCapabilities(self.address);
                weta.queryConfiguration(self.address);
            };

            self.equals = function(actual, expected) {
                return angular.equals(actual, expected);
            };

            self.onCapsChanged =
                function (pin) {
                $rootScope.$broadcast("weta-pin-change", pin)
                    self.clickMsg = JSON.stringify(pin);
                };
            /*
             $scope.$watch("queryForm.$invalid",
             function(invalid)
             {
             if (invalid)
             self.stopInterval();
             }
             );

             */
        }]
    );

var tempConfig =
    {
        "name": "Nano32",
        "caps": {
            "order": [
                "din",
                "dout",
                "pwm",
                "adc",
                "dac",
                "touch",
                "i2c_scl",
                "i2c_sda",
                "spi_miso",
                "spi_mosi",
                "spi_sclk",
                "spi_ss",
                "uart_rx",
                "uart_tx",
                "uart_rts",
                "uart_cts"
            ],
            "info": {
                "din": {
                    "heading": "In",
                    "description": "Digital Input",
                    "group": "Digital",
                    "allowedWith": ["dout"]
                },
                "dout": {
                    "heading": "Out",
                    "description": "Digital Output",
                    "group": "Digital",
                    "allowedWith": ["din"]
                },
                "pwm": {
                    "heading": "PWM",
                    "description": "Pulse Width Modulation"
                },
                "adc": {
                    "heading": "In",
                    "description": "Analog Input",
                    "group": "Analog"
                },
                "dac": {
                    "heading": "Out",
                    "description": "Analog Output",
                    "group": "Analog"
                },
                "touch": {
                    "heading": "Touch",
                    "description": "Touch Sensor"
                },
                "i2c_scl": {
                    "heading": "SCL",
                    "description": "I2C SCL",
                    "group": "I2C"
                },
                "i2c_sda": {
                    "heading": "SDA",
                    "description": "I2C SDA",
                    "group": "I2C"
                },
                "spi_miso": {
                    "heading": "MISO",
                    "description": "SPI MISO",
                    "group": "SPI"
                },
                "spi_mosi": {
                    "heading": "MOSI",
                    "description": "SPI MOSI",
                    "group": "SPI"
                },
                "spi_sclk": {
                    "heading": "SCLK",
                    "description": "SPI SCLK",
                    "group": "SPI"
                },
                "spi_ss": {
                    "heading": "SS",
                    "description": "SPI SS",
                    "group": "SPI"
                },
                "uart_rx": {
                    "heading": "Rx",
                    "description": "UART Rx",
                    "group": "UART"
                },
                "uart_tx": {
                    "heading": "Tx",
                    "description": "UART Tx",
                    "group": "UART"
                },
                "uart_rts": {
                    "heading": "RTS",
                    "description": "UART RTS",
                    "group": "UART"
                },
                "uart_cts": {
                    "heading": "CTS",
                    "description": "UART CTS",
                    "group": "UART"
                }
            },
            "pins": [
                {
                    "pin": 2,
                    "din": 1,
                    "dout": 1,
                    "pwm": 1,
                    "adc": 1,
                    "touch": 1
                },
                {
                    "pin": 4,
                    "din": 1,
                    "dout": 1,
                    "pwm": 1,
                    "adc": 1,
                    "touch": 1
                },
                {
                    "pin": 5,
                    "din": 1,
                    "dout": 1,
                    "pwm": 1,
                    "spi_ss": 1
                },
                {
                    "pin": 12,
                    "din": 1,
                    "dout": 1,
                    "pwm": 1,
                    "adc": 1,
                    "touch": 1,
                    "spi_miso": 1
                },
                {
                    "pin": 13,
                    "din": 1,
                    "dout": 1,
                    "pwm": 1,
                    "adc": 1,
                    "touch": 1,
                    "spi_mosi": 1
                },
                {
                    "pin": 14,
                    "din": 1,
                    "dout": 1,
                    "pwm": 1,
                    "adc": 1,
                    "touch": 1,
                    "spi_sclk": 1
                },
                {
                    "pin": 15,
                    "din": 1,
                    "dout": 1,
                    "pwm": 1,
                    "adc": 1,
                    "touch": 1,
                    "spi_ss": 1
                },
                {
                    "pin": 16,
                    "din": 1,
                    "dout": 1,
                    "pwm": 1,
                    "uart_rx": 1
                },
                {
                    "pin": 17,
                    "din": 1,
                    "dout": 1,
                    "pwm": 1,
                    "uart_tx": 1
                },
                {
                    "pin": 18,
                    "din": 1,
                    "dout": 1,
                    "pwm": 1,
                    "spi_sclk": 1
                },
                {
                    "pin": 19,
                    "din": 1,
                    "dout": 1,
                    "pwm": 1,
                    "spi_miso": 1,
                    "uart_cts": 1
                },
                {
                    "pin": 21,
                    "din": 1,
                    "dout": 1,
                    "pwm": 1,
                    "i2c_sda": 1
                },
                {
                    "pin": 22,
                    "din": 1,
                    "dout": 1,
                    "pwm": 1,
                    "i2c_scl": 1,
                    "uart_rts": 1
                },
                {
                    "pin": 23,
                    "din": 1,
                    "dout": 1,
                    "pwm": 1,
                    "spi_mosi": 1
                },
                {
                    "pin": 25,
                    "din": 1,
                    "dout": 1,
                    "pwm": 1,
                    "adc": 1,
                    "dac": 1
                },
                {
                    "pin": 26,
                    "din": 1,
                    "dout": 1,
                    "pwm": 1,
                    "adc": 1,
                    "dac": 1
                },
                {
                    "pin": 27,
                    "din": 1,
                    "dout": 1,
                    "pwm": 1,
                    "adc": 1,
                    "touch": 1
                },
                {
                    "pin": 32,
                    "din": 1,
                    "dout": 1,
                    "pwm": 1,
                    "adc": 1,
                    "touch": 1
                },
                {
                    "pin": 33,
                    "din": 1,
                    "dout": 1,
                    "pwm": 1,
                    "adc": 1,
                    "touch": 1
                },
                {
                    "pin": 34,
                    "din": 1,
                    "adc": 1
                },
                {
                    "pin": 35,
                    "din": 1,
                    "adc": 1
                },
                {
                    "pin": 36,
                    "din": 1,
                    "adc": 1
                }
            ]
        },
        "functions": {
            "digital": {
                "description": "Digital I/O",
                "options": [
                    {
                        "name": "io",
                        "description": "GPIO",
                        "type": "pin"
                    },
                    {
                        "name": "in",
                        "description": "In",
                        "type": "bool"
                    },
                    {
                        "name": "out",
                        "description": "Out",
                        "type": "bool"
                    },
                    {
                        "name": "pullup",
                        "description": "Pullup",
                        "type": "bool"
                    },
                    {
                        "name": "pulldown",
                        "description": "Pulldown",
                        "type": "bool"
                    },
                    {
                        "name": "opendrain",
                        "description": "Open Drain",
                        "type": "bool"
                    },
                    {
                        "name": "invert",
                        "description": "Invert",
                        "type": "bool"
                    },
                    {
                        "name": "debounce",
                        "description": "Debounce",
                        "type": "bool",
                        "requires": ["in"]
                    }
                ]
            },
            "pwm": {
                "description": "Pulse Width Modulation",
                "parts": {
                    "timer": {
                        "description": "PWM Timer",
                        "max": 4,
                        "options": [
                            {
                                "name": "frequency",
                                "description": "Frequency",
                                "type": "int"
                            },
                            {
                                "name": "width",
                                "description": "Width",
                                "type": [
                                    10,
                                    11,
                                    12,
                                    13,
                                    14,
                                    15
                                ]
                            }
                        ]
                    },
                    "channel": {
                        "description": "PWM Channel",
                        "max": 8,
                        "options": {
                            "io": {
                                "description": "GPIO",
                                "type": "pin"
                            },
                            "timer": {
                                "description": "Timer Id",
                                "type": "id"
                            }
                        }
                    }
                },
                "options": {
                }
            }
        },
        "peripherals": {},
        "gpio_options": [
            "in",
            "out",
            "pullup",
            "pulldown",
            "opendrain",
            "invert",
            "debounce"
        ],
        "adc_order": [
            36,
            255,
            255,
            39,
            32,
            33,
            34,
            35,
            255,
            255,
            4,
            0,
            2,
            15,
            13,
            12,
            14,
            27,
            25,
            26
        ],
        "touch_order": [
            4,
            0,
            2,
            15,
            13,
            12,
            14,
            27,
            33,
            32
        ],
        "uart_groups": [
            {
                "tx": 1,
                "rx": 3,
                "cts": 19,
                "rts": 22
            },
            {
                "tx": 17,
                "rx": 16,
                "cts": 255,
                "rts": 255
            }
        ],
        "spi_groups": [
            {
                "miso": 12,
                "mosi": 13,
                "sclk": 14,
                "ss": 15
            },
            {
                "miso": 19,
                "mosi": 23,
                "sclk": 18,
                "ss": 5
            }
        ],
        "i2c_groups": [
            {
                "scl": 22,
                "sda": 21
            }
        ]
    };
