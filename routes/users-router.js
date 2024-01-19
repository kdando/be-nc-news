//require controller
const getUsers = require("../controllers/users.controller")

//create router
const usersRouter = require("express").Router();

//Route to controllers per endpoint and request
usersRouter
.route("/")
.get(getUsers)

module.exports = usersRouter;