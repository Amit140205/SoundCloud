import React, { useEffect, useRef, useState } from "react";
import { useAudioPlayerStore } from "../../store/useAudioPlayerStore";
import { Button } from "../../components/ui/button";
import {
  Laptop2,
  ListMusic,
  Mic2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
} from "lucide-react";
import { Slider } from "../../components/ui/slider";

const formatDuration = (seconds) => {
  // duration is passed in seconds => seconds like (100s,120s,24s)
  // we need, 100s => 1.40s
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

function PlayBackControls() {
  const { togglePlay, playNext, playPrevious, currentSong, isPlaying } =
    useAudioPlayerStore();

  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef();

  useEffect(() => {
    audioRef.current = document.querySelector("audio");
    const audio = audioRef.current;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };
    const updataDuration = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      useAudioPlayerStore.setState({ isPlaying: false });
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updataDuration);

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updataDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong]);

  const handleTimeChange = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  const handleVolumeChange = (value) => {
    setVolume(value[0])
    if(audioRef.current){
        audioRef.current.volume = value[0] / 100
    }
  }
  return (
    <footer className="h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4">
      <div className="flex justify-between items-center h-full mx-auto max-w-[1800px]">
        {/* currently playing song */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]">
          {currentSong && (
            <>
              <img
                src={currentSong?.imageUrl}
                alt={currentSong?.title}
                className="w-14 h-14 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate hover:underline cursor-pointer">
                  {currentSong?.title}
                </div>
                <div className="text-sm text-zinc-400 truncate hover:underline cursor-pointer">
                  {currentSong?.artist}
                </div>
              </div>
            </>
          )}
        </div>

        {/* player controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* shuffle button */}
            <Button
              size="icon"
              variant="ghost"
              className="hidden sm:inline-flex hover:text-white text-zinc-400"
            >
              <Shuffle className="w-4 h-4" />
            </Button>

            {/* previous button */}
            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
              onClick={playPrevious}
              disabled={!currentSong}
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            {/* play/pause button */}
            <Button
              size="icon"
              variant="ghost"
              className="w-8 h-8 rounded-full bg-white hover:bg-white/80 text-black"
              onClick={togglePlay}
              disabled={!currentSong}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>

            {/* next button */}
            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
              onClick={playNext}
              disabled={!currentSong}
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            {/* repeat button */}
            <Button
              size="icon"
              variant="ghost"
              className="hidden sm:inline-flex hover:text-white text-zinc-400"
            >
              <Repeat className="w-4 h-4" />
            </Button>
          </div>

          <div className="hidden sm:flex items-center gap-2 w-full">
            <div className="text-zinc-400 text-sm">
              {formatDuration(currentTime)}
            </div>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              className="w-full hover:cursor-grab active:cursor-grabbing"
              onValueChange={handleTimeChange}
            />
            <div className="text-zinc-400 text-sm">
              {formatDuration(duration)}
            </div>
          </div>
        </div>

        {/* volume controls */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="text-zinc-400 hover:text-white"
          >
            <Mic2 className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-zinc-400 hover:text-white"
          >
            <ListMusic className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-zinc-400 hover:text-white"
          >
            <Laptop2 className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="text-zinc-400 hover:text-white"
            >
              <Volume1 className="w-4 h-4" />
            </Button>
            <Slider
                value={[volume]}
                max={100}
                step={1}
                className="w-24 hover:cursor-grab active:cursor-grabbing"
                onValueChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default PlayBackControls;
