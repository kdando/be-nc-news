//req models
const fetchCommentsByArticle = require("../models/comments.model")
const { checkArticleExists } = require("../models/articles.model")

//COMMENTS BY ARTICLE
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


module.exports = getCommentsByArticleId;