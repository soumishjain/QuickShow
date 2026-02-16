import React, { useEffect, useState } from 'react'
import { assets, dummyDateTimeData, dummyShowsData } from '../assets/assets'
import Loading from '../components/Loading'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, ArrowRightIcon, ClockIcon } from 'lucide-react'
import isoTimeFormat from '../lib/isoTimeFormat'
import BlurBg from '../components/BlurBg'
import toast from 'react-hot-toast'

const SeatLayout = () => {

  const groupRows = [["A","B"], ["C","D"],["E","F"],["G","H"],["I","J"]] 

  const {id , date} = useParams()
  const [selectedSeats,setSelectedSeats] = useState([])
  const [selectedTime,setSelectedTime] = useState(null)
  const [show,setShow] = useState(null)

  const navigate = useNavigate()

  const getShow = async () => {
    const show = dummyShowsData.find(show => show._id === id)
    if(show){
      setShow({
        movie : show,
        dateTime : dummyDateTimeData
      })
    }
  }

  const handleSeatClick = (seatId) => {
    if(!selectedTime){
      return toast("please select time first")
    }
    if(!selectedSeats.includes(seatId) && selectedSeats.length > 4){
      return toast("you can only select 5 seats")
    }
    setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev , seatId])
  }

  const renderSeats = (row,count = 9) => (
    <div key={row} className='flex gap-2 mt-2'>
      <div className='flex flex-wrap items-center justify-center gap-2'>
        {Array.from({length: count},(_, i) => {
          const seatId = `${row}${i+1}`;
          return (
            <button onClick={() => handleSeatClick(seatId)} className={`h-8 w-8 rounded border border-primary/60 cursor-pointer ${selectedSeats.includes(seatId) && "bg-primary text-white"}`}>
              {seatId}
            </button>
          )
        })}
      </div>
    </div>
  )

  useEffect(() => {
    getShow()
  },[])

  return show ? (
    <div className='flex flex-col gap-5 md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50'>
      <div className='flex flex-col gap-5 border border-primary/20 rounded-lg h-max w-60 max-md:w-full max-md:py-5 py-10 bg-primary/20'>
          <p className='text-lg max-md:text-center font-semibold px-6'>Available Timings</p>
          <div className='mt-5 max-md:mt-0 max-md:justify-center max-md:flex space-y-1'>
            {show.dateTime[date].map((item) => (
            <div onClick={() => setSelectedTime(item)} className={`flex gap-2 items-center px-6 py-2 w-max rounded-r-md max-md:rounded-md cursor-pointer transition ${selectedTime?.time === item.time ? 'bg-primary text-white' : 'hover:bg-primary/20'}`}>
              <ClockIcon className='w-4 h-4'/>
              <p className='text-sm'>{isoTimeFormat(item.time)}</p>
            </div>
          ))}</div>
      </div>

      <div className='relative flex items-center flex-1 flex-col '>
        <BlurBg top='-100px' left='-100px'/>
        <BlurBg bottom='0px' right='0px'/>
        <h1 className='text-2xl font-semibold mb-4'>Select Your Seats</h1>
        <img src={assets.screenImage} alt="" />
        <p className='text-sm mb-6 text-gray-400'>Screen This Side</p>

          <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
            <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
              {groupRows[0].map(row => renderSeats(row))}
            </div>

          <div className='grid grid-cols-2 gap-11'>
            {groupRows.slice(1).map((group,idx) => (
              <div>
                {group.map(row => renderSeats(row))}
              </div>
            ))}
          </div>
          </div>

          <button onClick={() => navigate('/my-bookings')} className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95'>Proceed To Checkout <ArrowRightIcon strokeWidth={3} className='w-4 h-4'/></button>

      </div>
    </div>
  ) : (<Loading />)
}

export default SeatLayout
