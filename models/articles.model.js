//require connection
const connection = require("../db/connection")

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


//ARTICLE BY ID
function fetchArticleById (article_id) {

    return checkArticleExists(article_id)
    .then(() => {
        return connection.query(
            `SELECT * FROM articles
            WHERE articles.article_id = $1;`, [article_id]
            )
        .then((result) => {
                if (result.rows.length === 0) {
                    return Promise.reject({ status: 404, msg: "No article with that id found."})
                } else {
                    return result.rows[0];
                }
        })
    })

    
}

//ALL ARTICLES
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

module.exports = { checkArticleExists, fetchArticleById, fetchAllArticles }