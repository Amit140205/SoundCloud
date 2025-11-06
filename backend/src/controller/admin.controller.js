import cloudinary from "../lib/cloudinary.js";
import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import fs from "fs";
//helper function for cloudinary uploads
const uploadToCloudinary = async (file) => {
//   console.log(file.tempFilePath);
  try {
    const result = await cloudinary.uploader
      .upload(file.tempFilePath, {
        resource_type: "auto",
      })

    return result.secure_url;
  } catch (error) {
    console.log(`error in upload to cloudinary : ${error}`);
    throw new Error("error in uploading to cloudinary");
  }
};

export const createSong = async (req, res, next) => {
  // console.log(req.body)
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "please upload all the files" });
    }

    const { title, artist, albumId, duration } = req.body;

    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration,
      albumId: albumId || null,
    });

    await song.save();

    // if song belongs to an album then update the album's cong array
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }

    return res.status(201).json({ message: song });
  } catch (error) {
    console.log(`error in create song controller : ${error}`);
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);

    // if the song belongs, we have to remove it from the album
    if (song?.albumId) {
      await Album.findByIdAndUpdate(song?.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(song._id);

    res.status(200).json({ message: "song deleted successfully" });
  } catch (error) {
    console.log(`error in delete song controller : ${error}`);
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files;

    const imageUrl = await uploadToCloudinary(imageFile);

    const album = new Album({
      title,
      artist,
      imageUrl,
      releaseYear,
    });

    await album.save();

    return res.status(201).json({ message: album });
  } catch (error) {
    console.log(`error in create album controller : ${error}`);
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    // console.log(req.params)
    const { id } = req.params;
    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);

    return res.status(200).json({ message: "album deleted successfully" });
  } catch (error) {
    console.log(`error in delete album controller : ${error}`);
    next(error);
  }
};

export const checkAdmin = async (req, res, next) => {
  return res.status(200).json({ admin: true });
};
