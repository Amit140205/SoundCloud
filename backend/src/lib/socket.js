import {Server} from "socket.io"
import { Message } from "../models/message.model.js"
import { useId } from "react"

export const initializeSocket = (httpServer)=>{
    const io = new Server(httpServer,{
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    })

    const userSockets = new Map() // {userId: socketId}
    const userActivities = new Map() // {userId: activities}

    io.on("connection",(socket)=>{

        // during connection(or user is online)
        socket.on("user_connected",(userId)=>{
            userSockets.set(userId,socket.id)
            userActivities.set(userId,"Idle")

            // broadcast to all connected sockets that this user is just logged in 
            io.emit("user_connected",userId)

            socket.emit("users_online",Array.from(userSockets.keys()))

            io.emit("activities",Array.from(userActivities.entries()))
        })

        // user activity change
        socket.on("update_activity",({userId,activity})=>{
            // console.log(`userId: ${userId}, activity: ${activity}`)
            userActivities.set(userId,activity)
            io.emit("update_activity",{userId,activity})
        })

        // message send
        socket.on("send_message",async (data)=> {
            try {
                // console.log(data)
                const {senderId,receiverId,content} = data
                const message = await Message.create({
                    senderId,
                    receiverId,
                    content
                })

                // send to receiver in realtime when he/she is online
                const receiverSocketId = userSockets.get(receiverId)

                if(receiverSocketId){
                    io.to(receiverSocketId).emit("receive_message",message)
                }

                socket.emit("sent_message",message)
            } catch (error) {
                console.log("error message: ",error)
                socket.emit("error_message",error.message)
            }
        })

        // user disconnects
        socket.on("disconnect",()=>{
            let disconnectedUserId;
            for(const [userId,socketId] of userSockets.entries()){
                // find disconnected user
                if(socketId === socket.id){
                    disconnectedUserId = userId
                    userSockets.delete(userId)
                    userActivities.delete(userId)
                    break
                }
            }
            if(disconnectedUserId){
                io.emit("user_disconnected",disconnectedUserId)
            }
        })
    })
} 