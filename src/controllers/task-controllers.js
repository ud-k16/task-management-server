const express = require("express");
const {
  addTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../services/task-services");

const taskRouter = express.Router();
// add task to collection
taskRouter.post("/", async (req, res) => {
  try {
    const data = req.body;
    console.log("add task to db ", data);
    const response = await addTask(data);
    if (response) {
      res.send({
        status: true,
        data: response,
        message: "task added",
      });
    } else throw new Error("adding task failed");
  } catch (error) {
    res.send({
      status: false,
      message: error.message,
    });
  }
});
// gets all task in collection returns
taskRouter.get("/", async (req, res) => {
  try {
    const response = await getTasks();
    if (response) {
      res.send({
        status: true,
        data: response,
        message: "task fetched",
      });
    } else throw new Error("fetching task failed");
  } catch (error) {
    res.send({
      status: false,
      message: error.message,
    });
  }
});
// gets single task
taskRouter.get("/:id", async (req, res) => {
  console.log("get request for task  ", req.params.id);
  try {
    const response = await getTaskById(req.params.id);
    if (response) {
      res.send({
        status: true,
        data: response,
        message: "task fetched by id successful",
      });
    } else throw new Error("fetch task failed");
  } catch (error) {
    res.send({
      status: false,
      message: error.message,
    });
  }
});
// update single task
taskRouter.put("/:id", async (req, res) => {
  console.log("update request for task id ", req.params.id);
  console.log("update request data  ", req.body);
  try {
    const response = await updateTask({ id: req.params.id, data: req.body });
    if (response) {
      res.send({
        status: true,
        data: response,
        message: "task update by id successful",
      });
    } else throw new Error("update task failed");
  } catch (error) {
    res.send({
      status: false,
      message: error.message,
    });
  }
});
// delete single task
taskRouter.delete("/:id", async (req, res) => {
  console.log("delete request for task  ", req.params.id);
  try {
    const response = await deleteTask(req.params.id);
    if (response) {
      res.send({
        status: true,
        data: response,
        message: "task delete by id successful",
      });
    } else throw new Error("delete task failed");
  } catch (error) {
    res.send({
      status: false,
      message: error.message,
    });
  }
});

module.exports = taskRouter;
