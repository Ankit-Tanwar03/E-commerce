import mongoose, { Collection } from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a product name"],
            trim: true,
            maxLength: [120, "Product name should not be more than 120 characters"]
        }, 
        price: {
            type: Number,
            required: [true, "Please provide a product price"],
            maxLength: [5, "Product price should not be more than Rs. 99,999"]
        }, 
        description: {
            type: String,
            //Use some editor js package to add description - assignment
        }, 
        photos: [
            {
                secure_url: {
                    type: String,
                    required: true
                }
            }
        ],
        stock: {
            type: Number,
            default: 0
        },
        sold: {
            type: Number,
            default: 0
        },
        collectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection"
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Product", productSchema)