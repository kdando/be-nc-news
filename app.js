//require express and create server
const express = require("express");
const app = express();
app.use(express.json());

//require connection
const connection = require("./db/connection");

//require and use CORS
const cors = require('cors')
app.use(cors());

//require router
const apiRouter = require("./routes/api-router");

//use router
app.use("/api", apiRouter);

///////////////////////////////

////ERROR HANDLING////
//400 Bad Path
app.use((req, res, next) => {
    return res.status(400).send({ msg: "Path does not exist."});
})
//Error received from model
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
