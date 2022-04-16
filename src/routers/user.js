const express = require("express");
const User = require("../models/User");
const router = new express.Router();
const bcryptjs = require("bcryptjs");
const auth = require("../middleware/auth");
const upload = require('../middleware/multer');
const sharp = require("sharp");
const { welcomeEmail, goodbyeEmail } = require("../emails/account");

// Creating resources API endpoints
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    welcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken();
    user.tokens.push({ token });
    await user.save();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send();
  }
  try {
    const userPassword = await bcryptjs.compare(
      req.body.password,
      user.password
    );
    if (!userPassword) {
      return res.status(400).send("Invalid Credentials!");
    }
    const token = await user.generateAuthToken();
    user.tokens.push({ token });
    await user.save();
    return res.send({ user, token });
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    const user = req.user;
    user.tokens = user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await user.save();
    res.send("Logged out");
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("Logged out");
  } catch (e) {
    res.status(500).send();
  }
});

// Reading resources API endpoints
router.get("/users/me", auth, async (req, res) => {
  if (!req.user) {
    res.status(500).send();
  }
  try {
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});
router.get("/users/:id", auth, async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    res.send(user);
  } catch (e) {
    res.status(404).send();
  }
});

// Updating resources API endpoints
router.patch("/users/me", auth, async (req, res) => {
  const allowedUpdates = ["name", "age", "password"];
  const updates = Object.keys(req.body);
  const isValid = updates.every((update) => {
    return !!allowedUpdates.find((allowedUpdate) => allowedUpdate === update);
  });
  if (!isValid) {
    return res.status(400).send({ error: "invalid updates" });
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Deleting resources API endpoints
router.delete("/users/me", auth, async(req, res) => {
  if(req.user)
  {
    await req.user.remove();
    goodbyeEmail(req.user.email, req.user.name)
    return res.send(req.user);
  }
  res.status(500).send();
});

// Uploading user's avatar image
router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res)=>{
  const buffer = await sharp(req.file.buffer).resize(200, 200).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.send()
}, (error, req, res, callback)=>{
  res.send({Error: error.message})
})

// Delete user profile image
router.delete('/users/me/avatar', auth, async(req, res)=>{
  req.user.avatar = null
  await req.user.save()
  res.send()
})

// Get user profile image
router.get('/users/:id/avatar', async(req, res)=>{
  try{
    const user = await User.findOne({_id: req.params.id})
    if(user && user.avatar)
    {
      res.setHeader('content-type', 'image/png')
      res.send(user.avatar)
    }
  }
  catch(e)
  {
    res.send(e)
  }
})

module.exports = router;
