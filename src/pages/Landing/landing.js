import { createRef, useContext, useEffect, useState, useRef, useCallback } from "react"
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TennatCard from "../../TenantCard/tenantCard";
import {Box, Checkbox, Menu, MenuItem, Paper } from "@mui/material";
import { UserContext } from "../../UserContext"
import { Button } from "@mui/material";
import Slider from '@mui/material/Slider';
import Modal from '@mui/material/Modal';

import GoogleMap from 'google-maps-react-markers';
import Lottie from "lottie-react";
import PropertySearching from '../../propertySearching.json'
import NoPropertiesFound from '../../noSearchResult.json'

const PRIMARYCOLOR = '#2D6674';

const defaultProps = {
    center: {
      lat: 40.730610,
      lng: -73.935242
    },
    zoom: 12
  };




export default function LandingPage(props){
   
    const {manhattanDL, setManhattanDL, queensDL, setQueensDL, brooklynDL, setBrooklynDL, jerseyDL, setJerseyDL, price, setPrice} = useContext(UserContext)
    const [tenants, setTenants] = useState([])
    const [filterModal, setfilterModal] = useState(false)
    const [sortMenu, setSortMenu] = useState(false)
    const [NYProps, setNYProps] = useState([])
    const MapPinsHashmap = new Map()
    // const [manhattanDL, setManhattanDL] = useState(true)

    const [loading, setLoading] = useState(true)

    const [anchorEl, setAnchorEl] = useState(null);
    const [mobile, setMobile] = useState(null)
    const [GMCenter, setGMCenter] = useState({lat:40.730610, lng:-73.935242})
    const [GMZoom, setGMZoom] = useState(12)

    const [mapReady, setMapReady] = useState(false)
    const GoogleMapRef = useRef(null);

    const onGoogleApiLoaded = ({ map, maps }) => {
        GoogleMapRef.current = map
        setMapReady(true)
      }

    
    function getDeviceWidth(){
        let width = window.innerWidth
        setMobile(width < 400)
    }

    const open = anchorEl;
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        getDeviceWidth()
        fetchCribConnectTenants()
    }, [])

    async function fetchCribConnectTenants(){
        // const resp = await fetch("https://crib-llc.herokuapp.com/users/cribconnect/getall");
        // const datas = await resp.json();
        
        // //Filter which tenant is suitable
        // console.log(datas)
        setfilterModal(false)   
        setLoading(true)
        await fetch("https://crib-llc.herokuapp.com/properties/getAllNewYorkPosting?&latitude=40.730610&longitude=-73.935242")
        .then((res) => {return res.json()})
        .then( async data => {
           

            //Sort Crib Connect users first 
            data.sort( (a,b) => b.userInfo.cribConnectUser - a.userInfo.cribConnectUser)

            setNYProps(data.filter((prop) => {
                if(!queensDL){
                    let sa = prop.propertyInfo.loc.secondaryTxt;
                    let spaceless_sa = sa.toLowerCase().replace(" ", "");
                    console.log(spaceless_sa)
                    if(spaceless_sa.indexOf("queens") != -1){
                        return false
                    }
                   
                }
                if(!brooklynDL){
                    let sa = prop.propertyInfo.loc.secondaryTxt;
                    let spaceless_sa = sa.toLowerCase().replace(" ", "");
                    console.log(spaceless_sa)
                    if(spaceless_sa.indexOf("brooklyn") != -1){
                        return false
                    }
                  
                }
                if(!jerseyDL){
                    let sa = prop.propertyInfo.loc.secondaryTxt;
                    let spaceless_sa = sa.toLowerCase().replace(" ", "");
                    console.log(spaceless_sa)
                    if(spaceless_sa.indexOf("nj") != -1 || spaceless_sa.indexOf("jersey") != -1){
                        return false
                    }
                }
                if(!manhattanDL){
                    let sa = prop.propertyInfo.loc.secondaryTxt;
                    let spaceless_sa = sa.toLowerCase().replace(" ", "");
                    console.log(spaceless_sa)
                    if(spaceless_sa.indexOf("nj") == -1 && spaceless_sa.indexOf("jersey") == -1 && spaceless_sa.indexOf("brooklyn") == -1 && spaceless_sa.indexOf("queens") == -1){
                        return false
                    }
                }
                if(prop.propertyInfo.price > price){
                  return false
                }
                return true
            }))
            setLoading(false)

        } )
        // const datas = await resp.json();
      
        // //Filter which tenant is suitable
        // setNYProps(datas)
      
        // setTenants()
        // await datas.forEach( async (user) => {
        //     if(user.postedProperties.length != 0){
        //         await fetch(`https://crib-llc.herokuapp.com/properties/${user.postedProperties[0]}`, {method: "POST"})
        //         .then( async (res) => {
        //             return await res.json()
        //         })
        //         .then ( data => {
        //             if(data.propertyInfo.price < price && data.propertyInfo.deleted == false){

        //                 let sa = data.propertyInfo.loc.secondaryTxt
        //                 let lower_spaceless_sa = sa.toLowerCase().replaceAll(" ","")
        //                 //Check if it is in NY
        //                 if(lower_spaceless_sa.indexOf("ny") != -1 || lower_spaceless_sa.indexOf("newyork") != -1){
    
        //                     if(!brooklynDL){
        //                         if(lower_spaceless_sa.indexOf("brooklyn") != - 1){
        //                             return
        //                         }
        //                     }
        //                     if(!jerseyDL){
        //                         if(lower_spaceless_sa.indexOf("jersey") != - 1 || lower_spaceless_sa.indexOf("nj") != -1){
        //                             return 
        //                         }
        //                     }
        //                     if(!queensDL){
        //                         if(lower_spaceless_sa.indexOf("queens") != - 1){
        //                             return 
        //                         }
        //                     }
                           
        //                     setTenants(tenants => [...tenants, user])
                            
        //                 }
        //             }
        //         })

        //     }
        // })
       
        

       
    }


    async function filterTenants(){
        setTenants([])
        setfilterModal(true)
    }

    async function SortByPrice() {
        let tempProps = NYProps;
        handleClose()
        setLoading(true)
        setNYProps(tempProps.sort((a,b) => a.propertyInfo.price - b.propertyInfo.price))
        setLoading(false)
    }

    async function SortByStartDate() {
        let tempProps = NYProps;
        handleClose()
        setLoading(true)
        setNYProps(tempProps.sort((a,b) => new Date(a.propertyInfo.availableFrom).getTime() - new Date(b.propertyInfo.availableFrom).getTime()))
        setLoading(false)
    }
    function HandleScrollToWithId(p){
        
        let ref = MapPinsHashmap.get(p.propertyInfo._id)
       
        if(ref.current == null || ref == undefined){
            alert("Property unavailable.")
        }
        else{
            if(ref.current == null){
                alert("Property unavailable.")
                return
            }
            ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
            HandleMapScrollToWithCoor(p.propertyInfo.loc.coordinates)
        }
    }

    function HandleMapScrollToWithCoor(coor){ 
        console.log(GoogleMapRef.current)
        let lat = coor[1]
        let lng = coor[0]
        setGMCenter({lat, lng})
        GoogleMapRef.current.setCenter({lat, lng})
        GoogleMapRef.current.setZoom(16)
        setGMZoom(13)
    }

    function resetFilter(){
        setfilterModal(true)
    }


    return(
        <div style={{ height: '90vh', width: '100vw'}}>
            
            {/* <h2 style={{fontWeight:'700'}}>Hello there 👋🏻</h2>
            <p style={{maxWidth: 400}}>We are Crib, a student startup for subleasing! We are students too so we understand how difficult subleasing can be. Check out the selected tenants below, be sure to check regularly since we update the list everyday!</p> */}
            <div style={{maxWidth: mobile ? '95vw' : '95vw', flexDirection:'row', justifyContent:'space-between', alignItems:'center', display:'flex', flex: 1,  height:'10vh', marginLeft:'auto', marginRight:'auto'}}>
              
                <p style={{alignSelf:'center', textAlign:'center',  fontWeight:'600'}}>{loading ? "Finding subleases..." : `${NYProps.length} subleases found`}</p>
                
                <div style={{flexDirection:'row'}}>
                    <Button onClick={filterTenants} style={{backgroundColor:'#2D6674'}} variant="contained">
                        Filters
                    </Button>
                    <Button
                        id="sort-menu"
                        aria-controls={open ? 'demo-positioned-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        style={{backgroundColor: '#E0E0E0', borderStyle:'solid', color: 'black', borderWidth:1, marginLeft: '1vw' }}
                    >
                        Sort
                    </Button>
                </div>
                <Menu
                    id="sort-menu"
                    aria-labelledby="demo-positioned-button"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                    }}
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                    }}
                >
                    <MenuItem disabled={loading} onClick={SortByPrice}>Price (low to hight)</MenuItem>
                    <MenuItem disabled={loading} onClick={SortByStartDate}>Start Date</MenuItem>
                    
                </Menu>
            </div>
            <div style={{flexDirection: mobile ? 'column' : 'row', display:'flex', width:'100vw',  }}>
                <div style={{height:'80vh', overflow:'scroll', display:'flex', width: mobile ? '100vw' : '50vw', overflowX:'hidden',  }}>
                    {loading ? 
                    <Lottie animationData={PropertySearching} loop/>
                    :

                    NYProps.length == 0 ?
                    <div style={{flexDirection:'column', alignItems:'center',alignSelf:'center', justifyContent:'center', display:'flex', flex: 1}}>
                        <Button style={{marginLeft:'auto', marginRight:'auto', backgroundColor: PRIMARYCOLOR, color:'white'}} varaint='contained' onClick={resetFilter}>Reset Filter</Button>
                        <Lottie animationData={NoPropertiesFound} loop style={{width:mobile? '80vw' : '30vw', margin:'auto'}}/>
                    </div>
                    :
                    <ul style={{paddingLeft: mobile ? 0 : '1vw', }}>
                        {NYProps.map((item, index) => {
                            const ref = React.createRef(null);
                            MapPinsHashmap.set(item.propertyInfo._id, ref)
                            
                            if(item.userInfo._id == undefined){
                                return null
                            }
                            else{
                                return (
                                    <li
                                    key={item.propertyInfo._id}
                                    ref={ref}
                                    >  
                                        <TennatCard data={item} index={index} mapScrollToPin={()=>HandleMapScrollToWithCoor(item.propertyInfo.loc.coordinates)}/>
                                    </li>
                                )
                            }
                        
                        })}
                    </ul>
                    }
                </div>
                <div >
                <div style={{height: '80vh', width:  '50vw', borderRadius:20, display: mobile ? 'none' : 'block' }}>
                     <GoogleMap
                        onGoogleApiLoaded={onGoogleApiLoaded}
                        apiKey="AIzaSyBbZGuUw4bqWirb1UWSzu9R6_r13rPj-eI"
                        defaultCenter={{
                            lat: defaultProps.center.lat,
                            lng: defaultProps.center.lng
                        }}
                        defaultZoom={11}
                        >

                        {
                            NYProps.map((p, index) => {
                                return(
                                    <div onClick={()=>{HandleScrollToWithId(p)}} key={"mappin" + p.propertyInfo._id} lat={p.propertyInfo.loc.coordinates[1]} lng={p.propertyInfo.loc.coordinates[0]} style={{backgroundColor: GMCenter.lat == p.propertyInfo.loc.coordinates[1] && GMCenter.lng == p.propertyInfo.loc.coordinates[0] ? 'red' : PRIMARYCOLOR, justifyContent:'center', textAlign:'center', alignItems:'center', width: 50, height: 30, display:'flex', flex: 1, borderRadius:20 ,zIndex: GMCenter.lat == p.propertyInfo.loc.coordinates[1] && GMCenter.lng == p.propertyInfo.loc.coordinates[0] ? 999 : 1 }}>
                                        <p style={{color:'white',margin:'auto'}}>${p.propertyInfo.price}</p>
                                    </div>
                                )
                            })
                        }
                    </GoogleMap>
                </div>
                </div>
            </div>
            
            
            <Modal
                
                open={filterModal}
                onClose={()=>setfilterModal(false)}
                aria-labelledby="modal-modal-filter"
                aria-describedby="modal-modal-filtersubleases"
                style={{display: 'flex', flex: 1, justifyContent:'center', alignItems:'center'}}
            >
              <div style={{width: "80vw", height:"auto", backgroundColor: 'white', borderRadius: 20, padding: 20, maxWidth: 400, position:'relative'}}>
                <h5 style={{fontWeight:'500', fontFamily:'DM Serif Display'}}>Select sublease area</h5>
                <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:400, marginTop:20}}>
                    <p>Manhattan</p>
                    <Checkbox onClick={()=> setManhattanDL(!manhattanDL)} checked={manhattanDL} style={{color: PRIMARYCOLOR }}/>

                </div>
                <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:400}}>
                    <p>Queens</p>
                    <Checkbox onClick={()=>setQueensDL(!queensDL)} checked={queensDL}  style={{color: PRIMARYCOLOR }}/>

                </div>
                <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:400}}>
                    <p>Brooklyn</p>
                    <Checkbox onClick={()=>setBrooklynDL(!brooklynDL)} checked={brooklynDL}  style={{color: PRIMARYCOLOR }}/>

                </div>
                <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:400}}>
                    <p>Jercity City / Jersey</p>
                    <Checkbox onClick={()=>setJerseyDL(!jerseyDL)} checked={jerseyDL} style={{color: PRIMARYCOLOR }}/>
                </div>
                <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', marginTop: 20}}>
                    <h5 style={{fontWeight:'500', fontFamily:'DM Serif Display'}}>Max Price</h5>
                    <h6 style={{fontWeight:'500', }}>${price}</h6>
                </div>
                <Box style={{maxWidth: 360,}}>
                    <Slider

                        min={0}
                        max={10000}
                        step={100}
                        getAriaLabel={() => 'Price range'}
                        value={price}
                        style={{color: PRIMARYCOLOR}}
                        onChange={(val) => {
                           
                            let max = val.target.value
                            setPrice(max)

                        }}
                        valueLabelDisplay="auto"
                    />
                </Box>
                <Button  onClick={fetchCribConnectTenants} fullWidth style={{backgroundColor:'#2D6674', maxWidth: 400, alignSelf:'center', marginTop:50}} variant="contained">
                    {loading ? "Finding subleases for you ..." : "Find subleases"}
                </Button>
              </div>
            </Modal>
               
           
    
        </div>
    )
}