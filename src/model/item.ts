import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: false, default: null },
    remark: { type: String, required: false, default: null },
});

export default mongoose.model("Item", itemSchema);