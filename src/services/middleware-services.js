const { decodeAccessToken, decodeRefreshToken } = require("./auth-services");

const authorizeUserWithAccessToken = async (req, res, next) => {
  try {
    const requestToken = req.headers.authorization.split(" ")[1];
    const user = decodeAccessToken({ token: requestToken });
    console.log(user);
    if (user) {
      req.user = user;
      next();
    }
  } catch (error) {
    // send unauthorized error
    res.status(401).send(error);
  }
};
const authorizeUserWithRefreshToken = async (req, res, next) => {
  try {
    const requestToken = req.headers.authorization.split(" ")[1];
    const user = decodeRefreshToken({ token: requestToken });
    console.log(user);
    if (user) {
      req.user = user;
      next();
    }
  } catch (error) {
    // send unauthorized error
    res.status(401).send(error);
  }
};
module.exports = {
  authorizeUserWithAccessToken,
  authorizeUserWithRefreshToken,
};
