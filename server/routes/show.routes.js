import express from 'express'
import { addShow, getHomeTrailers, getNowPlayingMovies, getShow, getShows, getUpcomingMovies } from '../src/controllers/show.controller.js'
import { protectAdmin } from '../src/middleware/auth.js'


const showRouter = express.Router()

showRouter.get('/now-playing',protectAdmin,getNowPlayingMovies )
showRouter.get('/home-trailers', getHomeTrailers)
showRouter.get('/upcoming',getUpcomingMovies)
showRouter.post('/add',protectAdmin,addShow)
showRouter.get('/all',getShows)
showRouter.get('/:movieId',getShow)

export default showRouter