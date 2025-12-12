import { Request, Response } from "express";
import { authService } from "./auth.service.js";



const signup = async (req:Request, res:Response) => {
    try {
        const result = await authService.signup(req.body);
        res.status(201).json({
            success:true,
            message:'User registered successfully',
            data:result
        })
    } catch (error:any) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}


// ===========
const signin = async (req:Request, res:Response) => {
    try {
        const {email, password} = req.body
        const result = await authService.signIn(email, password)

        res.status(200).json({
            success:true,
            message:"Login successfully",
            data:result,
        })
    } catch (error:any) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

export const authController = {
    signin,
    signup
}