import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import React, { useState } from 'react'
import BlurBg from './BlurBg'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const DateBox = ({dateTime , id}) => {

  const [selected,setSelected] = useState(null)
  const navigate = useNavigate()

  function bookHandler(){
    if(!selected){
      return toast('Please Select a Date')
    }
    navigate(`/movies/${id}/${selected}`)
  }

  return (
    <div id='dateselect' className='pt-30'>
        <div className='relative flex flex-col md:flex-row items-center justify-between gap-10 p-8 bg-primary/10 border border-primary/20 rounded-lg'>
    <BlurBg top='-100px' left='-100px'/>
    <BlurBg top='100px' right='0px'/>
      <div className='flex gap-4 flex-col'>
        <h3 className='text-lg font-semibold max-md:text-center'>Choose Date</h3>
        <div className='flex gap-6 text-sm mt-5 items-center'>
            <ChevronLeftIcon width={28}/>
            <span className='flex gap-6'>
                {Object.keys(dateTime).map((date) => {
                   return <button onClick={() => setSelected(date)} className={`flex cursor-pointer hover:bg-black/20 transition duration-100 h-14 w-14 aspect-square items-center justify-center rounded flex-col ${selected === date ? 'bg-primary text-white' : 'border-primary/70 border'}`}>
                        <span>{new Date(date).getDate()}</span>
                    <span>{new Date(date).toLocaleDateString("en-US",{month : "short"})}</span>
                    </button>
                })
            }
            </span>
            <ChevronRightIcon width={28}/>
        </div>
      </div>
      <button onClick={bookHandler} className='bg-primary cursor-pointer hover:bg-primary-dull px-4 py-2 rounded-md font-semibold' href="">Buy Tickets</button>
    </div>
    </div>
  )
}

export default DateBox
