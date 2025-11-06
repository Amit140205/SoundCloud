import React, { useEffect } from 'react'
import { useUserStore } from '../../store/useUserStore.js'
import {HeadphonesIcon, Music, User} from "lucide-react"
import {useUser} from "@clerk/clerk-react"
import { ScrollArea } from '../../components/ui/scroll-area.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar.jsx'

function FriendsActivity() {
    const {users,fetchUsers,onlineUsers,userActivities} = useUserStore()
    const {user} = useUser()

    // const isPlaying = true

    useEffect(()=>{
      if(user){
        fetchUsers()
      }
    },[fetchUsers,user,onlineUsers])

  return (
    <div className='h-full bg-zinc-900 rounded-t-lg flex flex-col'>
      <div className='flex justify-between items-center p-4  border-b border-zinc-800'>
        <div className='flex items-center gap-2'>
          <User className='size-5 shrink-0'/>
          <h2 className='font-semibold'>What they're listening to</h2>
        </div>
      </div>


      {!user && <LoginPrompt/>}
      
      <ScrollArea className="flex-1">
        <div className='p-4 space-y-4'>
          {users?.map((user)=>{ 
            const activity = userActivities.get(user.clerkId)
            // console.log(activity)
            const isPlaying = activity && activity !== "Idle"
            return (

            <div key={user._id}
              className='cursor-pointer hover:bg-zinc-800/50 p-3 rounded-md transition-colors group'
            >
              <div className='flex items-center gap-3'>

                <div className='relative'>
                  <Avatar className="size-10 border border-zinc-800">
                    <AvatarImage
                      src={user?.imageUrl}
                      alt={user?.fullName}
                    />
                    <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute h-3 w-3 bottom-0 right-0 rounded-full border-2 border-zinc-900
                   ${onlineUsers.has(user.clerkId) ? "bg-green-500" : "bg-zinc-500"}`} aria-hidden="true"/>
                </div>

                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2'>
                    <span className='font-medium text-sm text-white'>{user?.fullName}</span>
                    {isPlaying && <Music className='size-3.5 text-emerald-400 shrink-0'/>}
                  </div>
                  {isPlaying? (
                    <div className='mt-1'>
                      <div className='mt-1 text-sm text-white font-medium truncate'>
                        {activity.replace("Playing ","").split("by")[0]}
                      </div>
                      <div className='text-xs text-zinc-400 truncate'>
                        {activity.split(" by ")[1]}
                      </div>
                    </div>
                  ) : (
                    <div className='mt-1 text-sm text-zinc-400'>Idle</div>
                  )}
                </div>

              </div>

            </div>

          )})}
        </div>
      </ScrollArea>
    </div>
  )
}

export default FriendsActivity

const LoginPrompt = () => (
  <div className='h-full flex flex-col justify-center items-center p-6 space-y-4 text-center'>
    <div className='relative'>
      <div
        className='absolute -inset-1 bg-linear-to-r from-emerald-500 to-sky-500 rounded-full blur-lg opacity-75 animate-pulse'
        aria-hidden="true"
      />
      <div className='relative bg-zinc-900 rounded-full p-4'>
        <HeadphonesIcon className="size-8 text-emerald-500"/>
      </div>
    </div>

    <div className='space-y-2 max-w-[250px]'>
      <h3 className='text-lg font-semibold text-white'>See What Friends Are Playing</h3>
      <p className='text-sm text-zinc-400'>Login to discover what music your friends are enjoying right now</p>
    </div>
  </div>
)
