"use strict";

module.exports = () => {
    var container, manager;

    container = require("./container")();
    manager = container.resolve("manager");

    return manager;
};
