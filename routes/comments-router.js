//require controller
const { deleteCommentById } = require("../controllers/comments.controller");

//create router
const commentsRouter = require("express").Router();

//Route to controllers per endpoint and request
commentsRouter
.route("/:comment_id")
.delete(deleteCommentById)

module.exports = commentsRouter;