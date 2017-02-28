"use strict";

module.exports = (cryptoAsync, fsAsync) => {
    /**
     * Appends 1MB of data to the file provided. I only do this so that
     * I don't have to load the entire contents of the file into memory.
     *
     * @param {string} file A file path.
     * @return {Promise.<undefined>}
     */
    function chunk(file) {
        return cryptoAsync.randomBytesAsync(1000000).then((buffer) => {
            return fsAsync.appendFileAsync(file, buffer);
        });
    }

    /**
     * Creates a file with random data in it.
     *
     * @param {string} file The path to the file you want to output.
     * @param {int} sizeMb How many MB you would like the file to be.
     * @return {Promise.<undefined>}
     */
    function create(file, sizeMb) {
        var iteration, promise;

        iteration = sizeMb - 1;
        promise = chunk(file);

        for (iteration; iteration > 0; iteration -= 1) {
            promise = promise.then(() => {
                return chunk(file);
            });
        }

        return promise;
    }

    return {
        create
    };
};
