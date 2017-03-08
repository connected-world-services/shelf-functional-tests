"use strict";

describe("SEARCH", () => {
    var artifact, rootSearch, search, space;

    beforeAll(() => {
        return jasmine.shelf.createSpace().then((testSpace) => {
            space = testSpace;
            search = space.createSearch();
            rootSearch = jasmine.shelf.manager.reference.initSearch();
        });
    });
    beforeEach(() => {
        var metadata;

        return space.uploadArtifact("searchTest").then((testArtifact) => {
            artifact = testArtifact;
            metadata = {
                buildNumber: {
                    value: 27
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

        return rootSearch.search(criteria).then((results) => {
            expect(results).toBeDefined();
        });
    });
    it("can do a path search with single search and sort criteria", () => {
        var criteria;

        criteria = {
            search: "buildNumber=27",
            sort: "createdDate, DESC"
        };

        return search.search(criteria).then((results) => {
            expect(results).toBeDefined();
        });
    });
    it("can do a path search with a list of search and sort criteria with a limit", () => {
        var criteria;

        criteria = {
            search: [
                "buildNumber=27",
                "createdDate=*"
            ],
            sort: [
                "createdDate, DESC",
                "buildNumber, VER"
            ],
            limit: 1
        };

        return search.search(criteria).then((results) => {
            expect(results).toBeDefined();
        });
    });
});
