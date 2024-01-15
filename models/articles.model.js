//require connection
const connection = require("../db/connection")

function fetchArticleById (article_id) {
    return connection.query(
        `SELECT * FROM articles
        WHERE articles.article_id = ${article_id};`
        )
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "No article with that id found."})
            } else {
                return result.rows[0];
            }
        })
        
}

module.exports = fetchArticleById;