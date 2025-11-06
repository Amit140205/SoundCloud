import { HomeIcon, Library, MessageCircle } from "lucide-react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../../components/ui/button";
import { SignedIn } from "@clerk/clerk-react";
import { ScrollArea } from "../../components/ui/scroll-area";
import PlayListSkeleton from "../../components/skeleton/PlayListSkeleton";
import { useMusicStore } from "../../store/useMusicStore";

function LeftSideBar() {
    // const [isLoading,setIsLoading] = useState(true)

    // fetching the albums from backend by using global store conecpt
    const {albums,isLoading,fetchAlbums} = useMusicStore()

    useEffect(()=>{
      fetchAlbums().then()
    },[fetchAlbums])
    
    // console.log(albums)

  return (
    <div className="h-full flex flex-col gap-2">
      {/* navigation menu */}
      <div className="rounded-lg bg-zinc-900 p-4">
        <div className="space-y-2">
          <Link
            to="/"
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-zinc-800",
              })
            )}
          >
            <HomeIcon className="mr-2 size-5" />
            <span className="hidden md:inline">Home</span>
          </Link>

          {/* message icon is showing only if the user is authenticated */}
          <SignedIn>
            <Link
              to="/chat"
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className:
                    "w-full justify-start text-white hover:bg-zinc-800",
                })
              )}
            >
              <MessageCircle className="mr-2 size-5" />
              <span className="hidden md:inline">Messages</span>
            </Link>
          </SignedIn>
        </div>
      </div>

      {/* library section */}
      <div className="flex-1 rounded-t-lg bg-zinc-900 p-4">
        <div className="flex items-center justify-between mb-4">
          {/* playlist heading */}
          <div className="flex items-center px-2 text-white">
            <Library className="mr-2 size-5" />
            <span className="hidden md:inline">Playlists</span>
          </div>
        </div>

        {/* albums/playlists */}
        <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-2">
                {/* fetching from the backend server => so while loading maintaining a skeleton of that component*/}
                {isLoading?(
                    <PlayListSkeleton/>
                ): (
                    albums.map((album,index)=>(
                      <Link key={index} to={`/albums/${album._id}`}
                        className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                      >
                        {/* image */}
                        <img src={album.imageUrl} alt="playlist image"
                          className="size-12 rounded-md shrink-0 object-cover"
                        ></img>

                        {/* title and artist name */}
                        <div className="flex-1 min-w-0 hidden md:block">
                          <p className="font-medium truncate">{album.title}</p>
                          <p className="text-sm text-zinc-400 truncate">{album.artist}</p>
                        </div>
                      </Link>
                    ))
                )}
            </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default LeftSideBar;
