import { Album } from "../models/album.model.js"
import { Song } from "../models/song.model.js"
import { User } from "../models/user.model.js"

export const getStats = async (req,res,next)=>{
    try {
        // but it is not optimised
        // const totalSongs = await Song.countDocuments()
        // const totalUsers = await User.countDocuments()
        // const totalAlbums = await Album.countDocuments()

        // optimised approach
        const [totalSongs,totalUsers,totalAlbums,uniqueArtists] = await Promise.all([
            Song.countDocuments(),
            User.countDocuments(),
            Album.countDocuments(),

            // find the count of artists
            Song.aggregate([
                {
                    $unionWith : {
                        coll : "Album",
                        pipeline : []
                    }
                },
                {
                    $group : {
                        _id : "$artist"
                    }
                },
                {
                    $count : "count"
                }
            ])
        ])

        return res.status(200).json({
            totalSongs,
            totalUsers,
            totalAlbums,
            totalArtists : uniqueArtists[0]?.count || 0
        })
    } catch (error) {
        console.log(`error in get stats controller : ${error}`)
        next(error)
    }
}