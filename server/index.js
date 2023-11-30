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
  secret: '6dcd4ce23d88e2ee95838f73b7740a205c2c34e6a5177a8e8ebea7a4eae4bf25a6dcd4ce23d88e2ee95838f73b7740a205c2c34e6a5177a8e8ebea7a4eae4bf25',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const cors = require("cors");
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-ID'],
  credentials: true
}));

app.use(express.json());

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const config = require('./config');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return done(null, false, { message: 'Invalid password' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

app.use(passport.initialize());

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

app.get("/getUser/:id", (req, res) => {
  UserModel.findById(req.params.id)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

app.post('/createUser', async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({ email, password: hashedPassword });
  await newUser.save();

  res.json({ user: newUser });
});

app.post("/login", passport.authenticate('local', { session: false }), async (req, res) => {
  try {
    const user = req.user;
    const token = jwt.sign({ id: user._id }, '6dcd4ce23d88e2ee95838f73b7740a205c2c34e6a5177a8e8ebea7a4eae4bf25a6dcd4ce23d88e2ee95838f73b7740a205c2c34e6a5177a8e8ebea7a4eae4bf25', { expiresIn: '1h' });
  
    user.sessionId = token;
    await user.save();
  
    res.json({ token, user });
  } catch (err) {
    console.error('Error in /login:', err);
    res.status(500).json({ message: err.message });
  }
});


const authenticateUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token.' });
    }
    req.userId = decoded.id;
    next();
  });
};

app.post("/createPoll", authenticateUser, async (req, res) => {
  const { userId, title, votingType, options } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required.' });
  }

  const transformedOptions = options.map(option => option.text);

  const newPoll = new PollModel({
    userId,
    title,
    votingType,
    options: transformedOptions,
  });

  try {
    await newPoll.save();
    res.json(newPoll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const authenticatePoll = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token.' });
    }
    req.pollId = decoded.pollId;
    next();
  });
};

app.delete("/deletePoll", authenticatePoll, async (req, res) => {
  const { userId, pollId } = req.body;

  if (!userId || !pollId) {
    return res.status(400).json({ message: 'userId and pollId are required.' });
  }

  try {
    const poll = await PollModel.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found.' });
    }

    if (poll.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this poll.' });
    }

    await PollModel.findByIdAndDelete(pollId);
    res.json({ message: 'Poll deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
