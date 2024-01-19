//require models
const { fetchArticleById, fetchArticlesByTopic, fetchAllArticles, updateArticleVotes } = require("../models/articles.model.js");

//GET ARTICLE BY ID
function getArticleById (req, res, next) {
    const article_id = req.params.article_id;
    fetchArticleById(article_id)
    .then((result) => {
        return res.status(200).send({article: result});
    })
    .catch((error) => {
        next(error);
    })
}

//GET ALL ARTICLES / BY TOPIC
function getArticles (req, res, next) {

    //destructure queries assuming they exist
    const { sorted_by, order } = req.query

    if (req.query.topic) {
        fetchArticlesByTopic(req.query.topic)
        .then((result) => {
            return res.status(200).send({articles: result});
        })
        .catch((error) => {
            next(error);
        })

    } else {
        fetchAllArticles(sorted_by, order)
        .then((result) => {
            return res.status(200).send({articles: result});
        })
        .catch((error) => {
            next(error);
        })
    }
}

//PATCH ARTICLE VOTES BY ID
function patchArticleById (req, res, next) {

    const article_id = req.params.article_id
    const votes = req.body.inc_votes;

    if (req.body.inc_votes === undefined) {
        return res.status(400).send({ msg: "Requires an 'inc_votes' key."})
    }
    if (typeof votes !== "number") {
        return res.status(400).send({ msg: "Votes must be a number."})
    }

    updateArticleVotes(article_id, votes)
    .then((result) => {
        return res.status(200).send({article: result});
    })
    .catch((error) => {
        next(error);
    })
    
}

//export
module.exports = { getArticleById, getArticles, patchArticleById }