const mongoose = require("mongoose");

const PollSchema = new mongoose.Schema({   
    tile: {
        type: String,
        required: true,
    },
    votingType:{
        type: String,
        required: true,
    },
    option1:{
        type: String,
        required: true,
    },
    option2:{
        type: String,
        required: true,
    },
    option3:{
        type: String,
        required: true,
    },
});

const PollModel = mongoose.model("poll", PollSchema);
module.exports = PollModel;