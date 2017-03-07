"use strict";

var config, logger, originalTimeout;

// 10 minutes
const testTimeout = 10 * 60 * 1000;

originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
config = jasmine.shelf.container.resolve("config");
logger = jasmine.shelf.container.resolve("logger");

describe("ARTIFACT_AVAILABILITY", () => {
    var content, space;

    content = "ARTIFACT CONTENT";

    /**
     * @return {Promise.<undefined>}
     */
    function runUploadAndDownload() {
        var artifact;

        return space.uploadArtifact(content).then((testArtifact) => {
            artifact = testArtifact;
            logger.info(`Downloading artifact ${artifact.uri}`);

            return artifact.download();
        }).then((value) => {
            expect(`${artifact.uri} = ${value}`).toBe(`${artifact.uri} = ${content}`);
        });
    }

    /**
     * @return {Promise.<undefined>}
     */
    function createUploadDownloadChain() {
        var count, promise;

        count = 1;

        promise = runUploadAndDownload();
        for (count; count < 5; count += 1) {
            promise = promise.then(() => {
                return runUploadAndDownload();
            });
        }

        return promise;
    }

    beforeAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = testTimeout;

        return jasmine.shelf.createSpace().then((testSpace) => {
            space = testSpace;
        });
    });
    it("should be available in parallel", () => {
        var count, promiseList;

        count = 0;
        promiseList = [];

        for (count; count < config.concurrentRequests; count += 1) {
            promiseList.push(createUploadDownloadChain());
        }

        return Promise.all(promiseList);
    });
    afterAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});
