import { User } from "../models/user.model.js"

export const authCallback = async (req,res,next) => {
    try {
        
        const {id,firstName,lastName,imageUrl} = req.body
    
        // check user already exists or not
        const user = await User.findOne({clerkId : id})

        if(user) return res.status(409).json({message: "user already exists"})

        if(!user){
            await User.create({
                clerkId : id,
                fullName : `${firstName || ""} ${lastName || ""}`.trim(),
                imageUrl
            })
        }

        return res.status(200).json({success:true})
    } catch (error) {
        console.log(`error in auth controller : ${error}`)
        next(error)
    }
}