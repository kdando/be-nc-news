//require express and create server
const express = require("express");
const app = express();
app.use(express.json());

//require connection
const connection = require("./db/connection");

//require controllers
const getTopics = require("./controllers/topics.controller")

//ENDPOINTS
app.get("/api/topics", getTopics);

//export server
module.exports = app;
