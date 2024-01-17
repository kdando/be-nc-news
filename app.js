//require express and create server
const express = require("express");
const app = express();
app.use(express.json());

//require connection
const connection = require("./db/connection");

//require controllers
const getTopics = require("./controllers/topics.controller")
const getEndpoints = require("./controllers/endpoints.controller")
const { getArticleById, getArticles, patchArticleById } = require("./controllers/articles.controller")
const { getCommentsByArticleId, postCommentByArticleId, deleteCommentById } = require("./controllers/comments.controller")

////ENDPOINTS////
app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.patch("/api/articles/:article_id", patchArticleById);
app.delete("/api/comments/:comment_id", deleteCommentById);

////ERROR HANDLING////
//400 Bad Path
app.use((req, res, next) => {
    return res.status(400).send({ msg: "Path does not exist."});
})
//404 Nothing found (error received from model)
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        return res.status(err.status).send(err);
    }
    return res.status(404).send({ msg: "Not found."});
})
//"Catch all bucket" for other errors
app.use("*", (err, req, res, next) => {
    return res.status(500).send({ msg: "Internal server error."})
})

//export server
module.exports = app;
