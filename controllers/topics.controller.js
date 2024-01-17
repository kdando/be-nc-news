//require models
const fetchAllTopics = require("../models/topics.model");

//Get all topics
function getTopics (req, res, next) {
   
    fetchAllTopics()
    .then((result) => {
        return res.status(200).send({topics: result})
    })
    //Catch error and pass to next error-handling middleware
    .catch((error) => {
        next(error);
    })
}


//export
module.exports = getTopics;
