import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import axios from 'axios'
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const AppContext = createContext()

export const AppProvider = ({children}) => {

    const [isAdmin , setIsAdmin] = useState(false)
    const [shows,setShows] = useState([])
    const [favoritesMovies,setFavoritesMovies] = useState([])

    const user = useUser()
    const {getToken} = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const fetchIsAdmin = async () => {
        try{
            const {data} = await axios.get('/api/admin/is-admin',{headers: {Authorization : `Bearer ${await getToken()}`}})
            setIsAdmin(data.isAdmin)

            if(!data.isAdmin && location.pathname.startsWith('/admin')){
                navigate('/')
                toast.error("You are not Authorized to acces this dashboard")
            }

        }catch(err){
            console.log(err)
        }
    }


    const fetchShows = async () => {
        try {
            const {data} = await axios.get('/api/show/all')

            if(data.success){
                setShows(data.shows)
            }else{
                toast.error(error)
            }

        }catch(error){
            console.log(error)
        }
    }

    const fetchFavMovies = async ()=> {
        try{
            const {data} = await axios.get('/api/user/favorites',{headers : {Authorization: `Bearer ${await getToken()}`}})

            if(data.success){
                setFavoritesMovies(data.movies)
            }else{
                toast.error(data.message)
            }

        }catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        fetchShows()
    },[])



    useEffect(() => {
        if(user){
            fetchIsAdmin()
            fetchFavMovies()
        }
    },[user])

    const value = {
        axios,
        fetchIsAdmin,
        user,getToken,navigate,isAdmin,shows,
        favoritesMovies,fetchFavMovies
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)