import React,{createContext,useReducer,useEffect,useContext} from "react";
import './App.css'
import NavBar from "./components/NavBar";
import {BrowserRouter, Route,Routes,useNavigate} from "react-router-dom"
import Home from "./components/screens/home";
import Signup from "./components/screens/signup";
import Signin from "./components/screens/signin"
import Profile from "./components/screens/profile";
import CreatePost from './components/screens/createPost'
import {reducer,intialState} from './reducer/userReducer'
import UserProfile from './components/screens/UserProfile'
import MyFollowingPost from "./components/screens/Myfollowingpost";
import Reset from './components/screens/Reset'
import Newpassword from './components/screens/Newpassword'
export const UserContext = createContext()

const Routing = () => {
  const navigate = useNavigate()
  const { dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }
    else{
      if(!navigate('/reset')){
        navigate('/signin')
      }
      // if(!navigate.location.pathname.startsWith('/reset')){
      //   navigate.push('/signin')

      // }
    }
  },[])
  return(
    <Routes>
      <Route exact path="/" element={<Home />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
      <Route path="/signin" element={<Signin />}></Route>
      <Route exact path="/profile" element={<Profile />}></Route>
      <Route path="/createpost" element={<CreatePost />}></Route>
      <Route path="/profile/:userid" element={<UserProfile />}></Route>
      <Route path="/myfollowingpost" element={<MyFollowingPost />}></Route>
      <Route exact path="/reset" element={<Reset />}></Route>
      <Route path="/reset/:token" element={<Newpassword />}></Route>
    </Routes>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,intialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
