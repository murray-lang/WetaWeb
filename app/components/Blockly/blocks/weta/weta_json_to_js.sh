#!/usr/bin/env bash
echo "Blockly.defineBlocksWithJsonArray(" > weta_control.js
cat weta_control.json >> weta_control.js
echo ");" >> weta_control.js

echo "Blockly.defineBlocksWithJsonArray(" > weta_logic.js
cat weta_logic.json >> weta_logic.js
echo ");" >> weta_logic.js

echo "Blockly.defineBlocksWithJsonArray(" > weta_math.js
cat weta_math.json >> weta_math.js
echo ");" >> weta_math.js

echo "Blockly.defineBlocksWithJsonArray(" > weta_text.js
cat weta_text.json >> weta_text.js
echo ");" >> weta_text.js

echo "Blockly.defineBlocksWithJsonArray(" > weta_variable.js
cat weta_variable.json >> weta_variable.js
echo ");" >> weta_variable.js

echo "Blockly.defineBlocksWithJsonArray(" > weta_motors.js
cat weta_motors.json >> weta_motors.js
echo ");" >> weta_motors.js

echo "Blockly.defineBlocksWithJsonArray(" > weta_servos.js
cat weta_servos.json >> weta_servos.js
echo ");" >> weta_servos.js

echo "Blockly.defineBlocksWithJsonArray(" > weta_io.js
cat weta_io.json >> weta_io.js
echo ");" >> weta_io.js

echo "Blockly.defineBlocksWithJsonArray(" > weta_time.js
cat weta_time.json >> weta_time.js
echo ");" >> weta_time.js

echo "Blockly.defineBlocksWithJsonArray(" > weta_comms.js
cat weta_comms.json >> weta_comms.js
echo ");" >> weta_comms.js

echo "Blockly.defineBlocksWithJsonArray(" > weta_turtle.js
cat weta_turtle.json >> weta_turtle.js
echo ");" >> weta_turtle.js
