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

//BUILD QUERY FOR ALL ARTICLES (INCL TOPIC, SORT, ORDER)
function buildQueryString (topic, sorted_by, order) {
    
    //build query string
    let queryStr = `SELECT articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        CAST(articles.votes AS INT) AS votes,
        articles.article_img_url,
        CAST(COUNT(comments.article_id) AS INT) AS comment_count 
        FROM articles 
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id`
    
    if (topic !== undefined) {
        queryStr += ` WHERE articles.topic = '${topic}'`
    }

    queryStr += ` GROUP BY articles.article_id`
    
    if (sorted_by !== undefined) {
        queryStr += ` ORDER BY ${sorted_by}`
    } else {
        queryStr += ` ORDER BY created_at`
    }
    if (order === "asc") {
        queryStr += ` ASC;`
    } else {
        queryStr += ` DESC;`
    }

    return queryStr;

}

//GET ARTICLE BY ID
function fetchArticleById (article_id) {

    return checkArticleExists(article_id)
    .then(() => {
        return connection.query(
            `SELECT articles.*,
            CAST(COUNT(comments.article_id) AS INT) AS comment_count  
            FROM articles 
            LEFT JOIN comments 
            ON articles.article_id = comments.article_id
            WHERE articles.article_id = $1 
            GROUP BY articles.article_id;`, [article_id]
            )
        .then((result) => {
            return result.rows[0];
        })
    })
    
}

//GET ALL ARTICLES
function fetchAllArticles (topic, sorted_by, order) {

     //confirm sort and order args are valid
     const validSorts = ["title", "author", "article_id", "topic", "created_at", "votes", "body", "article_img_url", "comment_count", undefined]
     const validOrders = ["asc", "desc", undefined]
     if (!validSorts.includes(sorted_by)) {
         return Promise.reject({ status: 400, msg: "Can only sort by available columns."})
     }
     if (!validOrders.includes(order)) {
         return Promise.reject({ status: 400, msg: "Can only order by ascending or descending."})
     }

     //initiate empty query
     let queryStr = ""

    //if topic given, check it exists, then run query
    if (topic !== undefined) {
        return checkTopicExists(topic)
        .then(() => {
            queryStr = buildQueryString(topic, sorted_by, order)
            return queryStr;
        })
        .then((queryStr) => {
            return connection.query(queryStr)
            .then((result) => {
                if (result.rows.length === 0) {
                    return Promise.reject({ status: 200, msg: "No articles found for that topic."})
                } else {
                    return result.rows;
                }
            })
        })
    }

    //if topic not given just run query
    queryStr = buildQueryString(topic, sorted_by, order)
    return connection.query(queryStr)
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

module.exports = { checkArticleExists, fetchArticleById, fetchAllArticles, updateArticleVotes }