import { clerkClient } from "@clerk/express";

export const protectRoute = async (req,res,next) => {
    // console.log(req.auth().userId)
    if(!req.auth().userId){
        return res.status(401).json({message:"unauthorized- you must be signed in"})
    }
    next()
}

export const requireAdmin = async (req,res,next) => {
    try {
        const currentUser = await clerkClient.users.getUser(req.auth().userId)
        const isAdmin = process.env.ADMIN_EMAIL === currentUser?.primaryEmailAddress?.emailAddress

        if(!isAdmin){
            return res.status(403).json({message:"unauthorized - you must be an admin"})
        }
        next();
    } catch (error) {
        console.log(`error in require admin middleware : ${error}`)
        next(error)
    }
}