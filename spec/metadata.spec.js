"use strict";

describe("METADATA", () => {
    var artifact, space;

    beforeAll(() => {
        return jasmine.shelf.createSpace().then((testSpace) => {
            space = testSpace;
        });
    });
    beforeEach(() => {
        return space.uploadArtifact("LOL").then((a) => {
            artifact = a;
        });
    });
    it("can be uploaded and downloaded.", () => {
        var newMetadata;

        newMetadata = {
            myNewProperty: {
                value: "Hi there"
            }
        };

        return artifact.metadata.updateAll(newMetadata).then(() => {
            return artifact.metadata.getAll();
        }).then((allMetadata) => {
            expect(allMetadata.myNewProperty.value).toEqual(newMetadata.myNewProperty.value);
            [
                "md5Hash",
                "artifactPath",
                "artifactName"
            ].forEach((prop) => {
                expect(allMetadata[prop]).not.toBe();
            });
        });
    });
    it("can upload and download a single property", () => {
        var property;

        property = {
            name: "myProp",
            value: "hi there",
            immutable: true
        };

        return artifact.metadata.updateProperty(property.name, property).then(() => {
            return artifact.metadata.getProperty(property.name);
        }).then((remoteProperty) => {
            expect(remoteProperty).toEqual(property);
        });
    });
});
