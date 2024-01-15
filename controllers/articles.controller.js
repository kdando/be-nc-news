const fetchArticleById = require("../models/articles.model.js");

function getArticleById (req, res) {
    const article_id = req.params.article_id;
    fetchArticleById(article_id)
    .then((result) => {
        return res.send(result);
    })
    
}

module.exports = getArticleById;