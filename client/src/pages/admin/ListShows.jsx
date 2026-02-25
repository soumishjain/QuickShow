import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets'
import { Loader } from 'lucide-react'
import Loading from '../../components/Loading'
import Title from '../../components/admin/Title'
import formatDate from '../../lib/isoDateFormat'
import { useAppContext } from '../../context/AppContext'

const ListShows = () => {

  const currency = import.meta.env.VITE_CURRENCY

  const {axios, getToken , user} = useAppContext()

  const [shows,setShows] = useState([])
  const [loading,setLoading] = useState(true)
  
  
  const getShows = async () => {
    try{
      const {data} = await axios.get('/api/admin/all-shows',{
        headers : {Authorization : `Bearer ${await getToken()}`}
      })
      setShows(data.shows)

      setLoading(false)
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if(user){
      getShows()
    }
  },[user])

  return !loading ? (
    <div>
      <Title text1="List" text2="Shows"/>
      <div className='max-w-4xl mt-6 overflow-x-auto'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
          <thead>
            <tr className='bg-primary/20 text-left text-white'>
              <th className='p-2 font-medium'>Movie Name</th>
              <th className='p-2 font-medium'>Show Time</th>
              <th className='p-2 font-medium'>Total Bookings</th>
              <th className='p-2 font-medium'>Earnings</th>
            </tr>
          </thead>
          <tbody className='text-sm font-light'>
            {shows.map((show,index) => (
              <tr className='border-b border-primary/10 bg-primary/5 even:bg-primary/10'>
                <td className='p-2 min-w-45 pl-5'>{show.movie.title}</td>
                <td className='p-2'>{formatDate(show.showDateTime)}</td>
                <td className='p-2'>{Object.keys(show.occupiedSeats)}</td>
                <td className='p-2'>{currency} {Object.keys(show.occupiedSeats).length*show.showPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : <Loading />
}

export default ListShows
