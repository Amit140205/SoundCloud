import { useUser } from '@clerk/clerk-react'
import React, { useState } from 'react'
import { useUserStore } from '../../../store/useUserStore'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { Send } from 'lucide-react'

function MessageInput() {
    const [newMessage,setNewMessage] = useState("")
    const {user} = useUser()
    const {selectedUser,sendMessage} = useUserStore()

    const handleSubmit = ()=>{
        if(!newMessage || !user || !selectedUser) return
        sendMessage(user.id,selectedUser.clerkId,newMessage.trim())
        setNewMessage("")
    }

  return (
    <div className='p-4 mt-auto border-t border-zinc-800'>
        <div className='flex gap-2'>
            <Input
                value={newMessage}
                placeholder="Type a message"
                onChange={(e)=>setNewMessage(e.target.value)}
                className="bg-zinc-800 border-none"
                onKeyDown={(e)=>e.key === "Enter" && handleSubmit()}
            />
            <Button size="icon" onClick={handleSubmit} disabled={!newMessage.trim()}>
                <Send className='size-4'/>
            </Button>
        </div>
    </div>
  )
}

export default MessageInput