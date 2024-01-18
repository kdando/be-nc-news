//require models
const { fetchCommentsByArticle, addComment, removeComment } = require("../models/comments.model")
const { checkArticleExists } = require("../models/articles.model")
const { checkUserExists } = require("../models/users.model")

//GET COMMENTS BY ARTICLE
function getCommentsByArticleId (req, res, next) {

    const article_id = req.params.article_id;

    const articleExistenceQuery = checkArticleExists(article_id);
    const commentsFetchQuery = fetchCommentsByArticle(article_id);

    Promise.all([articleExistenceQuery, commentsFetchQuery])
    .then((result) => {
        return res.status(200).send({comments: result[1]});
    })
    .catch((error) => {
        next(error);
    })

}

//POST COMMENT TO ARTICLE
function postCommentByArticleId (req, res, next) {
    
    const article_id = req.params.article_id;
    const comment = req.body;
    const { username, body } = comment;

    if (username === undefined || body === undefined) {
        return res.status(400).send({ msg: "Comment must have username and body."})
    }

    if (typeof username !== "string" || typeof body !== "string") {
        return res.status(400).send({ msg: "Comments must be text only." })
    }

    const articleExistenceQuery = checkArticleExists(article_id);
    const userExistenceQuery = checkUserExists(username);

    Promise.all([articleExistenceQuery, userExistenceQuery])
    .then((result) => {
        addComment(article_id, comment)
        .then((result) => {
            return res.status(201).send({comment: result})
        })
    })
    .catch((error) => {
        next(error)
    })
    
}

//DELETE COMMENT BY ID
function deleteCommentById (req, res, next) {

    const comment_id = req.params.comment_id

    removeComment(comment_id)
    .then(() => {
        return res.status(204).send();
    })
    .catch((error) => {
        next(error);
    })

}

module.exports = { getCommentsByArticleId, postCommentByArticleId, deleteCommentById }