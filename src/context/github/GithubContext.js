import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";
const GithubContext = createContext()

//Github URL

export const GithubProvider =({children}) => {
    const initialState = {
        users:[],
        user:{},
        repos: [],
        loading: false
    }

    const [state,dispatch] = useReducer(githubReducer,initialState)

    const getUser = async (login) => {
        setLoading(true)
        
        const response = await fetch(`https://api.github.com/users/${login}`)

        if(response.status===404){
            window.location = '/notfound'
        }else{
            const data = await response.json()
            dispatch({
                type:'GET_USER',
                payload:data,
            })
        }
        
    }
    //Get User Repos
    const getUserRepos = async (login) => {
        setLoading()

        const params = new URLSearchParams({
            sort: 'created',
            per_page:10
        })

        const response = await fetch(`https://api.github.com/users/${login}/repos?${params}`)
        const data = await response.json()
        dispatch({
            type:'GET_REPOS',
            payload:data,
        })
    }

    const searchUsers = async (text) => {
        setLoading()
        const params = new URLSearchParams({
            q:text
        })
        const response = await fetch(`https://api.github.com/search/users?${params}`)
        const {items} = await response.json()
        dispatch({
            type:'GET_USERS',
            payload:items,
        })
    }

    //clear users from state
    const clearUsers = () => dispatch({type:'CLEAR_USERS'})


    //set Loading
    const setLoading = () => dispatch({type:'SET_LOADING'})

    return <GithubContext.Provider value={{
        users:state.users,
        loading : state.loading,
        user: state.user,
        repos:state.repos,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
    }}>
        {children}
    </GithubContext.Provider>
}
export default GithubContext