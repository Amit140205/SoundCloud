import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMusicStore } from "../../store/useMusicStore";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Button } from "../../components/ui/button";
import { Clock, Pause, Play } from "lucide-react";
import { useAudioPlayerStore } from "../../store/useAudioPlayerStore";
import Topbar from "../../components/custom/Topbar";

const formatDuration = (seconds) => {
  // duration is passed in seconds => seconds like (100s,120s,24s)
  // we need, 100s => 1.40s
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

function AlbumPage() {
  const { albumId } = useParams();
  const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();

  // album music playing
  const { currentSong, isPlaying, togglePlay, playAlbum } =
    useAudioPlayerStore();

  const handlePlaySong = (index) => {
    if (!currentAlbum) return;
    playAlbum(currentAlbum?.songs, index);
  };

  const handlePlayAlbum = ()=>{
    if(!currentAlbum) return
    const isCurrentAlbumIsPlaying = currentAlbum.songs.some(song => song._id === currentSong?._id)
    if(isCurrentAlbumIsPlaying){
      togglePlay()
    }else{
      // play album from the first
      playAlbum(currentAlbum?.songs,0)
    }
  }

  useEffect(() => {
    if (albumId) {
      fetchAlbumById(albumId);
    }
  }, [fetchAlbumById, albumId]);

  if (isLoading) return null;

  return (
    <>
    <div className="h-full">
      <ScrollArea className="h-full rounded-t-lg">
        {/* main content */}
        <div className="relative min-h-full">
          {/* gradient */}
          <div
            className="absolute inset-0 bg-linear-to-b from-[#5038a0]/80 via-zinc-900/80
					 to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />

          {/* content */}
          <div className="relative z-10">
            <div className="flex gap-6 pb-8 p-6">
              <img
                src={currentAlbum?.imageUrl}
                alt={currentAlbum?.title}
                className="w-60 h-60 shadow-xl rounded"
              />
              <div className="flex flex-col justify-end">
                <p className="font-medium text-sm">Album</p>
                <h1 className="text-7xl font-bold my-4">
                  {currentAlbum?.title}
                </h1>

                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">
                    {currentAlbum?.artist}
                  </span>
                  <span className="font-medium">
                    • {currentAlbum?.songs.length} songs
                  </span>
                  <span className="font-medium">
                    • {currentAlbum?.releaseYear}
                  </span>
                </div>
              </div>
            </div>

            {/* play button */}
            <div className="px-6 pb-4 gap-6 flex items-center">
              <Button
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
                onClick={handlePlayAlbum}
              >
                {isPlaying && currentAlbum?.songs.some(song => song._id === currentSong._id) ? (
                  <Pause className="w-7 h-7 text-black"/>
                ) : (
                  <Play className="w-7 h-7 text-black" />
                )}
                
              </Button>
            </div>

            {/* table section */}
            <div className="bg-black/20 backdrop-blur-sm">
              {/* table header */}
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                <div>#</div>
                <div>Title</div>
                <div>Release Date</div>
                <div>
                  <Clock className="w-4 h-4" />
                </div>
              </div>

              {/* songs list */}
              <div className="px-6">
                <div className="space-y-2 py-2">
                  {currentAlbum?.songs.map((song, index) => {
                    const isCurrent = song._id === currentSong?._id
                    return (
                      <div
                        key={song?._id}
                        className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 border-b hover:bg-white/5
                      rounded-md group cursor-pointer"
                        onClick={()=>handlePlaySong(index)}
                      >
                        <div className="flex items-center justify-center">
                          {isCurrent && isPlaying ? (
                            <div className="size-4 text-green-400">♫</div>
                          ) : (
                            <span className="group-hover:hidden">
                            {index + 1}
                          </span>
                          )}
                          
                          {!isCurrent && <Play className="h-4 w-4 hidden group-hover:block" />}
                          
                        </div>

                        <div className="flex items-center gap-3">
                          <img
                            src={song?.imageUrl}
                            alt={song?.title}
                            className="size-10"
                          />
                          <div>
                            <div className="font-medium text-white">
                              {song?.title}
                            </div>
                            <div>{song?.artist}</div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          {song?.createdAt.split("T")[0]}
                        </div>
                        <div className="flex items-center">
                          {formatDuration(song?.duration)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
    </>
  );
}

export default AlbumPage;
