import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, Calendar1Icon, CircleArrowOutUpRight, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
const HeroSection = () => {
    const navigate = useNavigate()
  return (
    <div className='bg-[url("/backgroundImage.png")]  min-h-screen bg-center bg-cover px-6 md:px-16 lg:px-36 '>
        <div className="absolute bottom-0 left-0 w-full h-42 bg-gradient-to-t 
                from-black via-black/40 to-transparent 
                pointer-events-none"> </div>
       <div className='flex flex-col gap-4 max-sm:w-80 w-120'>
         <img className='mt-50 md:w-40 max-md:w-30' src={assets.marvelLogo} alt="" />
        <h1 className='max-md:text-4xl md:text-6xl font-semibold max-w-100'>Guardian <br /> of the Galaxy</h1>
        <div className='flex gap-2 max-md:text-md flex-wrap'>
            <p>Action | </p>
            <p>Adventure | </p>
            <p>Scifi</p>
            <p className='flex gap-2'><Calendar1Icon className='h-5 w-5' /> 2018</p>
            <p className='flex gap-2'><ClockIcon /> 2h 8m</p>
      </div>
      <p className='max-md:text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut necessitatibus nesciunt autem, assumenda porro fuga cupiditate quisquam et sunt quam? Explicabo deserunt similique at, culpa sequi in vitae numquam voluptate!</p>
            <button onClick={() => navigate('/movies')} className='group mt-2 flex bg-primary hover:bg-primary-dull flex-1 rounded-full px-4 py-2 w-fit'>
                <span className='group-hover:-translate-x-1 transition-transform duration-300'>Explore Movies</span>
                <ArrowRight className='group-hover:translate-x-1 transition-transform duration-300'/>
            </button>
       </div>
    </div>
  )
}

export default HeroSection
