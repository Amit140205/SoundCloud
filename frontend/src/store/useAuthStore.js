import { create } from "zustand"
import { axiosInstance } from "../lib/axios"

export const useAuthStore  = create((set)=>({
    isAdmin: false,
    isLoading: false,
    error: null,

    checkAdminStatus: async()=>{
        set({
            isLoading: true,
            error: null
        })
        try {
            const response = await axiosInstance.get("/admin/check")
            set({
                isAdmin: response.data.admin
            })
        } catch (error) {
            set({
                isAdmin: false,
                error: error.response.data.message
            })
        } finally {
            set({
                isLoading: false
            })
        }
    },

    reset: async()=>{
        set({
            isAdmin: false,
            isLoading: false,
            error: null
        })
    }
}))