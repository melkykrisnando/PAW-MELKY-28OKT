const { default: mongoose } = require("mongoose");
const { lowercase } = require("zod");

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,

        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            select: false
        }
    },
    {
        timestamps : true
    },
);

const UserModel = mongoose.model("users", schema)
export default UserModel