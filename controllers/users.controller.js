//require models
const { fetchAllUsers } = require("../models/users.model")

//GET ALL USERS
function getUsers (req, res, next) {
    fetchAllUsers()
    .then((result) => {
        return res.status(200).send({users: result})
    })
    .catch((error) => {
        next(error);
    })
}

module.exports = getUsers;