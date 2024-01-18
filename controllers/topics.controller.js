const { fetchAllTopics } = require("../models/topics.model");

//GET ALL TOPICS
function getTopics (req, res, next) {
   
    fetchAllTopics()
    .then((result) => {
        return res.status(200).send({topics: result})
    })
    .catch((error) => {
        next(error);
    })
}

module.exports = getTopics;
