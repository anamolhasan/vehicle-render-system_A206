import express from 'express'
import initDB from './config/db.js'
import { userRouter } from './modules/users/user.route.js'


const app = express()
app.use(express.json())


initDB()

// all api
app.use('/api/v1/users', userRouter)




app.get('/', (req, res) => {
    res.send('<h1>Welcome vehicle-rental-system server</h1>')
})

app.use((req, res) => {
    res.status(404).json({
        success:false,
        message:'Route not found',
        path:req.path
    })
})

export default app