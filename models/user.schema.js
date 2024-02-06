import mongoose from "mongoose";
import authRoles from "../utils/authRoles";
import JWT  from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import config from "../config/index";

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
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next();
})

//adding more features directly into the schema
userSchema.methods = {
    //comparing passwords
    comparePassword: async function(enteredPassword){
        return await bcrypt.compare(enteredPassword, this.password)     //this.password is password from backend and enteredPaasword is password coming from frontend
    },

    //generating JWT
    getJwtToken: function(){
        return JWT.sign(
            {
                _id: this._id,
                role: this.role
            },
            config.JWT_SECRET,
            {
                expiresIn: config.JWT_EXPIRY
            }
            
            )
    },

    //forgot password
    generateForgotPasswordToken: function()
    {
        const forgotToken = crypto.randomBytes(20).toString('hex');

        //step-1 save to db
        this.forgotPasswordToken = crypto
        .createHash('SHA256')
        .update(forgotToken)
        .digest('hex')

        this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000

        //step-2 send to user
        return forgotToken
    }

}

export default mongoose.model("User", userSchema)