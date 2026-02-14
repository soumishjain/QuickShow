import React from 'react'
import { assets, dummyShowsData } from '../assets/assets'
import MovieCard from '../components/MovieCard'
import BlurBg from '../components/BlurBg'
const Favourite = () => {
  return dummyShowsData.length > 0 ? (
    <div className='mt-40 md:px-40 max-md:px-10 flex flex-col gap-8'>
      <h3 className='font-semibold text-xl max-md:text-md'>Your Favourites</h3>
      <BlurBg top='50px' right='80px'/>
      <BlurBg bottom='50px' left='80px'/>
      <div className=' flex max-md:justify-center flex-wrap gap-6 justify-start'>
    {dummyShowsData.map((movie) => {
        return <MovieCard movie={movie}/>
      })}
    </div>
      </div>
  ) : (
    <div>
      <h2>No Movies Available</h2>
    </div>
  )
}

export default Favourite
