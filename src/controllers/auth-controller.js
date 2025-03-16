const express = require("express");
const {
  addUser,
  loginUser,

  generateAccessToken,
  deleteUserToken,
} = require("../services/auth-services");
const {
  authorizeUserWithRefreshToken,
} = require("../services/middleware-services");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    console.log("signup request for data ", req.body);
    const dbResponse = await addUser(req.body);
    const data = {
      userId: dbResponse.insertedId,
    };
    res.send({
      status: true,
      message: "user added successful",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    console.log("login request for data ", req.body);
    const { accessToken, refreshToken, user } = await loginUser(req.body);

    res.send({
      status: true,
      message: "user login successful",
      data: {
        token: {
          accessToken,
          refreshToken,
        },
        user,
      },
    });
  } catch (error) {
    console.log(error.message);
    // send why login failed
    res.send({
      status: false,
      message: error.message,
    });
  }
});
authRouter.get(
  "/access-token",
  authorizeUserWithRefreshToken,
  async (req, res) => {
    try {
      // if refresh token is valid , then generate a access token and send it
      const user = req.user;
      const accessToken = generateAccessToken({
        email: user.email,
        name: user.name,
      });
      res.send({ accessToken, status: true });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
);
authRouter.delete("/logout", async (req, res) => {
  try {
    console.log("logout request for data ", req.body);
    const response = await deleteUserToken(req.body.email);

    res.send({
      status: true,
      message: "user logout successful",
      data: response,
    });
  } catch (error) {
    console.log(error.message);
    // send why logout failed
    res.send({
      status: false,
      message: error.message,
    });
  }
});
module.exports = authRouter;
