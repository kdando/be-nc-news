//Create router and require subrouters (or just controller for getEndpoints)
const apiRouter = require("express").Router();

const articlesRouter = require("./articles-router");
const topicsRouter = require("./topics-router")
const usersRouter = require("./users-router")
const commentsRouter = require("./comments-router")

const getEndpoints = require("../controllers/endpoints.controller");

//subrouters
apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.get("/", getEndpoints);

//Bad path error handling
apiRouter.use((req, res, next) => {
    return res.status(400).send({ msg: "Path does not exist."});
})


module.exports = apiRouter;