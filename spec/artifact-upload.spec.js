"use strict";
var config, container, cryptoAsync, fileCreator, fsAsync, logger;

container = require("./helpers/lib/container")();
logger = container.resolve("logger");
fsAsync = container.resolve("fsAsync");
cryptoAsync = container.resolve("cryptoAsync");
fileCreator = container.resolve("fileCreator");
config = container.resolve("config");


/**
 * Figures out the md5 hash of a local file.
 *
 * @param {string} file
 * @return {Promise.<string>}
 */
function loadLocalMd5Hash(file) {
    var hash, promise, stream;

    stream = fsAsync.createReadStream(file);
    hash = cryptoAsync.createHash("md5");

    promise = new Promise((resolve, reject) => {
        stream.on("readable", () => {
            const data = stream.read();

            if (data) {
                hash.update(data);
            } else {
                resolve(hash.digest("hex"));
            }
        });
        stream.on("error", (error) => {
            reject(error);
        });
    });

    return promise;
}

describe("LARGE_ARTIFACT_UPLOAD", () => {
    var originalTimeout;

    beforeEach(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

        // 30 minutes
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30 * 60 * 1000;
    });
    it("will successfully upload.", () => {
        var error, fileName, remoteMd5Hash;

        fileName = "large.txt";
        logger.debug(`Creating large file of "${config.largeFileSize}MB"`);

        return fileCreator.create(fileName, config.largeFileSize).then(() => {
            return jasmine.shelf.uploadArtifactFromFile(fileName);
        }).then((artifact) => {
            logger.info(`Successfuly uploaded "${artifact.uri}"`);
            logger.debug("Getting remote md5Hash");

            return artifact.metadata.getProperty("md5Hash");
        }).then((md5HashProperty) => {
            remoteMd5Hash = md5HashProperty;
            logger.debug("Got remote md5Hash %O", md5HashProperty);
            logger.debug("Getting local md5Hash");

            return loadLocalMd5Hash(fileName);
        }).then((localMd5Hash) => {
            logger.debug(`Got local md5Hash ${localMd5Hash}`);
            expect(localMd5Hash).toEqual(remoteMd5Hash.value);
        }).then(null, (err) => {
            error = err;
        }).then(() => {
            return fsAsync.unlinkAsync(fileName).then(null, (err) => {
                logger.error(`Failed to clean up file "${fileName}"`);
                logger.error(err.message);
                logger.debug(err.stack);
            });
        }).then(() => {
            if (error) {
                logger.error(error);
                jasmine.fail("Forcing test to fail because an error was not handled.");
            }
        });
    });
    afterEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});
