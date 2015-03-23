#!/usr/bin/env node
var meow = require("meow");
var tabindex = require("./");
var draw = require("./draw")

var program = meow({
    help: [
        'Usage',
        '    tabindex <url>',
        '',
        'Example',
        '    tabindex https://google.com',
        '',
        'Options',
        '    --output=tabindex.gif      Sets the oupit target',
        '    --width=1024               Sets the viewport size',
        '    --delay=3000               Sets the delay capturing the page (in ms)',
        '    --scale=0.5                Sets the scale of the rendered gif'
    ].join('\n')
});

tabindex(program.input[0], program.flags, function(err, result) {
    if (err) {
        return console.log("Error:", err);
    }

    //console.log(result.tabOrder)

    // Generate a gif!
    draw(result.tabOrder, result.width, result.height,
         program.flags.output, program.flags.scale);
});