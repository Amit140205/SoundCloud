import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"

export const useMusicStore = create((set)=>({
    albums: [],
    songs: [],
    isLoading: false,
    error: null,
    currentAlbum: null,
    madeForYouSongs: [],
    featuredSongs: [],
    trendingSongs: [],
    stats: {
        totalSongs: 0,
        totalUsers: 0,
        totalAlbums: 0,
        totalArtists: 0 
    },

    deleteSong: async (songId)=>{
        set({
            isLoading:true,
            error:null
        })
        try {
            await axiosInstance.delete(`/admin/songs/${songId}`)

            // update the state
            // by removing the song
            set((state) => ({
                songs: state.songs.filter((song) => song._id !== songId)
            }))

            toast.success("Song deleted successfully")

        } catch (error) {
            toast.error("Error while deleting song")
            set({
                error: error.message
            })
        } finally {
            set({
                isLoading: false
            })
        }
    },

    deleteAlbum: async (albumId)=>{
        set({
            isLoading: true,
            error: null
        })
        try {
            await axiosInstance.delete(`/admin/albums/${albumId}`)

            set((state) => ({
                albums: state.albums.filter((album) => album._id !== albumId),
                songs: state.songs.map((song) => song.albumId === albumId ? {...song,albumId:null} : song)
            }))

            toast.success("Album deleted successfully")
        } catch (error) {
            toast.error("Error while deleting album")
            set({
                error: error.message
            })
        } finally {
            set({
                isLoading: false
            })
        }
    },

    fetchStats: async ()=>{
        set({
            isLoading: true,
            error: null
        })
        try {
            const response = await axiosInstance.get("/stats")
            set({
                stats: response.data
            })
        } catch (error) {
            set({
                error: error.response.data.message
            })
        } finally {
            set({
                isLoading: false
            })
        }
    },

    fetchSongs: async ()=>{
        set({
            isLoading: true,
            error: null
        })
        try {
            const response = await axiosInstance.get("/songs")
            set({
                songs: response.data
            })
        } catch (error) {
            set({
                error: error.response.data.message
            })
        } finally {
            set({
                isLoading: false
            })
        }
    },

    fetchAlbums: async ()=>{
        set({
            isLoading: true,
            error: null
        })
        // data fetch logic
        try {
            const res = await axiosInstance.get("/albums")
            set({
                albums: res.data
            })
        } catch (error) {
            set({
                error: error.response.data.message
            })
        } finally {
            set({
                isLoading: false
            })
        }
    },

    fetchAlbumById: async (albumId)=>{
        set({
            isLoading: true,
            error: null
        })

        // fetch specific album data
        try {
            const res = await axiosInstance.get(`/albums/${albumId}`)

            set({
                currentAlbum : res.data
            })
        } catch (error) {
            set({
                error: error.response.data.message
            })
        } finally {
            set({
                isLoading: false
            })
        }
    },

    fetchMadeForYouSongs: async ()=>{
        set({
            isLoading: true,
            error: null
        })
        try {
            const response = await axiosInstance.get("/songs/made-for-you")
            set({
                madeForYouSongs: response.data
            })
        } catch (error) {
            set({
                error: error.response.data.message
            })
        } finally {
            set({
                isLoading: false
            })
        }
    },

    fetchTrendingSongs: async ()=>{
        set({
            isLoading: true,
            error: null
        })
        try {
            const response = await axiosInstance.get("/songs/trending")
            set({
                trendingSongs: response.data
            })
        } catch (error) {
            set({
                error: error.response.data.message
            })
        } finally {
            set({
                isLoading: false
            })
        }
    },
    
    fetchFeaturedSongs: async ()=>{
        set({
            isLoading: true,
            error: null
        })
        try {
            const response = await axiosInstance.get("/songs/featured")
            set({
                featuredSongs: response.data
            })
        } catch (error) {
            set({
                error: error.response.data.message
            })
        } finally {
            set({
                isLoading: false
            })
        }
    },
}))