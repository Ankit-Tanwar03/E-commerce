import User from '../models/user.schema'
import customError from '../utils/customError'
import asyncHandler from '../services/asyncHandler'
import cookieOptions from '../utils/cookieOptions'
import mailHelper from '../utils/mailHelper'
import crypto from 'crypto'
import { isLoggedIn } from '../middleware/auth.middleware'
import { compileFunction } from 'vm'

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
        res.cookie("token", token, cookieOptions)
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

/*
@FORGOT_PASSWORD
@route http://localhost:4000/api/auth/password/forgot
@description - User will submit an email and we will generate a token
@parameters - email
@return success message - email sent
*/

export const forgotPassword = asyncHandler( async (req, res) => {
    const {email} = req.body

    if (!email){
        throw new customError("Please enetr your email", 400)
    }

    const user = await findOne({email})
    if(!user){
        throw new customError("User doesn't exist", 400)
    }

    const resetToken = user.generateForgotPasswordToken()

    await user.save({validateBeforeSave: false})

    const resetUrl = 
    `${req.protocol}://${req.get("host")}/api/auth/password/reset/${resetToken}`


    const text = `Your password reset url is
    \n\n ${resetUrl}\n\n`

    try {
        await mailHelper({
            email: user.email,
            subject: "Password reset email for website",
            text:text,
        })
        res.status(200).json({
            success: true,
            message: `Email send to ${user.email}`
        })
    } catch (err) {
        //roll back - clear fields and save
        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined

        await user.save({validateBeforeSave: false})

        throw new customError(err.message || 'Email sent failure', 500)
    }

})

/*
@RESET_PASSWORD
@route http://localhost:4000/api/auth/password/reset/:resetToken
@description - User will be able to reset password based on url token
@parameters - token from url, password and confirmPassword
@return User Object
*/

export const resetPassword = asyncHandler ( async (req, res) => {
    const {resetToken, password, confirmPassword} = req.params || req.body

    const resetPasswordToken = crypto
    .createHash('SHA256')
    .update(resetToken)
    .digest('hex')

    const user = await User.findOne({
        forgotPasswordToken: resetPasswordToken,
        forgotPasswordExpiry: {$gt: Date.now()}
    })

    if(!user){
        throw new customError ("Password link expired", 400)
    }

    if(!password !== confirmPassword){
        throw new customError ("Password doesn't match", 400)
    }

    user.password = password
    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined

    await user.save()

    const token = user.getJwtToken()
    user.password= undefined
    res.cookie("token", token, cookieOptions)
    res.status(200).json({
        success: true,
        token,
        user
    })

})

/*
@CHANGE_PASSWORD
@route http://localhost:4000/api/auth/changepassword
@description - match the passowrd in the database and allow user to exxnter new password
@parameters - password, new_password
@return User Object
*/

export const changePassword = asyncHandler (isLoggedIn, async(req,res) => {
    const {password, newPassword} = req.body
    const {user} = req

    if(!(password||newPassword)){
        throw new customError("All fields are required to change password", 400)
    }

    const isPasswordMatched = comparePassword(password)

    if(isPasswordMatched){
        user.password = newPassword

        await user.save()
        user.password = undefined

        res.status(200).json({
            success: true,
            message: "password changed successfully",
            user
        })

        throw new customError("Entered Password is incorrect", 400)
    }
})

/*
@GET_PROFILE
@route http://localhost:4000/api/auth/profile
@description - check for token and populate user.token
@parameters - name, email, password 
@return User Object
*/

export const getProfile = asyncHandler (async (req,res) => {
    const {user} = req 

    if(!user) {
        throw customError("User not found", 400)
    }

    res.status(200).json({
        success: true,
        token,
        user
    })
})