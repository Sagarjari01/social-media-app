import React, {useState, useContext} from "react"
import { Link, useNavigate } from "react-router-dom"
import M from 'materialize-css'

const Reset = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const postData = () => {
        // eslint-disable-next-line
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
           return M.toast({html: 'Invalid Email',classes:"#c62828 red darken-3"})
        }
        fetch("/reset-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email
            })
        }).then(res =>  res.json())
        .then(data => {
            if(data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }
            else{
                M.toast({html: data.message,classes:"#00c853 green accent-4"})
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
                type="text" 
                placeholder="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)} />
                <button className="waves-effect waves-light btn #2979ff blue accent-3" 
                onClick={()=>postData()}>Reset password</button>
            </div>
        </div>
    )
}

export default Reset