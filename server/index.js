require('dotenv').config();
const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const mongoose = require("mongoose");
const User = require("./models/Users");
const PollModel = require("./models/Polls");

const cors = require("cors");
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-ID']
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

    res.json(user);
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, 'your_secret_key', { expiresIn: '1h' });

        res.json({ token, user });
    } catch (err) {
        console.error('Error in /login:', err);
        res.status(500).json({ message: err.message });
    }
});

app.post("/createPoll", async (req, res) => {
    try {
        console.log(req.headers['x-session-id']);
      const user = await User.findOne({ sessionId: req.headers['x-session-id'] });
  
      if (!user) {
        res.status(401).json({ error: 'Invalid session ID' });
        return;
      }
  
      const poll = new Poll({
        ...req.body,
        userId: user._id, 
      });
  

      await poll.save();
  
      res.json(poll);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create poll' });
    }
  });


app.listen(3001, () => {
  console.log("SERVER RUNS PERFECTLY!");
});