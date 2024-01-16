//require model
const fetchArticleById = require("../models/articles.model.js");

//extract parameter and invoke model with it
function getArticleById (req, res, next) {
    const article_id = req.params.article_id;
    fetchArticleById(article_id)
    .then((result) => {
        return res.send(result);
    })
    .catch((error) => {
        next(error);
    })
    
}

//export
module.exports = getArticleById;