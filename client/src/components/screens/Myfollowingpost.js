import React,{useState,useEffect,useContext} from "react"
import { UserContext } from "../../App"
import { Link } from "react-router-dom"
const MyFollowingPost = () => {
    const [data,setData] = useState([])
    const {state, dispatch} = useContext(UserContext)
    useEffect(()=>{
        fetch('/getsubpost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setData(result.posts)
        })
    },[])
    
    const likePost = (id) => {
        fetch('https://social-media-backend-3nkr.onrender.com/like',{
            method:"put",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.map(item=>{
                
                if(item._id===result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const unlikePost = (id) => {
        fetch('https://social-media-backend-3nkr.onrender.com/unlike',{
            method:"put",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const makeComment = (text, postId) => {
        fetch('https://social-media-backend-3nkr.onrender.com/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const deletePost = (postid)=>{
        fetch(`https://social-media-backend-3nkr.onrender.com/deletepost/${postid}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }
    
    return(
        <div className="home">
            {
                data.map(item=>{
                    return(
                        <div className="card home-card" key={item._id}>
                            <h5 style={{padding:"6px"}}><Link to={item.postedBy._id !== state._id ? "profile/"+item.postedBy._id :  "profile/"}>{item.postedBy.name}</Link> {item.postedBy._id === state._id && <i className="material-icons" 
                            style={{float:"right",cursor:"pointer"}}
                            onClick={()=>deletePost(item._id)}>delete</i> } </h5>
                            <div className="card-image">
                                <img alt={item.title} src={item.photo} />
                            </div>
                            <div className="card-content">              
                            {item.likes.includes(state._id)
                            ? <i className="material-icons" style={{color:"red",cursor:"pointer"}} onClick={()=>unlikePost(item._id)}>favorite</i>
                            : <i className="material-icons" style={{cursor:"pointer"}} onClick={()=>likePost(item._id)}>favorite_border</i>}
                                <h6>{item.likes.length} likes</h6>
                                <h5>{item.title}</h5>
                                <p>{item.body}</p>
                                {
                                    
                                    item.comments.map(record=>{
                                        return(
                                            <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                   makeComment(e.target[0].value,item._id)
                                }}>
                                    <input type="text" placeholder="add a comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
            } 
        </div>
    )
}

export default MyFollowingPost