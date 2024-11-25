

const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://gshikhar819:Fj3eyCVZ5gmswUW8@namastenodejs.omrun.mongodb.net/?retryWrites=true&w=majority&appName=NamasteNodeJs"
    );
};

module.exports = connectDB;

