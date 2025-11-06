import React from 'react'
import {Link} from "react-router-dom"
import {LayoutDashboardIcon} from "lucide-react"
import SignedInAuthButton from './SignedInAuthButton'
import { SignedOut, UserButton } from '@clerk/clerk-react'
import { useAuthStore } from '../../store/useAuthStore'
import { buttonVariants } from '../ui/button'
import { cn } from '../../lib/utils'
function Topbar() {
    const {isAdmin} = useAuthStore()
    // console.log(isAdmin)
  return (
    <div className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10 rounded-t-lg'>
        {/* two items => name,auth */}
        <div className='flex gap-2 items-center text-xl font-medium'>
            <img src="/logo/logo.png" className='h-8 w-16' alt="logo" />
            SoundCloud
        </div>
        <div className='flex gap-4 items-center'>
            {isAdmin && (
                <Link to={"/admin"}
                    className={cn(
                        buttonVariants({variant:"outline"})
                    )}
                >
                    <LayoutDashboardIcon className="size-4 mr-2"/>
                    Admin DashBoard
                </Link>
            )}

            <SignedOut>
                <SignedInAuthButton/>
            </SignedOut>

            <UserButton/>
        </div>
    </div>
  )
}

export default Topbar