import React, { useEffect } from "react";
import Topbar from "../../components/custom/Topbar";
import { useMusicStore } from "../../store/useMusicStore";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "../../components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { useAudioPlayerStore } from "../../store/useAudioPlayerStore";

function HomePage() {
  const {
    madeForYouSongs,
    featuredSongs,
    trendingSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    fetchFeaturedSongs,
    isLoading,
  } = useMusicStore();

  const {initializeQueue} = useAudioPlayerStore()

  useEffect(() => {
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

  // console.log(featuredSongs,madeForYouSongs,trendingSongs)

  // initialize the queue
  useEffect(()=>{
    if(featuredSongs.length>0 && madeForYouSongs.length>0 && trendingSongs.length>0){
      const allSongs = [...featuredSongs,...madeForYouSongs,...trendingSongs]
      initializeQueue(allSongs)
    }
  },[initializeQueue,featuredSongs,madeForYouSongs,trendingSongs])

  return (
    <main className="rounded-t-md h-full bg-linear-to-b from-zinc-800 to-zinc-900">
      <Topbar />
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            Good Afternoon
          </h1>
          <FeaturedSection />

          <div className="space-y-8">
            <SectionGrid
              title="Made For You"
              songs={madeForYouSongs}
              isLoading={isLoading}
            />
            <SectionGrid
              title="Trending Songs"
              songs={trendingSongs}
              isLoading={isLoading}
            />
          </div>
          
        </div>
      </ScrollArea>
    </main>
  );
}

export default HomePage;
