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

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);