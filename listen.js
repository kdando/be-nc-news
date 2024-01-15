//require server, set server listening, then export
const app = require("./app");

const listening = app.listen(8080, () => {
    console.log("Server is listening on port 8080...")
})

module.exports = listening;