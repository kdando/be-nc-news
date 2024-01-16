//require connection
const connection = require("../db/connection")

function fetchCommentsByArticle (article_id) {
    
    return connection.query(
        `SELECT * FROM comments
        WHERE comments.article_id = $1
        ORDER BY created_at DESC;`, [article_id]
        )
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Article has no comments."})
            } else {
                return result.rows;
            }
        })


}

module.exports = fetchCommentsByArticle;