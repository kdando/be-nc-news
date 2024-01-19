//require in controller
const { getArticleById, getArticles, patchArticleById } = require("../controllers/articles.controller");
const { getCommentsByArticleId, postCommentByArticleId } = require("../controllers/comments.controller");

//create router
const articlesRouter = require("express").Router();

//Route to controllers per endpoint and request
articlesRouter
.route("/:article_id/comments")
.get(getCommentsByArticleId)
.post(postCommentByArticleId)

articlesRouter
.route("/:article_id")
.get(getArticleById)
.patch(patchArticleById)

articlesRouter
.route("/")
.get(getArticles)


module.exports = articlesRouter;