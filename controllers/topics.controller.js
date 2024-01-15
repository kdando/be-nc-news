//require models
const fetchAllTopics = require("../models/topics.model");

//Get all topics
function getTopics (req, res) {
    fetchAllTopics()
    .then((result) => {
        return res.send(result)
    })
}


//export
module.exports = getTopics;
