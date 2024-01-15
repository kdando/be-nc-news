//require models
const fetchAllTopics = require("../models/topics.model");

//Get all topics
function getTopics (req, res, next) {
    fetchAllTopics()
    .then((result) => {
        return res.send(result)
    })
    //Catch error and pass to next error-handling middleware
    .catch((error) => {
        next(error);
    })
}


//export
module.exports = getTopics;
