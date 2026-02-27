import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, Calendar1Icon, ChevronLeft, ChevronRight, CircleArrowOutUpRight, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import Loading from './Loading'
const HeroSection = () => {
    const navigate = useNavigate()

    const [current , setCurrent] = useState(0)

    const {shows , image_base_url} = useAppContext()

    useEffect(() => {
      if(!shows.length) return;
      const interval = setInterval(() => {
        setCurrent(prev => (prev + 1) % shows.length)
      },5000 )

      return () => clearInterval(interval)
    },[shows])

    const handlePrev = () => {
      setCurrent(prev => (prev == 0 ? shows.length - 1 : prev - 1))
    }

     const handleNext = () => {
    setCurrent(prev => (prev + 1) % shows.length)
  }

    const movie = shows[current]




  return shows.length > 0 ? (
    <div
      className="relative min-h-screen bg-center bg-cover transition-all duration-1000"
      style={{
        backgroundImage: movie
          ? `url(${image_base_url}${movie.backdrop_path})`
          : ''
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>

      {/* Left Arrow */}
      <button
        onClick={handlePrev}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 p-3 rounded-full transition"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={handleNext}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 p-3 rounded-full transition"
      >
        <ChevronRight size={28} />
      </button>

      {movie && (
        <div className="relative z-10 px-6 md:px-16 lg:px-36 pt-60 max-w-3xl text-white space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            {movie.title}
          </h1>

          <div className="flex gap-4 flex-wrap text-sm md:text-base">
            <p className="flex items-center gap-1">
              <Calendar1Icon size={18} />
              {movie.release_date}
            </p>

            <p className="flex items-center gap-1">
              <ClockIcon size={18} />
              {Math.floor(movie.runtime / 60)}hr {movie.runtime % 60}min
            </p>
          </div>

          <p className="text-sm md:text-base line-clamp-3">
            {movie.overview}
          </p>

          <button
            onClick={() => navigate('/movies')}
            className="group mt-10 flex bg-primary hover:bg-primary-dull rounded-full px-6 py-3 w-fit"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-300">
              Explore Movies
            </span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      )}
    </div>
  ) : <Loading />
}

export default HeroSection
