import { createRef, useContext, useEffect, useState, useRef, useCallback, useMemo } from "react"
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TennatCard from "../../TenantCard/tenantCard";
import {Box, Checkbox, Menu, MenuItem, IconButton, TextField, Autocomplete, Grid, Typography, FormControl, InputLabel, Select } from "@mui/material";
import { UserContext } from "../../UserContext"
import { Button } from "@mui/material";
import Slider from '@mui/material/Slider';
import Modal from '@mui/material/Modal';
import { debounce } from '@mui/material/utils';
import parse from 'autosuggest-highlight/parse';
import { DatePicker } from "@mui/x-date-pickers"

import NYDayImage from '../../NYCDay.jpeg'



import GoogleMap from 'google-maps-react-markers';
import Lottie from "lottie-react";
import PropertySearching from '../../propertySearching.json'
import NoPropertiesFound from '../../noSearchResult.json'

import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import SearchingAnim from './searching.json'

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import TuneIcon from '@mui/icons-material/Tune';
import { MEDIUMGREY, MEDIUMROUNDED, OPENSANS, SUBTEXTCOLOR } from "../../sharedUtils";

import Fade from '@mui/material/Fade';

//For date picker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from "react-router-dom";

const PRIMARYCOLOR = '#2D6674';

const defaultProps = {
    center: {
      lat: 40.749089,
      lng: -73.990306
    },
    zoom: 12
  };




