//require connection
const connection = require("../db/connection")

//GET COMMENTS FOR ARTICLE
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

//DELETE A COMMENT
function removeComment (comment_id) {

    return checkCommentExists(comment_id)
    .then(() => {
        return connection.query(
            `DELETE FROM comments
            WHERE comments.comment_id = $1;`, [comment_id]
            )
        .then((result) => {
            return result;
        })
    })

}

//CHECK USERNAME EXISTS
function checkUserExists (username) {
    if (typeof username !== "string") {
        return Promise.reject({ status: 400, msg: "Invalid username."})
    }
    return connection.query(
        `SELECT * FROM users
        WHERE username = $1;`, [username]
    )
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "No user with that name found."})
        }
        return;
    })
}

//CHECK COMMENT EXISTS
function checkCommentExists (comment_id) {
    
    if (isNaN(Number(comment_id))) {
        return Promise.reject({ status: 400, msg: "Invalid comment id."})
    }
    return connection.query(
        `SELECT * FROM comments
        WHERE comment_id = $1;`, [comment_id]
    )
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "No comment with that id found."})
        }
        return;
    })
}

module.exports = { fetchCommentsByArticle, addComment, removeComment, checkUserExists, checkCommentExists }