const express = require("express");
const {userAuth} = require("../middlewares/auth")

const profileRouter = express.Router();
const {validateEditProfileData} = require("../utils/validation");

//Profile API
profileRouter.get("/profile/view", userAuth, async(req,res) => {
    try{
    const user = req.user; 
    res.send(user);
   }
   catch(err) {
    res.status(400).send("ERROR : " + err.message);
}
});

//Profile edit API
profileRouter.patch("/profile/edit", userAuth, async (req,res) => {
    try{
        if(!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;
        console.log(loggedInUser);

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        console.log(loggedInUser);

        await loggedInUser.save();

        res.send(`${loggedInUser.firstName}, your profile is updated successfully !!`);
    }
    catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

module.exports = profileRouter;