//require express and create server
const express = require("express");
const app = express();
app.use(express.json());

//require connection
const connection = require("./db/connection");

//require controllers
const getTopics = require("./controllers/topics.controller")
const getEndpoints = require("./controllers/endpoints.controller")
const getArticleById = require("./controllers/articles.controller")

//ENDPOINTS
app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);

//ERROR HANDLING
//Bad path
app.use((req, res, next) => {
    res.status(400).send({ msg: "Path does not exist."});
})
//"Catch all bucket"
app.use("*", (req, res, next) => {
    res.status(500).send({ msg: "Internal server error."})
})

//export server
module.exports = app;
