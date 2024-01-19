//require controller
const getTopics = require("../controllers/topics.controller")

//create router
const topicsRouter = require("express").Router();

//Route to controllers per endpoint and request
topicsRouter
.route("/")
.get(getTopics)

module.exports = topicsRouter;