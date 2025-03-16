const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { MongoDBClient } = require("../db");
//encrypts the user password to store in db
const encryptUserPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};
// checks if the user password and their respective hashed password from db matches
const decryptUserPassword = async ({ password, hashedPassword }) => {
  try {
    const isValidPassword = await bcrypt.compare(password, hashedPassword);
    return isValidPassword;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
// generater function of Refresh token ,which is used to generate new access token
const generateRefreshToken = (data) => {
  // data is an object of user data that is to be used in user token generation
  // ex. data = {email,userName}
  try {
    // creates token synchronously for the given user data
    const tokenGenerated = jwt.sign(
      {
        email: data.email,
        name: data.name,
      },
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "1h" }
    );
    return tokenGenerated;
  } catch (error) {
    console.log("generatorRefreshToken", error);
    throw new Error("TOKEN_GENERATION_ERROR");
  }
};
// generater function of user token this is used to authorize user to access services offered in server
const generateAccessToken = (data) => {
  // data is an object of user data that is to be used in user token generation
  // ex. data = {email,userName}
  try {
    // creates token synchronously for the given user data
    const tokenGenerated = jwt.sign(
      {
        email: data.email,
        name: data.name,
      },
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "15m" }
    );
    return tokenGenerated;
  } catch (error) {
    console.log("generateUserToken", error);
    throw new Error("TOKEN_GENERATION_ERROR");
  }
};
// takes token from user and verify its authenticity by giving the decoded user data from it
const decodeRefreshToken = ({ token }) => {
  try {
    const decodeToken = jwt.verify(
      token,
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY
    );
    return decodeToken;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
// takes token from user and verify its authenticity by giving the decoded user data from it
const decodeAccessToken = ({ token }) => {
  try {
    const decodeToken = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY
    );
    return decodeToken;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
// insert new user into db {email,password,name}
const addUser = async (data) => {
  try {
    if (MongoDBClient) {
      const database = MongoDBClient.db("taskmanager");
      const collection = database.collection("users");
      const user = await collection.findOne({ email: data.email });
      if (user) {
        throw new Error("USER_EXISTS");
        return;
      }
      // encrypt password before storing to db
      const encryptedPassword = await encryptUserPassword(data.password);
      const result = await collection.insertOne({
        ...data,
        password: encryptedPassword,
      });
      console.log(JSON.stringify(result, null, 4));
      return result;
    } else {
      console.log("DB_CONNECTION_ERROR");
      throw new Error("DB_CONNECTION_ERROR");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
// loggin user {email,password}
const loginUser = async (data) => {
  try {
    if (MongoDBClient) {
      const database = MongoDBClient.db("taskmanager");
      const collection = database.collection("users");
      const document = await collection.findOne({ email: data.email });
      // if user mail exists in db proceed to check password else through user not found error
      if (document) {
        // if password match with passwordin db then proceed to create authorization token for user
        // else through error password mismatch
        const isPasswordMatch = await decryptUserPassword({
          password: data.password,
          hashedPassword: document.password,
        });
        if (isPasswordMatch) {
          const accessToken = generateAccessToken({
            name: document.name,
            email: document.email,
          });
          const refreshToken = generateRefreshToken({
            name: document.name,
            email: document.email,
          });
          // data to be stored in refreshtoken collection
          const refreshTokenData = {
            token: refreshToken,
            userId: document.email,
          };
          await addRefreshTokenToDatabase(refreshTokenData);
          return { accessToken, refreshToken, user: document };
        } else throw new Error("PASSWORD_ERROR");
      } else throw new Error("USER_NOT_FOUND_ERROR");
    } else {
      throw new Error("DB_ERROR");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
// add refresh token to db
const addRefreshTokenToDatabase = async (data) => {
  // data {userId,token}
  try {
    if (MongoDBClient) {
      const database = MongoDBClient.db("taskmanager");
      const collection = database.collection("refreshtokens");
      const document = await collection.findOne({ userId: data.userId });
      let dbResponse;
      if (document) {
        dbResponse = await collection.updateOne(
          { userId: data.userId },
          { $set: { token: data.token } }
        );
      } else dbResponse = await collection.insertOne(data);
      return dbResponse;
    }
  } catch (error) {
    throw error;
  }
};

const deleteUserToken = async (email) => {
  try {
    if (MongoDBClient) {
      const database = MongoDBClient.db("taskmanager");
      const collection = database.collection("refreshTokens");
      const dbResponse = await collection.deleteOne({ userId: email });
      return dbResponse;
    } else {
      throw new Error("DB_ERROR");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
module.exports = {
  decodeAccessToken,
  decodeRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  addUser,
  loginUser,
  encryptUserPassword,
  decryptUserPassword,
  deleteUserToken,
};
