import React from "react";
import { useAudioPlayerStore } from "../../../store/useAudioPlayerStore";
import { Button } from "../../../components/ui/button";
import { Pause, Play } from "lucide-react";

function PlayButton({ song }) {
  const { currentSong, isPlaying, setCurrentSong, togglePlay } =
    useAudioPlayerStore();
  const isCurrent = currentSong?._id === song._id;

  const handlePlay = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      setCurrentSong(song);
    }
  };
  return (
    <Button
        size="icon"
        onClick={handlePlay}
        className={`absolute bottom-3 right-2 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all 
            opacity-0 translate-y-2 group-hover:translate-y-0
            ${isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
    >
        {isCurrent && isPlaying ? (
            <Pause className="size-5 text-black"/>
        ) : (
            <Play className="size-5 text-black"/>
        )}
    </Button>
  )
}

export default PlayButton;
