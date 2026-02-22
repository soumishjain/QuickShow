import axios from 'axios'
import movieModels from '../models/movie.models.js'
import showModel from '../models/show.models.js'


export const getNowPlayingMovies = async (req,res) => {
    try{
        const {data} = await axios.get('https://api.themoviedb.org/3/movie/now_playing',{
            headers : {Authorization : `Bearer ${process.env.TMDB_API_KEY}`}
        })

        const movies = data.results
        res.json(
            {success : true,
                movies : movies
            }
        )
    }catch(err){
        console.log(err)
        res.json({success : false, message : err.message})
    }
}

export const addShow = async (req,res) => {
    try{
        const {movieId , showsInput,showPrice} = req.body
        let movie = await movieModels.findOne({id : movieId})
        if(!movie){
        const [movieDetailsResponse,movieCreditsResponse] = await Promise.all(
            [
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`,{
            headers : {Authorization : `Bearer ${process.env.TMDB_API_KEY}`}
        }),

        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`,{
            headers : {Authorization : `Bearer ${process.env.TMDB_API_KEY}`}
        })
            ]
        )

        const movieApiData = movieDetailsResponse.data
        const creditsApiData = movieCreditsResponse.data

        const movieDetails = {
            id : movieId,
            title : movieApiData.title,
            overview : movieApiData.overview,
            poster_path : movieApiData.poster_path,
            backdrop_path : movieApiData.backdrop_path,
            genres : movieApiData.genres,
            casts : creditsApiData.casts,
            release_date : movieApiData.release_date,
            original_language : movieApiData.original_language,
            tagline : movieApiData.tagline || "",
            vote_average : movieApiData.vote_average,
            runtime : movieApiData.runtime
        }

        movie = await movieModels.create(movieDetails)
        }

        const showsToCreate = [];
        showsInput.forEach(show => {
            const showDate = show.date;
            show.time.forEach((time) => {
                const dateTimeString = `${showDate}T${time}`
                showsToCreate.push({
                    movie : movieId,
                    showDateTime : new Date(dateTimeString),
                    showPrice,
                    occupiedSeats : {}
                })
            })
        })

        if(showsToCreate.length > 0){
            await showModel.insertMany(showsToCreate)
        }

        res.json({success : true, message : "Show added successfully"})

    }catch(err){
         console.log(err)
        res.json({success : false, message : err.message})
    }
}


export const getShows = async (req,res) => {
    try{
        const shows = await showModel.find({showDateTime : {$gte : new Date()}}).populate('movie').sort({showDateTime : 1})

        const uniqueShows = new Set((shows.map(show => show.movie)))

        res.json({success : true , shows : Array.from(uniqueShows)})

    }catch(err){
        console.error(err)
        res.json({success : false, message : err.message})
    }
}

export const getShow = async (req,res) => {
    try{
        const {movieId} = req.params;
        const shows = await showModel.find({movie : movieId, showDateTime : {$gte : new Date()}})

        const movie = await movieModels.findOne({id : movieId})
        const dateTime = {}
        shows.forEach(show => {
            const date = show.showDateTime.toISOString().split("T")[0];
            if(!dateTime[date]) {
                dateTime[date] = []
            }

            dateTime[date].push({time : show.showDateTime, showId : show.id})

        })
        res.json({success : true , movie, dateTime})
    }catch(err){
console.error(err)
        res.json({success : false, message : err.message})
    }
}