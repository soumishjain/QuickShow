import React from 'react'
import { assets } from '../../assets/assets'
import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

const AdminSidebar = () => {

    const user = {
        firstName : 'Admin',
        lastName : 'User',
        imageUrl : assets.profile
    }

    const adminNavLinks = [
        {name: "Dashboard" , path: '/admin' , icon : LayoutDashboardIcon},
        {name: "Add Shows" , path: '/admin/add-shows' , icon : PlusSquareIcon},
        {name: "List Shows" , path: '/admin/list-shows' , icon : ListIcon},
        {name: "List Bookings" , path: '/admin/list-bookings' , icon : ListCollapseIcon},
    ]

  return (
    <div className='flex flex-col items-center gap-5 max-md:w-30 w-60 h-[calc(100vh-64px)] border-r-2 border-white/10'>
      <div className='flex flex-col gap-2 items-center'>
        <img className='rounded-full mt-10 h-17 max-md:h-12 aspect-square' src={user.imageUrl} alt="" />
      <h2 className='text-md font-semibold'>{user.firstName} {user.lastName}</h2>
      </div>
      <div className='flex flex-col w-full'>
        {adminNavLinks.map((link,index) => (
            <NavLink end to={link.path} className={({isActive}) => `text-sm  flex w-full py-2 max-md:pl-1 pl-10 gap-2 items-center ${isActive ? "bg-primary/30 max-md:border-r-5  font-semibold border-r-8 border-primary/70 text-primary" : "text-white/50"}`} ><link.icon/> {link.name}</NavLink>
        )
        )}
      </div>
    </div>
  )
}

export default AdminSidebar
