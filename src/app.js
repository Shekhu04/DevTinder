const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signUp", async (req,res) => {
    //Creating a new instance of User model

    const user = new User({
        firstName: "Shikhar",
        lastName: "Gupta",
        emailId: "shikhar@gupta.com",
        password:"shikhar@123",
    })
    
    try{
        await user.save();
        res.send("User Added Successfully");
    } catch(err) {
        res.status(400).send("Error saving the user:" + err.message);
    }
    
});

connectDB()
   .then(() => {
    console.log("Database connection established...");
    app.listen(3000, ()=> {
        console.log("server started on port 3000");
    });
   })
   .catch((err) => {
       console.error("Database cannot be connected!!");
   });



