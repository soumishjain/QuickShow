import React from 'react'
import MovieCard from '../components/MovieCard'
import BlurBg from '../components/BlurBg'
import { useAppContext } from '../context/AppContext'
import Loading from '../components/Loading'
const Movies = () => {


  const {shows} = useAppContext()

  return shows.length > 0 ? (
    <div className='mt-40 md:px-40 max-md:px-10 flex flex-col gap-8'>
      <h3 className='font-semibold text-xl max-md:text-md'>Now Showing</h3>
      <BlurBg top='50px' right='80px'/>
      <BlurBg bottom='50px' left='80px'/>
      <div className=' flex max-md:justify-center flex-wrap gap-6 justify-start'>
    {shows.map((movie) => {
        return <MovieCard movie={movie}/>
      })}
    </div>
      </div>
  ) : (
   <Loading />
  )
}

export default Movies
