import React, { useEffect, useRef } from 'react'
import { Card, CardContent } from '../../components/ui/card'
import { Loader } from 'lucide-react'
import { useUser } from '@clerk/clerk-react'
import { axiosInstance } from '../../lib/axios'
import { useNavigate } from 'react-router-dom'

function AuthCallBackPage() {

  const {isLoaded,user} = useUser()
  const navigate = useNavigate()

  // little optimisation => blocking react to twice invoke the useEffect() (results twice api call to create the user)
  const syncAttempted = useRef(false)

  // sync user with the database
  useEffect(()=>{
    const syncUser = async ()=>{
      try {
        if(!isLoaded || !user || syncAttempted.current) return
        console.log(user)
        // here => twice calling
        syncAttempted.current = true
        await axiosInstance.post("/auth/callback",{
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl
        })
        
      } catch (error) {
        console.log(`error in auth callback page : ${error}`)
      } finally {
        navigate("/")
      }
    }

    syncUser()
  },[isLoaded,user,navigate])

  return (
    <div className='h-screen w-full bg-black flex items-center justify-center'>
      <Card className="w-[90%] max-w-md bg-zinc-900 border-zinc-800">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <Loader className='animate-spin size-8 text-emerald-500'/>
          <h3 className='text-zinc-400 text-xl font-bold'>Logging you in</h3>
          <p className='text-zinc-400 text-sm'>Redirecting...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthCallBackPage