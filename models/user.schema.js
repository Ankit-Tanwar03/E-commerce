import mongoose from "mongoose";
import authRoles from "../utils/authRoles";

const userSchema = new mongoose.Schema(
    {
    name:{
        type: String,
        required: [true, "Name is required"],
        maxLength: [50, "Name must be less than 50 characters"]
    },

    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true
    },

    password:{
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be atleast 8 characters"],
        select: false
    },

    role:{
        type: String,
        enum: Object.values(authRoles),
        default: authRoles.USER
    },

    forgotPasswordToken: String,
    forgotPasswordExpiry: Date
    },
    {
        timestamps: true
    }
)

//password encryption
userSchema.pre("save", async function (next){
    if(!this.modified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next();
})

export default mongoose.model("User", userSchema)