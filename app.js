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

////ENDPOINTS////
app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);

////ERROR HANDLING////
//400 Bad Path
//No err parameter as should be triggered where no endpoint reached
app.use((req, res, next) => {
    console.log("BAD PATH BABY")
    return res.status(400).send({ msg: "Path does not exist."});
})
//404 Nothing found (error received from model)
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        return res.send(err);
    }
    return res.status(404).send({ msg: "Not found."});
})
//"Catch all bucket" for other errors
app.use("*", (err, req, res, next) => {
    console.log("WE IN APP LEVEL ERR 2")
    return res.status(500).send({ msg: "Internal server error."})
})

//export server
module.exports = app;
