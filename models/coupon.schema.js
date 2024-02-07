import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            String,
            required: [true, "Please enter the coupon code"]
        },

        discount: {
            Number,
            default: 0
        },
    
        isActive: {
            Boolean,
            default: true
        },
    },
    {
        timestamps: true
    }
    
)

export default mongoose.model("Coupon", couponSchema)