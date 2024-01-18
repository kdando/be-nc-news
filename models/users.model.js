//require connection
const connection = require("../db/connection")

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

//GET ALL USERS
function fetchAllUsers () {
    
    return connection.query(`SELECT * FROM users;`)
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "No users found."})
        } else {
            return result.rows;
        }
    })
}

module.exports = { checkUserExists, fetchAllUsers }