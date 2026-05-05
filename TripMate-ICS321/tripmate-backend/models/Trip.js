import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: {
        type: String,
        default: "Member",
    },
    id: Number,
});

const daySchema = new mongoose.Schema({
    dayNumber: Number,
    places: [
        {
            name: String,
            category: String,
            city: String,
            image: String,
        },
    ],
});

const tripSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    destination: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
        min: 1,
        max: 12,
    },
    itinerary: {
        type: mongoose.Schema.Types.Mixed, // يقبل أي شكل
        default: {}
    },
    members: [memberSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Trip = mongoose.model("Trip", tripSchema);
export default Trip;