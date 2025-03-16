const { ObjectId } = require("mongodb");
const { MongoDBClient } = require("../db");

const addTask = async (data) => {
  try {
    if (MongoDBClient) {
      const database = MongoDBClient.db("taskmanager");
      const collection = database.collection("tasks");
      const dbResponse = await collection.insertOne(data);
      if (dbResponse) {
        const cursor = collection.find({});
        const documents = await cursor.toArray();
        return documents;
      } else {
        throw new Error("DB_ERROR");
      }
    } else {
      throw new Error("DB_ERROR");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteTask = async (id) => {
  try {
    if (MongoDBClient) {
      const database = MongoDBClient.db("taskmanager");
      const collection = database.collection("tasks");
      const _id = ObjectId.createFromHexString(id);
      const dbResponse = await collection.deleteOne({ _id });
      if (dbResponse) {
        const cursor = collection.find({});
        const documents = await cursor.toArray();
        return documents;
      } else {
        throw new Error("DB_ERROR");
      }
    } else {
      throw new Error("DB_ERROR");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateTask = async ({ id, data }) => {
  // data {title:"",description:""}
  try {
    if (MongoDBClient) {
      const database = MongoDBClient.db("taskmanager");
      const collection = database.collection("tasks");
      console.log(typeof id);
      const _id = ObjectId.createFromHexString(id);
      const document = await collection.findOne({ _id });
      let dbResponse;
      if (document) {
        dbResponse = await collection.updateOne(
          { _id },
          { $set: { title: data.title, description: data.description } }
        );
      } else dbResponse = await collection.insertOne(data);

      // return task data after modify
      const cursor = collection.find({});
      const documents = await cursor.toArray();
      return documents;
    } else throw new Error("DB_CONNECTION_ERROR");
  } catch (error) {
    throw error;
  }
};

const getTaskById = async (id) => {
  try {
    if (MongoDBClient) {
      const database = MongoDBClient.db("taskmanager");
      const collection = database.collection("tasks");
      const _id = ObjectId.createFromHexString(id);
      const document = await collection.findOne({ _id });
      return document;
    } else throw new Error("DB_CONNECTION_ERROR");
  } catch (error) {
    throw error;
  }
};

const getTasks = async () => {
  try {
    if (MongoDBClient) {
      const database = MongoDBClient.db("taskmanager");
      const collection = database.collection("tasks");
      const cursor = collection.find({});
      const documents = await cursor.toArray();
      return documents;
    } else throw new Error("DB_CONNECTION_ERROR");
  } catch (error) {
    throw error;
  }
};
module.exports = {
  getTasks,
  getTaskById,
  addTask,
  deleteTask,
  updateTask,
};
