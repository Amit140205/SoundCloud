import { Album } from "../models/album.model.js"

export const getAllAlbums = async (req,res,next)=>{
    try {
        const albums = await Album.find()
        return res.status(200).json(albums)
    } catch (error) {
        console.log(`error in get all albums controller : ${error}`)
        next(error)
    }
}
export const getAlbumById = async (req,res,next)=>{
    try {
        const {albumId} = req.params
        const album = await Album.findById(albumId).populate("songs")
        return res.status(200).json(album)
    } catch (error) {
        console.log(`error in get album by id controller : ${error}`)
        next(error)
    }
}