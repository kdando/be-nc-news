//require connection
const connection = require("../db/connection")

function fetchArticleById (article_id) {

    //if article_id is not a number reject with 400 error
    if (isNaN(Number(article_id))) {
        return Promise.reject({ status: 400, msg: "Invalid article id."})
    }

    //otherwise query the db for specified article
    //parametrized query sanitised
    return connection.query(
        `SELECT * FROM articles
        WHERE articles.article_id = $1;`, [article_id]
        )
        .then((result) => {
            //if article_id valid but non-existent reject with 404
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "No article with that id found."})
            } else {
                return result.rows[0];
            }
        })
        
}

module.exports = fetchArticleById;