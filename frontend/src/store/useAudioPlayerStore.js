import {create} from "zustand"
import { useUserStore } from "./useUserStore"

export const useAudioPlayerStore = create((set,get)=>({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,

    initializeQueue: (songs)=>{
        set({
            queue: songs,
            currentSong: get().currentSong || songs[0],
            currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex
        })
    },

    playAlbum: (songs,startIndex=0)=>{
        if(songs.length === 0) return

        const song = songs[startIndex]

        // socket connection for activity update
        const socket = useUserStore.getState().socket
        if(socket.auth){
            socket.emit("update_activity",{
                userId: socket.auth.userId,
                activity: `Playing ${song.title} by ${song.artist}`
            })
        }

        set({
            queue: songs,
            currentSong: song,
            isPlaying: true,
            currentIndex: startIndex
        })
    },

    setCurrentSong: (song)=>{
        if(!song) return 

        // socket connection for activity update
        const socket = useUserStore.getState().socket
        if(socket.auth){
            socket.emit("update_activity",{
                userId: socket.auth.userId,
                activity: `Playing ${song.title} by ${song.artist}`
            })
        }

        const songIndex = get().queue.findIndex(s => s._id === song._id)
        set({
            currentSong: song,
            currentIndex: songIndex !== -1? songIndex : get().currentIndex,
            isPlaying: true
        })
    },

    togglePlay: ()=>{
        const willStartPlaying = !get().isPlaying

        // socket update activity
        const currentSong = get().currentSong
        const socket = useUserStore.getState().socket

        if(socket.auth){
            socket.emit("update_activity",{
                userId: socket.auth.userId,
                activity: willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle"
            })
        }
        
        // negate the state
        set({
            isPlaying: willStartPlaying
        })
    },
    
    playNext: ()=>{
        const {currentIndex,queue} = get()
        const nextIndex = currentIndex + 1

        // if there is a next song to play
        if(nextIndex < queue.length){
            const nextSong = queue[nextIndex]

            // socket activity update
            const socket = useUserStore.getState().socket
            if(socket.auth){
                socket.emit("update_activity",{
                    userId: socket.auth.userId,
                    activity: `Playing ${nextSong.title} by ${nextSong.artist}`
                })
            }

            set({
                currentSong: nextSong,
                currentIndex: nextIndex,
                isPlaying: true
            })
        }else{
            // if no songs remaining
            set({
                isPlaying: false
            })

            // socket activity update
            const socket = useUserStore.getState().socket
            if(socket.auth){
                socket.emit("update_activity",{
                    userId: socket.auth.userId,
                    activity: `Idle`
                })
            }
        }
    },

    playPrevious: ()=>{
        const {currentIndex,queue} = get()
        const prevIndex = currentIndex - 1

        // if previous song present
        if(prevIndex >= 0){
            const prevSong = queue[prevIndex]

            // socket activity update
            const socket = useUserStore.getState().socket
            if(socket.auth){
                socket.emit("update_activity",{
                    userId: socket.auth.userId,
                    activity: `Playing ${prevSong.title} by ${prevSong.artist}`
                })
            }

            set({
                currentSong: prevSong,
                currentIndex: prevIndex,
                isPlaying: true
            })
        }else{
            set({
                isPlaying: false
            })

            // socket activity update
            const socket = useUserStore.getState().socket
            if(socket.auth){
                socket.emit("update_activity",{
                    userId: socket.auth.userId,
                    activity: `Idle`
                })
            }
        }
    }
}))