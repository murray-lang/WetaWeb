var fs = require('fs');

if( process.argv.length > 2 )
{
    var jsFileName = process.argv[2];
    var jsonFileName = process.argv[3];
    var js;
    var json;
    var msg 
    console.log('Reading ' + jsFileName + '...');
    try
    {
        js = fs.readFileSync( jsFileName, { encoding: 'utf8' });
    }
    catch (e)
    {
        console.log('Error reading file ' + jsFileName + ': ' + e);
        process.exit(1);
    }
    console.log('Interpreting JavaScript...');
    try
    {   
        var setup = 
            'var goog = {};' +
            'goog.provide = function(blah) {};' +
            'goog.require = function(blah) {};' +
            'var Blockly = { Msg: {} };';
            
        eval(setup);
        eval(js);
        json = JSON.stringify(Blockly.Msg, null, '\t');
        
    }
    catch(e)
    {
        console.log('Error interpreting JavaScript: ' + e);
        process.exit(1);
    }
    console.log('Writing JSON file ' + jsonFileName);
    try
    {
        fs.writeFileSync(jsonFileName, json, { encoding: 'utf8' });
    }
    catch (e)
    {
        console.log('Error writing JSON file: ' + e);
        process.exit(1);
    }
    process.exit(0);
}
else
{
    console.log('Usage: jsonifymsg.js <Javascript file in> <JSON file out>');
    process.exit(1);
}
