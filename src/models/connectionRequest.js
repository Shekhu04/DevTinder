const { createNextState } = require("@reduxjs/toolkit");
const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            require : true,
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
        },
        status: {
            type: String,
            required: true,
            enum : {
                values : ["ignore", "interested", "accepted", "rejected"],
                message: `{VALUE} is incorrect status type`,
            },
        },
    },
    {timestamps : true}
);

//Compound Indexing
connectionRequestSchema.index({ fromUserId : 1, toUserId : 1})

connectionRequestSchema.pre("save", function () {
    const connectionRequest = this;
    //Check if the fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself!!");
    }
    next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);