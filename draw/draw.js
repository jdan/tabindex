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
            for (i = el.x; i < el.x + el.width * 4; i += 4) {
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

module.exports = function() {
    var encoder = new GIFEncoder(100, 100);
    encoder.createReadStream().pipe(fs.createWriteStream('myanimated.gif'));

    encoder.start();
    encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(100);  // frame delay in ms
    encoder.setQuality(10); // image quality. 10 is default.

    for (var i = 0; i < 10; i++) {
        encoder.addFrame(drawFrame(100, 100, {
            x: Math.floor(Math.random() * 50),
            y: Math.floor(Math.random() * 50),
            width: 20,
            height: 20
        }));
    }

    encoder.finish();
};

run();
