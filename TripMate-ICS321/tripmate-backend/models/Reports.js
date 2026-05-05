import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    content: { type: String, required: true },
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", reportSchema);
export default Report;