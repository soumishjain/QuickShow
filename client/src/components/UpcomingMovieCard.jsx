import React from 'react'
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { StarIcon } from 'lucide-react';

const UpcomingMovieCard = ({movie}) => {

    const navigate = useNavigate()


    const {image_base_url} = useAppContext()

  return (
     <div  className='cursor-pointer hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between h-100 w-68 bg-primary/10 border-2 border-primary/20 rounded-2xl p-3'>
      <div>
         <img loading='lazy' className='rounded-2xl object-cover object-center h-70' src={image_base_url + movie.backdrop_path} alt="" />
       <div className='flex flex-col justify-between gap-3'>
        <h3 className='text-xl mt-2 font-semibold'>{movie.title}</h3>
       <span className='text-white/60 text-sm'>
        {new Date(movie.release_date).getFullYear()}
       </span> 
       </div>
      </div>
        
     </div>
   )
}

export default UpcomingMovieCard
