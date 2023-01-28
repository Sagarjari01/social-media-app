import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'
const Profile  = ()=>{
    const [userProfile,setProfile] = useState(null)

    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showFollow,setShowFollow] = useState(state?!state.followers.includes(userid):true)

    useEffect(()=>{
       fetch(`https://social-media-backend-3nkr.onrender.com/user/${userid}`,{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt"),
           }
       }).then(res=>res.json())
       .then(result=>{
            // console.log(result)
            setProfile(result)
       })
    },[])

    const followUser = () => {
        fetch("https://social-media-backend-3nkr.onrender.com/follow",{
            method:"put",
            headers:{
                "Content-Type":"Application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            // console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            setShowFollow(false)
        })
    }

    const unfollowUser = () => {
        fetch("https://social-media-backend-3nkr.onrender.com/unfollow",{
            method:"put",
            headers:{
                "Content-Type":"Application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            // console.log(data)
            dispatch({type:"UPDATE",payload:{followers:data.followers,following:data.following}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item!=data._id)
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            })
            setShowFollow(true)
        })
    }

   return (
       <>
       {userProfile ? 
       <div style={{maxWidth:"550px",margin:"0px auto"}}>
           <div style={{
               display:"flex",
               justifyContent:"space-around",
               margin:"18px 0px",
               borderBottom:"1px solid grey"
           }}>
               <div>
                   <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                   src={userProfile.user.pic} />
               </div>
               <div>
                   <h4>{userProfile.user.name}</h4>
                   <h5>{userProfile.user.email}</h5>
                   <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                       <h6>{userProfile.posts.length} posts</h6>
                       <h6>{userProfile.user.followers.length} followers</h6>
                       <h6>{userProfile.user.following.length} following</h6>
                   </div>
                   {showFollow ?
                   <button style={{margin:"10px"}} className="waves-effect waves-light btn #2979ff blue accent-3" 
                onClick={()=>followUser()}>Follow</button>
                    :
                    <button style={{margin:"10px"}} className="waves-effect waves-light btn #2979ff blue accent-3" 
                onClick={()=>unfollowUser()}>UNFollow</button>
                    }
               </div>
           </div>
     
           <div className="gallery">
               {
                   userProfile.posts.map(item=>{
                       return(
                        <img key={item._id} className="item" src={item.photo} alt={item.title}/>  
                       )
                   })
               }
           </div>
       </div>

       :
       
       <h2 style={{textAlign:"center"}}>Loading...!</h2>
       }
       
       </>
   )
}


export default Profile