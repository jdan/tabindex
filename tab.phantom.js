var system = require("system");
var page = require("webpage").create();
var options = JSON.parse(system.args[1]);

page.viewportSize = { width: options.width };
page.open(options.url, function(status) {
    if (status === 'fail') {
        system.stderr.writeLine('Couldn\'t load url: ' + url);
        phantom.exit(1);
    }

    setTimeout(function() {
        var getActiveElement = function() {
            return page.evaluate(function() {
                // Best we can do is tagName I guess :(
                return document.activeElement.tagName;
            });
        };

        // Loop until we hit the same one
        var elements = [getActiveElement()];
        for (var i = 0; i < 10; i++) {
            page.sendEvent('keypress', page.event.key.Tab);
            elements.push(getActiveElement());
        }

        // Send back to node
        console.log(JSON.stringify(elements));
        phantom.exit();

    }, options.delay);
});