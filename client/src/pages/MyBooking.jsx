import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import BlurBg from '../components/BlurBg'
import isoTimeFormat from '../lib/isoTimeFormat'
import formatDate from '../lib/isoDateFormat'
import { useAppContext } from '../context/AppContext'

const MyBooking = () => {
  const [myBookings,setMyBookings] = useState([])
  const [isLoading,setIsLoading] = useState(true)

  const {axios,getToken,user,image_base_url} = useAppContext()

  async function getMyBookings(){
    try{
      const {data} = await axios.get('/api/user/bookings', {
        headers : {
          Authorization : `Bearer ${await getToken()}`
        }
      })
      console.log(data.bookings)
      if(data.success) setMyBookings(data.bookings)
        setIsLoading(false)
    } catch(error){
  console.log(error)
}
  }

  useEffect(() => {
    if(user){
      getMyBookings()
    }
    
  },[user])

  return !isLoading ? (
    <div className='relative mt-40 max-md:mt-30 md:px-60 max-md:px-10'>
      <BlurBg top='20px' left='80px'/>
      <BlurBg bottom='100px' right='200px'/>
      <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>
      <div className='flex flex-col gap-3'>
        {myBookings.map(booking => (
          <div className='flex gap-5 p-2 border border-primary/20 bg-primary/8 rounded-lg max-w-3xl'>
            <img className='w-45 max-md:w-20 max-md:aspect-square max-md:h-20 h-30 object-cover object-top rounded-lg' src={image_base_url + booking.show.movie.poster_path} alt="" />
            <div className='flex justify-between w-full max-md:flex-col max-md:gap-2'>
              <div className='flex flex-col justify-center'>
                <h3 className='text-lg font-semibold '>{booking.show.movie.title}</h3>
              <p className='text-white/30 text-sm'>{Math.floor(booking.show.movie.runtime / 60)}hr {booking.show.movie.runtime % 60}min</p>
              <p className='text-white/30 text-sm'>{formatDate(booking.show.showDateTime)}</p>
              </div>
              <div className='flex gap-2 flex-col items-end justify-center '>
                <div className='flex items-center gap-2'>
                  <h1 className='text-2xl max-md:text-lg font-bold'>${booking.amount}</h1>
                  {booking.isPaid === false ? <button className='flex px-4 font-semibold py-1 items-center text-sm bg-primary hover:bg-primary-dull transition rounded-full cursor-pointer'>Pay Now</button> : <></>}
                </div>
              <p className='flex text-white/30 text-sm'><span>Total Tickets: </span>{booking.bookedSeats.length}</p>
              <p className='flex text-white/30 text-sm'><span>Seat Number: </span>{booking.bookedSeats.map((seats,idx) => (
                <p className='text-white/30 text-sm'>{seats}{idx === booking.bookedSeats.length - 1 ? "" : ", "}</p>
              ))}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : <Loading />
}

export default MyBooking