import User from '../models/user.schema'
import customError from '../utils/customError'
import asyncHandler from '../services/asyncHandler'
import cookieOptions from '../utils/cookieOptions'

/*
@SIGNUP 
@route http://localhost:4000/api/auth/signup
@description - User signup controller for creating new user
@parameters - name, email, password, role
@return User Object
*/

export const signUp = asyncHandler( async (req, res) => {
    const {name, email, password} = req.body                         //grabbing values from body

    if(!(name || email || password)){                                //validating all the fields
        throw new customError("All fields are required", 400)
    }

    const existingUser = await User.findOne({email})                 //checking if user alreday exists

    if(existingUser){
        throw new customError("User already exits", 400)
    }
    
    const user = await User.create({                                 //user created with the help of userSchema.pre("save", async function (next) in model 
        name,
        email,
        password
    })

    const token = user.getJwtToken()                                // token generated with the help of getJwtToken: function() in model
    console.log(user);
    user.password = undefined                                       //making it undefined as a precaution. It is already select false in the model

    res.cookie("token", token, cookieOptions)                       //storing token in cookie

    res.status(200).json({                                          //sending response back with status
        success: true,
        token,
        user
    })
})