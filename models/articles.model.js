const connection = require("../db/connection");
const { checkTopicExists } = require("./topics.model");

//CHECK ARTICLE EXISTS
function checkArticleExists (article_id) {
    if (isNaN(Number(article_id))) {
        return Promise.reject({ status: 400, msg: "Invalid article id."})
    }

    return connection.query(
        `SELECT * FROM articles
        WHERE article_id = $1;`, [article_id]
    )
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "No article with that id found."})
        }
        return;
    })
}

//GET ARTICLE BY ID
function fetchArticleById (article_id) {

    return checkArticleExists(article_id)
    .then(() => {
        return connection.query(
            `SELECT * FROM articles
            WHERE articles.article_id = $1;`, [article_id]
            )
        .then((result) => {
            return result.rows[0];
        })
    })

    
}

//GET ARTICLES BY TOPIC
function fetchArticlesByTopic (topic) {
    return checkTopicExists(topic)
    .then(() => {
        return connection.query(
            `SELECT * FROM articles
            WHERE articles.topic = $1;`, [topic]
            )
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "No articles found for that topic."});
            } else {
                return result.rows;
            }
            
        })
    })
}

//GET ALL ARTICLES
function fetchAllArticles () {
    return connection.query(
        `SELECT articles.author,
         articles.title,
         articles.article_id,
         articles.topic,
         articles.created_at,
         articles.votes,
         articles.article_img_url,
         COUNT(comments.article_id) AS comment_count 
         FROM articles 
         LEFT JOIN comments 
         ON articles.article_id = comments.article_id 
         GROUP BY articles.article_id 
         ORDER BY created_at DESC;`
    )
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "No articles found."})
        } else {
            return result.rows;
        }
    })
}

//PATCH ARTICLE BY ID
function updateArticleVotes(article_id, votes) {

    return checkArticleExists(article_id)
    .then(() => {
        return connection.query(
            `UPDATE articles
            SET votes = votes + $2
            WHERE articles.article_id = $1
            RETURNING *;`, [article_id, votes]
            )
        .then((result) => {
            return result.rows[0];
        })
    })

}

module.exports = { checkArticleExists, fetchArticleById, fetchArticlesByTopic, fetchAllArticles, updateArticleVotes }