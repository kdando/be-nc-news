//require connection
const connection = require("../db/connection")

//fetch all topics
function fetchAllTopics() {
    return connection.query(`SELECT * FROM topics;`)
    .then((result) => {
        //Custom error for empty results array
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: "No topics found!"})
        } else {
        //Otherwise, return the results
            return result.rows;
        }
    })
}

//export
module.exports = fetchAllTopics;