import React from 'react'
import { useAppContext } from '../context/AppContext'
import BlurBg from '../components/BlurBg'
import MovieCard from '../components/MovieCard'
import UpcomingMovieCard from '../components/UpcomingMovieCard'

const Upcoming = () => {

    const {upcoming} = useAppContext()

  return upcoming.length > 0 ? (
    <div className='mt-40 md:px-40 max-md:px-10 flex flex-col gap-8'>
      <h3 className='font-semibold text-xl max-md:text-md'>Upcoming Movies</h3>
      <BlurBg top='50px' right='80px'/>
      <BlurBg bottom='50px' left='80px'/>
      <div className=' flex max-md:justify-center flex-wrap gap-6 justify-start'>
    {upcoming.map((movie) => {
        return <UpcomingMovieCard movie={movie}/>
      })}
    </div>
      </div>
  ) : (
    <div>
      <h2>No Movies Available</h2>
    </div>
  )
}

export default Upcoming
