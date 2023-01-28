import React,{ useContext,useRef,useEffect,useState } from "react"
import { Link , useNavigate } from "react-router-dom"
import { UserContext } from '../App'
import M from 'materialize-css'

const NavBar = () => {
    const navigate = useNavigate()
    const userModal = useRef(null)
    const drawer = useRef(null)
    const [search,setSearch] = useState('')
    const [userDetails,setuserDetails] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [width, setWidth] = useState(window.innerWidth);



    useEffect(() => {
      function handleWindowSizeChange() {
        setWidth(window.innerWidth);
      }
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
  }, []);

  useEffect(()=>{
    M.Sidenav.init(drawer.current)
  },[])

  let isMobile = (width <= 768);

    useEffect(()=>{
        M.Modal.init(userModal.current)
        
    },[])
    const searchUser = (query) => {
        setSearch(query)
        fetch('https://social-media-backend-3nkr.onrender.com/search-users',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                query
            })
        }).then(res=>res.json())
        .then(result=>{
            setuserDetails(result.user)
        })
    }
    
    const renderList = () => {
        if(state){
            return[
                <li key="1"><i data-target="modal1" className="modal-trigger large material-icons" style={{color:"black",cursor:"pointer"}}>search</i></li>,
                <li className="li_profile" key="2"><Link to="/profile">Profile</Link></li>,
                <li className="li_createPost"key="3"><Link to="/createpost">Create Post</Link></li>,
                <li className="li_myFollowing"key="4"><Link to="/myfollowingpost">My Following Posts</Link></li>,
                <li key="5">
                    <button className="logout_btn waves-effect waves-light btn #d32f2f red darken-2" 
                    onClick={()=>{
                        localStorage.clear()
                        dispatch({type:"CLEAR"})
                        navigate('/signin')
                    }}>Logout</button>
                </li>
                
            ]
        }
        else{
            return[
                <li key="6"><Link to="/signin">Signin</Link></li>,
                <li key="7"><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    const renderListMob = () => {
        if(state){
            return[
                <li key="1"><i data-target="modal1" className="modal-trigger large material-icons" style={{color:"black",cursor:"pointer",marginRight:"10px"}}>search</i></li>,
                <li key="8"><i data-target="slide-out" className="sidenav-trigger material-icons" style={{color:"black",cursor:"pointer"}}>menu</i></li>//modal ni jarror nathi materialize ma sidemenubar no use karvo
                
            ]
        }
        else{
            return[
                <li key="6"><Link to="/signin">Signin</Link></li>,
                <li key="7"><Link to="/signup">Signup</Link></li>
            ]
        }
    }
    return(
        <>
       <nav>
            <div className="nav-wrapper white">
            <Link to="/" className="brand-logo">Instagram</Link>
            <ul id="nav-mobile" className="right">
                {isMobile?renderListMob():renderList()}
            </ul>
            </div>
            <div id="modal1" className="modal" ref={userModal} style={{color:"black"}}>
                <div className="modal-content">
                <input 
                type="text" 
                placeholder="search Users"
                value={search}
                onChange={(e)=>searchUser(e.target.value)} />
                <ul className="collection">
                    {
                    userDetails.map(item=>{
                    return <Link id={item._id} to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                    M.Modal.getInstance(userModal.current).close()
                    setSearch('')
                    }}><li key={item._id} className="collection-item">{item.email}</li></Link> 
                    })}
                </ul>
                </div>
                <div className="modal-footer">
                <a className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>close</a>
                </div>
            </div>
      </nav>
      <ul id="slide-out" className="sidenav" ref={drawer}>
          <li><Link onClick={()=>{
              M.Sidenav.getInstance(drawer.current).close()
          }} to="/">Home</Link></li>
          <li><div className="divider"></div></li>

          <li><Link onClick={()=>{
              M.Sidenav.getInstance(drawer.current).close()
          }} to="/profile">Profile</Link></li>
          <li><div className="divider"></div></li>
          
          <li><Link onClick={()=>{
              M.Sidenav.getInstance(drawer.current).close()
          }} to="/createpost">Create Post</Link></li>
          <li><div className="divider"></div></li>

          <li><Link onClick={()=>{
              M.Sidenav.getInstance(drawer.current).close()
          }} to="/myfollowingpost">My Following Posts</Link></li>
          <li><div className="divider"></div></li>

          <li>
          <button style={{marginLeft:"24px",marginTop:"7px"}} className="btn waves-effect waves-light #d32f2f red darken-2" 
          onClick={()=>{
            localStorage.clear()
            dispatch({type:"CLEAR"})
            navigate('/signin')
            }}>Logout</button>
          </li>
        </ul>
      </>
    )
}

export default NavBar

//  <ul id="slide-out" class="sidenav">
// <li><div class="user-view">
// <div class="background">
//   <img src="images/office.jpg">
// </div>
// <a href="#user"><img class="circle" src="images/yuna.jpg"></a>
// <a href="#name"><span class="white-text name">John Doe</span></a>
// <a href="#email"><span class="white-text email">jdandturk@gmail.com</span></a>
// </div></li>
// <li><a href="#!"><i class="material-icons">cloud</i>First Link With Icon</a></li>
// <li><a href="#!">Second Link</a></li>
// <li><div class="divider"></div></li>
// <li><a class="subheader">Subheader</a></li>
// <li><a class="waves-effect" href="#!">Third Link With Waves</a></li>
// </ul>
// <a href="#" data-target="slide-out" class="sidenav-trigger"><i class="material-icons">menu</i></a>