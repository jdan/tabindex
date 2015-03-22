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
         * Returns the active element
         */
        var getActiveElement = function() {
            return page.evaluate(function() {
                var el = document.activeElement;
                var rect = el.getBoundingClientRect();
                return {
                    tag: el.tagName,
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height,
                    content: el.innerHTML
                };
            });
        };

        /**
         * Detect if the element has been active before, meaning it has
         * appeared in the tab order already.
         *
         * The API for this admittedly has side-effects.
         */
        var _idx = {};
        var elementHasBeenActive = function(el) {
            // Hash the element
            var key = [
                el.tag,
                el.x,
                el.y,
                el.width,
                el.height
            ].toString();

            // If we have seen it before, return true
            if (_idx[key]) {
                return true;

            // Otherwise, store it (side-effect !!) and return false
            } else {
                _idx[key] = true;
                return false;
            }
        }

        var elements = [];
        var el;

        // Loop until we hit the same one or <body>
        while (1) {
            // Simulate the press of a tab key
            page.sendEvent('keypress', page.event.key.Tab);
            el = getActiveElement();

            // Our schema for active elements hashes easily, so we can check
            // if we have seen it before
            if (elementHasBeenActive(el) || el.tag === 'BODY') {
                break;
            } else {
                elements.push(el);
            }
        }

        // Send back to node
        console.log(JSON.stringify(elements));
        phantom.exit();

    }, options.delay);
});