import User from '../models/user.schema'
import customError from '../utils/customError'
import asyncHandler from '../services/asyncHandler'
import cookieOptions from '../utils/cookieOptions'

/*
@SIGNUP 
@route http://localhost:4000/api/auth/signup
@description - User signup controller for creating new user
@parameters - name, email, password
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

/*
@LOGIN
@route http://localhost:4000/api/auth/login
@description - Allowing user to login with email and password
@parameters - email, password
@return User Object
*/

export const logIn = asyncHandler( async (req, res) => {
    const {email, password} = req.body                                  //grabbing values from body

    if(!(email || password)){                                           //validating all the fields
        throw new customError("All fields are required", 400)
    }

    const user = await User.findOne({email}).select("+password")        //password select is false in model, but we need it to match password

    if(!user){
        throw new customError("Invalid credentials", 400)               //quering db is user exists
    }


    const isPasswordMatched = user.comparePassword(password)            //comparing  password with the help of comparePassword in model

    if (isPasswordMatched){                                             //sending response if password matches
        const token = user.getJwtToken()
        user.password= undefined
        const cookie = res.cookie("token", token, cookieOptions)
        res.status(200).json({
            success: true,
            token,
            user
        })

        throw new customError("Invalid credentials", 400)               //throwing error if password doesn't match
    }



})

/*
@LOGOUT
@route http://localhost:4000/api/auth/logout
@description - Allowing user to logout by clearing user cookies
@parameters - none
@return success message
*/

export const logOut = asyncHandler( async (_req, res) => {      //_req is a good coding practise, tells we are not using req anywhere
    res.cookie("token", null, {                                 // clearing cookie, also can use clearCookie() method
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({                                      //sending success response
        success: true,
        message: "Logged Out"
    })
})