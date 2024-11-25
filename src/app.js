const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signUp", async (req,res) => {
    //Creating a new instance of User model
    const user = new User(req.body); 
    try{
        await user.save();
        res.send("User Added Successfully");
    } catch(err) {
        res.status(400).send("Error saving the user:" + err.message);
    }
});

//Get user by email
app.get("/user", async(req,res) => {
    const userEmail = req.body.emailId;

    try{
        const users = await User.findOne({emailId : userEmail});
        if(!users) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch (err){
        res.status(400).send("Something went wrong");
    }
});

//Feed Api - GET/feed  - get all the users from the database
app.get("/feed", async (req,res) => {
    try{
        const users = await User.find({});
        res.send(users);

    } catch (err){
        res.status(400).send("Something went wrong");
    }
})

//Delete user API
app.delete("/user", async (req,res) => {
    const userId = req.body.userId;
    try{
       const user = await User.findByIdAndDelete(userId);
       res.send("User deleted successfully")
    } catch (err){
        res.status(400).send("Something went wrong");
    }
})

//Update data of the user
app.patch("/user", async (req,res) => {
    const userId = req.body.userId;
    const data = req.body;

    try{
        await User.findByIdAndUpdate({_id: userId},data,{ 
            returnDocument:"after",
        });
        res.send("User updated successfully")
    } 
     catch (err){
        res.status(400).send("Something went wrong");
    }
})

connectDB()
   .then(() => {
    console.log("Database connection established...");
    app.listen(3000, ()=> {
        console.log("server started on port 3000");
    });
   })
   .catch((err) => {
       console.error("Database cannot be connected!!"+ err.message);
   });



