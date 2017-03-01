"use strict";

module.exports = (config, fsAsync, logger, path, shelfLib, unique, URI) => {
    var hostPrefix, pathParts, pathPrefix, reference, shelf, uri;

    uri = new URI(config.uri);
    hostPrefix = `${uri.protocol()}://${uri.hostname()}`;

    if (uri.port()) {
        hostPrefix += `:${uri.port()}`;
    }

    pathParts = uri.path().split("/");
    shelf = pathParts[1];

    /**
     * The parts will be ["", "<shelf>", "artifact", "the", "rest"].
     * I want everything after "artifact".
     */
    pathPrefix = pathParts.slice(3).join("/");
    reference = shelfLib(hostPrefix).initReference(shelf, config.token);


    /**
     * Builds the path to the directory where we wish to upload
     * things. It is unlikely that this path will already exist.
     *
     * @return {Promise.<string>}
     */
    function buildPath() {
        return unique().then((uniqueId) => {
            return path.join(pathPrefix, uniqueId);
        });
    }


    /**
     * Makes sure the file exists and is writable.
     *
     * @param {string} filePath
     * @return {Promise.<undefined>}
     */
    function checkFile(filePath) {
       /**
         * fs.constants was added in v6.1. Adding this to make it more
         * backwards compatible.
         */
        return fsAsync.accessAsync(filePath, (fsAsync.constants || fsAsync).R_OK).then(null, () => {
            throw new Error(`File ${filePath} either doesn't exist or is not readable`);
        });
    }


    /**
     * @param {string} file A path to a file.
     * @return {Promise.<shelfLib~Artifact>}
     */
    function uploadArtifactFromFile(file) {
        var artifact;

        return checkFile(file).then(() => {
            logger.debug(`Building path for file ${file}`);

            return buildPath();
        }).then((artifactPath) => {
            artifactPath = path.join(artifactPath, path.basename(file));
            logger.debug(`Artifact Path: ${artifactPath}`);
            artifact = reference.initArtifact(artifactPath);
        }).then(() => {
            logger.debug(`Uploading artifact to ${artifact.uri}`);

            return artifact.uploadFromFile(file);
        }).then((loc) => {
            logger.debug(`Successfuly uploaded artifact to ${reference.buildUrl(loc)}`);

            return artifact;
        });
    }

    return {
        uploadArtifactFromFile
    };
};
