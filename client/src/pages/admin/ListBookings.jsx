import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../../assets/assets'
import { Loader } from 'lucide-react'
import Loading from '../../components/Loading'
import Title from '../../components/admin/Title'
import formatDate from '../../lib/isoDateFormat'
import { useAppContext } from '../../context/AppContext'

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY

  const {axios , getToken , user} = useAppContext()

  const [loading,setLoading] = useState(true)
  const [Bookings,setBookings] = useState([])

  const getBookings = async () => {
    try{
      const {data} = await axios.get('/api/admin/all-bookings', {
        headers : {Authorization: `Bearer ${await getToken()}`}
      })
      setBookings(data.bookings)
    }catch(error){
      console.error(error)   
    }

    setLoading(false)

  }

  useEffect(() => {
    if(user){
      getBookings()
    }
  },[user])

  return !loading ? (
    <div>
      <Title text1="List" text2="Shows"/>
      <div className='max-w-4xl mt-6 overflow-x-auto'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
          <thead>
            <tr className='bg-primary/20 text-left text-white'>
              <th className='p-2 font-medium'>User Name</th>
              <th className='p-2 font-medium'>Movie Time</th>
              <th className='p-2 font-medium'>Show Time</th>
              <th className='p-2 font-medium'>Seats</th>
              <th className='p-2 font-medium'>Amount</th>
            </tr>
          </thead>
          <tbody className='text-sm font-light'>
            {Bookings.map((item,index) => (
              <tr className='border-b border-primary/10 bg-primary/5 even:bg-primary/10'>
                <td className='p-2 min-w-45 pl-5'>{item.user.name}</td>
                <td className='p-2'>{item.show.movie.title}</td>
                <td className='p-2'>{formatDate(item.show.showDateTime)}</td>
                <td className='p-2'>{Object.keys(item.bookedSeats).map(seat => item.bookedSeats[seat]).join(", ")}</td>
                <td className='p-2'>{currency} {item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : <Loading />
}

export default ListBookings
