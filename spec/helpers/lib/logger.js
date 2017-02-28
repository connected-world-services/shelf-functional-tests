"use strict";

module.exports = (config, debug, Log, programName) => {
    var log;

    if (config.debug) {
        debug.enable(`${debug.load()} ${programName}`);
    }

    log = new Log();

    return {
        debug: debug(programName),
        error: log.error.bind(log),
        info: log.info.bind(log),
        warn: log.warning.bind(log)
    };
};
