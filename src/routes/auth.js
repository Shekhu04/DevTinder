const express = require("express");
const {validateSignUpData} = require("../utils/validation")
const User = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

//SignUp API
authRouter.post("/signUp", async (req,res) => {
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
authRouter.post("/login", async (req,res) => {
    try{
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user) {
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid) {

            //Create a JWT token
            const token = await user.getJWT();

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

module.exports = authRouter;