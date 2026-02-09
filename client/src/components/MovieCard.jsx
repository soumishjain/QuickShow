 import { StarIcon } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';
 
 const MovieCard = ({movie}) => {
    const runtime = movie.runtime
    const hr = Math.floor(runtime/60);
    const min = runtime % 60
    const navigate = useNavigate()
   return (
     <div className='hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between h-88 w-68 bg-gray-800 rounded-2xl p-3'>
      <div>
         <img className='rounded-2xl object-cover object-center h-50' src={movie.backdrop_path} alt="" />
       <h3 className='text-xl mt-2 font-semibold'>{movie.title}</h3>
       <span className='text-white/60 text-sm'>
        {new Date(movie.release_date).getFullYear()} • {movie.genres.splice(0,2).map((genre) => genre.name).join(" | ")} • {hr}hr {min}min
       </span>
      </div>
        <div className='flex justify-between'>
            <button onClick={() => {
                navigate(`/movies/${movie._id}`)
            }} className='bg-primary font-semibold hover:bg-primary-dull px-2 py-1 rounded-full  '>Buy Ticket</button>
            <span className='flex gap-1'><StarIcon fill='currentColor' className='h-5 text-primary w-5'/> {movie.vote_average.toFixed(1)} </span>
        </div>
     </div>
   )
 } 
 
 export default MovieCard
 