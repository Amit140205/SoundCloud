import React from 'react'
import { useMusicStore } from '../../../store/useMusicStore'
import FeatureGridSkeleton from '../../../components/skeleton/FeatureGridSkeleton'
import PlayButton from './PlayButton'

function FeaturedSection() {
    const {featuredSongs,isLoading,error} = useMusicStore()

    if(isLoading) return <FeatureGridSkeleton/>

    if(error) return <p className='text-red-500 mb-4 text-lg'>{error}</p>

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
      {featuredSongs.map((song)=>(
        <div key={song._id} className='flex items-center bg-zinc-800/50 hover:bg-zinc-700/50 
        overflow-hidden transition-colors group relative cursor-pointer'>
          <img src={song?.imageUrl} alt={song?.title} className='w-16 h-16 sm:w-20 sm:h-20 shrink-0 object-cover'/>
          <div className='flex-1 p-4'>
            <div className='font-medium truncate'>{song?.title}</div>
            <p className='text-sm truncate text-zinc-400'>{song?.artist}</p>
          </div>
          {/* todo add a play button */}
          <PlayButton song={song}/>
        </div>
        
      ))}
    </div>
  )
}

export default FeaturedSection