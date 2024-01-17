//require connection
const connection = require("../db/connection")

//GET COMMENTS
function fetchCommentsByArticle (article_id) {
    return connection.query(
        `SELECT * FROM comments
        WHERE comments.article_id = $1
        ORDER BY created_at DESC;`, [article_id]
        )
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 200, msg: "Article has no comments."})
            } else {
                return result.rows;
            }
        })
}

//POST A COMMENT
function addComment (article_id, comment) {

    const { username, body } = comment;

    return connection.query(
        `INSERT INTO comments (article_id, author, body, votes)
        VALUES ($1, $2, $3, 0)
        RETURNING *;`, [article_id, username, body]
        )
        .then((result) => {
            return result.rows[0];
        })

}

module.exports = { fetchCommentsByArticle, addComment }