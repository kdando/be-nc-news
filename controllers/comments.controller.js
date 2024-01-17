//req models
const { fetchCommentsByArticle, addComment } = require("../models/comments.model")
const { checkArticleExists } = require("../models/articles.model")

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

    checkArticleExists(article_id)
    .then(() => {

        addComment(article_id, comment)
        .then((result) => {
            
            return res.status(201).send({comment: result})

        })

    })
    
    
}


module.exports = { getCommentsByArticleId, postCommentByArticleId }