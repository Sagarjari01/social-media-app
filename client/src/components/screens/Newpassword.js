import React, {useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import M from 'materialize-css'


const Signin = () => {
    const navigate = useNavigate()
    const [password, setPassword] = useState("")
    const { token } = useParams()
    // console.log(token)
    const postData = () => {
        fetch("https://social-media-backend-3nkr.onrender.com/new-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token
            })
        }).then(res =>  res.json())
        .then(data => {
            // console.log(data)
            if(data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }
            else{
                M.toast({html:data.message,classes:"#00c853 green accent-4"})
                navigate('/signin')
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
                type="password" 
                placeholder="Enter a new password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)} />
                <button className="waves-effect waves-light btn #2979ff blue accent-3" 
                onClick={()=>postData()}>Update Password</button>
            </div>
        </div>
    )
}

export default Signin