const express = require("express");
const auth = require("../middleware/auth");
const Task = require("../models/Task");
const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  if (req.query.completed) {
    match.completed = req.query.completed;
  }

  const sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parseInt(parts[1]);
  }

  const user = await req.user.populate({
    path: "tasks",
    match,
    options: {
      limit: parseInt(req.query.limit),
      skip: parseInt(req.query.skip),
      sort,
    },
  });

  if (!user) {
    res.status(500).send();
  }
  res.send(user.tasks);
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const task = await Task.findOne({ _id, owner: req.user._id });
  if (!task) {
    res.status(404).send();
  }
  res.send(task);
});
router.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const allowedUpdates = ["name", "completed"];
  const updates = Object.keys(req.body);
  const isValid = updates.every((update) => {
    return !!allowedUpdates.find((allowedUpdate) => allowedUpdate === update);
  });
  if (!isValid) {
    return res.status(400).send({ error: "invalid updates" });
  }
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      res.status(404).send();
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    task.save();
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});
router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
  if (!task) {
    return res.status(404).send();
  }
  return res.send(task);
});

module.exports = router;