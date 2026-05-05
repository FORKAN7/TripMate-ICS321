import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
    name: String,
    city: String,
    description: String,
    image: String,
    category: String,
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    }
});

const Place = mongoose.model("Place", placeSchema);
export default Place;