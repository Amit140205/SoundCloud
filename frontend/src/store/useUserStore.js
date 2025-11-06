import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { io } from "socket.io-client"

const baseUrl = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/"
const socket = io(
    baseUrl,
    { 
        autoConnect: false, //connect only when the user is authenticated 
        withCredentials: true
    }
)

export const useUserStore = create((set,get) => ({
  users: [],
  isLoading: false,
  error: null,
  socket: socket,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  messages: [],
  selectedUser: null,

  setSelectedUser: (user)=>(
    set({selectedUser : user})
  ),

  // socket connection
  initSocket: (userId) => {
    if(!get().isConnected){
        // auth
        socket.auth = {userId}
        socket.connect()
        socket.emit("user_connected",userId)

        socket.on("users_online",(users)=>{
            // console.log(users)
            set({onlineUsers: new Set(users)})
        })

        socket.on("activities",(activities)=>{
            set({userActivities: new Map(activities)})
        })

        socket.on("user_connected",(userId)=>{
            set((state)=>({
                onlineUsers: new Set([...state.onlineUsers,userId])
            }))
        })

        socket.on("user_disconnected",(userId)=>{
            set((state)=>{
                const newOnlineUsers = new Set(state.onlineUsers)
                newOnlineUsers.delete(userId)
                return {onlineUsers: newOnlineUsers}
            })
        })

        socket.on("receive_message",(message)=>{
            set((state)=>(
                {messages:[...state.messages,message]}
            ))
        })

        socket.on("sent_message",(message)=>{
            set((state)=>(
                {messages:[...state.messages,message]}
            ))
        })

        socket.on("update_activity",({userId,activity})=>{
            set((state)=>{
                const newActivities = new Map(state.userActivities)
                newActivities.set(userId,activity)
                return {userActivities: newActivities}
            })
        })

        set({isConnected: true})
    }
  },

  disconnectSocket: () => {
    if(get().isConnected){
        socket.disconnect()
        set({isConnected: false})
    }
  },

  sendMessage: (senderId,receiverId,content) => {
    const socket = get().socket
    // console.log(socket)
    if(!socket) return 

    socket.emit("send_message",{senderId,receiverId,content})
  },

  fetchMessages: async (userId)=>{
    set({
        isLoading: true, 
        error:null
    })
    try {
        const response = await axiosInstance.get(`/users/messages/${userId}`)
        // console.log(response)
        set({messages: response.data})
    } catch (error) {
        set({
            error: error.response.data.message
        })
    } finally {
        set({
            isLoading: false
        })
    }
  },

  fetchUsers: async () => {
    set({
      isLoading: true,
      error: null,
    });
    try {
      const response = await axiosInstance.get("/users");
      set({
        users: response.data,
      });
    } catch (error) {
      set({
        error: error.response.data.message,
      });
    } finally {
      set({
        isLoading: false,
      });
    }
  },
}));
