import express from "express"
import dotenv from "dotenv"
import connectDB from "./lib/db.js"
import {clerkMiddleware} from "@clerk/express"
import fileUpload from "express-fileupload"
import path from "path"

import userRoutes from "./routes/user.route.js"
import statRoutes from "./routes/stat.route.js"
import adminRoutes from "./routes/admin.route.js"
import authRoutes from "./routes/auth.route.js"
import songRoutes from "./routes/song.route.js"
import albumRoutes from "./routes/album.route.js"
import cors from "cors"
import { createServer } from "http"
import { initializeSocket } from "./lib/socket.js"
import cron from "node-cron"
import fs from "fs"

dotenv.config()

const app = express()
const PORT = process.env.PORT
const __dirname = path.resolve()

// sokcet config
const httpServer = createServer(app)
initializeSocket(httpServer)

app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
))
app.use(express.json())
app.use(clerkMiddleware()) //this will add auth to req obj => req.auth.userId
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : path.join(__dirname,"temp"),
    createParentPath : true,
    limits : {
        fileSize : 10*1024*1024 //10mb max
    }
}))

// cron-job
// deleting the temp files from the server after every 1 hour
const tempDir = path.join(process.cwd(),"temp")
cron.schedule("0 * * * *",()=>{
    if(fs.existsSync(tempDir)){
        fs.readdir(tempDir,(err,files)=>{
            if(err){
                console.log(`error in cron job ${err}`)
                return
            }
            for(const file of files){
                fs.unlink(path.join(tempDir,file),(err)=>{
                    if(err){
                        console.log(`error in cron job ${err}`)
                        return
                    }
                })
            }
        })
    }
})

app.use("/api/users",userRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/songs",songRoutes)
app.use("/api/stats",statRoutes)
app.use("/api/albums",albumRoutes)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
    app.get("/*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"../frontend/dist/index.html"))
    })
}

app.use((err,req,res,next)=>{
    return res.status(500).json({message : process.env.NODE_ENV === "production" ? "internal server error" : err.message})
})

httpServer.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
    connectDB()
})

// todo : socket io