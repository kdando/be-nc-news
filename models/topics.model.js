//require connection
const connection = require("../db/connection")

//fetch all topics
function fetchAllTopics() {
    return connection.query(`SELECT * FROM topics;`)
    .then((result) => {
        return result.rows;
    })
}

//export
module.exports = fetchAllTopics;