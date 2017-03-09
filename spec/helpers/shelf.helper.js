"use strict";
var path, url;

path = require("path");
url = require("url");

if (!jasmine.shelf) {
    jasmine.shelf = require("./lib")();
}

jasmine.getUriPath = (uri) => {
    var testLink, testUri;

    testUri = url.parse(uri);
    testLink = testUri.path.split("/").slice(3).join("/");

    return path.format({
        root: "/",
        name: testLink
    });
};
