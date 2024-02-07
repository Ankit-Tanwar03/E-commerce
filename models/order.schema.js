import mongoose from "mongoose";
import orderStatus from "../utils/orderStatus";

const orderSchema = new mongoose.Schema(
    {
        product:{
            type: [
                {
                    productId:{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Product",
                        required: true
                    },
                    count:{
                        type: Number
                    },
                    price:{
                        type: String
                    }
                }
            ], required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        phoneNumber: {
            type: Number,
            required: true,
            maxLength: [10, "Number cannot be greater than 10 digits"],
            minLength: [10, "Number cannot be less than 10 digits"]
        },
        address: {
            type: String,
            required: true
        },
        transactionId: {
            type: String
        },
        coupon: {
            type: String
        },
        status:{
            type: String,
            enum: Object.values(orderStatus),
            default: orderStatus.Ordered
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Order", orderSchema)