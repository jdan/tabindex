var meow = require("meow");
var tabindex = require("./");

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
        '    --delay=3000               Sets the delay capturing the page (in ms)'
    ].join('\n')
});

tabindex(program.input[0], program.flags, function(err, data) {
    if (err) {
        return console.log("Error:", err);
    }

    // Generate a gif!
    console.log(data.length);
});