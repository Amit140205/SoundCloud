import React, { useEffect, useState } from 'react'
import {useAuth} from "@clerk/clerk-react"
import { axiosInstance } from '../lib/axios'
import {Loader} from "lucide-react"
import { useAuthStore } from '../store/useAuthStore'
import { useUserStore } from '../store/useUserStore'

const updateApiToken = (token)=>{
    if(token){
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }else{
        delete axiosInstance.defaults.headers.common["Authorization"]
    }
}

function AuthProvider({children}) {
    const {getToken,userId} = useAuth()
    const [loading,setLoading] = useState(true)
    const {checkAdminStatus} = useAuthStore()
    const {initSocket,disconnectSocket} = useUserStore()

    useEffect(()=>{
        const initAuth = async ()=>{
            try {
                const token = await getToken()
                updateApiToken(token)

                // todo
                // check 1. user is authenticated or not
                // check 2. user is admin or not

                if(token){
                    await checkAdminStatus()

                    // socket connection
                    if(userId) initSocket(userId)
                }


            } catch (error) {
                updateApiToken(null)
                console.log(`error in auth provider : ${error}`)
            }finally{
                setLoading(false)
            }
        }

        initAuth()

        // clean up
        return ()=> disconnectSocket()
    },[getToken,userId,disconnectSocket,initSocket,checkAdminStatus])

    if(loading){
        return (
            <>
                <div className='h-screen w-full flex items-center justify-center'>
                    <Loader className="size-8 animate-spin text-emerald-500"/>
                </div>
            </>
        )
    }else{
        return (
            <div>{children}</div>
        )
    }
}

export default AuthProvider