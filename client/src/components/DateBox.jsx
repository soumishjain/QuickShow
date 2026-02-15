import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import React from 'react'
import BlurBg from './BlurBg'

const DateBox = ({dateTime , id}) => {
  return (
    <div id='dateselect' className='pt-30'>
        <div className='relative flex flex-col md:flex-row items-center justify-between gap-10 p-8 bg-primary/10 border border-primary/20 rounded-lg'>
    <BlurBg top='-100px' left='-100px'/>
    <BlurBg top='100px' right='0px'/>
      <div className='flex gap-4 flex-col'>
        <h3 className='text-lg font-semibold'>Choose Date</h3>
        <div className='flex gap-6 text-sm mt-5 items-center'>
            <ChevronLeftIcon />
            <span className='flex gap-6'>
                {Object.keys(dateTime).map((date) => {
                   return <button className='flex flex-col'>
                        <span>{new Date(date).getDate()}</span>
                    <span>{new Date(date).toLocaleDateString("en-US",{month : "short"})}</span>
                    </button>
                })
            }
            </span>
            <ChevronRightIcon />
        </div>
      </div>
      <a className='bg-primary hover:bg-primary-dull px-4 py-2 rounded-md font-semibold' href="">Buy Tickets</a>
    </div>
    </div>
  )
}

export default DateBox
