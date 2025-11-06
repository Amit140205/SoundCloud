import React from 'react'

function PlayListSkeleton() {
  return Array.from({length:7}).map((_,index)=>(
    <div key={index} className='rounded-md flex items-center p-2 gap-3'>
        {/* left side => image */}
        <div className='w-12 h-12 rounded-md shrink-0 bg-zinc-800 animate-pulse'/>
        {/* right side => title,artist*/}
        <div className='flex-1 hidden md:block min-w-0 space-y-2'>
            <div className='h-4 bg-zinc-800 rounded animate-pulse w-3/4'/>
            <div className='h-3 bg-zinc-800 rounded animate-pulse w-1/2'/>
        </div>
    </div>
  ))
}

export default PlayListSkeleton