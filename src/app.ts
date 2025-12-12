import express from 'express'


const app = express()
app.use(express.json())


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