import React, {useState, useContext} from "react"
import { Link, useNavigate } from "react-router-dom"
import M from 'materialize-css'
import {UserContext} from '../../App'

const Signin = () => {
    const {state,dispatch} = useContext(UserContext)
    const navigate = useNavigate()
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const postData = () => {
        // eslint-disable-next-line
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
           return M.toast({html: 'Invalid Email',classes:"#c62828 red darken-3"})
        }
        fetch("https://social-media-backend-3nkr.onrender.com/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        }).then(res =>  res.json())
        .then(data => {
            // console.log(data)
            if(data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html: "SignedIn Successfully",classes:"#00c853 green accent-4"})
                navigate('/')
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input 
                type="text" 
                placeholder="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)} />
                <input 
                type="password" 
                placeholder="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)} />
                <button className="waves-effect waves-light btn #2979ff blue accent-3" 
                onClick={()=>postData()}>Login</button>
                <h5>
                    <Link to="/signup">Don't have an account?</Link>
                </h5>
                <h6>
                    <Link to="/reset">Forgot Password?</Link>
                </h6>
            </div>
        </div>
    )
}

export default Signin