import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["Member", "Admin"],
        default: "Member",
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
    photos: {
    type: [String],
    default: [],
},
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;