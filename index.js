// configure dotenv
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRouter = require("./src/controllers/auth-controller");
const taskRouter = require("./src/controllers/task-controllers");
const {
  authorizeUserWithAccessToken,
} = require("./src/services/middleware-services");

const app = express();
// parsing json coming from request body
app.use(express.json());

app.use(
  cors({
    origin: ["*"],
  })
);
// port number taken from .env file
const PORT = process.env.PORT || 7000;

// router definition
app.use("/api/auth", authRouter);
// task route protected with access token verification
app.use("/api/tasks", authorizeUserWithAccessToken, taskRouter);

app.listen(PORT, () => {
  console.log("server listening on port", PORT);
});
