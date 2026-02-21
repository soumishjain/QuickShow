import axios from 'axios'
import movieModels from '../models/movie.models.js'


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
        const movie = await movieModels.findbyId(movieId)
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
    }catch(err){
         console.log(err)
        res.json({success : false, message : err.message})
    }
}