export default function LandingPage(props){
    const navigate = useNavigate()
    const {mobile, setMobile, manhattanDL, setManhattanDL, queensDL, setQueensDL, brooklynDL, setBrooklynDL, jerseyDL, setJerseyDL, price, setPrice, roomType, setRoomType, studioType, setStudioType, apartmentType, setApartmentType
    ,requestStart, setRequestStart, requestEnd, setRequestEnd} = useContext(UserContext)
    const [tenants, setTenants] = useState([])
    const [filterModal, setfilterModal] = useState(false)
    const [sortMenu, setSortMenu] = useState(false)
    const [NYProps, setNYProps] = useState([])
    const MapPinsHashmap = new Map()
    const tenantListRef = useRef(null)
    // const [manhattanDL, setManhattanDL] = useState(true)

    const [loading, setLoading] = useState(true)

    const [anchorEl, setAnchorEl] = useState(null);
    const [GMCenter, setGMCenter] = useState({lat:40.730610, lng:-73.935242})
    const [GMZoom, setGMZoom] = useState(12)

    const [mapReady, setMapReady] = useState(false)
    const GoogleMapRef = useRef(null);

    const [mobileMapModalVis, setMobileMapModalVis] = useState(false)
    const [mapSelectedProp, setMapSelectedProp] = useState(null)

    const [mapGalleryModalVis, setMapGalleryModalVis] = useState(false)
    const imgListRef = useRef(null)

    //Location stuff
    const [searchLocation, setSearchLocation] = useState("New York City")
    const autocompleteService = { current: null };
    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    const loaded = useRef(false);

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    //Subtenant form modal prompt 
    const [subtenantFormModalVis, setSubtenantFormModalVis] = useState(false)
    const [subtenantFormPage, setSubtenantFormPage] = useState(0)

    const [subtenantFormLocation, setSubtenantFormLocation] = useState("")
    const [subtenantFormType, setSubtenantFormType] = useState(null)
    const [subtenantFormBudget, setSubtenantFormBudget] = useState(0)
    const [subtenantFormStartDate, setSubtenantFormStartDate] = useState(null)
    const [subtenantFormEndDate, setSubtenantFormEndDate] = useState(null)
    const [subtenantFormBio, setSubtenantFormBio] = useState("")

    const [subtenantFormSuccessModal, setSubtenantFormSuccessModal] = useState(false)



    if (typeof window !== 'undefined' && !loaded.current) {
        
        loaded.current = true;
    }
    const fetchAuto = useMemo(
        () =>
          debounce((request, callback) => {
            autocompleteService.current.getPlacePredictions(request, callback);
          }, 400),
        [],
    );

    useEffect(()=> {
        
        let active = true;

        if (!autocompleteService.current && window.google) {
          autocompleteService.current =
            new window.google.maps.places.AutocompleteService();
        }
        if (!autocompleteService.current) {
          return undefined;
        }
    
        if (inputValue === '') {
          setOptions(value ? [value] : []);
          return undefined;
        }
    
        fetchAuto({ input: inputValue }, (results) => {
          if (active) {
            let newOptions = [];
    
            if (value) {
              newOptions = [value];
            }
    
            if (results) {
              newOptions = [...newOptions, ...results];
            }
    
            setOptions(newOptions);
          }
        });
    
        return () => {
          active = false;
        };
    }, [value, inputValue, fetchAuto]);


    const onGoogleApiLoaded = ({ map, maps }) => {
        GoogleMapRef.current = map
        setMapReady(true)
    }

    const open = anchorEl;
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        promptSubtenantForm()
        fetchCribConnectTenants()
    }, [])

    async function promptSubtenantForm(){
        let showModal = localStorage.getItem("promptSubtenantForm")
        if(showModal == 1 ){
            setSubtenantFormModalVis(true)
            localStorage.setItem("promptSubtenantForm", 0)
        }
    }

    async function fetchCribConnectTenants(location){
        // const resp = await fetch("https://crib-llc.herokuapp.com/users/cribconnect/getall");
        // const datas = await resp.json();
        
        // //Filter which tenant is suitable
        // console.log(datas)
        setfilterModal(false)   
        setLoading(true)
        console.log(searchLocation)
        let loc = location == undefined ? searchLocation : location
        if(loc == undefined){
            return
        }
        console.log(loc)
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + loc + '&key=AIzaSyBbZGuUw4bqWirb1UWSzu9R6_r13rPj-eI', {
            method: 'GET'
                         }).then(res => res.json()).then(async jsonresp => {
                            console.log("RESSSS",)
                            console.log("RESULTS", jsonresp.results)
                            if(jsonresp.results == null || jsonresp.results == undefined || jsonresp.results.length == 0){
                                return [-74.0059728, 40.7127753]
                            }
                            let coor = [jsonresp.results[0].geometry.location.lng, jsonresp.results[0].geometry.location.lat]
                            console.log(coor)
                            return coor
                     
                        }).then( async coor => {
                            console.log("COOR", coor)
                            await fetch(`https://crib-llc.herokuapp.com/properties/getAllNewYorkPosting?&page=0&latitude=${coor[1]}&longitude=${coor[0]}`)
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
                                    if(!roomType){
                                        let type = prop.propertyInfo.type;
                                        if(type == "Room"){
                                            return false
                                        }
                                    }
                                    if(!studioType){
                                        let type = prop.propertyInfo.type;
                                        if(type == "Studio"){
                                            return false
                                        }
                                    }
                                    if(!apartmentType){
                                        let type = prop.propertyInfo.type;
                                        if(type == "Apartment" || type == "Entire apartment"){
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
                        })
  
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
        window?.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    }

    async function SortByStartDate() {
        let tempProps = NYProps;
        handleClose()
        setLoading(true)
        setNYProps(tempProps.sort((a,b) => new Date(a.propertyInfo.availableFrom).getTime() - new Date(b.propertyInfo.availableFrom).getTime()))
        setLoading(false)
        tenantListRef.current.scrollIntoView(true)
        window?.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    }

    function handleNav(route){
        navigate(route)
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
        setMapSelectedProp(p)
        let lat = p.propertyInfo.loc[1]
        let lng = p.propertyInfo.loc[0]
        setGMCenter({lat, lng})
        window?.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    }

    function handleSubtenantFormNav(){
        let at = localStorage.getItem("accessToken")

        if(at == null){
            window.open("https://subtenant-form.herokuapp.com", "_blank")  
            return
        }      
        else{
            if(subtenantFormPage == 0){
                setSubtenantFormPage(1)
            }
            if(subtenantFormPage == 1){
                if(subtenantFormLocation.trim().length == 0){
                    alert("Please enter location.")
                }
                else{
                    setSubtenantFormPage(2)
                }
            }    
        }
    }

    function getAge(dob){
        let age = Math.floor(dob / (1000*60*60*24*31*12))
        return age
    }

    async function handleSubtenantSubmit(){
        if(subtenantFormLocation.trim() == ""){
            alert("Plese enter location")
            return;
        }
        if(subtenantFormType == null){
            alert("Plese enter sublease type")
            return;
        }
        if(subtenantFormStartDate == null){
            alert("Plese enter request start date")
            return;
        }
        if(subtenantFormEndDate == null){
            alert("Plese enter request end")
            return;
        }
        if(subtenantFormBio == null){
            alert("Plese let others know a bit about yourself")
            return;
        }
        // console.log(subtenantFormLocation)
        // console.log(subtenantFormType)
        // console.log(subtenantFormBudget)
        // console.log(subtenantFormStartDate)
        // console.log(subtenantFormEndDate)
        // console.log(subtenantFormBio)
        
        //Check if the person is a tenant 
        setLoading(true)
        let at = localStorage.getItem("accessToken")
        let uid = localStorage.getItem("uid")
        //Get the user information first 
        //Create the subtenant object
        await fetch('https://crib-llc.herokuapp.com/users/' + uid, {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + at,
        }
        }) 
        .then(res => res.json()).then(async userData =>{
            let age = getAge(userData.dob)
            console.log(age)
            fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + subtenantFormLocation + '&key=AIzaSyBbZGuUw4bqWirb1UWSzu9R6_r13rPj-eI', {
            method: 'GET'
            })
            .then(res => res.json()).then(async jsonresp => {
            console.log("RESSSS", jsonresp.results[0].geometry.location)
            let coor = [jsonresp.results[0].geometry.location.lng, jsonresp.results[0].geometry.location.lat]
            console.log(coor)
            return coor
            })
            .then( async coor => {

                await fetch('https://crib-llc.herokuapp.com/subtenants/create', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "name": userData.firstName+ " " +userData.lastName,
                    "subleaseStart": new Date(subtenantFormStartDate),
                    "subleaseEnd": new Date(subtenantFormEndDate),
                    "budget":  subtenantFormBudget,
                    "bio": subtenantFormBio,
                    "phoneNumber": userData.phoneNumber,
                    "age": age,
                    "gender": userData.gender,
                    "sharedRoomFlexibility": subtenantFormType == "Studio" || subtenantFormType == "Entire apartment" ? false : true,
                    "roommatesFlexibility": false,
                    "location": subtenantFormLocation,
                    "coords": coor,
                    "deleted": "false",
                    "type": subtenantFormType,
                    "desiredArea": ["Manhattan"]
                    
                })

                }).then(res => {
                    //Successfully created the subtenant object and sent the reqeust
                    setLoading(false)
                    setSubtenantFormModalVis(false)
                    setSubtenantFormSuccessModal(true)
                })
                .catch( res => {
                    //Error occured to close the modal 
                    setLoading(false)
                    setSubtenantFormModalVis(false)
                })
            })
            .catch(e=>{
                console.log("Error")
                setLoading(false)
                setSubtenantFormModalVis(false)
            })    
        })
    }
        

    return(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div style={{ height: mobile ? '78vh' : '90vh', width: '100vw', overflowY: 'hidden', }}>
            
            <div style={{width: '100vw', paddingLeft: '5vw', paddingRight: '5vw', flexDirection:'row', justifyContent:'space-between', alignItems:'center', display:'flex', flex: 1,  height:'12vh'}}>
                {/* <div style={{marginTop:'auto', marginBottom:'auto', width: '40vw'}}>
                    <p style={{fontSize: mobile ? '0.9rem' : '1rem', marginBottom:0, fontWeight:'700',fontFamily: OPENSANS, color: PRIMARYCOLOR}}>{loading ? "Finding subleases..." : `${NYProps.length}+ subleases found`}</p>
                </div> */}
                <div style={{flexDirection:'row', display:'flex', alignItems:'center'}}>
                    <div style={{width: mobile ? '60vw' : '20vw', flex: 1, display:'flex'}}>
                        <Autocomplete
                        id="google-map-demo"
                        fullWidth
                        getOptionLabel={(option) =>
                            typeof option === 'string' ? option : option.description
                        }
                        filterOptions={(x) => x}
                        style={{outline:'none', marginBottom:0}}
                        options={options}
                        autoComplete
                        includeInputInList
                        filterSelectedOptions
                        value={searchLocation}
                        forcePopupIcon={false}
                        noOptionsText="No locations"
                        onChange={(event, newValue) => {
                            setOptions(newValue ? [newValue, ...options] : options);
                            console.log(newValue)
                           
                            if(newValue != null && newValue != undefined){
                                setSearchLocation(newValue.description);
                                fetchCribConnectTenants(newValue.description)
                            }
                            
                            
                            
                        }}
                        onInputChange={(event, newInputValue) => {
                            console.log(newInputValue)
                            setInputValue(newInputValue);
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Enter location" variant="outlined" />
                        )}
                        renderOption={(props, option) => {
                            const matches =
                            option.structured_formatting.main_text_matched_substrings || [];
                            const parts = parse(
                            option.structured_formatting.main_text,
                            matches.map((match) => [match.offset, match.offset + match.length]),
                            );

                            return (
                            <li key={"googleAutocompleteOptions" + option.structured_formatting.main_text_matched_substrings} {...props}>
                                <Grid container alignItems="center">
                                <Grid item sx={{ display: 'flex', width: 'auto' }}>
                                    <LocationOnIcon sx={{ color: 'text.secondary' }} />
                                </Grid>
                                <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                    {parts.map((part, index) => (
                                    <Box
                                        key={index}
                                        component="span"
                                        sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                                    >
                                        {part.text}
                                    </Box>
                                    ))}

                                    <Typography variant="body2" color="text.secondary">
                                    {option.structured_formatting.secondary_text}
                                    </Typography>
                                </Grid>
                                </Grid>
                            </li>
                            );
                        }}
                        />
                    </div>
                    {!mobile && loading == true && searchLocation != null ? 
                    <p style={{marginBottom:0, fontFamily: OPENSANS, fontSize:"0.9rem", fontWeight:"500", marginLeft:'2vw'}}>Looking for sublets in {searchLocation}...</p> 
                    :
                    !mobile ?
                    <p style={{marginBottom:0, fontFamily: OPENSANS, fontSize:"0.9rem", fontWeight:"500", marginLeft:'2vw'}}><span style={{fontWeight:'700'}}>{NYProps.length}+</span> sublets found in {searchLocation}</p>
                    :
                    null
                    }
                    {/* <div style={{marginLeft:'1vw'}}>
                        <DatePicker
                        label="Start date"
                        value={dayjs(startDate)}
                        onChange={(event)=>                                
                            setStartDate(event)
                        }
                        slotProps={{ textField: {error:false, style:{outline:"none"}} }}
                        
                        />
                    </div>
                    <div style={{marginLeft:'1vw'}}>
                        <DatePicker
                        label="End date"
                        value={dayjs(startDate)}
                        onChange={(event)=>                                
                            setStartDate(event)
                        }
                        slotProps={{ textField: {error:false, style:{outline:"none"}} }}
                        
                        />
                    </div> */}
                    {/* <div style={{marginLeft:'1vw'}}>
                        <Button onClick={fetchCribConnectTenants} variant="contained" style={{backgroundColor: PRIMARYCOLOR, textTransform:'none'}}>
                            <p style={{marginBottom:0, fontSize:'1rem', fontWeight:'500'}} >Search</p>
                        </Button>
                    </div> */}
                </div>
                
                <div style={{flexDirection:'row',  width:'30vw', justifyContent:'flex-end', display:'flex'}}>
                    
                    <IconButton onClick={filterTenants} style={{outline:'none'}}>
                        <TuneIcon size={20} style={{color:'black'}} />
                    </IconButton>
                    <Button
                        id="sort-menu"
                        aria-controls={open ? 'demo-positioned-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        style={{ borderStyle:'solid', color: 'black', borderWidth:1, marginLeft: '1vw', outline:'none' }}
                    >
                        <p style={{fontFamily:'Open Sans', fontWeight:'700', marginTop:'auto', marginBottom:'auto', textTransform:'none'}}>Sort</p>
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
            <div style={{flexDirection: mobile ? 'column' : 'row', display:'flex', width:'100vw', paddingLeft: mobile ? 0 : '5vw', paddingRight: mobile ? 0 : '5vw'  }}>
                <div style={{height:'80vh', overflowY:'scroll', display:'flex', width: mobile ? '100vw' : '50vw', overflowX:'hidden',  }}>
                    {loading ? 
                    <div style={{display:'flex', flex: 1}}>
                        <Lottie style={{margin:'auto'}} animationData={SearchingAnim} loop/>
                    </div>
                    :

                    NYProps.length == 0 ?
                    <div style={{flexDirection:'column', alignItems:'center',alignSelf:'center', justifyContent:'center', display:'flex', flex: 1}}>
                        <Button style={{marginLeft:'auto', marginRight:'auto', backgroundColor: PRIMARYCOLOR, color:'white'}} varaint='contained' onClick={resetFilter}>Reset Filter</Button>
                        <Lottie animationData={NoPropertiesFound} loop style={{width:mobile? '80vw' : '30vw', margin:'auto'}}/>
                    </div>
                    :

                   
                        <ul ref={tenantListRef} style={{paddingLeft: 0, marginLeft: mobile ? 'auto' : 0, marginRight: mobile ? 'auto' : 0 }}>
                         {NYProps.map((item, index) => {
                                const ref = React.createRef(null);
                                MapPinsHashmap.set(item.propertyInfo._id, ref)
                                
                                if(item.userInfo._id == undefined){
                                    return null
                                }
                                else{
                                    return (
                                        <li
                                        style={{listStyleType:'none', paddingLeft: 0, paddingTop:0}}
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
                <div style={{height: '78vh', width:  '40vw', borderRadius:10, display: mobile ? 'none' : 'block', overflow:'hidden' }}>
                     <GoogleMap
                       
                        onGoogleApiLoaded={onGoogleApiLoaded}
                        apiKey="AIzaSyBbZGuUw4bqWirb1UWSzu9R6_r13rPj-eI"
                        defaultCenter={{
                            lat: defaultProps.center.lat,
                            lng: defaultProps.center.lng
                        }}
                        defaultZoom={12}
                        >

                        {
                            NYProps.map((p, index) => {
                                return(
                                    <div onClick={()=>{HandleScrollToWithId(p)}} key={"mappin" + p.propertyInfo._id} lat={p.propertyInfo.loc.coordinates[1]} lng={p.propertyInfo.loc.coordinates[0]} style={{backgroundColor: GMCenter.lat == p.propertyInfo.loc.coordinates[1] && GMCenter.lng == p.propertyInfo.loc.coordinates[0] ? PRIMARYCOLOR : 'white', justifyContent:'center', textAlign:'center', alignItems:'center', width: 50, height: 30, display:'flex', flex: 1, borderRadius:20, borderColor: PRIMARYCOLOR, borderWidth:'2px', borderStyle:'solid' ,zIndex: GMCenter.lat == p.propertyInfo.loc.coordinates[1] && GMCenter.lng == p.propertyInfo.loc.coordinates[0] ? 999 : 1 }}>
                                        <p style={{color: GMCenter.lat == p.propertyInfo.loc.coordinates[1] && GMCenter.lng == p.propertyInfo.loc.coordinates[0] ? 'white' : PRIMARYCOLOR ,margin:'auto', fontWeight:'700', fontFamily:OPENSANS}}>${p.propertyInfo.price}</p>
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


                <h5 style={{fontWeight:'500', marginTop: 20}}>Sublease type</h5>
                <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:400, marginTop:20}}>
                    <p>Studio</p>
                    <Checkbox checked={studioType} onClick={()=>setStudioType(!studioType)} style={{color: PRIMARYCOLOR }}/>

                </div>
                <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:400}}>
                    <p>Room</p>
                    <Checkbox checked={roomType}  onClick={()=> setRoomType(!roomType)} style={{color: PRIMARYCOLOR }}/>

                </div>
                <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:400}}>
                    <p>Apartment</p>
                    <Checkbox checked={apartmentType} onClick={()=> setApartmentType(!apartmentType)} style={{color: PRIMARYCOLOR }}/>

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
                    <div style={{width: '100vw', height:'100vh', backgroundColor:'white', alignSelf:'center', position: 'absolute', paddingTop: '7vh',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'}}>

                        <div style={{height:'10vh', width:'100%',  padding:'auto', flexDirection:'column', display:'flex', width: '95vw', marginLeft:'auto', marginRight:'auto'}}>
                            <p onClick={()=>setMobileMapModalVis(false)} style={{textDecorationLine:'underline', fontFamily: OPENSANS, fontWeight:'600', color: MEDIUMGREY, fontSize:'0.9rem'}}>Back to list view</p>
                            <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between'}}>
                                <p style={{alignSelf:'center', textAlign:'center',  fontWeight:'600', marginTop:'auto', marginBottom:'auto'}}>{loading ? "Finding subleases..." : `${NYProps.length}+ subleases found`}</p>
                                <div style={{flexDirection:'row', marginTop:'auto', marginBottom:'auto'}}>
                                    <Button size="small" onClick={filterTenants} style={{backgroundColor:'#2D6674', textTransform:'none'}} variant="contained">
                                        Filters
                                    </Button>
                                </div>
                            </div>
                       </div>
                        <div style={{height:'40vh', width:'100%',  overflow:'hidden'}}>
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
                                        <div onClick={() => handleMobileMapPinClick(p)} key={"mappin" + p.propertyInfo._id} lat={p.propertyInfo.loc.coordinates[1]} lng={p.propertyInfo.loc.coordinates[0]} style={{backgroundColor: mapSelectedProp != null && mapSelectedProp.propertyInfo.loc.coordinates[1] == mapSelectedProp.propertyInfo.loc.coordinates[1] && mapSelectedProp.propertyInfo.loc.coordinates[0] == p.propertyInfo.loc.coordinates[0] ? PRIMARYCOLOR : 'white', justifyContent:'center', textAlign:'center', alignItems:'center', width: 50, height: 30, display:'flex', flex: 1, borderRadius:20, borderColor: PRIMARYCOLOR, borderWidth:'2px', borderStyle:'solid' ,zIndex: GMCenter.lat == p.propertyInfo.loc.coordinates[1] && GMCenter.lng == p.propertyInfo.loc.coordinates[0] ? 999 : 1 }}>
                                             <p style={{color: mapSelectedProp != null && mapSelectedProp.propertyInfo.loc.coordinates[1] == p.propertyInfo.loc.coordinates[1] && mapSelectedProp.propertyInfo.loc.coordinates[0] == p.propertyInfo.loc.coordinates[0] ? 'white' : PRIMARYCOLOR ,margin:'auto', fontWeight:'700', fontFamily:OPENSANS}}>${p.propertyInfo.price}</p>
                                        </div>
                                    )
                                })
                                
                            }
                            </GoogleMap>        
                        </div>   
                        { mapSelectedProp != null &&
                            <div style={{width:'100vw',background:'white', paddingLeft:'2vw', paddingRight:'2vw', paddingTop:'2vh', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, height:'auto' }}>
                                {/* <IconButton style={{position:'absolute', right:'2vw', top: '-5vh'}} onClick={()=> setMapSelectedProp(null)}>
                                    <CancelIcon size={40} style={{color:'black'}} />
                                </IconButton> */}
                                <div onClick={handlePreviewClick}>
                                    <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between'}}>
                                        <p style={{fontWeight:'500', marginBottom:0, fontSize:'1rem', fontFamily: OPENSANS}}>{mapSelectedProp.propertyInfo.loc.streetAddr}</p>
                                        <p style={{fontWeight:'500', marginBottom:0, fontSize:'1rem', fontFamily: OPENSANS}}>${mapSelectedProp.propertyInfo.price} /month</p>
                                    </div>
                                    <p style={{color:MEDIUMGREY, fontWeight:'600', fontSize:'0.9rem', fontFamily: OPENSANS}}>{new Date(mapSelectedProp.propertyInfo.availableFrom).getTime() < new Date().getTime() ? "Now" : new Date(mapSelectedProp.propertyInfo.availableFrom).toLocaleString().split(",")[0]} - {new Date(mapSelectedProp.propertyInfo.availableTo).toLocaleString().split(",")[0]}</p>
                                </div>
                                <div style={{ width: '95vw',  }}>
                                {/* <ul style={{flexDirection:'row', display: 'flex', overflowX:'scroll', height:'15vh', width: '95vw',  marginLeft:'auto', marginRight:'auto', paddingLeft:0,}}> */}
                                <ul style={{flexDirection:'row', display: 'flex',   width: '95vw',  paddingLeft:0, borderRadius: MEDIUMROUNDED, marginLeft:'auto', marginRight:'auto',  overflow:'hidden'}}>

                                    {
                                    mapSelectedProp.propertyInfo.imgList.map((item, index)=> {
                                        return(
                                            <li key={"mapInLandingImg" + item + index} onClick={()=>setMapGalleryModalVis(true)} style={{marginLeft: index == 0 ? 0 : '2vw', width: '30vw', height: '30vw',}}>
                                                <img key={item + index} src={item} style={{width: '30vw', height: '30vw', borderRadius:10 }}/>
                                            </li>
                                        )
                                    })
                                    }   
                                    
                                </ul>
                                </div>
                                <Button onClick={()=>handleNav(`/listingDetails/${mapSelectedProp.propertyInfo._id}`)} fullWidth style={{backgroundColor: PRIMARYCOLOR, outline:'none', height:'5vh', textTransform:'none'}}>
                                    <p style={{fontSize:'0.9rem', fontWeight:'600', fontFamily: OPENSANS, color:'white', marginBottom:0}}>View property details</p>
                                </Button>
                            </div>
                        }
                    </div>
                </Modal>
                {/* Subtenant form modal vis */}
                <Modal
                    aria-labelledby="subtenant-form"
                    aria-describedby="subtenant-form"
                    open={subtenantFormModalVis}
                    onClose={()=> setSubtenantFormModalVis(false)}
                    closeAfterTransition
                
                    slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                    }}
                >
                    <Fade in={subtenantFormModalVis}>
                    <div 
                        style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: mobile ? '90vw' : '40vw',
                        height:'auto',
                        backgroundColor:'white',
                        padding: mobile ? '4vw' : '2vw',
                        borderRadius: MEDIUMROUNDED,
                        display:'flex',
                      
                        flexDirection:'column',
                        }}>
                        {subtenantFormPage == 0 ?
                        <>
                            <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.3rem', marginBottom: 5,}}>Get notified when new subleases are up</p>
                            <p style={{fontWeight:'400', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: '2vh',}}>Let us know your preferences so we can notify you right away when subleases that match your preferences are posted.</p>

                            <img src={NYDayImage}  style={{width:'100%', height:'25vh', borderRadius: MEDIUMROUNDED}}/>
                            <Button onClick={handleSubtenantFormNav} fullWidth variant="contained" style={{backgroundColor: 'black', outline:'none', textTransform:'none', height: '6vh', marginTop:'4vh'}}>
                                <p style={{fontFamily: OPENSANS, marginBottom:0, fontWeight:'600', objectFit:'cover'}}>
                                    Yes, I'm in
                                </p>
                            </Button>
                            <p onClick={()=> setSubtenantFormModalVis(false)} style={{fontFamily: OPENSANS, marginBottom:0, fontWeight:'500', color:'#737373', marginLeft:'auto', marginRight:'auto', marginTop:'2vh', cursor:'pointer', fontSize:"0.9rem"}}>
                                No, I don't need help
                            </p>
                        </>
                        :
                        <>
                            <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.3rem', marginBottom: 5,}}>What's your preferences</p>
                            <div style={{marginTop:'2vh'}}>
                                <Autocomplete
                                id="google-map-demo"
                                fullWidth
                                getOptionLabel={(option) =>
                                    typeof option === 'string' ? option : option.description
                                }
                                filterOptions={(x) => x}
                                style={{outline:'none', marginBottom:0}}
                                options={options}
                                autoComplete
                                includeInputInList
                                filterSelectedOptions
                                value={subtenantFormLocation}
                                forcePopupIcon={false}
                                noOptionsText="No locations"
                                onChange={(event, newValue) => {
                                    setOptions(newValue ? [newValue, ...options] : options);
                                    console.log(newValue)
                                
                                    if(newValue != null && newValue != undefined){
                                        setSubtenantFormLocation(newValue.description);
                                        fetchCribConnectTenants(newValue.description)
                                    }
                                    
                                    
                                    
                                }}
                                onInputChange={(event, newInputValue) => {
                                    console.log(newInputValue)
                                    setInputValue(newInputValue);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Enter location" variant="outlined" />
                                )}
                                renderOption={(props, option) => {
                                    const matches =
                                    option.structured_formatting.main_text_matched_substrings || [];
                                    const parts = parse(
                                    option.structured_formatting.main_text,
                                    matches.map((match) => [match.offset, match.offset + match.length]),
                                    );

                                    return (
                                    <li {...props}>
                                        <Grid container alignItems="center">
                                        <Grid item sx={{ display: 'flex', width: 'auto' }}>
                                            <LocationOnIcon sx={{ color: 'text.secondary' }} />
                                        </Grid>
                                        <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                            {parts.map((part, index) => (
                                            <Box
                                                key={index}
                                                component="span"
                                                sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                                            >
                                                {part.text}
                                            </Box>
                                            ))}

                                            <Typography variant="body2" color="text.secondary">
                                            {option.structured_formatting.secondary_text}
                                            </Typography>
                                        </Grid>
                                        </Grid>
                                    </li>
                                    );
                                }}
                                />
                                <div style={{marginTop:'2vh'}}>
                                <FormControl fullWidth>
                                <InputLabel id="bedroom-select">Sublease Type</InputLabel>
                                <Select
                                    labelId="bedroom-select"
                                    fullWidth
                                    value={subtenantFormType}
                                    label="Sublease Type"
                                    onChange={(val)=> setSubtenantFormType(val.target.value)}
                                >
                                    <MenuItem value={"Room"}>Room</MenuItem>
                                    <MenuItem value={"Studio"}>Studio</MenuItem>
                                    <MenuItem value={"Entire apartment"}>Entire apartment</MenuItem>
                                </Select>
                                </FormControl>
                                </div>
                                <div style={{marginTop:'4vh'}}>
                                    <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between'}}>
                                        <p>Budget per month ($)</p>
                                        <p>${subtenantFormBudget}</p>
                                    </div>
                                <Box>
                                    <Slider
                                        min={0}
                                        max={10000}
                                        step={100}
                                        getAriaLabel={() => 'Price range'}
                                        value={subtenantFormBudget}
                                        style={{color: PRIMARYCOLOR}}
                                        onChange={(val) => {
                                        
                                            let price = val.target.value
                                            setSubtenantFormBudget(price)

                                        }}
                                        valueLabelDisplay="auto"
                                    />
                                </Box>
                                </div>
                                <div style={{marginTop:'2vh', flexDirection:'row', display:'flex', justifyContent:'space-between'}}>
                                    <DatePicker
                                    label="Start date"
                                    value={dayjs(subtenantFormStartDate)}
                                    onChange={(event)=>                                
                                        setSubtenantFormStartDate(event)
                                    }
                                    slotProps={{ textField: {error:false, style:{outline:"none"}} }}
                                    
                                    />
                                    <DatePicker
                                    label="End date"
                                    value={dayjs(subtenantFormEndDate)}
                                    onChange={(event)=>                                
                                        setSubtenantFormEndDate(event)
                                    }
                                    slotProps={{ textField: {error:false, style:{outline:"none"}} }}
                                    
                                    />
                                </div>
                                <div style={{marginTop:'2vh', flexDirection:'row', display:'flex', justifyContent:'space-between'}}>
                                    <TextField multiline rows={ mobile ? 3 : 5} onChange={val=>setSubtenantFormBio(val.target.value)}  fullWidth label="A bit about yourself" placeholder="Example: Reason of sublease? Your personality? Any important details the tenant should know about you?"/>
                                </div>
                            </div>

                          
                            <Button onClick={handleSubtenantSubmit} fullWidth variant="contained" style={{backgroundColor: 'black', outline:'none', textTransform:'none', height: '6vh', marginTop:'4vh'}}>
                                <p style={{fontFamily: OPENSANS, marginBottom:0, fontWeight:'600', objectFit:'cover'}}>
                                    Submit
                                </p>
                            </Button>
                            <p onClick={()=> setSubtenantFormModalVis(false)} style={{fontFamily: OPENSANS, marginBottom:0, fontWeight:'500', color:'#737373', marginLeft:'auto', marginRight:'auto', marginTop:'2vh', cursor:'pointer', fontSize:"0.9rem"}}>
                                No, I don't need help
                            </p>
                        </>
                        }



                    </div>
                    </Fade>
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
                    <div style={{width: mobile ? '95vw' : '70vw',  backgroundColor:'white', alignSelf:'center', borderRadius: MEDIUMROUNDED, padding: 10, position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',}}>
                        <div style={{display:'flex', flex: 1}}>
                            <h6 style={{fontWeight:'500', marginLeft:'auto', marginRight:'auto'}}>Image Gallery</h6>
                        </div>
                        <div style={{position:'relative'}}>
                            <ul ref={imgListRef} style={{flexDirection:'row', display: 'flex', overflow:'scroll', height:'auto', width: mobile ? '100%' : '50vw', borderRadius: MEDIUMROUNDED,  marginLeft:'auto', marginRight:'auto', paddingLeft:0,}}>
                            
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
                <Modal
                    aria-labelledby="subtenant-form"
                    aria-describedby="subtenant-form"
                    open={subtenantFormSuccessModal}
                    onClose={()=> setSubtenantFormSuccessModal(false)}
                    closeAfterTransition
                
                    slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                    }}
                >
                    <Fade in={subtenantFormSuccessModal}>
                        <div 
                            style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: mobile ? '90vw' : '40vw',
                            height:'auto',
                            backgroundColor:'white',
                            padding: mobile ? '4vw' : '2vw',
                            borderRadius: MEDIUMROUNDED,
                            display:'flex',
                        
                            flexDirection:'column',
                            }}>
                                <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.3rem', marginBottom: 5,}}>We will contact you as soon as we found a suitable subleases!</p>
                                <p style={{fontWeight:'400', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 0, color: SUBTEXTCOLOR}}>If you need a sublease urgently, please send a message to <a href='tel:+12624428111'>+1(262)-442-8111</a> for further assistance.</p>
                                <Button onClick={()=> setSubtenantFormSuccessModal(false)} fullWidth variant="contained" style={{backgroundColor: 'black', outline:'none', textTransform:'none', height: '6vh', marginTop:'4vh'}}>
                                    <p style={{fontFamily: OPENSANS, marginBottom:0, fontWeight:'600', objectFit:'cover'}}>
                                        Browse available subleases
                                    </p>
                                </Button>
                        </div>
                    </Fade>
                </Modal>
                
               { mobile &&
                <div onClick={()=>setMobileMapModalVis(true)} style={{position:'absolute',backgroundColor: 'black', flexDirection:'row', display:'flex', justifyContent:'space-around', alignItems:'center', marginLeft:'auto', marginRight:'auto', bottom: '5vh', paddingLeft: 10, paddingRight:10, paddingTop:7, paddingBottom:7, borderRadius:15, width:'auto',
                    left: '50%',
                    transform: 'translate(-5vh, -50%)'}}>
                    <div>
                        <p style={{color:"white", marginTop:'auto', marginBottom:"auto", fontFamily: OPENSANS, fontWeight:'600', fontSize:'0.9rem'}}>Map</p>
                    </div>
                    <MapIcon color='white' style={{color:'white', marginLeft:'1vw', fontSize:"2.5vh"}} />
                </div>
                }
    
        </div>
        </LocalizationProvider>
    
    )
}