import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets'
import Loading from '../../components/Loading'
import Title from '../../components/admin/Title'
import { CheckIcon, Currency, DeleteIcon, StarIcon } from 'lucide-react'
import kConverter from '../../lib/kConverter'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddShows = () => {

  const {axios , getToken , user , image_base_url} = useAppContext()

  const [movies,setMovies] = useState([])
  const [selectedMovie,setSelectedMovie] = useState(null)
  const [dateTimeSelection,setDateTimeSelection] = useState({})
  const [dateTimeInput,setDateTimeInput] = useState("")
  const [showPrice,setShowPrice] = useState("")
  const [addingShow , setAddingShow] = useState(false)

  const fetchNowplayingMovies = async () => {
    try{
      const { data } = await axios.get('/api/show/now-playing', {
        headers : {Authorization : `Bearer ${await getToken()}`}
      })
      if(data.success) setMovies(data.movies)
    } catch(error){

    }
  }

  const currency = import.meta.env.VITE_CURRENCY

  const handleDateTimeAdd = () => {
    if(!dateTimeInput) return;
    const [date,time] = dateTimeInput.split("T");
    if(!date || !time) return;
    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if(!times.includes(time)){
        return { ...prev, [date] : [...times,time]};
      }
      return prev
    })
  }

  const handleRemoveTime = (date,time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if(!filteredTimes.length === 0) {
        const {[date] : _, ... rest} = prev;
        return rest;
      }
      return {
        ...prev,
        [date]: filteredTimes
      }
    })
  }

  const handleSubmit = async () => {
    try{
      setAddingShow(true)
      if(!selectedMovie || Object.keys(dateTimeSelection).length === 0 || !showPrice) {
        return toast('Missing required fields')
      }

      const showsInput = Object.entries(dateTimeSelection).map(([date,time]) => ({date,time}));

      const payload = {
        movieId : selectedMovie,
        showsInput,
        showPrice : Number(showPrice)
      }

      const {data} = await axios.post('/api/show/add',payload, {headers : {Authorization: `Bearer ${await getToken()}`}})


      if(data.success){
        toast.success(data.message)
        setSelectedMovie(null)
        setDateTimeSelection({})
        setShowPrice("")
      }else{
        toast.error(data.message)
      }

    } catch(error){
      console.error("Submission error: ", error)
      toast.error("An error occured. Please try again")
    }

    setAddingShow(false)

  }

  useEffect(() => {
    if(user)
    fetchNowplayingMovies()
  },[user] )


  return movies.length > 0? (
    <div>
      <Title text1="Add" text2="Shows"/>
      <p className='mt-10 text-lg font-medium'>Now Playing Movies</p>
      <div className='overflow-x-auto pb-4'>
        <div className='flex gap-4 mt-4 w-max group flex-wrap'>
          {movies.map(movie => (
            <div className='relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300' onClick={() => setSelectedMovie(movie.id)}>
              <div className='relative rounded-lg overflow-hidden'>
                <img className='w-full object-cover brightness-90' src={image_base_url + movie.poster_path} alt="" />
                <div className='text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0'>
                  <p className='flex items-center gap-1 text-gray-400'>
                    <StarIcon className='w-4 h-4 text-primary fill-primary' />
                    {movie.vote_average.toFixed(1)}
                  </p>
                  <p className='text-gray-300'>{kConverter(movie.vote_count)}</p>
                </div>
              </div>
              {selectedMovie === movie.id && (
                <div className='absolute top-2 right-2 flex items-center justify-center h-6 w-6 bg-primary rounded'>
                  <CheckIcon className='h-4 w-4 text-white' strokeWidth={2.5}/>
                </div>
              )}
              <p className='text-white/30 text-sm'>{movie.title}</p>
              <p className='text-xs text-white/20'>{movie.release_date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* show price input */}
      <div className='mt-8'>
        <label className='block text-sm font-medium mb-2' htmlFor="">Show Price</label>
        <div className='inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md'>
          <p className='text-gray-400 text-sm'>{currency}</p>
          <input className='outline-none' placeholder='Enter Show Ptice' type="number" min={0} value={showPrice} onChange={(e) => setShowPrice(e.target.value)} />
        </div>
      </div>

      <div className='mt-8'>
        <label className='block text-sm font-medium mb-2' htmlFor="">Select Date And Time</label>
        <div className='inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md'>
          <input className='outline-none rounded-md' type='datetime-local' value={dateTimeInput} onChange={(e) => setDateTimeInput(e.target.value)} />
          <button className='bg-primary/80 text-white px-3  py-2 text-sm rounded-lg hover:bg-primary cursor-pointer' onClick={handleDateTimeAdd}>Add Time</button>
        </div>
      </div>


          {/* display selected date and time */}
          {Object.keys(dateTimeSelection).length > 0 && (
            <div className='mt-6'>
              <h2 className='mb-2'>Selected Date-Tine</h2>
              <ul className='space-y-3'>
                {Object.entries(dateTimeSelection).map(([date,times]) => (
                  <li>
                    <div className='font-medium'>{date}</div>
                    <div className='flex flex-wrap gap-2 mt-1 text-sm'>
                      {times.map((time) => (
                        <div className='border border-primary px-2 py-1 flex items-center rounded'>
                          <span>{time}</span>
                          <DeleteIcon width={15} className='ml-2 text-red-500 hover:text-red-700 cursor-pointer' onClick={() => handleRemoveTime(date,time)}/>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={handleSubmit} disabled={addingShow} className='bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer'>
            Add Show
          </button>
    </div>
  ) : <Loading />
}

export default AddShows
