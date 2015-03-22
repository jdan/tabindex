var system = require("system");
var page = require("webpage").create();
var options = JSON.parse(system.args[1]);

page.viewportSize = { width: options.width, height: 10000 };
page.open(options.url, function(status) {
    if (status === 'fail') {
        system.stderr.writeLine('Couldn\'t load url: ' + url);
        phantom.exit(1);
    }

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
    };

    setTimeout(function() {
        var elements = [];
        var el;

        while (1) {
            // Simulate the press of a tab key
            page.sendEvent('keypress', page.event.key.Tab);
            el = getActiveElement();

            // Break if we have seen the element before, or if it's the BODY
            if (el.tag === 'BODY' || elementHasBeenActive(el)) {
                break;
            } else {
                elements.push(el);
            }
        }

        var bodyWidth = page.evaluate(function() {
            return document.body.offsetWidth;
        });
        var bodyHeight = page.evaluate(function() {
            return document.body.offsetHeight;
        });

        // Send back to node
        // - The tab order of elements (as defined above)
        // - The width of the body
        // - The height of the body
        console.log(JSON.stringify({
            tabOrder: elements,
            width: bodyWidth,
            height: bodyHeight
        }));
        phantom.exit();

    }, options.delay);
});