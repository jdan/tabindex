var system = require("system");
var page = require("webpage").create();
var options = JSON.parse(system.args[1]);

page.viewportSize = { width: options.width, height: 200 };
page.open(options.url, function(status) {
    if (status === 'fail') {
        system.stderr.writeLine('Couldn\'t load url: ' + url);
        phantom.exit(1);
    }

    setTimeout(function() {
        /**
         * Returns the active element as an array with the following format:
         * - tagName
         * - x coordinate
         * - y coordinate
         * - width
         * - height
         * - content
         *
         * We do this to easily check quality between two items, without
         * resorting to their querySelectorText, object equality, or some
         * other metric.
         */
        var getActiveElement = function() {
            return page.evaluate(function() {
                var el = document.activeElement;
                var rect = el.getBoundingClientRect();
                return [
                    el.tagName,
                    rect.left,
                    rect.top,
                    rect.width,
                    rect.height,
                    el.innerHTML
                ];
            });
        };

        var elements = [];
        var seenElements = {};
        var el;

        // Loop until we hit the same one or <body>
        while (1) {
            // Simulate the press of a tab key
            page.sendEvent('keypress', page.event.key.Tab);
            el = getActiveElement();

            // Our schema for active elements hashes easily, so we can check
            // if we have seen it before
            if (seenElements[el] || el[0] === 'BODY') {
                break;
            } else {
                seenElements[el] = true;

                // Push in a cleaner format
                elements.push({
                    tag: el[0],
                    x: el[1],
                    y: el[2],
                    width: el[3],
                    height: el[4],
                    contnet: el[5]
                });
            }
        }

        // Send back to node
        console.log(JSON.stringify(elements));
        phantom.exit();

    }, options.delay);
});