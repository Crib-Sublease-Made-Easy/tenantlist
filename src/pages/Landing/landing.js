import { createRef, useContext, useEffect, useState, useRef, useCallback } from "react"
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TennatCard from "../../TenantCard/tenantCard";
import {Box, Checkbox, Menu, MenuItem, IconButton } from "@mui/material";
import { UserContext } from "../../UserContext"
import { Button } from "@mui/material";
import Slider from '@mui/material/Slider';
import Modal from '@mui/material/Modal';

import GoogleMap from 'google-maps-react-markers';
import Lottie from "lottie-react";
import PropertySearching from '../../propertySearching.json'
import NoPropertiesFound from '../../noSearchResult.json'

import MapIcon from '@mui/icons-material/Map';
import CancelIcon from '@mui/icons-material/Cancel';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

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
    const tenantListRef = useRef(null)
    // const [manhattanDL, setManhattanDL] = useState(true)

    const [loading, setLoading] = useState(true)

    const [anchorEl, setAnchorEl] = useState(null);
    const [mobile, setMobile] = useState(null)
    const [GMCenter, setGMCenter] = useState({lat:40.730610, lng:-73.935242})
    const [GMZoom, setGMZoom] = useState(12)

    const [mapReady, setMapReady] = useState(false)
    const GoogleMapRef = useRef(null);

    const [mobileMapModalVis, setMobileMapModalVis] = useState(false)
    const [mapSelectedProp, setMapSelectedProp] = useState(null)

    const [mapGalleryModalVis, setMapGalleryModalVis] = useState(false)
    const imgListRef = useRef(null)


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
        await fetch("https://crib-llc.herokuapp.com/properties/getAllNewYorkPosting?&page=0&latitude=40.730610&longitude=-73.935242")
        .then((res) => {return res.json()})
        .then( async data => {
           

            //Sort Crib Connect users first 
            data.sort( (a,b) => b.userInfo.cribConnectUser - a.userInfo.cribConnectUser)

            setNYProps(data.filter((prop) => {
                if(!queensDL){
                    let sa = prop.propertyInfo.loc.secondaryTxt;
                    let spaceless_sa = sa.toLowerCase().replace(" ", "");
                    if(spaceless_sa.indexOf("queens") != -1){
                        return false
                    }
                   
                }
                if(!brooklynDL){
                    let sa = prop.propertyInfo.loc.secondaryTxt;
                    let spaceless_sa = sa.toLowerCase().replace(" ", "");
                    if(spaceless_sa.indexOf("brooklyn") != -1){
                        return false
                    }
                  
                }
                if(!jerseyDL){
                    let sa = prop.propertyInfo.loc.secondaryTxt;
                    let spaceless_sa = sa.toLowerCase().replace(" ", "");
                    if(spaceless_sa.indexOf("nj") != -1 || spaceless_sa.indexOf("jersey") != -1){
                        return false
                    }
                }
                if(!manhattanDL){
                    let sa = prop.propertyInfo.loc.secondaryTxt;
                    let spaceless_sa = sa.toLowerCase().replace(" ", "");
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
        tenantListRef.current.scrollIntoView(true)
    }

    async function SortByStartDate() {
        let tempProps = NYProps;
        handleClose()
        setLoading(true)
        setNYProps(tempProps.sort((a,b) => new Date(a.propertyInfo.availableFrom).getTime() - new Date(b.propertyInfo.availableFrom).getTime()))
        setLoading(false)
        tenantListRef.current.scrollIntoView(true)
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

    function scrollImgList(op){
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        if(op == "+"){
            if(mobile){
                imgListRef.current.scrollLeft +=  windowWidth*0.95
            }
            else{
                imgListRef.current.scrollLeft +=  windowWidth*0.5
            }
        }
        if(op == "-"){
            if(mobile){
                imgListRef.current.scrollLeft -=  windowWidth*0.95
            }
            else{
                imgListRef.current.scrollLeft -=   windowWidth*0.5
            }
            
        }
    }

    function handlePreviewClick(){
        setMobileMapModalVis(false)
        HandleScrollToWithId(mapSelectedProp)
    }

    function handleMobileMapPinClick(p){
        window.scrollTo(0,0)
        setMapSelectedProp(p)
        let lat = p.propertyInfo.loc[1]
        let lng = p.propertyInfo.loc[0]
        setGMCenter({lat, lng})
    }

    return(
        <div style={{ height: '90vh', width: '100vw'}}>
            
            {/* <h2 style={{fontWeight:'700'}}>Hello there 👋🏻</h2>
            <p style={{maxWidth: 400}}>We are Crib, a student startup for subleasing! We are students too so we understand how difficult subleasing can be. Check out the selected tenants below, be sure to check regularly since we update the list everyday!</p> */}
            <div style={{maxWidth: mobile ? '95vw' : '95vw', flexDirection:'row', justifyContent:'space-between', alignItems:'center', display:'flex', flex: 1,  height:'10vh', marginLeft:'auto', marginRight:'auto'}}>
                <p style={{alignSelf:'center', textAlign:'center',  fontWeight:'600', marginTop:'auto', marginBottom:'auto'}}>{loading ? "Finding subleases..." : `${NYProps.length} subleases found`}</p>
                
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
                    <div style={{display:'flex', flex: 1}}>
                        <Lottie style={{margin:'auto'}} animationData={PropertySearching} loop/>
                    </div>
                    :

                    NYProps.length == 0 ?
                    <div style={{flexDirection:'column', alignItems:'center',alignSelf:'center', justifyContent:'center', display:'flex', flex: 1}}>
                        <Button style={{marginLeft:'auto', marginRight:'auto', backgroundColor: PRIMARYCOLOR, color:'white'}} varaint='contained' onClick={resetFilter}>Reset Filter</Button>
                        <Lottie animationData={NoPropertiesFound} loop style={{width:mobile? '80vw' : '30vw', margin:'auto'}}/>
                    </div>
                    :

                   
                        <ul ref={tenantListRef} style={{paddingLeft: mobile ? 0 : '1vw', }}>
                         {NYProps.map((item, index) => {
                                const ref = React.createRef(null);
                                MapPinsHashmap.set(item.propertyInfo._id, ref)
                                
                                if(item.userInfo._id == undefined){
                                    return null
                                }
                                else{
                                    return (
                                        <li
                                        key={item.userInfo._id + item.propertyInfo._id}
                                        ref={ref}
                                        >  
                                            <TennatCard key={item.userInfo._id + item.propertyInfo._id + index} data={item} index={index} mapScrollToPin={()=>HandleMapScrollToWithCoor(item.propertyInfo.loc.coordinates)}/>
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
                <h5 style={{fontWeight:'500',}}>Select sublease area</h5>
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
                    <h5 style={{fontWeight:'500',}}>Max Price</h5>
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


            {/* Map in mobile */}
            <Modal 
                open={mobileMapModalVis}
                onClose={() => setMobileMapModalVis(false)}
                aria-labelledby="Gallery-Mobile-Map"
                aria-describedby="Show-Mobile-Map"
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    display: 'flex',
                }}
                >
                    <div style={{width: '95vw', height:'85vh', backgroundColor:'white', alignSelf:'center', borderRadius:20,position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'}}>
                        <div style={{height:'7vh', width:'100%', justifyContent:'space-between', padding:'auto', flexDirection:'row', display:'flex', paddingLeft: '2vw', paddingRight:'2vw'}}>
                            <p style={{alignSelf:'center', textAlign:'center',  fontWeight:'600', marginTop:'auto', marginBottom:'auto'}}>{loading ? "Finding subleases..." : `${NYProps.length} subleases found`}</p>
                            <div style={{flexDirection:'row', marginTop:'auto', marginBottom:'auto'}}>
                                <Button size="small" onClick={filterTenants} style={{backgroundColor:'#2D6674'}} variant="contained">
                                    Filters
                                </Button>
                            </div>
                       </div>
                        <div style={{height:'78vh', width:'100%', borderRadius: 15, overflow:'hidden'}}>
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
                                        <div onClick={() => handleMobileMapPinClick(p)} key={"mappin" + p.propertyInfo._id} lat={p.propertyInfo.loc.coordinates[1]} lng={p.propertyInfo.loc.coordinates[0]} style={{backgroundColor: GMCenter.lat == p.propertyInfo.loc.coordinates[1] && GMCenter.lng == p.propertyInfo.loc.coordinates[0] ? 'red' : PRIMARYCOLOR, justifyContent:'center', textAlign:'center', alignItems:'center', width: 50, height: 30, display:'flex', flex: 1, borderRadius:20 ,zIndex: GMCenter.lat == p.propertyInfo.loc.coordinates[1] && GMCenter.lng == p.propertyInfo.loc.coordinates[0] ? 999 : 1 }}>
                                            <p style={{color:'white',margin:'auto'}}>${p.propertyInfo.price}</p>
                                        </div>
                                    )
                                })
                                
                            }
                          
                          
                            </GoogleMap>
                            { mapSelectedProp != null &&
                                <div style={{width:'100%', position:'absolute', background:'white', bottom: 0, paddingLeft:'2vw', paddingRight:'2vw', paddingTop:'1vh', borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}>
                                    <IconButton style={{position:'absolute', right:'2vw', top: '-5vh'}} onClick={()=> setMapSelectedProp(null)}>
                                        <CancelIcon size={40} style={{color:'black'}} />
                                    </IconButton>
                                    <div onClick={handlePreviewClick}>
                                        <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between'}}>
                                            <p style={{fontWeight:'500', marginBottom:0,}}>{mapSelectedProp.propertyInfo.loc.streetAddr}</p>
                                            <p style={{fontWeight:'500', marginBottom:0,}}>${mapSelectedProp.propertyInfo.price} /month</p>
                                        </div>
                                        <p style={{color:'#333333'}}>{new Date(mapSelectedProp.propertyInfo.availableFrom).getTime() < new Date().getTime() ? "Now" : new Date(mapSelectedProp.propertyInfo.availableFrom).toLocaleString().split(",")[0]} - {new Date(mapSelectedProp.propertyInfo.availableTo).toLocaleString().split(",")[0]}</p>
                                    </div>
                                    <>
                                    <ul style={{flexDirection:'row', display: 'flex', overflow:'scroll', height:'auto', width: '100%',  marginLeft:'auto', marginRight:'auto', paddingLeft:0,}}>
                                    
                                        {
                                        mapSelectedProp.propertyInfo.imgList.map((item, index)=> {
                                            return(
                                                <li onClick={()=>setMapGalleryModalVis(true)} style={{marginLeft: index == 0 ? 0 : '2vw'}}>
                                                    <img key={item + index} src={item} style={{width: '20vw', maxHeight: '20vw', borderRadius:10 }}/>
                                                </li>
                                            )
                                        })
                                        }   
                                        
                                    </ul>
                                    </>
                                </div>
                            }
                            
                        </div>   
                    </div>
                </Modal>

                {/* Map Modal Image Click Gallery */}
                <Modal 
                open={mapGalleryModalVis}
                onClose={() => setMapGalleryModalVis(false)}
                aria-labelledby="Gallery-Modal"
                aria-describedby="Show-proeprty-images"
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    display: 'flex',
                }}
                >
                    <div style={{width: mobile ? '95vw' : '70vw',  backgroundColor:'white', alignSelf:'center', borderRadius:20, padding: 10, position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',}}>
                        <div style={{display:'flex', flex: 1}}>
                            <h6 style={{fontWeight:'500', marginLeft:'auto', marginRight:'auto'}}>Image Gallery</h6>
                        </div>
                        <div style={{position:'relative'}}>
                            <ul ref={imgListRef} style={{flexDirection:'row', display: 'flex', overflow:'scroll', height:'auto', width: mobile ? '100%' : '50vw', borderRadius:10,  marginLeft:'auto', marginRight:'auto', paddingLeft:0,}}>
                            
                                {
                                mapSelectedProp != null && mapSelectedProp.propertyInfo.imgList.map((item, index)=> {
                                    return(
                                        <li>
                                            <img key={item + index} src={item} style={{width: mobile ? '95vw' : '50vw', maxHeight: 'auto', borderRadius:10 }}/>
                                        </li>
                                    )
                                })
                                }   
                                
                            </ul>
                            <IconButton onClick={()=>scrollImgList("-")} style={{position:'absolute', top:'50%' , left: 10, transform: 'translate(0, -50%)', backgroundColor: 'rgba(0,0,0,0.3)'}}>
                                <KeyboardArrowLeftIcon style={{color:'white'}}/>
                            </IconButton>
                            <IconButton onClick={()=>scrollImgList("+")} style={{position:'absolute', top:'50%' , right: 10, transform: 'translate(0, -50%)', backgroundColor: 'rgba(0,0,0,0.3)'}}>
                                <KeyboardArrowRightIcon style={{color:'white'}}/>
                            </IconButton>
                        </div>

                    
                    </div>
                </Modal>
               { mobile &&
                <div onClick={()=>setMobileMapModalVis(true)} style={{position:'absolute',backgroundColor:PRIMARYCOLOR, flexDirection:'row', display:'flex', justifyContent:'space-around', alignItems:'center', marginLeft:'auto', marginRight:'auto', bottom: '5vh', paddingLeft: 10, paddingRight:10, paddingTop:7, paddingBottom:7, borderRadius:15, width:'auto',
                    left: '50%',
                    transform: 'translate(-5vh, -50%)'}}>
                    <div>
                        <p style={{color:"white", marginTop:'auto', marginBottom:"auto"}}>Map</p>
                    </div>
                    <MapIcon size={12} color='white' style={{color:'white'}} />
                </div>
                }
    
        </div>
    )
}