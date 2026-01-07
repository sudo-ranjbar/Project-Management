import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import express from 'express'
import mongoose from 'mongoose'

import routes from './routes/index.js'
dotenv.config()

const app = express()
app.use(cors({
    origin: process.env.FRONTEND_HOST_NAME,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(morgan("dev"))
app.use(express.json())

// db connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('DB connected successfully'))
    .catch((err) => console.log('Connection failed: ', err))

const PORT = process.env.PORT || 4000

app.get("/", async (req, res) => {
    res.status(200).json({
        message: "welcome to api"
    })
})

app.use("/api/v1", routes)

// error middleware
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({
        message: "Internal server error"
    })
})

// not found middleware
app.use((req, res, err) => {
    console.log(err)
    res.status(404).json({
        message: "Not found"
    })
})

app.listen(PORT, () => { console.log(`app is running on port ${PORT}`) })