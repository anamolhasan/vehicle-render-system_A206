import { pool } from "../../config/db.js"


const getAllUser = async () => {
    const result = await pool.query(`
        SELECT * FROM users
        `)

        if (result.rows.length === 0) {
            throw new Error('Not User found')
        }

        const user = result.rows.map((item) => {
            const {password, ...rest} = item;
            return rest
        })

        return user
}


const updateUser = async (
    id:string,
    payload: Record<string, unknown>,
    loggedInUser:{id:string, role: string}
) => {
    const {name, email, phone, role} = payload;

    // =====
    if(loggedInUser.role === 'customer' && loggedInUser.id !== id){
        throw new Error("You are not allowed to update this user")
    }
    const safeRole = loggedInUser.role === 'admin' ? role : null;

    // ====

    const result = await pool.query(`
          UPDATE users
          SET 
          name = COALESCE($1, name),
          email = COALESCE($2, email),
          phone = COALESCE($3, phone),
          role = COALESCE($4, role)
          WHERE =  $5
          RETURNING *
        `,
        [name, email, phone, safeRole, id]
    )
    if(result.rows.length === 0){
        throw new Error('No user found')
    }
    const user = result.rows.map((item) => {
        const {password, ...rest} =item;
        return rest
    })
    return
}


// ============= DELETE USER
const deleteUser = async (id: string) => {
    // 1. Check if user exists
    const userCheck = await pool.query(`
        SELECT * FROM users WHERE id=$1
        `, [id]);
    
    if(!userCheck.rows.length){
        throw new Error('User not found')
    }

    // 2. Check active booking
    const activeBooking = await pool.query(`
        SELECT * FROM booking WHERE customer_id=$1 AND status='active'
        `, [id])

    if(activeBooking.rows.length){
        throw new Error('Cannot delete user with active booking')
    }

    // 3. Delete user
    const result = await pool.query(`
        DELETE FROM users WHERE id=$1 RETURNING *
        `,[id])
    return result.rows[0]
}

export const userService = {
    getAllUser,
    updateUser,
    deleteUser,
}