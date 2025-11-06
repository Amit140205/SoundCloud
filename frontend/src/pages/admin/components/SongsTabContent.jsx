import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Music } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import SongTable from './SongTable'
import AddSongDialog from './AddSongDialog'

function SongsTabContent() {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className="flex items-center gap-2">
              <Music className='w-5 h-5 text-emerald-500'/>
              Songs Library
            </CardTitle>
            <CardDescription className="mt-1">Manage your music tracks</CardDescription>
          </div>
          <AddSongDialog/>
        </div>
      </CardHeader>
      <CardContent>
        <SongTable/>
      </CardContent>
    </Card>
  )
}

export default SongsTabContent