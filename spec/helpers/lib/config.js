"use strict";

module.exports = {
    concurrentRequests: process.env.SHELF_CONCURRENT_REQUESTS || 10,
    debug: !!process.env.DEBUG,
    largeFileSize: process.env.SHELF_LARGE_FILE_SIZE || 1000,
    token: process.env.SHELF_AUTH_TOKEN,
    uri: process.env.SHELF_URI
};
