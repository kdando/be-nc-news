//require models
const { fetchArticleById, fetchAllArticles } = require("../models/articles.model.js");

//ARTICLE BY ID
//extract parameter and invoke model with it
function getArticleById (req, res, next) {
    const article_id = req.params.article_id;
    fetchArticleById(article_id)
    .then((result) => {
        return res.status(200).send(result);
    })
    .catch((error) => {
        next(error);
    })
}

//ALL ARTICLES
function getArticles (req, res, next) {
    fetchAllArticles()
    .then((result) => {
        return res.status(200).send(result);
    })
    .catch((error) => {
        next(error);
    })
}

//export
module.exports = { getArticleById, getArticles }