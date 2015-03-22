var execFile = require("child_process").execFile;
var objectAssign = require("object-assign");
var path = require("path");
var phantomjs = require("phantomjs");

module.exports = function(url, options, cb) {
    options = objectAssign({
        delay: 3000,
        width: 1024,
        url: url
    }, options);

    execFile(phantomjs.path, [
        path.join(__dirname, "tab.phantom.js"),
        JSON.stringify(options)
    ], function(err, result) {
        if (err) {
            return cb(err);
        } else {
            return cb(null, JSON.parse(result));
        }
    });
};