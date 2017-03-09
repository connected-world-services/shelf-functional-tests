"use strict";

describe("SEARCH", () => {
    var artifact, rootSearch, search, space, testLink;

    beforeAll(() => {
        return jasmine.shelf.createSpace().then((testSpace) => {
            space = testSpace;
            search = space.createSearch();
            rootSearch = space.reference.initSearch();
        });
    });
    beforeEach(() => {
        var metadata;

        return space.uploadArtifact("searchTest").then((testArtifact) => {
            artifact = testArtifact;
            testLink = jasmine.getUriPath(testArtifact.uri);
            metadata = {
                buildNumber: {
                    value: 27
                },
                version: {
                    value: "1.0.0"
                }
            };

            return artifact.metadata.updateAll(metadata);
        });
    });
    it("can do a path search without criteria", () => {
        return search.search().then((results) => {
            // Need to parse links and make sure my artifact is in there somewhere.
            expect(results).toBeDefined();
        });
    });
    it("can do a root search without criteria", () => {
        var criteria;

        criteria = {
            limit: 1
        };

        return rootSearch.search(criteria).then((results) => {
            expect(results.length).toEqual(1);
        });
    });
    it("can do a path search with single search and sort criteria", () => {
        var criteria;

        criteria = {
            search: "buildNumber=27",
            sort: "createdDate, DESC"
        };

        return search.search(criteria).then((results) => {
            expect(results).toEqual(jasmine.arrayContaining([testLink]));
        });
    });
    it("can do a path search with a list of search and sort criteria with a limit", () => {
        var criteria;

        criteria = {
            search: [
                "buildNumber=27",
                "createdDate=*",
                "version~=1.0.0"
            ],
            sort: [
                "createdDate, DESC",
                "version, VER"
            ],
            limit: 1
        };

        return search.search(criteria).then((results) => {
            expect(results.length).toBe(1);
            expect(results[0]).toBe(testLink);
        });
    });
});
