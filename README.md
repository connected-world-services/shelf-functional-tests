Shelf Functional Tests
======================

A suite of functional tests for things like infrastructure and concurrency.

[![Dependencies][dependencies-badge]][dependencies-link]
[![Dev Dependencies][devdependencies-badge]][devdependencies-link]


Overview
--------

Unit tests are great but they can't catch every problem. Most of the problems we have had (after deployment) have been due to certain infrastructure or concurrency problems. We also have to do a certain amount of manual testing per deployment which takes up additional time. These tests are aimed at alleviating those problems.


Installation
------------

    curl https://codeload.github.com/connected-world-services/shelf-functional-tests/tar.gz/master | tar -xzv
    cd shelf-functional-tests-master
    npm install


Configuration
-------------

| Name                    | Type   | Description                                                                                                                                                                                                                | Default |
|-------------------------|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| `DEBUG`                 | bool   | Turns on debug logging for additional information.                                                                                                                                                                         | false   |
| `SHELF_LARGE_FILE_SIZE` | int    | The number of MB that you would like the large file upload test to use.                                                                                                                                                    | 1000    |
| `SHELF_AUTH_TOKEN`      | string | The token required in the Authorization header to [Shelf].                                                                                                                                                                 | -       |
| `SHELF_URI`             | string | The full URI to where you would like the tests to upload to. This should include the protocol, host and path to the testing directory. For example `https://api.shelf-qa.cwscloud.net/test-shelf/artifact/path/to/test/in` | -       |


Running the Tests
-----------------

**Important:** Remember that once [Shelf] stores an artifact it *cannot* be deleted without administrative intervention. Make sure that the `SHELF_URI` is pointing to somewhere you don't mind filling up with a ton of artifacts.

There are two main scripts you can run.

    npm run test

The above will run all tests.

    npm run fast-test

The above will run all tests that are quick. This excludes the test that uploads a very large file.


License
-------

This software is distributed under a [modified MIT license][LICENSE] with clauses covering patents. [Read full license terms][LICENSE].


[dependencies-badge]: https://img.shields.io/david/connected-world-services/shelf-functional-tests.svg
[dependencies-link]: https://david-dm.org/connected-world-services/shelf-functional-tests
[devdependencies-badge]: https://img.shields.io/david/dev/connected-world-services/shelf-functional-tests.svg
[devdependencies-link]: https://david-dm.org/connected-world-services/shelf-functional-tests#info=devDependencies
[LICENSE]: LICENSE.md
[Shelf]: https://github.com/not-nexus/shelf
