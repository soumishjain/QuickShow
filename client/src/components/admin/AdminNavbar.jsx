import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const AdminNavbar = () => {
  return (
    <div className='w-full border-b-2 border-white/10 px-5 py-3'>
        <Link to='/'>
      <img className='h-7' src={assets.logo} alt="" />
    </Link>
    </div>
  )
}

export default AdminNavbar
