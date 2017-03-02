"use strict";

module.exports = (cryptoAsync) => {
    /**
     * Creates a random string of 10 hex characters.
     *
     * @return {Promise.<string>}
     */
    function create() {
        return cryptoAsync.randomBytesAsync(5).then((buffer) => {
            return buffer.toString("hex");
        });
    }


    /**
     * Resolves with a unique ID in the form
     *  YYYY-MM-DD-HH-MM-SS.SSS-<random10DigitHexString>
     *
     * @return {Promise.<string>}
     */
    function createWithDate() {
        return create().then((randomString) => {
            var dateString;

            dateString = new Date().toISOString().replace(/:/g, "-").replace(/T/g, "-").replace("Z", "");

            return `${dateString}-${randomString}`;
        });
    }

    return {
        create,
        createWithDate
    };
};
