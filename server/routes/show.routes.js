import express from 'express'
import { getNowPlayingMovies } from '../src/controllers/show.controller.js'

const showRouter = express.Router()

showRouter.get('/now-playing',getNowPlayingMovies )

export default showRouter