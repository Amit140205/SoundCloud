import React from 'react'
import {useSignIn} from "@clerk/clerk-react"
import { Button } from '../ui/button'
 
function SignedInAuthButton() {
    const {signIn,isLoaded} = useSignIn()
    
    const signInWithGoogle = ()=>{
        signIn.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/auth-callback"
        })
    }

    if(!isLoaded){
        return null
    }else{
        return (
            <Button onClick={signInWithGoogle} variant={"secondary"} className="w-full text-white border-zinc-200 h-11">
                <img src="logo/google.png" alt="google" className='size-5'/>
                Continue with Google
            </Button>
        )
    }
}

export default SignedInAuthButton