const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth")

app.use(express.json());
app.use(cookieParser());

//SignUp API
app.post("/signUp", async (req,res) => {
    try{
        //Validation of data
        validateSignUpData(req);

    const {firstName,lastName,emailId,password} = req.body;

    //Encrypt password
    const passwordHash = await bcrypt.hash(password,10);

    //Creating a new instance of User model
    const user = new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash,
    }); 
   
        await user.save();
        res.send("User Added Successfully");
    } catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

//Login API
app.post("/login", async (req,res) => {
    try{
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user) {
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid) {

            //Create a JWT token
            const token = await jwt.sign({_id: user._id}, "DEV@Tinder", {expiresIn : "7d"});

            //Add the token to cookie and send the response back to the user
            res.cookie("token", token, {
                expires: new Date(Date.now()+ 8 * 3600000)
            }); 
            res.send("Login Successfull !!!")
        } else {
            throw new Error("Invalid Credentials");
        }

    }  catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

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

//Profile API
app.get("/profile", userAuth, async(req,res) => {
    try{
    const user = req.user;
    res.send(user);
   }
   catch(err) {
    res.status(400).send("ERROR : " + err.message);
}
});

app.post("/sendConnectionRequest", userAuth, async (req,res) => {
    const user = req.user;
    console.log("Sending a connection request");

    res.send(user.firstName + " sent the connection request")
})

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
app.patch("/user/:userId", async (req,res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try{
        const ALLOWED_UPDATES = [
             "photoUrl", "about", "gender","age", "skills"
        ]
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
         if(!isUpdateAllowed){
            throw new Error("Update not allowed");
         }
         if(data?.skills.length > 10){
            throw new Error("Skills cannot be more than 10");
         }
        const user = await User.findByIdAndUpdate({_id: userId},data,{ 
            returnDocument:"after",
            runValidators:true,
        });
        res.send("User updated successfully")
    } 
     catch (err){
        res.status(400).send("Something went wrong: " + err.message);
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



