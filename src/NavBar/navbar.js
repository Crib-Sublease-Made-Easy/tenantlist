import * as React from 'react';
import { Link, useNavigate} from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { EXTRALIGHT, MEDIUMGREY, OPENSANS, PRIMARYCOLOR } from "../sharedUtils";
import { Button, IconButton, Modal} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react"
import { useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';


export default function NavBar(){
    const navigate = useNavigate()
    const {loggedIn, setLoggedIn, mobile} = useContext(UserContext) 
    const [menuModal, setMenuModal] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [anchorEl, setAnchorEl] = useState(null)
    const openMenu = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(()=> {
        getToken()
    }, [])

    function getToken(){
        let first = localStorage.getItem("firstName")
        if(first != null && first != undefined){
            setFirstName(first)
        }
    }

    function signout(){
        setLoggedIn(false)
        setMenuModal(false)
        window.open("/")
        localStorage.clear()
       
        
    }

    function handleNav(route){
       
        setMenuModal(false)
        navigate(route)
    }

    return(
        
        <div style={{display:'flex', height: "10vh", width: mobile ? "100vw" : '100vw', flexDirection: 'row', alignItems:'center',  borderBottomStyle:'solid', borderBottomWidth:1, borderColor: EXTRALIGHT, flexDirection:'row', justifyContent:'space-between',paddingLeft:  '5vw', paddingRight:'5vw'}}>
            <Link to="/" style={{textDecorationLine:'none', outline:'none'}} >
                <h3 style={{fontWeight:'400', fontFamily: 'Lobster', color: '#2D6674', marginTop: 'auto', marginBottom:'auto'}}>Crib</h3>
            </Link>
            {/* <Link to="subleasemyroomintro" style={{fontWeight:'700',  color: '#333333'}}>Post a sublease</Link> */}
            <IconButton onClick={()=>setMenuModal(true)} style={{borderColor:'white', outline:'none'}}>
                <MenuIcon size={20} style={{color: MEDIUMGREY}}/>
            </IconButton>
            
            <Modal
                
                open={menuModal}
                onClose={()=>setMenuModal(false)}
                aria-labelledby="modal-menu"
                aria-describedby="modal-menu"
                style={{display: 'flex', flex: 1, justifyContent:'center', alignItems:'center'}}
            >
                <div style={{backgroundColor: 'red', position:'relative', height: '100%', width:'100%' , backgroundColor:'white'}}>
                    <div style={{display:'flex', height: "10vh", width: mobile ? "100vw" : '90vw', flexDirection: 'row', alignItems:'center', paddingLeft: mobile ? '5vw' : 0, paddingRight: mobile ? '5vw' : 0, marginLeft: mobile ? 0 : '5vw', marginRight: mobile ? 0 : '5vw', flexDirection:'row', justifyContent: loggedIn ? 'space-between' : 'flex-end'}}>
                        {loggedIn &&
                            <p style={{fontWeight:'600', fontSize:'1.3rem', fontFamily: OPENSANS, marginBottom:0, color: PRIMARYCOLOR}}>Welcome back {firstName}!</p>
                        }
                        <IconButton onClick={()=>setMenuModal(false)} style={{borderColor:'white', outline:'none'}}>
                            <CloseIcon size={20} style={{color: MEDIUMGREY}}/>
                        </IconButton>
                    </div>
                    <div style={{display:'block', marginLeft:'5vw',}}>
                        
                        <div onClick={()=>handleNav("/discoverSubleases")} style={{paddingTop:5, paddingBottom: 5,display:'block',flexDirection:'column',  cursor:'pointer', }}>
                            <p style={{fontFamily:'Open Sans', fontWeight:'600'}}>Find subleases</p>
                        </div>
                        <div onClick={()=>handleNav("/propertyPosting")} style={{paddingTop:5, paddingBottom: 5, flexDirection:'row', cursor:'pointer'}}>
                            <p style={{fontFamily:'Open Sans', fontWeight:'600'}}>Post a sublease</p>
                        </div>
                        {
                            loggedIn &&
                            <div onClick={()=> handleNav("/myRequests")} style={{paddingTop:5, paddingBottom: 5, flexDirection:'row', cursor:'pointer'}}>
                                <p style={{fontFamily:'Open Sans', fontWeight:'600'}}>My requests</p>
                            </div>
                        }
                        <div onClick={()=>handleNav("/termsOfServices")} style={{paddingTop:5, paddingBottom: 5, flexDirection:'row', cursor:'pointer'}}>
                            <p style={{fontFamily:'Open Sans', fontWeight:'600'}}>Terms of services</p>
                        </div>
                        <div onClick={()=>handleNav("/privacy")} style={{paddingTop:5, paddingBottom: 5, flexDirection:'row', cursor:'pointer'}}>
                            <p style={{fontFamily:'Open Sans', fontWeight:'600'}}>Privacy</p>
                        </div>

                     
                        
                        { !loggedIn ?
                            <>
                           
                            <div style={{paddingTop:5, paddingBottom: 5, flexDirection:'row',}}>
                                <Link onClick={()=>setMenuModal(false)} to="/login" style={{display:'flex', flex: 1, textDecorationLine:'none'}}>
                                    <p  style={{fontFamily:'Open Sans', fontWeight:'600',  color:'black', textDecorationLine:'none'}}>Log In</p>
                                </Link>
                            </div>
                            <div style={{paddingTop:5, paddingBottom: 5, flexDirection:'row',}}>
                                <Link onClick={()=>setMenuModal(false)} to='/signup' style={{display:'flex', flex: 1, textDecorationLine:'none'}}>
                                    <p  style={{fontFamily:'Open Sans', fontWeight:'600', color:'black', textDecorationLine:'none'}}>Sign up</p>
                                </Link>
                            </div>
                            </>
                            :
                            <>
                                <div style={{paddingTop:5, paddingBottom: 5, flexDirection:'row'}}>
                                    <Link style={{display:'flex', flex: 1, textDecorationLine:"none"}}>
                                    <p onClick={signout} style={{fontFamily:'Open Sans', fontWeight:'600', marginTop:'auto', marginBottom:'auto', color:'black', textDecorationLine:'none'}}>Sign out</p>
                                    </Link>
                                </div>
                            </>
                        }
                        
                    </div>
                </div>
            </Modal>
        </div>
       
    )
}
