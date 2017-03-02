"use strict";

module.exports = (fsAsync, logger, path, unique) => {
    /**
     * This class exists to organize all artifacts within a
     * certain test. For example, if I did a concurrency test
     * where I uploaded many artifacts or make many metadata
     * requests they would all be contained within the same
     * "testPath". WARNING: Artifacts are immutable. Think carefully
     * about the path you will use to run tests.
     *
     * Below I will parameterize the part of the URI which is the test path.
     *
     *  https://api.shelf-qa.cwscloud.net/test/artifact/<testPath>
     */
    class Space {
        /**
         * @param {shelfLib~Reference} reference
         * @param {string} testPath See class description for details.
         */
        constructor(reference, testPath) {
            this.reference = reference;
            this.testPath = testPath;
            this.artifactList = [];
        }


        /**
         * Makes sure the file exists and is writable.
         *
         * @param {string} filePath
         * @return {Promise.<undefined>}
         */
        checkFile(filePath) {
           /**
             * fs.constants was added in v6.1. Adding this to make it more
             * backwards compatible.
             */
            return fsAsync.accessAsync(filePath, (fsAsync.constants || fsAsync).R_OK).then(null, () => {
                throw new Error(`File ${filePath} either doesn't exist or is not readable`);
            });
        }


        /**
         * Uploads the provided content as an artifact.
         *
         * @param {string} content
         * @return {Promise.<shelfLib~Artifact>}
         */
        uploadArtifact(content) {
            var artifact;

            return unique.create().then((randomId) => {
                var artifactPath;

                artifactPath = path.join(this.testPath, randomId);
                artifact = this.reference.initArtifact(artifactPath);

                return artifact;
            }).then(() => {
                logger.debug(`Uploading artifact to ${artifact.uri}`);

                return artifact.upload(content);
            }).then((loc) => {
                logger.debug(`Successfuly uploaded artifact to ${this.reference.buildUrl(loc)}`);
                this.artifactList.push(artifact);

                return artifact;
            });
        }


        /**
         * @param {string} file A path to a file.
         * @return {Promise.<shelfLib~Artifact>}
         */
        uploadArtifactFromFile(file) {
            var artifact;

            return this.checkFile(file).then(() => {
                var artifactPath;

                artifactPath = path.join(this.testPath, path.basename(file));
                logger.debug(`Artifact Path: ${artifactPath}`);
                artifact = this.reference.initArtifact(artifactPath);
            }).then(() => {
                logger.debug(`Uploading artifact to ${artifact.uri}`);

                return artifact.uploadFromFile(file);
            }).then((loc) => {
                logger.debug(`Successfuly uploaded artifact to ${this.reference.buildUrl(loc)}`);
                this.artifactList.push(artifact);

                return artifact;
            });
        }
    }

    return Space;
};
