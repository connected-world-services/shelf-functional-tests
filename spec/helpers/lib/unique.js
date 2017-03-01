"use strict";

module.exports = (cryptoAsync) => {
    /**
     * Resolves with a unique ID in the form
     *  YYYY-MM-DD-HH-MM-SS.SSS-<random10DigitHexString>
     *
     * @return {Promise.<string>}
     */
    return () => {
        return cryptoAsync.randomBytesAsync(5).then((buffer) => {
            var dateString, randomString;

            randomString = buffer.toString("hex");
            dateString = new Date().toISOString().replace(/:/g, "-").replace(/T/g, "-").replace("Z", "");

            return `${dateString}-${randomString}`;
        });
    };
};
