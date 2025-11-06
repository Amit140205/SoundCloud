import React, { useEffect, useRef } from 'react'
import { useAudioPlayerStore } from '../../store/useAudioPlayerStore'

function AudioPlayer() {
  const audioRef = useRef()
  const prevSongRef = useRef()

  const {currentSong,isPlaying,playNext} = useAudioPlayerStore()

  // set the initial volume to 75
  useEffect(()=>{
    if(audioRef.current){
      audioRef.current.volume = 0.75
    }
  },[])

  // handle play/pause logic
  useEffect(()=>{
    if(isPlaying){
      audioRef?.current.play()
    }else{
      audioRef?.current.pause()
    }
  },[isPlaying])

  // handle song ends
  useEffect(()=>{
    const audio = audioRef?.current

    const handleEnded = ()=>{
      playNext()
    }

    audio?.addEventListener("ended",handleEnded)

    return () => (audio?.removeEventListener("ended",handleEnded))
  },[playNext])

  // handle song changes
  useEffect(()=>{
    if(!audioRef.current || !currentSong) return
    const audio = audioRef?.current

    // check wheather the song changes or not
    const isSongChange = prevSongRef.current !== currentSong?.audioUrl
    if(isSongChange){
      // console.log(currentSong)
      audio.src = currentSong?.audioUrl
      // reset the playback time to 0 
      audio.currentTime = 0

      prevSongRef.current = currentSong?.audioUrl

      if(isPlaying){
        audio.play()
      }
    }
  },[currentSong,isPlaying])

  return (
    <audio ref={audioRef}/>
  )
}

export default AudioPlayer