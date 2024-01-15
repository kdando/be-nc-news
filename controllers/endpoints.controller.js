//require endpoints file
const endpoints = require("../endpoints.json")

//require model
const fetchAllEndpoints = require("../models/endpoints.model")

function getEndpoints (req, res) {
    try {
        const endpoints = fetchAllEndpoints();
        return res.send(endpoints);
    } catch (error) {
        return res.status(500).send({ msg: "Unable to read or parse endpoints.json"})
    }
  
}

//export
module.exports = getEndpoints;