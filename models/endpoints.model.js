//require path module
const path = require("path");
const { nextTick } = require("process");

function fetchAllEndpoints () {
    const endpointsPath = path.resolve(__dirname, '../endpoints.json')
    try {
        const endpoints = require(endpointsPath)
        return endpoints;
    } catch (error) {
        next(error);
    }
}

//export
module.exports = fetchAllEndpoints;