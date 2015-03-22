var GIFEncoder = require("gifencoder");
var fs = require("fs");

/**
 * Returns the ImageData corresponding to an element's bounding box being
 * drawn on a white background.
 */
function drawFrame(width, height, el, cb) {
    var byteData = new Uint8ClampedArray(width * height * 4);
    var row, i, rowData;

    for (row = 0; row < height; row++) {
        // Generate a row of 255's
        rowData = [];
        for (i = 0; i < width; i++) {
            rowData.push(255, 255, 255, 255);
        }

        if (row >= el.y && row < el.y + el.height) {
            for (i = el.x*4; i < el.x*4 + el.width*4; i += 4) {
                rowData[ i ] = 0;
                rowData[i+1] = 0;
                rowData[i+2] = 0;
                rowData[i+3] = 0;
            }
        }

        byteData.set(rowData, row * width * 4);
    }

    return byteData;
}

/**
 * Renders a GIF of a given tab order represented by:
 * - an array of elements
 * - document width
 * - document height
 * - output file (default: tab.gif)
 * - scale parameter (default 0.5)
 */
module.exports = function(els, width, height, outputFile, scale) {
    scale = scale || 0.5;
    outputFile = outputFile || "tab.gif";

    var scaledWidth = Math.floor(scale * width);
    var scaledHeight = Math.floor(scale * height);

    var encoder = new GIFEncoder(scaledWidth, scaledHeight);
    encoder.createReadStream().pipe(fs.createWriteStream(outputFile));

    encoder.start();
    encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(200);  // frame delay in ms
    encoder.setQuality(10); // image quality. 10 is default.

    els.forEach(function(el) {
        encoder.addFrame(drawFrame(scaledWidth, scaledHeight, {
            x: Math.floor(el.x * scale),
            y: Math.floor(el.y * scale),
            width: Math.floor(el.width * scale),
            height: Math.floor(el.height * scale)
        }));
    });

    encoder.finish();
};
