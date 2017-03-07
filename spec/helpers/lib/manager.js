"use strict";

module.exports = (config, container, logger, path, shelfLib, Space, unique, URI) => {
    var hostPrefix, pathParts, pathPrefix, reference, shelf, shelfLibOptions, uri;

    uri = new URI(config.uri);
    hostPrefix = `${uri.protocol()}://${uri.hostname()}`;

    if (uri.port()) {
        hostPrefix += `:${uri.port()}`;
    }

    pathParts = uri.path().split("/");
    shelf = pathParts[1];
    shelfLibOptions = {};

    if (config.debug) {
        shelfLibOptions.logLevel = "debug";
    }

    /**
     * The parts will be ["", "<shelf>", "artifact", "the", "rest"].
     * I want everything after "artifact".
     */
    pathPrefix = pathParts.slice(3).join("/");
    reference = shelfLib(hostPrefix, shelfLibOptions).initReference(shelf, config.token);


    /**
     * Builds the path to the directory where we wish to upload
     * things. It is unlikely that this path will already exist.
     *
     * @return {Promise.<string>}
     */
    function buildPath() {
        return unique.createWithDate().then((uniqueId) => {
            return path.join(pathPrefix, uniqueId);
        });
    }


    /**
     * Creates a Space instance.
     *
     * @return {Promise.<shelfFunctionalTests~Space>}
     */
    function createSpace() {
        return buildPath().then((testPath) => {
            return new Space(reference, testPath);
        });
    }


    /**
     * @see shelfFunctionalTests~Space.uploadArtifact
     *
     * @param {string} content
     * @return {shelfLib~Artifact}
     */
    function uploadArtifact(content) {
        return createSpace().then((space) => {
            return space.uploadArtifact(content);
        });
    }


    /**
     * @see shelfFunctionalTests~Space.uploadArtifactFromFile
     *
     * @param {string} file
     * @return {shelfLib~Artifact}
     */
    function uploadArtifactFromFile(file) {
        return createSpace().then((space) => {
            return space.uploadArtifactFromFile(file);
        });
    }

    return {
        container,
        createSpace,
        uploadArtifact,
        uploadArtifactFromFile,
        reference
    };
};
