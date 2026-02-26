import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { dummyDateTimeData, dummyShowsData } from '../assets/assets'
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react'
import BlurBg from '../components/BlurBg'
import DateBox from '../components/DateBox'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const MovieDetail = () => {
  const {id} = useParams()
  const [movie, setMovie] = useState(null)
  const [dateTime, setDateTime] = useState({})

  const {shows,axios,getToken,user,fetchFavMovies,favoritesMovies,image_base_url} = useAppContext()

  const getShow = async () => {
    
    try{
        const {data} = await axios.get(`/api/show/${id}`)

         console.log("API RESPONSE:", data)
        if(data.success){
          setMovie(data.movie)
      setDateTime(data.dateTime)
        }
    }catch(error){
       console.error("API ERROR:", error)
    }

  }
  useEffect(() => {
    getShow()
  },[id])

  const handleFav = async () => {
      try{
        if(!user) return toast.error("please login to proceed")
          console.log("Sending movieId:", id)

          const {data} = await axios.post('/api/user/update-favorite', {movieId : id}, {headers : {Authorization : `Bearer ${await getToken()}`}})

        if(data.success){
          await fetchFavMovies()
          toast.success(data.message)
        }
      }catch(err){
        console.log(err)
      }
  }


  return movie ? (
    <div className='mt-40 max-md:mt-30 md:px-40 max-md:px-10'>
      <BlurBg top='100px' right='100px'/>
      <div className='flex max-md:flex-col max-sm:justify-center max-md:items-center max-md:gap-3 gap-10'>
      <img className='w-100 max-md:w-50 max-md:h-70 rounded-2xl' src={image_base_url + movie?.poster_path} alt="" />
      <div className='flex flex-col py-10 justify-between'>
        <div className='flex gap-5 max-md:gap-2 flex-col'>
          <h2 className='text-primary'>ENGLISH</h2>
        <h1 className='text-5xl max-md:text-3xl max-md:mb-3 font-bold'>{movie?.title}</h1>
        </div>
        <div className='flex flex-col gap-5'>
          <div className='text-white/70 flex gap-2'>
          <StarIcon fill='currentColor' className='text-primary h-5 w-5'/>
          <p>{movie?.vote_average?.toFixed(1)} User Rating</p>
        </div>
        <p className='text-white/60'>{movie?.overview}</p>
        <p>{Math.floor(movie?.runtime / 60)}hr {movie?.runtime % 60}min • {movie?.genres.map(genre => (genre.name)).join(", ")} • {movie?.release_date.split('-')[0]}</p>
        <div className='flex gap-3 max-md:flex-col'>
          <button className='flex gap-2 bg-gray-700 max-md:flex max-md:justify-center hover:bg-gray-800 px-4 py-2 rounded-md font-semibold'>
            <PlayCircleIcon className='h-5 w-5'/>
            <p>Watch Trailer</p>
          </button>
          <a className='bg-primary hover:bg-primary-dull max-md:flex max-md:justify-center px-4 py-2 rounded-md font-semibold' href="#dateselect">Buy Tickets</a>
          <button onClick={handleFav} className='cursor-pointer bg-gray-700 aspect-square rounded-full w-10 flex justify-center items-center hover:bg-gray-800'>
            <Heart className={`h-5 w-5 ${favoritesMovies.find(movie => movie.id === id) ? 'fill-primary text-primary' : ""}`} />
          </button>
        </div>
        </div>
      </div>
    </div>

    <p className='mt-40 max-md:mt-20 font-medium text-xl'>Cast</p>
    <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
      <div className='flex gap-4 w-max items-center px-4'>
      {movie?.casts.slice(0,12).map((cast,index) => (
        <div className='flex flex-col items-center'>
          <img className='h-20 aspect-square object object-cover rounded-full' src= { cast.profile_path? image_base_url + cast.profile_path : "/no-image.jpg"} alt="" />
          <p className='text-xs mt-3 text-center'>{cast.name}</p>
        </div>
      ))}  
    </div>
    </div>

      <DateBox dateTime={dateTime} id={id}/>

      <h3 className='font-semibold text-xl mt-40 max-md:text-md'>You Might Also Like</h3>
      <div className='flex gap-4 mt-10 flex-wrap max-lg:justify-center'>
        {shows.slice(0,4).map((movie,index) => {
          return <MovieCard key={index} movie={movie}/>
        })}
      </div>
      <div className='w-full flex justify-center mt-20'>
        <button onClick={() => {
            navigate('/movies'); scrollTo(0,0)
        }} className='bg-primary hover:bg-primary-dull px-4 py-2 rounded-md font-semibold'>Show more</button>
    </div>
      </div>
  ) : (
    <Loading />
  )
}

export default MovieDetail
