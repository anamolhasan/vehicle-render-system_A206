import { Request, Response } from "express";
import { bookingService } from "./booking.service.js";
import { role } from "../../utils/role.js";




const createBooking = async (req:Request, res:Response) => {
    try {
        const result = await bookingService.createBooking(req.body)

        res.status(201).json({
            success:true,
            message:'Booking created successfully',
            data:result
        })
    } catch (error:any) {
        res.status(404).json({
            success:false,
            message:error.message
        })
    }
}


const getAllBooking =  async (req:Request, res:Response) => {
    try {
        const result = await bookingService.getAllBooking(req.users)

        res.status(200).json({
            success:true,
            message:
               req.users?.role === role.admin 
               ? 'Booking retrieved successfully'
               : 'Your booking retrieved successfully',
            data: result
        })
    } catch (error:any) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}


// --------
const updateBooking = async (req:Request, res:Response) => {
    try {
        const bookingId = req.params.id;
        const user = req.users
        const result = await bookingService.updateBooking(
            bookingId as string,
            req.body,
            user
        )

        res.status(200).json({
            success:true,
            message:
                 result.status === 'cancelled'
                ? "Booking cancelled successfully"
                : "Booking marked as returned. vehicle is nw available",
            data:result
        })
    } catch (error:any) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

// ========= 
const autoReturnBooking = async (req:any, res:any) => {
    try{
        const updatedBooking = await bookingService.autoReturnBooking()
        
        return res.status(200).json({
            success:true,
            message:'Auto-return process completed',
            updatedBooking,
        })
    }catch (error:any) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Something went wong'
        })
    }
}

export const bookingController = {
    createBooking,
    getAllBooking,
    updateBooking,
    autoReturnBooking,
}