const mongoose = require("mongoose");

const PollSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },   
    title: {
        type: String,
        required: true,
    },
    votingType:{
        type: String,
        required: true,
    },
    options:{
        type: [String],
        required: true,
        validate: [arrayLimit, '{PATH} exceeds the limit of 3']
    },
});

function arrayLimit(val) {
  return val.length <= 3;
}

const PollModel = mongoose.model("poll", PollSchema);
module.exports = PollModel;