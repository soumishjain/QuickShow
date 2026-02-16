import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UsersIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Title from '../../components/admin/Title'
import BlurBg from '../../components/BlurBg'
import { dummyDashboardData } from '../../assets/assets'
import Loading from '../../components/Loading'
import formatDate from '../../lib/isoDateFormat'

const DashBoard = () => {

    const currency = import.meta.env.VITE_CURRENCY

    const [dashboardData, setdashBoardData] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        activeShows: [],
        totalUser: 0
    })

    const [loading, setLoading] = useState(true)

    const dashboardCards = [
        { title: "Total Bookings", value: dashboardData.totalBookings || 0, icon: ChartLineIcon },
        { title: "Total Revenue", value: currency + dashboardData.totalRevenue || 0, icon: CircleDollarSignIcon },
        { title: "Active Shows", value: dashboardData.activeShows?.length || 0, icon: PlayCircleIcon },
        { title: "Total Users", value: dashboardData.totalUser || 0, icon: UsersIcon }
    ]

    const fetchDashboardData = async () => {
        setdashBoardData(dummyDashboardData)
        setLoading(false)
    }

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return !loading ? (
        <div className='flex flex-col gap-10'>
            <BlurBg />
            <Title text1={"Admin"} text2={"Dashboard"} />
            <div className='flex flex-wrap gap-5'>
                {dashboardCards.map((card) => (
                    <div className='flex rounded-lg px-5 py-3 justify-between w-60 flex-wrap bg-primary/8 border border-primary/20 items-center'>
                        <div className='flex flex-col gap-4'>
                            <p className='text-sm'>{card.title}</p>
                            <p className='text-2xl'>{card.value}</p>
                        </div>
                        <card.icon className='w-8 h-8' />
                    </div>
                ))}
            </div>

            <h1 className='font-semibold text-xl'>Active Shows</h1>
            <div className='flex flex-wrap gap-5'>
                {dashboardData.activeShows.map(show => (
                    <div className='w-60 hover:-translate-y-2 transition-all duration-100 rounded-lg border bg-primary/8 border-primary/20'>
                        <img className='w-full h-70 object-cover rounded-t-lg ' src={show.movie.poster_path} alt="" />
                        <div className='px-3 py-2 flex flex-col gap-2'>
                            <h1 className='font-semibold text-lg'>{show.movie.title}</h1>
                            <div className='flex justify-between items-center'>
                                <h1 className='text-2xl font-bold'>{currency + show.showPrice}</h1>
                                <p className='flex gap-1 items-center '><StarIcon className='text-primary h-5 w-5' fill='currentColor' /> <span className='text-white/50 text-sm'>{show.movie.vote_average.toFixed(1)}</span></p>
                            </div>
                            <p className='text-sm text-white/50'>{formatDate(show.showDateTime)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ) : <Loading />
}

export default DashBoard
