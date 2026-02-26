import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { useAppContext } from '../context/AppContext'

const Navbar = () => {
    const [isOpen,setIsOpen] = useState(false)
    const {user} = useUser()
    const {openSignIn} = useClerk()
    const navigate = useNavigate()
    const {favoritesMovies} = useAppContext()

  return (
    <div className='fixed top-0 z-50 max-md:px-6 max-md:py-4 px-20 py-8 w-full flex items-center justify-between max-md:justify-between gap-8'>
        <Link onClick={() => {scrollTo(0,0);}} to='/'>
        <img className='flex-1' src={assets.logo} alt="" />
        </Link>

        <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg max-md:h-screen flex max-md:flex-col backdrop-blur transition-[width] duration-300 max-md:items-center max-md:justify-center gap-6 md:border border-gray-300/20 overflow-hidden bg-black/70 px-5 py-3 md:bg-white/10
          md:rounded-full  ${isOpen ? 'max-md:w-full' : 'max-md:w-0 max-md:-translate-x-full'}`}>
            <XIcon onClick={() => setIsOpen(false)} className='md:hidden max-md:absolute top-3 right-7'/>
            <NavLink className={({isActive}) => `${isActive ? 'text-primary underline' : ''}`} onClick={() => {scrollTo(0,0); setIsOpen(false)}} to='/'>Home</NavLink>
            <NavLink className={({isActive}) => `${isActive ? 'text-primary underline' : ''}`} onClick={() => {scrollTo(0,0); setIsOpen(false)}} to='/movies'>Movies</NavLink>
            <NavLink className={({isActive}) => `${isActive ? 'text-primary underline' : ''}`} onClick={() => {scrollTo(0,0); setIsOpen(false)}} to='/releases'>Releases</NavLink>
            <NavLink className={({isActive}) => `${isActive ? 'text-primary underline' : ''}`} onClick={() => {scrollTo(0,0); setIsOpen(false)}} to='/my-bookings'>My Bookings</NavLink>
            {favoritesMovies.length > 0 && <NavLink className={({isActive}) => `${isActive ? 'text-primary underline' : ''}`} onClick={() => {scrollTo(0,0); setIsOpen(false)}} to='/favourite'>Favourites</NavLink>}
        </div>

        <div className='flex items-center gap-4'>
        <SearchIcon className='max-md:hidden' />
        {
            !user ? (
                <button onClick={openSignIn} className='bg-primary px-4 py-1 hover:bg-primary-dull font-semibold cursor-pointer rounded-full px-'>Login</button>
            ) : (
                <UserButton>
                    <UserButton.MenuItems>
                        <UserButton.Action label='My Bookings' labelIcon={<TicketPlus width={15} />} onClick={() => navigate('/my-bookings')}/>
                    </UserButton.MenuItems>
                </UserButton>
            )
        }
        <MenuIcon onClick={() => setIsOpen(!isOpen)} className='cursor-pointer min-md:hidden h-8 w-8'/>
        </div>
        
    </div>
  )
}

export default Navbar
