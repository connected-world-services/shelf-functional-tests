"use strict";

var config, container, logger, originalTimeout, path;

// 30 minutes
const testTimeout = 30 * 60 * 1000;

originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
path = require("path");
container = jasmine.shelf.container;
logger = container.resolve("logger");
config = container.resolve("config");


/**
 * Runs a bunch of callbacks concurrently.
 *
 * @param {Function} createPromise
 * @param {Array.<Object>} dataList
 * @return {Promise.<Array.<Object>>}
 */
function runConcurrent(createPromise, dataList) {
    var count, promise, promiseList;

    promiseList = [];
    dataList = dataList || [];

    for (count = 0; count < config.concurrentRequests; count += 1) {
        if (dataList.length) {
            promise = createPromise(dataList[count]);
        } else {
            promise = createPromise();
        }

        promiseList.push(promise);
    }

    return Promise.all(promiseList);
}


describe("CONCURRENCY", () => {
    var artifactContent, metadatum, space;

    artifactContent = "ARTIFACT CONTENTS";
    metadatum = {
        name: "myProp",
        value: "myValue"
    };
    beforeAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = testTimeout;

        return jasmine.shelf.createSpace().then((testSpace) => {
            space = testSpace;
        });
    });
    it("can be handled when making similar requests", () => {
        return runConcurrent(() => {
            return space.uploadArtifact(artifactContent);
        }).then(() => {
            return runConcurrent((artifact) => {
                logger.info(`Downloading artifact ${artifact.uri}.`);

                return artifact.download().then((value) => {
                    expect(value).toBe(artifactContent, `Downloaded artifact did not match what was uploaded for ${artifact.uri}`);
                });
            }, space.artifactList);
        }).then(() => {
            return runConcurrent((artifact) => {
                logger.info(`Uploading a metadata property for ${artifact.uri}`);

                return artifact.metadata.updateProperty(metadatum.name, metadatum);
            }, space.artifactList);
        }).then(() => {
            return runConcurrent((artifact) => {
                var criteria, search;

                criteria = {
                    search: [
                        `artifactName=${path.basename(artifact.uri)}`,
                        `${metadatum.name}=${metadatum.value}`
                    ]
                };
                logger.info(`Searching for ${artifact.uri}`);
                search = space.createSearch();

                return search.search(criteria).then((linkList) => {
                    expect(linkList.length).toBe(1, `Searching for ${JSON.stringify(criteria, null, 4)} resulted in the wrong number of links for ${artifact.uri}`);
                });
            }, space.artifactList);
        });
    });
    it("can be handled when making different requests", () => {
        var count, logSearch, promise, promiseList, search;

        promiseList = [];
        logSearch = () => {
            logger.info(`Successfully searched for ${space.testPath}`);
        };

        for (count = 0; count < config.concurrentRequests; count += 1) {
            if (count % 2) {
                promise = space.uploadArtifact(artifactContent).then((artifact) => {
                    return artifact.metadata.updateProperty(metadatum.name, metadatum);
                });
            } else {
                search = space.createSearch();
                logger.info(`Searching path ${space.testPath}`);
                promise = search.search().then(logSearch);
            }

            promiseList.push(promise);
        }

        return Promise.all(promiseList);
    });
    afterAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});
