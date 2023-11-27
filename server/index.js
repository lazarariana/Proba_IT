require('dotenv').config();
const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const mongoose = require("mongoose");
const UserModel = require("./models/Users");
const PollModel = require("./models/Polls");
const session = require('express-session');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if your using https
}));

const cors = require("cors");
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-ID'],
  credentials: true
}));

app.use(express.json());

mongoose.connect(
  "mongodb+srv://ariana:AqEvToNGkkrC3aoi@cluster0.hu0cvuj.mongodb.net/proba?retryWrites=true&w=majority"
);

app.get("/getUsers", (req, res) => {
  UserModel.find({})
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.json(err.response.data);
    });
})

app.post("/createUser", async (req, res) => {
  const user = req.body;
  const newUser = new UserModel(user);
  await newUser.save();

  req.session.userId = newUser._id;

  res.json(user);
});

app.post("/login", async (req, res) => {

  try {
    const { email, password } = req.body;

    // Fetch the user from the database
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, '6dcd4ce23d88e2ee95838f73b7740a205c2c34e6a5177a8e8ebea7a4eae4bf25a6dcd4ce23d88e2ee95838f73b7740a205c2c34e6a5177a8e8ebea7a4eae4bf25', { expiresIn: '1h' });
  
    user.sessionId = token;
    await user.save();
  
    res.json({ token, user });
  } catch (err) {
    console.error('Error in /login:', err);
    res.status(500).json({ message: err.message });
  }
});

app.post("/createPoll", async (req, res) => { 
  try {
    const poll = new PollModel({
      ...req.body,
    });

    await poll.save();

    res.json(poll);
    console.log(poll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create poll' });
  }
});

app.get("/getPolls", (req, res) => {
  PollModel.find({})
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.json(err.response.data);
    });
});

app.listen(3001, () => {
  console.log("SERVER RUNS PERFECTLY!");
});
