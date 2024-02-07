import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
    {
        name: {
                String,
                required: [true, "Please provide a category name"],
                trim: true,
                maxLength: [120, "Collection should not be more than 120 characters"]
            } 
    },

    {
        timestamps: true
    }
)

export default mongoose.Schema("Collection", collectionSchema)