import { ArrowRight } from 'lucide-react'
import React from 'react'
import BlurBg from './BlurBg'
import { useNavigate } from 'react-router-dom'
import { dummyShowsData } from '../assets/assets'
import MovieCard from './MovieCard'

const FeaturedSection = () => {
  const navigate = useNavigate()
    return (
    <div className='relative flex flex-col gap-15 overflow-hidden px-2 md:px-45 py-20'>
        <BlurBg top='40' left=' 80px' />
      <div className='flex justify-between'>
        <h3 className='font-semibold text-xl max-md:text-md'>Now Showing</h3>
        <span className='flex gap-3 cursor-pointer group'><span className='transition-transform duration-300  ease-in-out  group-hover:-translate-x-1'>View All</span> <ArrowRight className='transition-transform duration-300  ease-in-out group-hover:translate-x-1'/></span>
      </div>
      <div className='flex justify-between gap-4 flex-wrap max-lg:justify-center'>
        {dummyShowsData.slice(0,4).map((show) => (
            <MovieCard key={show._id} movie={show}/>
        ))}
      </div>
      <div className='flex justify-center items-center'>
        <button onClick={() => {
            navigate('/movies'); scrollTo(0,0)
        }} className='bg-primary hover:bg-primary-dull px-4 py-2 rounded-md font-semibold'>Show more</button>
      </div>
    </div>
  )
}

export default FeaturedSection
