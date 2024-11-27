const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req,res,next) => {
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token is not valid !!");
        }

        const decodedObj = await jwt.verify(token, "DEV@Tinder");

        const{_id} = decodedObj;

        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }
        req.user = user;
        next();
    }
    catch(err){
        res.status(400).send("Error : " + err.message);
    }
};

module.exports = {
    userAuth
}

// Flow Summary
// Extract Token: Retrieves the token from req.cookies.
// Validate Token: Verifies the token's authenticity using jwt.verify().
// Find User: Extracts the _id from the token and queries the database for the user.
// Authorize Access: Calls next() if the user exists and the token is valid.
// Handle Errors: Sends an error response for invalid tokens or missing users.
// This middleware ensures that only authenticated users can access protected routes.