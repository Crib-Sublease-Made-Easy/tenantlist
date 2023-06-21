import * as React from 'react';
import { Link, useNavigate} from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { EXTRALIGHT, MEDIUMGREY, MEDIUMROUNDED, OPENSANS, PRIMARYCOLOR } from "../sharedUtils";
import { Avatar, Button, Divider, IconButton, ListItemIcon, Menu, MenuItem, Modal, Tooltip} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react"
import { useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';
import { PersonAdd } from '@mui/icons-material';


export default function NavBar(){
    const navigate = useNavigate()
    const {loggedIn, setLoggedIn, mobile, notifications} = useContext(UserContext) 
    const [menuModal, setMenuModal] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [anchorEl, setAnchorEl] = useState(null)
    const openMenu = Boolean(anchorEl);

    const handleClick = (event) => {
        setMenuModal(true)
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setMenuModal(false)
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
                <h3 style={{fontWeight:'400', fontFamily: 'Righteous', color: '#2D6674', marginTop: 'auto', marginBottom:'auto'}}>Crib</h3>
            </Link>
            <div style={{flexDirection:'row', display:'flex', alignItems:'center'}}>
                <div style={{flexDirection:'row', display:'flex', alignItems:'center'}}>
                    {!mobile &&
                    <>
                    <p onClick={()=> handleNav('/discoverSubleases')} style={{fontFamily: OPENSANS, marginBottom:0, fontWeight:'600', color: MEDIUMGREY, marginRight:'2vw', cursor:'pointer', fontSize:'0.9rem'}}>Find</p>
                    <p onClick={()=> handleNav('/propertyPosting')} style={{fontFamily: OPENSANS, marginBottom:0, fontWeight:'600', color: MEDIUMGREY, marginRight:'2vw',  cursor:'pointer', fontSize:'0.9rem'}}>Post</p>
                    </>
                    }
                    <p onClick={()=> handleNav('/howItWorks')} style={{fontFamily: OPENSANS, marginBottom:0, fontWeight:'600', color: MEDIUMGREY, marginRight:'5vw',  cursor:'pointer', fontSize:'0.9rem'}}>How it works</p>
                </div>
                <div style={{position:'relative'}}>
                    {notifications &&
                    <div style={{width:'1vh', height:'1vh', borderRadius:'0.5vh', backgroundColor:'red', position:'absolute', top:0, right:0}}/>
                    }
                    <Tooltip>
                    
                    <IconButton
                        onClick={handleClick}
                        
                        size="small"
                        style={{outline:'none'}}
                        aria-controls={menuModal ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={menuModal ? 'true' : undefined}
                    >
                        <MenuIcon size={20} style={{color: MEDIUMGREY}}/>
                    </IconButton>
                    </Tooltip>
                </div>
            </div>
            <Menu
            onClose={handleClose}
            anchorEl={anchorEl}
            id="account-menu"
            open={menuModal}
            PaperProps={{
            elevation: 0,
            sx: {
                borderRadius: 2,
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.2))',
                mt: 1.5,
                width: mobile ? '90vw' : '17.5vw',
            },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
        <div>
            { mobile &&
            <>
            <MenuItem onClick={()=> handleNav("/discoverSubleases")} style={{paddingTop:'1.5vh', paddingBottom:'1.5vh'}}>
                <p style={{marginBottom:0, fontWeight:'600', fontFamily: OPENSANS, fontSize:'0.9rem'}}>Find a sublease</p>
            </MenuItem>
            <MenuItem onClick={()=> handleNav("/propertyPosting")} style={{paddingTop:'1.5vh', paddingBottom:'1.5vh'}}>
                <p style={{marginBottom:0, fontWeight:'600', fontFamily: OPENSANS, fontSize:'0.9rem'}}>Post a sublease</p>
            </MenuItem>
            </>
            }
            {loggedIn &&
            <>
            <MenuItem onClick={()=>handleNav("/profile")} style={{paddingTop:'1.5vh', paddingBottom:'1.5vh'}}>
                <p style={{marginBottom:0, fontWeight:'600', fontFamily: OPENSANS, fontSize:'0.9rem'}}>Profile</p>
            </MenuItem>
            <MenuItem onClick={()=>handleNav("/mySublease")}  style={{paddingTop:'1.5vh', paddingBottom:'1.5vh'}}>
                <p style={{marginBottom:0, fontWeight:'600', fontFamily: OPENSANS, fontSize:'0.9rem'}}>My sublease</p>
            </MenuItem>
            
            <MenuItem onClick={()=> handleNav("/myRequests")} style={{paddingTop:'1.5vh', paddingBottom:'1.5vh'}}>
                <p style={{marginBottom:0, fontWeight:'600', fontFamily: OPENSANS, fontSize:'0.9rem'}}>My requests</p>
            </MenuItem>
            {/* <MenuItem onClick={handleClose} style={{paddingTop:'1.5vh', paddingBottom:'1.5vh'}}>
                <p style={{marginBottom:0, fontWeight:'600', fontFamily: OPENSANS, fontSize:'0.9rem'}}>Notification</p>
            </MenuItem> */}
            </>
            }
            { loggedIn &&
            <Divider />
            }
            <MenuItem onClick={()=>handleNav("/termsOfServices")}  style={{paddingTop:'1.5vh', paddingBottom:'1.5vh'}}>
                <p style={{marginBottom:0, fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem'}}>Terms of services</p>
            </MenuItem>
            <MenuItem onClick={()=>handleNav("/privacy")} style={{paddingTop:'1.5vh', paddingBottom:'1.5vh'}}>
                <p style={{marginBottom:0, fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem'}}>Privacy</p>
            </MenuItem>

            <Divider />
            {loggedIn ?
            <MenuItem onClick={signout} style={{paddingTop:'1.5vh', paddingBottom:'1.5vh'}}>
                <p style={{marginBottom:0, fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem'}}>Logout</p>
            </MenuItem>
            :
            <>
                <MenuItem onClick={()=>handleNav("/login")} style={{paddingTop:'1.5vh', paddingBottom:'1.5vh'}}>
                    <p style={{marginBottom:0, fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem'}}>Login</p>
                </MenuItem>
                <MenuItem onClick={()=>handleNav("/signup")} style={{paddingTop:'1.5vh', paddingBottom:'1.5vh'}}>
                    <p style={{marginBottom:0, fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem'}}>Sign up</p>
                </MenuItem>
            </>
            }
           
        </div>
        </Menu>
            
          
        </div>
       
    )
}
