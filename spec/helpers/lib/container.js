"use strict";

module.exports = () => {
    var container, Dizzy;

    Dizzy = require("dizzy");
    require("dizzy-promisify-bluebird")(Dizzy);
    container = new Dizzy();
    container.register("container", container);
    container.register("config", "./config").fromModule(__dirname);
    container.register("programName", "shelf-functional-tests");
    container.registerBulk({
        crypto: "crypto",
        debug: "debug",
        Log: "log",
        path: "path",
        shelfLib: "shelf-lib",
        URI: "urijs"
    }).fromModule();
    container.registerBulk({
        fileCreator: "./file-creator",
        logger: "./logger",
        manager: "./manager",
        Space: "./space",
        unique: "./unique"
    }).fromModule(__dirname).asFactory().cached();
    container.registerBulk({
        cryptoAsync: "crypto",
        fsAsync: "fs"
    }).fromModule().promisified().cached();

    return container;
};
