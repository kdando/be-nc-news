const connection = require("../db/connection")

//CHECK TOPIC EXISTS
function checkTopicExists (topic) {
    if (typeof topic !== "string") {
        return Promise.reject({ status: 400, msg: "Invalid topic."})
    }
    return connection.query(
        `SELECT * FROM topics
        WHERE slug = $1;`, [topic]
    )
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "No topic with that name found."})
        }
        return;
    })
}

//GET ALL TOPICS
function fetchAllTopics() {
    return connection.query(`SELECT * FROM topics;`)
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: "No topics found!"})
        } else {
            return result.rows;
        }
    })
}

//export
module.exports = { checkTopicExists, fetchAllTopics };