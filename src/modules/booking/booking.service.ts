
import { pool } from "../../config/db.js"
import { role } from "../../utils/role.js"



const createBooking = async (payload:Record<string, unknown>) => {
    const {customer_id, vehicle_id, rent_start_date, rent_end_date} = payload

    try {
        if(!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
            throw new Error('All fields are required')
        }
        const vehicleDate = await pool.query(`
            SELECT * FROM vehicles WHERE id = $1
            `,[vehicle_id])

        if(!vehicleDate.rows.length){
            throw new Error('Vehicle not found')
        }

        if(vehicleDate.rows[0].availability_status === 'booked'){
            throw new Error('Vehicle is not available')
        }
        //  
        const dailyPrice = vehicleDate.rows[0].daily_rent_price;
        // 

        const startDate = new Date(String(rent_start_date))
        const endDate = new Date(String(rent_end_date))

        if(isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error('Invalid date format')
        }
        const totalTimeDate = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        )

        // -- check booking
        const bookingOver = await pool.query(`
            SELECT * FROM booking WHERE vehicle_id = $1
            AND status = 'active'
            AND rent_start_date < $3
            AND rent_end_date > $2
            `, [vehicle_id, rent_start_date, rent_end_date]
        )

        if(bookingOver.rows.length){
            throw new Error('Vehicle already booked in this time range')
        }

        const total_price = dailyPrice * totalTimeDate
        //  ---
        const result = await pool.query(`
            INSERT INTO booking (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
            VAlUES ($1, $2, $3, $4, $5, 'active')
            RETURNING *
            `, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
        )

        // --- update availability status
        await pool.query(`
            UPDATE vehicles
            SET availability_status = 'booked'
            WHERE id = $1
            RETURNING *
            `, [vehicle_id]
        )
        return {
            ...result.rows[0],
            vehicle:{
                vehicle_name:vehicleDate.rows[0].vehicle_name,
                daily_rent_price:dailyPrice
            }
        }

    } catch (error:any) {
        throw new Error(error.message)
    }
}


// ===== get all booking 
const getAllBooking = async(users:any) => {
    if(users.role === role.admin){
        const result = await pool.query(`
            SELECT b.* , u.name AS customer_name, u.email AS customer_email, v.vehicle_name, v.registration_number
            FROM booking b
            JOIN users u ON b.customer_id = u.id
            JOIN vehicles v ON b.vehicle_id  = v.id
            `)

        if(result.rows.length === 0){
            throw new Error('NO Booking found')
        }
        return result.rows.map((row) => {
            return {
                ...row,
                customer:{
                    name:row.customer_name,
                    email:row.customer_email
                },
                vehicle: {
                    vheicle_name: row.vehicle_name,
                    registration_number: row.registration_number,
                }
            }
        })
    }

    const result = await pool.query(`
        SELECT b.*, v.vehicle_name, v.registration_number, v.type 
        FROM booking b
        JOIN vehicles v ON b.vehicle_id = v.id 
        WHERE b.customer_id = $1
        `, [users.id]
    )
    if(result.rows.length === 0){
        throw new Error('No User found')
    }
    return result.rows.map((row) => {
        return {
            ...row,
            vehicle:{
                vehicle_name:row.vehicle_name,
                registration_number:row.registration_number,
            }
        }
    })
}


// == update booking  === 
const updateBooking = async (id:string, payload:any, user:any) => {
    const {status} = payload

    // load booking
    const bookingDate = await pool.query(`
        SELECT * FROM booking WHERE id = $1
        `, [id])

    if(!bookingDate.rows.length) throw new Error('Booking not found')
    
    const booking = bookingDate.rows[0]

    // ==== customer cancel 
    if(status === 'cancelled'){
        if(user.role !== role.customer){
            throw new Error('Only customer cancel booking')
        }

        // Rent শুরু হওয়ার তারিখ চলে গেলে আর booking cancel করা যাবে না
        if(new Date() >= new Date(booking.rent_start_date)){
            throw new Error('Cannot cancel after rent start date')
        }

        const updated = await pool.query(`
            UPDATE booking SET status = 'cancelled' WHERE id =$1 RETURNING *
            `, [id]
        )

        await pool.query(`
            UPDATE vehicles SET availability_status='available' WHERE id=$1
            `,[booking.vehicle_id]
        )

        return updated.rows[0]
    }
    throw new Error('Invalid status update')
}

// -  auto return booking

const autoReturnBooking = async () => {
    const today = new Date().toISOString().split('T')[0]

    const expired = await pool.query(`
        UPDATE booking SET status = 'returned'
        WHERE status = 'active' AND rent_end_date < $1
        RETURNING *
        `, [today]
    )

    for(const bk of expired.rows){
        await pool.query(`
            UPDATE vehicles SET availability_status = 'available' WHERE id = $1
            `, [bk.vehicle_id]
        )
    }
    return expired.rows
}

export const bookingService = {
    createBooking,
    getAllBooking,
    updateBooking,
    autoReturnBooking,
}
