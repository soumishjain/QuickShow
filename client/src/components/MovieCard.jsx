 import { StarIcon } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
 
 const MovieCard = ({movie}) => {
    const runtime = movie.runtime
    const hr = Math.floor(runtime/60);
    const min = runtime % 60
    const navigate = useNavigate()


    const {image_base_url} = useAppContext()

   return (
     <div onClick={() => {
      navigate(`/movies/${movie.id}`)
     }} className='cursor-pointer hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between h-100 w-68 bg-primary/10 border-2 border-primary/20 rounded-2xl p-3'>
      <div>
         <img className='rounded-2xl object-cover object-center h-50' src={image_base_url + movie.backdrop_path} alt="" />
       <h3 className='text-xl mt-2 font-semibold'>{movie.title}</h3>
       <span className='text-white/60 text-sm'>
        {new Date(movie.release_date).getFullYear()} • {movie.genres?.slice(0,2).map((genre) => genre.name).join(" | ") || "N/A"} • {hr}hr {min}min
       </span> 
      </div>
        <div className='flex justify-between'>
            <button onClick={() => {
                navigate(`/movies/${movie.id}`); scrollTo(0,0)
            }} className='bg-primary font-semibold hover:bg-primary-dull px-2 py-1 rounded-full  '>Buy Ticket</button>
            <span className='flex gap-1'><StarIcon fill='currentColor' className='h-5 text-primary w-5'/> {movie.vote_average.toFixed(1)} </span>
        </div>
     </div>
   )
 } 
 
 export default MovieCard
 