"use strict";

module.exports = {
    debug: !!process.env.DEBUG,
    largeFileSize: process.env.SHELF_LARGE_FILE_SIZE || 1000,
    token: process.env.SHELF_AUTH_TOKEN,
    uri: process.env.SHELF_URI
};
