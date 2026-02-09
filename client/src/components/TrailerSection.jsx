import React, { useState } from 'react'
import { assets, dummyTrailers } from '../assets/assets'
import BlurBg from './BlurBg'
import ReactPlayer from 'react-player'
import { PlayCircleIcon } from 'lucide-react'
const TrailerSection = () => {
    const [currentTrailer , setCurrentTrailer] = useState(dummyTrailers[0])
  return (
    <div className='relative gap-4 mt-5 py-5 max-md:px-10  md:px-65 max-md:h-[400px] h-[800px] w-full flex flex-col items-center'>
    <BlurBg top='-50px' right='50px'/>
    <div className='w-full'>
        <h3 className='font-semibold text-xl max-md:text-md'>Trailers</h3>
    </div>
    <ReactPlayer className='' height={'100%'} width={'100%'} src={currentTrailer.videoUrl} controls />
    <div className='group justify-center flex-wrap flex gap-4'>
        {dummyTrailers.map((trailer) => (
            <div onClick={() => {
                setCurrentTrailer(trailer)
            }} className='hover:-translate-y-1  duration-300 relative w-50 max-md:w-30 rounded-xl group-hover:not-hover:opacity-50 transition-all'>
                <img className='rounded-xl' src={trailer.image} alt="" />
                <PlayCircleIcon strokeWidth={1.6} className='absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] h-8 w-8'/>
            </div>
        ))}
    </div>
    </div>
  )
}

export default TrailerSection