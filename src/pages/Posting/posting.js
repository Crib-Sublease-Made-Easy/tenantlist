import { AMENITIESLIST, EXTRALIGHT, LIGHTGREY, MEDIUMGREY, MEDIUMROUNDED, OPENSANS, PRIMARYCOLOR, GetIcon, GENDERS } from '../../sharedUtils'
import WelcomeImage from '../../welcomeImage.png'
import AppStoreDownload from './appStoreDownload.png'
import TwoPhonesImage from './twoPhonesImage.png'
import { Autocomplete, Box, Button, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useContext, useMemo, useRef, useState } from 'react'
import { UserContext } from '../../UserContext'
import { useEffect } from 'react'
import { debounce } from '@mui/material/utils';
import parse from 'autosuggest-highlight/parse';

import imageCompression from 'browser-image-compression';

import WhiteLoadingAnimation from '../../whiteLoading.json'
import Lottie from "lottie-react";

import Fade from '@mui/material/Fade';

//Icon
import ApartmentIcon from '@mui/icons-material/Apartment';
import KingBedIcon from '@mui/icons-material/KingBed';
import WeekendIcon from '@mui/icons-material/Weekend';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Groups2Icon from '@mui/icons-material/Groups2';
import CloseIcon from '@mui/icons-material/Close';

//Image 
import PostingImage1 from './postingImg1.jpg'
import PostingImage2 from './postingImg2.jpg'
import PostingImage3 from './postingImg3.jpg'



//Datepicker
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers"
import { CheckBox } from '@mui/icons-material'



function loadScript(src, position, id) {
    if (!position) {
        return;
    }
    
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('id', id);
    script.src = src;
    position.appendChild(script);
}

const autocompleteService = { current: null };



export default function PropertyPostingScreen(){
    const navigate = useNavigate()
    const {mobile, loggedIn} = useContext(UserContext)
    const [postingPage, setPostingPage] = useState(0)
    const [loading, setLoading] = useState(false)
    const [fading, setFading] = useState(false)
    const [review, setReview] = useState(false)
    const [userData, setUserData] = useState(null)

    //Sublease property 
   
    const bedroomImageRef = useRef(null);
    const bathroomImageRef = useRef(null);
    const kitchenImageRef = useRef(null);
    const livingroomImageRef = useRef(null);
    const floorplanImageRef = useRef(null);
    
    const [propertyType, setPropertyType] = useState(null)
    const [propertyLocation, setPropertyLocation] = useState(null)
    const [propertyBedroomFile, setPropertyBedroomFile] = useState(null)
    const [propertyBedroomURL, setPropertyBedroomURL] = useState(null)
    const [propertyBathroomFile, setPropertyBathroomFile] = useState(null)
    const [propertyBathroomURL, setPropertyBathroomURL] = useState(null)
    const [propertyLivingroomFile, setPropertyLivingroomFile] = useState(null)
    const [propertyLivingroomURL, setPropertyLivingroomURL] = useState(null)
    const [propertyKitchenFile, setPropertyKitchenFile] = useState(null)
    const [propertyKitchenURL, setPropertyKitchenURL] = useState(null)
    const [propertyFloorplanFile, setPropertyFloorplanFile] = useState(null)
    const [propertyFloorplanURL, setPropertyFloorplanURL] = useState(null)

    const [propertyPrice, setPropertyPrice] = useState(null)
    const [propertySecurityDeposit, setPropertySecurityDepost] = useState(null)

    const [propertyStartDate, setPropertyStartDate] = useState(null)
    const [propertyEndDate, setPropertyEndDate] = useState(null)

    const [propertyAmenities, setPropertyAmenities] = useState([])

    const [propertyNumberBedroom, setPropertyNumberBedroom] = useState(null)
    const [propertyNumberBathroom, setPropertyNumberBathroom] = useState(null)

    const [propertyRoomates, setPropertyRoommates] = useState(false)
    const [propertyRoomatesGender, setPropertyRoommatesGender] = useState(null)
    const [propertyShareRoom, setPropertyShareRoom] = useState(false)
    const [propertyShareRoomGender, setPropertyShareRoomGender] = useState(null)

    const [propertyDescription, setPropertyDescription] = useState("")

    const [propertyPreferenceGender, setPropertyPreferenceGender] = useState(null)

    const [reviewSelectedImage, setReviewSelectedImage] = useState(null)

    //Modal
    const [postingSuccessModal, setPostingSuccessModal] = useState(false)

    

    //Location stuff
    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    const loaded = useRef(false);

    if (typeof window !== 'undefined' && !loaded.current) {
        if (!document.querySelector('#google-maps')) {
          loadScript(
            `https://maps.googleapis.com/maps/api/js?key=AIzaSyBbZGuUw4bqWirb1UWSzu9R6_r13rPj-eI&libraries=places`,
            document.querySelector('head'),
            'google-maps',
          );
        }
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


    useEffect(()=>{
        getToken()
    }, [])

    async function getToken(){
        let at = localStorage.getItem("accessToken")
        let uid = localStorage.getItem("uid")
        if(at != null && uid != null){

            await fetch('https://crib-llc.herokuapp.com/users/' + uid, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + at,
            }
            }) 
            .then(res => res.json()).then(async userData =>{
                setUserData(userData)
            })
            .catch(e=>{
              console.log("Error")
            })
        } 
    }

    function handleNav(route){
        navigate(route)
    }

    function AppStoreNav(){
        window.open('https://apps.apple.com/us/app/crib-subleasing-made-easy/id1645127110', '_blank')
    }

    function handleImageSelect(pic){
        if(pic == "Bedroom"){
            bedroomImageRef.current.click()
        }
        if(pic == "Bathroom"){
            bathroomImageRef.current.click()
        }
        if(pic == "Livingroom"){
            livingroomImageRef.current.click()
        }
        if(pic == "Kitchen"){
            kitchenImageRef.current.click()
        }
        if(pic == "Floorplan"){
            floorplanImageRef.current.click()
        }
    }

    function updateAmenities(name) {

        if (propertyAmenities.indexOf(name) != -1) {
            let tempindex = propertyAmenities.indexOf(name);
            setPropertyAmenities([...propertyAmenities.slice(0, tempindex), ...propertyAmenities.slice(tempindex + 1, propertyAmenities.length)])
        }
        else {
            setPropertyAmenities(prev => [...prev, name]);
        }
    }

    async function handleImageChange(event, pic){

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024
        }

        const fileUploaded = event.target.files[0];
        console.log(fileUploaded)

        const compressedFile = await imageCompression(fileUploaded, options);
        
        const url = URL.createObjectURL(fileUploaded)
        // setProfImg(url)
        // setProfileImage(fileUploaded)
        if(pic == "Bedroom"){
            setPropertyBedroomFile(compressedFile)
            setPropertyBedroomURL(url)
            setReviewSelectedImage(url)
        }
        else if(pic == "Bathroom"){
            setPropertyBathroomFile(compressedFile)
            setPropertyBathroomURL(url)
        }
        else if(pic == "Kitchen"){
            setPropertyKitchenFile(compressedFile)
            setPropertyKitchenURL(url)
        }
        else if(pic == "Livingroom"){
            setPropertyLivingroomFile(compressedFile)
            setPropertyLivingroomURL(url)
        }
        else if(pic == "Floorplan"){
            setPropertyFloorplanFile(compressedFile)
            setPropertyFloorplanURL(url)
        }

    }


    function handleNextClick(){
        let at = localStorage.getItem("accessToken")

        if(at == null){
            alert("Please login or sign up to post a property.")
            navigate("/login")
            return
        }
        if(userData.postedProperties.length != 0){
            alert("Users can only post 1 property.")
            return
        }
        if(review && postingPage != 11){
            
            setLoading(true)
            setFading(false)
            setTimeout(()=>{
                setPostingPage(11)
                setLoading(false)
                setFading(true)
            },1500)
            return
        }
        if(postingPage == 11){
            postProperty()
            return
        }
        // console.log(propertyType)
        // console.log(propertyLocation)
        // console.log(propertyPrice)
        // console.log(propertySecurityDeposit)
        // console.log(propertyStartDate)
        // console.log(propertyEndDate)
        // console.log(propertyAmenities)
        // console.log(propertyNumberBathroom)
        // console.log(propertyNumberBedroom)
        // console.log(propertyDescription)
        // console.log(propertyRoomates)
        // console.log(propertyRoomatesGender)
        // console.log(propertyShareRoom)
        // console.log(propertyShareRoomGender)
        // console.log(propertyPreferenceGender)
       
        console.log(propertyBedroomFile)
        console.log(propertyBathroomFile)
        console.log(propertyKitchenFile)
        console.log(propertyLivingroomFile)
        if(postingPage == 1 ){
            if(propertyType == null){
                alert("Please select a property type.")
                return
            }  
        }
        if(postingPage == 2 ){
            console.log(value)
            if(propertyLocation == null){
                alert("Please select  property location.")
                return
            }  
        }
        if(postingPage == 3 ){
            console.log(value)
            if(propertyBedroomFile == null){
                alert("Please select a bedroom image.")
                return
            }  
            if(propertyBathroomFile == null){
                alert("Please select a bathroom image.")
                return
            }  
            if(propertyKitchenFile == null){
                alert("Please select a kitchen image.")
                return
            }  
            if(propertyLivingroomFile == null){
                alert("Please select a living room image.")
                return
            }  
        }
        if(postingPage == 4){
            if(propertyPrice == null){
                alert("Please enter sublease monthly rent.")
                return
            }
        }
        if(postingPage == 4){
            let pass = /^\d+$/.test(propertyPrice)
            if(!pass){
                alert("Please enter a valid monthly rent.")
                return
            }
        }
        if(postingPage == 4){
            let pass = /^\d+$/.test(propertySecurityDeposit)
            if(!pass){
                alert("Please enter a valid security deposit.")
                return
            }
        }
        if(postingPage == 5){
            if(propertyStartDate == null){
                alert("Please enter sublease start date.")
                return
            }
            if(propertyEndDate == null){
                alert("Please enter sublease end date.")
                return
            }
            if( new Date(propertyStartDate).getTime() < new Date().getTime()){
                alert("Sublease start date must be later than today.")
                return
            }
            if( new Date(propertyEndDate).getTime() < new Date(propertyStartDate).getTime()){
                alert("Sublease end date cannot be before start date.")
                return
            }
        }
        if(postingPage == 7){
            if(propertyNumberBedroom == null){
                alert("Please enter a valid number of bedrooms.")
                return
            }
            if(propertyNumberBathroom == null){
                alert("Please enter a valid number of bathrooms.")
                return
            }
            
        }
        if(postingPage == 8){
            if(propertyRoomates){
                if(propertyRoomatesGender == null){
                    alert("Please select roommate gender.")
                    return
                }
            }
            if(propertyShareRoom){
                if(propertyShareRoomGender == null){
                    alert("Please select the roommates' gender   in the shared room.")
                    return
                }
            }
        }
        if(postingPage == 9){
            if(propertyDescription.length < 100){
                alert("Property description has to be more than 100 characters.")
                return
            }
        }
        if(postingPage == 10){
            setReview(true)
            if(propertyPreferenceGender == null){
                alert("Please select preferred gender.")
                return
            }
        }
        setLoading(true)
        setFading(false)
        setTimeout(()=>{
            setPostingPage(postingPage+1)
            setLoading(false)
            setFading(true)
        },1000)
    }

    function handleReviewEditNav(page){
        setLoading(true)
        setFading(false)
        setTimeout(()=>{
            setPostingPage(page)
            setLoading(false)
            setFading(true)
        },1000)
    }

    function handleBackClick(){
        setFading(false)
        setLoading(true)
        setTimeout(()=>{
            setPostingPage(postingPage-1)
            setLoading(false)
            setFading(true)
        },1000)
    }


    async function postProperty(){
        //Last check
        setLoading(true)
        if(propertyType == null){
            alert("Please select sublease type.")
            handleReviewEditNav(1)
            return;
        }
        if(propertyLocation == null){
            alert("Please select sublease location.")
            handleReviewEditNav(2)
            return;
        }
        if(propertyBedroomFile == null){
            alert("Please select bedroom image.")
            handleReviewEditNav(3)
            return;
        }
        if(propertyBathroomFile == null){
            alert("Please select bathroom image.")
            handleReviewEditNav(3)
            return;
        }
        if(propertyLivingroomFile == null){
            alert("Please select livingroom image.")
            handleReviewEditNav(3)
            return;
        }
        if(propertyKitchenFile == null){
            alert("Please select kitchen image.")
            handleReviewEditNav(3)
            return;
        }
        if(propertyPrice == null){
            alert("Please select sublease monthly rent.")
            handleReviewEditNav(4)
            return;
        }
        if(propertyStartDate == null){
            alert("Please select sublease start date.")
            handleReviewEditNav(5)
            return;
        }
        if(propertyEndDate == null){
            alert("Please select sublease end date.")
            handleReviewEditNav(5)
            return;
        }
        if( new Date(propertyEndDate).getTime() < new Date(PropertyPostingScreen).getTime()){
            alert("End date cannot be before start date")
            handleReviewEditNav(5)
            return;
        }
        if(propertyRoomates && propertyRoomatesGender == null){
            alert("Please select roommate gender.")
            handleReviewEditNav(8)
            return;
        }
        if(propertyShareRoom && propertyShareRoomGender == null){
            alert("Please select shared roommate gender.")
            handleReviewEditNav(8)
            return;
        }
        if(propertyDescription == null || propertyDescription.length < 100){
            alert("Property description must be more than 100 characters.")
            handleReviewEditNav(9)
            return;
        }
        if(propertyPreferenceGender == null){
            alert("Please select preferred gender to sublease to.")
            handleReviewEditNav(10)
            return;
        }
        
        let location = propertyLocation.structured_formatting.main_text +","+ propertyLocation.structured_formatting.secondary_text

        await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address='${location}'&key=AIzaSyBbZGuUw4bqWirb1UWSzu9R6_r13rPj-eI`,{
            method:"GET"
        }).then( res => {return res.json()})
        .then(jsonresp =>{
            let coor = [jsonresp.results[0].geometry.location.lng, jsonresp.results[0].geometry.location.lat]
              
            const postingData = new FormData();
            postingData.append("type", propertyType)
            postingData.append("streetAddr", propertyLocation.structured_formatting.main_text)
            postingData.append("secondaryTxt", propertyLocation.structured_formatting.secondary_text);               //String 
            postingData.append("latitude", coor[1])
            postingData.append("longitude", coor[0])
            postingData.append("price", propertyPrice);
            postingData.append("description", propertyDescription);
            postingData.append("availableFrom", new Date(propertyStartDate).getTime());
            postingData.append("availableTo", new Date(propertyEndDate).getTime());
            postingData.append("bed",propertyNumberBedroom);
            postingData.append("bath",propertyNumberBathroom);
            postingData.append("timePosted", new Date())
            postingData.append("title", "Name");
            propertyAmenities.forEach(element => {
                postingData.append("amenities", element);
            });
          
            postingData.append("roommates", propertyRoomates);
            postingData.append("roommatesGender", propertyRoomatesGender)
            postingData.append("shared", propertyShareRoom);
            postingData.append("sharedGender", propertyShareRoomGender)
            postingData.append("availabilityFlexibility", true);
            postingData.append("preferenceGender", propertyPreferenceGender);
            if(propertySecurityDeposit != null && propertySecurityDeposit != undefined){
                postingData.append("securityDeposit", propertySecurityDeposit);
            }
            postingData.append("propertyImages", propertyBedroomFile);
            postingData.append("propertyImages", propertyBathroomFile);
            postingData.append("propertyImages", propertyKitchenFile);
            postingData.append("propertyImages", propertyLivingroomFile);
            if(propertyFloorplanFile != null){
                postingData.append("propertyImages", propertyFloorplanFile);
            }



            //Posting data is good
            let at = localStorage.getItem("accessToken")
            
            if(at == null){
                alert("Please log in or sign up to post a property.")
                return
            }

            fetch('https://crib-llc.herokuapp.com/properties', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Authorization': 'bearer ' + at
                },
                body: postingData,
            })
            .then(async (response) => {
                if(response.status == 200){      
                    navigate('/propertyposting')
                    
                    setPostingSuccessModal(true)
                }
                else{
                    alert("An error occured. Please try again later!")
                    navigate("/")
                   
                }
               
            })
            .catch(e => {
                setLoading(false)
                navigate("/")
                alert(e)
            })
            
        })

    }

    function handlePostingSuccess(){
        setPostingSuccessModal(false)
        navigate("/")
    }



    return(
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{ height: mobile ? '70vh' : '80vh', width:'100vw', flexDirection: mobile ? 'column' : 'row', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', justifyContent:'space-between', overflowY:'scroll'}}>
            <Fade in={fading}>
            { postingPage == 0 ?
                <>
                    <div style={{height:'auto', flexDirection:'column', marginTop:  0,  paddingTop: mobile ? '3vh' : 0,display:'flex', justifyContent:'center'}}>
                        {mobile ?
                        <p style={{fontWeight:'800', fontFamily: OPENSANS, fontSize: mobile ? '2.1rem' : '2.6rem'}}>Sublease your room<br/>easier, safer, faster with Crib.</p>
                        :
                        <p style={{fontWeight:'800', fontFamily: OPENSANS, fontSize: mobile ? '1.8rem' : '2.6rem'}}>Sublease your room<br/>safer, faster, easier,<br/>with Crib.</p>
                        }
                        {/* <p style={{fontFamily: OPENSANS, fontWeight:'500'}}>Post a sublease in 30 seconds and save thousands in rent.</p> */}
                        {/* <img onClick={AppStoreNav} src={AppStoreDownload} style={{width: mobile ? '30vw' : '10vw', marginTop:mobile ? '2vh' : '10vh', cursor:'pointer'}}/> */}
                        {/* <div style={{flexDirection: mobile ? 'column' : 'row', display:'flex', marginTop: mobile ? '5vh' : '5vh' }}>
                            <Button onClick={()=> handleNav('/discoverSubleases')} style={{backgroundColor: PRIMARYCOLOR, color: 'white', padding: 10, textTransform:'none', outline:'none'}}> 
                                <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'700'}}>Find a sublease</p>
                            </Button>
                            <Button onClick={()=>handleNav('/subleasemyroomintro')} variant="outlined" style={{color: PRIMARYCOLOR, padding: 10, borderColor: PRIMARYCOLOR, marginLeft: mobile ? 0 : '2vh', textTransform:'none', marginTop: mobile ? '2vh' : 0, outline:'none'}}>
                                <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'700'}}>Post a sublease</p>
                            </Button>
                        </div> */}
                    </div>
                    <div style={{flexDirection: 'column', display:'flex',  justifyContent:'center'}}>
                        {/* <div style={{flexDirection: 'row', display:'flex', justifyContent:'flex-end', }}>
                            <Button variant="outlined" style={{borderColor: PRIMARYCOLOR, textTransform:'none'}}>
                                <p style={{marginBottom:0, fontFamily: OPENSANS, color: PRIMARYCOLOR,  }}>View postings</p>
                            </Button>
                        </div> */}
                        <div style={{}}>
                            <div style={{ alignItems:'center', display:'flex', flexDirection: mobile ? 'column-reverse' : 'row', marginTop: mobile ? '2vh' : 0 }}>
                                {/* <img src={TwoPhonesImage} style={{width: mobile ? '60vw' : 'auto', height: mobile ? 'auto' : '70vh', alignSelf:'center', marginRight: mobile ? 0 : '10vw'}} /> */}
                                
                                    <img src={PostingImage1} style={{width: mobile ? '70vw' : '15vw', height:'auto', marginTop: mobile ? '3vh' : 0 }} />
                                    <div style={{marginLeft:'2vw',width: mobile ? '90vw' : '30vw',}}>
                                        <p style={{marginBottom: 10, fontSize: mobile ? '1.2rem' : '1.4rem', fontWeight:'600', fontFamily: OPENSANS}}>Post a sublease in 30 seconds</p>
                                        <p style={{marginBottom: 0, fontSize: mobile ? '0.9rem' : '1rem', fontWeight:'500',fontFamily: OPENSANS, color: MEDIUMGREY}}>Tell us a little bit about your sublease so we can create a posting for you. Takes 30 seconds ~</p>
                                    </div>
                                
                            </div>
                            <div style={{alignItems:'center', display:'flex', flexDirection: mobile ? 'column-reverse' : 'row', marginTop:'8vh',  }}>
                                {/* <img src={TwoPhonesImage} style={{width: mobile ? '60vw' : 'auto', height: mobile ? 'auto' : '70vh', alignSelf:'center', marginRight: mobile ? 0 : '10vw'}} /> */}
                                
                                <img src={PostingImage2} style={{width: mobile ? '70vw' : '15vw', height:'auto', marginTop: mobile ? '3vh' : 0 }} />
                                <div style={{marginLeft:'2vw',width: mobile ? '90vw' : '30vw',}}>
                                    <p style={{marginBottom: 10, fontSize: mobile ? '1.2rem' : '1.4rem', fontWeight:'600', fontFamily: OPENSANS}}>Receive sublease requests</p>
                                    <p style={{marginBottom: 0, fontSize:'1rem',fontWeight:'500',fontFamily: OPENSANS, color: MEDIUMGREY }}>You will get a request when subtenants are interested in your sublease.</p>
                                </div>
                            
                                
                            </div>
                            <div style={{alignItems:'center', display:'flex', flexDirection: mobile ? 'column-reverse' : 'row', marginTop:'8vh',  }}>
                                {/* <img src={TwoPhonesImage} style={{width: mobile ? '60vw' : 'auto', height: mobile ? 'auto' : '70vh', alignSelf:'center', marginRight: mobile ? 0 : '10vw'}} /> */}
                                
                                    <img src={PostingImage3} style={{width: mobile ? '70vw' : '15vw', height:'auto', marginTop: mobile ? '3vh' : 0 }} />
                                    <div style={{marginLeft:'2vw',width: mobile ? '90vw' : '30vw',}}>
                                        <p style={{marginBottom: 10, fontSize: mobile ? '1.2rem' : '1.4rem', fontWeight:'600', fontFamily: OPENSANS}}>Finalize sublease details</p>
                                        <p style={{marginBottom: 0, fontSize:'1rem',fontWeight:'500',fontFamily: OPENSANS, color: MEDIUMGREY }}>Tell subtenants more about how rent is paid and what's the move in process like.</p>
                                    </div>
                                
                            </div>
                        </div>
                    </div>
                </>
                :
                postingPage == 1 ?
                <div style={{flexDirection:'column', display:'block', justifyContent:'center',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto', textAlign: mobile ? 'left' : 'center'}}>
                    <p style={{fontSize: '1.5rem', fontFamily: OPENSANS, fontWeight:'600'}}>Choose the type of sublease you're posting</p>
                    <div style={{marginTop:'5vh'}}>
                        <div  onClick={()=>setPropertyType("Entire Apartment")}  style={{borderWidth:'2px', borderColor: propertyType == "Entire Apartment" ? PRIMARYCOLOR : LIGHTGREY, borderStyle:'solid',  borderRadius: MEDIUMROUNDED, padding: mobile ? '3vw' : '1vw', flexDirection: 'row', display:'flex', alignItems: 'center' ,cursor:'pointer'}}>
                            <ApartmentIcon style={{color: MEDIUMGREY, fontSize: mobile ? '6vw' : '3vw', marginBottom:0}} />
                            <div style={{flexDirection:'column', display:'flex', marginLeft:'2vw'}}>
                                <p style={{fontSize:'1.2rem', fontWeight:'600', fontFamily: OPENSANS, marginBottom:0}}>Entire apartment</p>
                                <p style={{fontSize:'0.9rem', fontWeight:'500', fontFamily: OPENSANS, marginBottom:0}}>2+ bedroom apartment</p>

                            </div>
                        </div>
                        <div onClick={()=>setPropertyType("Room")}  style={{borderWidth:'2px', borderColor: propertyType == "Room" ? PRIMARYCOLOR :  LIGHTGREY, borderStyle:'solid',  borderRadius: MEDIUMROUNDED, padding: mobile ? '3vw' : '1vw', flexDirection: 'row', display:'flex', alignItems:'center', marginTop: '2vh', cursor:'pointer'}}>
                            <KingBedIcon style={{color: MEDIUMGREY, fontSize:  mobile ? '6vw' : '3vw', marginBottom:0}} />
                            <div style={{flexDirection:'column', display:'flex', marginLeft:'2vw', textAlign:'left'}}>
                                <p style={{fontSize:'1.2rem', fontWeight:'600', fontFamily: OPENSANS, marginBottom:0}}>Room</p>
                                <p style={{fontSize:'0.9rem', fontWeight:'500', fontFamily: OPENSANS, marginBottom:0}}>Shared public area</p>
                            </div>
                        </div>
                        <div onClick={()=>setPropertyType("Studio")} style={{borderWidth:'2px', borderColor: propertyType == "Studio" ? PRIMARYCOLOR : LIGHTGREY, borderStyle:'solid',  borderRadius: MEDIUMROUNDED, padding: mobile ? '3vw' :'1vw', flexDirection: 'row', display:'flex', alignItems:'center', marginTop: '2vh', cursor:'pointer'}}>
                            <WeekendIcon style={{color: MEDIUMGREY, fontSize:  mobile ? '6vw' :  '3vw', marginBottom:0}} />
                            <div style={{flexDirection:'column', display:'flex', marginLeft:'2vw', textAlign:'left'}}>
                                <p style={{fontSize:'1.2rem', fontWeight:'600', fontFamily: OPENSANS, marginBottom:0}}>Studio</p>
                                <p style={{fontSize:'0.9rem', fontWeight:'500', fontFamily: OPENSANS, marginBottom:0}}>Open-styled apartment</p>
                            </div>
                        </div>
                    </div>

                </div>
                :
                postingPage == 2 ?
                <div style={{flexDirection:'column', display:'block', justifyContent:'center',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto', minWidth:'35vw', textAlign: mobile ? 'left' :  'center'}}>
                    <p style={{fontSize: '1.5rem', fontFamily: OPENSANS, fontWeight:'600'}}>What is the address of your sublease?</p>
                    <div style={{marginTop:'4vh'}}>
                        <Autocomplete

                        id="google-map-demo"
                        fullWidth
                        getOptionLabel={(option) =>
                            typeof option === 'string' ? option : option.description
                        }
                        filterOptions={(x) => x}
                        options={options}
                        autoComplete
                        includeInputInList
                        filterSelectedOptions
                        value={propertyLocation}
                        noOptionsText="No locations"
                        onChange={(event, newValue) => {
                            setOptions(newValue ? [newValue, ...options] : options);
                            setPropertyLocation(newValue);
                        }}
                        onInputChange={(event, newInputValue) => {
                            setInputValue(newInputValue);
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Add a location" fullWidth />
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
                                <Grid item sx={{ display: 'flex', width: 44 }}>
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
                </div>
                :
                postingPage == 3 ?
                <div style={{flexDirection:'column', display:'block', justifyContent:'center',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto', textAlign: mobile ? 'left' : 'center'}}>
                    <p style={{fontSize: '1.5rem', fontFamily: OPENSANS, fontWeight:'600'}}>Upload images of your sublease</p>
                    <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'400', display: mobile ? 'none' : 'block'}}>Uploading actual images of your sublease increase chances of success by 70%.</p>
                    <div style={{flexDirection:'row', display:'flex', flex: 1, justifyContent:'space-between', width:'90vw', marginTop:'2vh', overflow:'scroll', height: mobile ? '50vh' : 'auto'}}>
                        <div style={{flexDirection:'column' , cursor:"pointer"}}>
                            <p style={{fontWeight:'500', fontSize:'1.1rem', }}>Bedroom</p>
                            <img onClick={()=>handleImageSelect("Bedroom")} src={ propertyBedroomURL} style={{width: mobile ? '70vw' : '17vw', height: mobile ? '70vw' : '17vw', backgroundColor:EXTRALIGHT, borderRadius: MEDIUMROUNDED, objectFit:'cover', borderWidth:'1px', borderColor:LIGHTGREY, borderStyle:'solid', }}/>
                            <input onChange={(event)=>handleImageChange(event, "Bedroom")}  ref={bedroomImageRef} type="file" accept="image/*" style={{display: 'none'}} />
                        </div>
                        <div style={{flexDirection:'column', cursor:"pointer", marginLeft: mobile ? '5vw' : 0}}>
                            <p style={{fontWeight:'500', fontSize:'1.1rem'}}>Bathroom</p>
                            <img onClick={()=>handleImageSelect("Bathroom")} src= {propertyBathroomURL} style={{width: mobile ? '70vw' : '17vw', height: mobile ? '70vw' : '17vw',backgroundColor:EXTRALIGHT, borderRadius: MEDIUMROUNDED, objectFit:'cover', borderWidth:'1px', borderColor:LIGHTGREY, borderStyle:'solid'}}/>
                            <input onChange={(event)=>handleImageChange(event, "Bathroom")}  ref={bathroomImageRef} type="file" accept="image/*" style={{display: 'none'}} />

                        </div>
                        <div style={{flexDirection:'column',  cursor:"pointer",  marginLeft: mobile ? '5vw' : 0}}>
                            <p style={{fontWeight:'500', fontSize:'1.1rem'}}>Kitchen</p>
                            <img onClick={()=>handleImageSelect("Kitchen")} src= {propertyKitchenURL} style={{width: mobile ? '70vw' : '17vw', height: mobile ? '70vw' : '17vw', backgroundColor:EXTRALIGHT, borderRadius: MEDIUMROUNDED, objectFit:'cover', borderWidth:'1px', borderColor:LIGHTGREY, borderStyle:'solid'}}/>
                            <input onChange={(event)=>handleImageChange(event, "Kitchen")}  ref={kitchenImageRef} type="file" accept="image/*" style={{display: 'none'}} />

                        </div>
                        <div style={{flexDirection:'column',  cursor:"pointer",  marginLeft: mobile ? '5vw' : 0}}>
                            <p style={{fontWeight:'500', fontSize:'1.1rem'}}>Living room</p>
                            <img onClick={()=>handleImageSelect("Livingroom")} src= {propertyLivingroomURL} style={{width: mobile ? '70vw' : '17vw', height: mobile ? '70vw' : '17vw', backgroundColor:EXTRALIGHT, borderRadius: MEDIUMROUNDED, objectFit:'cover', borderWidth:'1px', borderColor:LIGHTGREY, borderStyle:'solid'}}/>
                            <input onChange={(event)=>handleImageChange(event, "Livingroom")}  ref={livingroomImageRef} type="file" accept="image/*" style={{display: 'none'}} />

                        </div>
                        <div style={{flexDirection:'column',  cursor:"pointer",  marginLeft: mobile ? '5vw' : 0}}>
                            <p style={{fontWeight:'500', fontSize:'1.1rem'}}>Floorplan (Optional)</p>
                            <img onClick={()=>handleImageSelect("Floorplan")} src= {propertyFloorplanURL} style={{width: mobile ? '70vw' : '17vw', height: mobile ? '70vw' : '17vw', backgroundColor:EXTRALIGHT, borderRadius: MEDIUMROUNDED, objectFit:'cover', borderWidth:'1px', borderColor:LIGHTGREY, borderStyle:'solid'}}/>
                            <input onChange={(event)=>handleImageChange(event, "Floorplan")}  ref={floorplanImageRef} type="file" accept="image/*" style={{display: 'none'}} />

                        </div>
                    </div>
                </div>
                :
                postingPage == 4 ?
                <div style={{flexDirection:'column', display:'block', justifyContent:'center',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto', textAlign:'center', minWidth: mobile ? '90vw' : '30vw', textAlign: mobile ? 'left' : 'center'}}>
                    <p style={{fontSize: '1.5rem', fontFamily: OPENSANS, fontWeight:'600'}}>What is your monthly rent?</p>
                    <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'400'}}>Please enter the monthly rent in USD</p>
                    <div style={{marginTop:'5vh'}}>
                        <TextField 
                        type="tel"
                        value={propertyPrice}
                        onChange={(val) => setPropertyPrice(val.target.value)}
                        InputProps={{
                            placeholder: 'Monthly rent',
                            startAdornment: <InputAdornment style={{paddingRight:'1vw'}}>$</InputAdornment>,
                            endAdornment: <InputAdornment> /month</InputAdornment>,
                        }}
                        fullWidth 
                        />
                    </div>
                
                    <div style={{marginTop:'5vh'}}>
                        <TextField 
                        type="tel"
                        value={propertySecurityDeposit}
                        onChange={(val) => setPropertySecurityDepost(val.target.value)}
                        InputProps={{
                            placeholder: 'Security deposit (if applicable)',
                            startAdornment: <InputAdornment style={{paddingRight:'1vw'}}>$</InputAdornment>
                        }}
                        fullWidth 
                        />
                    </div>
                </div>
                :
                postingPage == 5 ?
                <div style={{flexDirection:'column', display:'block', justifyContent:'center',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto',  textAlign: mobile ? 'left' : 'center'}}>
                    <p style={{fontSize: '1.5rem', fontFamily: OPENSANS, fontWeight:'600'}}>What is availability of your sublease?</p>
                    <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'400'}}>Enter the maximun range for a better result</p>
                    <div style={{marginTop:'5vh'}}>
                        <DatePicker
                        label="Start date"
                        value={propertyStartDate}
                        onChange={(event)=>   
                            {                     
                            console.log(event)        
                            setPropertyStartDate(event)
                            }
                        }
                        slotProps={{  textField: {error:false, fullWidth: true} }}
                        />
                    </div>
                    <div style={{marginTop:'5vh'}}>
                        <DatePicker
                        label="End date"
                        value={propertyEndDate}
                        onChange={(event)=>                                
                            setPropertyEndDate(event)
                        }
                        slotProps={{  textField: {error:false, fullWidth: true} }}
                        />
                    </div>
                    
                </div>
                :
                postingPage == 6 ?
                <div style={{flexDirection:'column', display:'block', justifyContent:'center',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto',  textAlign: mobile ? 'left' : 'center', minWidth: mobile ? '90vw' : '40vw'}}>
                    <p style={{fontSize: '1.5rem', fontFamily: OPENSANS, fontWeight:'600'}}>What amenities are included with the sublease?</p>
                    <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'400', marginBottom:0, }}>Scroll to see more amenities options.</p>
                    <div style={{flexDirection:'column', display:"flex", overflow:'scroll', height:'60vh', paddingLeft:"1vw", paddingRight:'1vw', marginTop: mobile ? '2vh' : "5vh"}}>
                    {
                        AMENITIESLIST.map((item)=> {
                            return(
                                <div style={{flexDirection:'row', display:'flex',  marginTop: mobile ? '4vh' : '4vh', alignItems:'center', justifyContent:'space-between', }}>
                                    <div style={{flexDirection:'row', display:'flex', alignItems:"center"}}>
                                        {GetIcon(MEDIUMGREY, mobile ? '6vw' : '2vw', item.name)}
                                        <p style={{fontFamily: OPENSANS, fontWeight:"500", fontSize: mobile ? '0.9rem' : '1.1rem', marginLeft:'1.5vw', marginBottom:0}}>{item.name.replaceAll("_", " ")}</p>
                                    </div>
                                    <CheckBox onClick={() => updateAmenities(item.name)} check={false} style={{color: propertyAmenities.indexOf(item.name) == -1 ? LIGHTGREY : PRIMARYCOLOR, cursor: 'pointer'}} />
                                </div>
                            )
                        })
                    }
                    </div>
                </div>
                :
                postingPage == 7 ?
                <div style={{flexDirection:'column', display:'block', justifyContent:'center',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto',textAlign: mobile ? 'left' : 'center', minWidth: mobile ? '90vw' : '35vw'}}>
                    <p style={{fontSize: '1.5rem', fontFamily: OPENSANS, fontWeight:'600'}}>Tell subtenants more about your sublease</p>
                    <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'400'}}>How many bedrooms and bathrooms are in the entire property? {mobile ? null : <br/>}If studio, please enter 1 bedroom and 1 bathroom.</p>
                    <div  style={{marginTop: '4vh'}}>
                        <FormControl fullWidth>
                        <InputLabel id="bedroom-select">Number of bedrooms</InputLabel>
                        <Select
                            labelId="bedroom-select"
                            fullWidth
                            value={propertyNumberBedroom}
                            label="Number of bedrooms"
                            onChange={(val)=> setPropertyNumberBedroom(val.target.value)}
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                        </Select>
                        </FormControl>
                    </div>
                    <div  style={{marginTop: '4vh'}}>
                        <FormControl fullWidth>
                        <InputLabel id="bathroom-select">Number of bathrooms</InputLabel>
                        <Select
                            labelId="bathroom-select"
                            fullWidth
                            value={propertyNumberBathroom}
                            label="Number of bedrooms"
                            onChange={(val)=> setPropertyNumberBathroom(val.target.value)}
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                        </Select>
                        </FormControl>
                    </div>
                </div>
                :
                postingPage == 8 ?
                <div style={{flexDirection:'column', display:'block', justifyContent:'center',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto', textAlign: mobile ? 'left' : 'center', minWidth: mobile ? '90vw' : '35vw'}}>
                    <p style={{fontSize:  mobile ? '1.2rem' : '1.5rem', fontFamily: OPENSANS, fontWeight:'600'}}>Are there other roommates during subtenant's stay?</p>
                    <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'2vh'}}>
                        <p style={{fontFamily: OPENSANS, fontWeight:"400", fontSize: mobile ? '1rem' : '1.1rem', marginBottom:0}}>Yes, there will be roommates</p>
                        <CheckBox onClick={() => setPropertyRoommates(!propertyRoomates)} check={propertyRoomates} style={{color: propertyRoomates ? PRIMARYCOLOR : LIGHTGREY, fontSize: mobile ? '6vw' : '2vw',cursor:'pointer' }} />
                    </div>
                    { propertyRoomates &&
                    <>
                        <p style={{fontFamily: OPENSANS, fontWeight:"600", fontSize:'1rem', marginBottom:0, textAlign:'start', marginTop:'2vh' }}>What are roommates' gender?</p>

                        <div style={{flexDirection:'row', justifyContent:'space-between', display:'flex', marginTop:'4vh', width:'100%'}}>
                            {
                                GENDERS.map((item) => {
                                    return(
                                        <div onClick={()=> setPropertyRoommatesGender(item)} style={{paddingLeft: mobile ? '2vw' :'1vw', paddingRight:  mobile ? '2vw' : '1vw', paddingTop:'1vh', paddingBottom:'1vh', borderColor: LIGHTGREY, borderWidth:'1px', borderRadius:MEDIUMROUNDED, borderStyle:'solid', cursor:'pointer', backgroundColor: item == propertyRoomatesGender ? PRIMARYCOLOR : 'white'}}>
                                            <p style={{marginBottom:0, fontSize:'1rem', fontWeight:'500', fontFamily: OPENSANS, color: item == propertyRoomatesGender ? "white" : MEDIUMGREY}}>{item}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>   
                    </>   
                    }
                    <p style={{fontSize: mobile ? '1.2rem' : '1.5rem', fontFamily: OPENSANS, fontWeight:'600', marginTop: mobile ? '3vh' : '6vh', textAlign:'start'}}>Does the tenant have to share the room?</p>
                    <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'2vh'}}>
                        <p style={{fontFamily: OPENSANS, fontWeight:"400", fontSize:mobile ? '1rem' : '1.1rem',marginBottom: 0 }}>Yes, it is <span style={{textDecorationLine:'underline'}}>not</span> a private bedroom</p>
                        <CheckBox onClick={() => setPropertyShareRoom(!propertyShareRoom)} check={propertyShareRoom} style={{color: propertyShareRoom ? PRIMARYCOLOR : LIGHTGREY,  fontSize: mobile ? '6vw' : '2vw',cursor:'pointer' }} />
                    </div>
                    {
                    propertyShareRoom &&
                    <>
                        <p style={{fontFamily: OPENSANS, fontWeight:"600", fontSize:'1rem', marginBottom:0, textAlign:'start', marginTop:'2vh' }}>What are shared roommates' gender?</p>
                        <div style={{flexDirection:'row', justifyContent:'space-between', display:'flex', marginTop:'4vh', width:'100%'}}>
                            {
                                GENDERS.map((item) => {
                                    return(
                                        <div onClick={()=> setPropertyShareRoomGender(item)} style={{paddingLeft: mobile ? '2vw' :'1vw', paddingRight:  mobile ? '2vw' : '1vw', paddingTop:'1vh', paddingBottom:'1vh', borderColor: LIGHTGREY, borderWidth:'1px', borderRadius:MEDIUMROUNDED, borderStyle:'solid', cursor:'pointer', backgroundColor: item == propertyShareRoomGender ? PRIMARYCOLOR : 'white'}}>
                                            <p style={{marginBottom:0, fontSize:'1rem', fontWeight:'500', fontFamily: OPENSANS, color: item == propertyShareRoomGender ? "white" : MEDIUMGREY}}>{item}</p>
                                        </div>
                                    )
                                })
                            }
                            
                        </div>   
                    </>
                    }
                    
                    
                </div>
                :
                postingPage == 9 ?
                <div style={{flexDirection:'column', display:'block', justifyContent:'center',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto', textAlign: mobile ? 'left' : 'center', width: mobile ? '90vw' : '40vw'}}>
                    <p style={{fontSize: '1.5rem', fontFamily: OPENSANS, fontWeight:'600'}}>Sublease description</p>
                    <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'400'}}>Enter useful information about the sublease that would help subtenants. Are there any restaurants nearby? How close are public transportation?</p>
                    <div style={{marginTop:'5vh'}}>
                        <TextField value={propertyDescription} onChange={(val) => setPropertyDescription(val.target.value)} label="Description..." fullWidth  multiline rows={8} inputProps={{ maxLength: 1000 }}/>
                    </div>
                </div>
                :
                postingPage == 10 ?
                <div style={{flexDirection:'column', display:'block', justifyContent:'center',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto',  textAlign: mobile ? 'left' : 'center', width: mobile ? '90vw' : '45vw'}}>
                    <p style={{fontSize: '1.5rem', fontFamily: OPENSANS, fontWeight:'600'}}>What genders are you comfortable subleasing to? </p>
                    <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'400'}}>Choose "Both" increases your success by 50%</p>
                    <div style={{flexDirection:'row', justifyContent:'space-between', display:'flex', marginTop:'6vh', width:'100%'}}>
                        {
                            GENDERS.map((item) => {
                                return(
                                    <div onClick={()=> setPropertyPreferenceGender(item)} style={{paddingLeft: mobile ? '2vw' :'1vw', paddingRight:  mobile ? '2vw' : '1vw', paddingTop:'1vh', paddingBottom:'1vh', borderColor: LIGHTGREY, borderWidth:'1px', borderRadius:MEDIUMROUNDED, borderStyle:'solid', cursor:'pointer', backgroundColor: item == propertyPreferenceGender ? PRIMARYCOLOR : 'white'}}>
                                        <p style={{marginBottom:0, fontSize:'1rem', fontWeight:'500', fontFamily: OPENSANS, color: item == propertyPreferenceGender ? "white" : MEDIUMGREY}}>{item}</p>
                                    </div>
                                )
                            })
                        }
                        
                    </div>   
                </div>
                :
               
                
                <div style={{flexDirection: mobile ? 'column' : 'row', display:'flex', flex:1, paddingTop:'3vh', marginLeft:'auto', marginRight:'auto', overflow:'scroll'}}>
                  
                    <div style={{ width: mobile ? '90vw' :  '50vw'}}>
                        <p style={{fontSize: mobile ? '2rem' : '2.5rem', fontFamily: OPENSANS, fontWeight:'600'}}>Review</p>
                        <p style={{fontSize: mobile ? '1rem' : '1rem', fontFamily: OPENSANS, fontWeight:'400'}}>Take a second look and make sure everything looks good.</p>
                     
                        <div style={{marginTop:'4vh',  maxWidth: mobile ? '90vw' : '40vw'}}>
                            <div style={{flexDirection:"row", display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                <p style={{marginBottom:0, fontSize: mobile ? '1.2rem' : '1.4rem', fontFamily: OPENSANS, fontWeight:'700'}}>Type</p>
                                <IconButton onClick={()=>handleReviewEditNav(1)} style={{outline:'none'}}>
                                    <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                                </IconButton>
                            </div>
                            <div style={{marginTop:'1vh', }}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>{propertyType}</p>
                            </div>
                        </div>

                        <div style={{marginTop:'4vh',maxWidth: mobile ? '90vw' : '40vw'}}>
                            <div style={{flexDirection:"row", display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                <p style={{marginBottom:0, fontSize: mobile ? '1.2rem' : '1.4rem', fontFamily: OPENSANS, fontWeight:'700'}}>Location</p>
                                <IconButton style={{outline:'none'}} onClick={()=>handleReviewEditNav(2)}>
                                    <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                                </IconButton>
                            </div>
                            <div style={{marginTop:'1vh', }}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>{propertyLocation.description}</p>
                            </div>
                        </div>
                        <div style={{marginTop:'4vh',maxWidth: mobile ? '90vw' : '40vw'}}>
                            <div style={{flexDirection:"row", display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                <p style={{marginBottom:0, fontSize:mobile ? '1.2rem' :  '1.4rem', fontFamily: OPENSANS, fontWeight:'700'}}>Rent</p>
                                <IconButton style={{outline:'none'}} onClick={()=>handleReviewEditNav(4)}>
                                    <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                                </IconButton>
                            </div>
                            <div style={{marginTop:'1vh', }}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>Security deposit: ${propertyPrice}</p>
                            </div>
                            <div style={{marginTop:'1vh', }}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>Monthly rent: ${propertySecurityDeposit}</p>
                            </div>
                        </div>
                        <div style={{marginTop:'4vh',maxWidth: mobile ? '90vw' : '40vw'}}>
                            <div style={{flexDirection:"row", display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                <p style={{marginBottom:0, fontSize: '1.4rem', fontFamily: OPENSANS, fontWeight:'700'}}>Availability</p>
                                <IconButton style={{outline:'none'}} onClick={()=>handleReviewEditNav(5)}>
                                    <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                                </IconButton>
                            </div>
                            <div style={{marginTop:'1vh', }}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>From {new Date(propertyStartDate).toLocaleDateString().split(",")[0]} to {new Date(propertyEndDate).toLocaleDateString().split(",")[0]}</p>
                            </div>
                        </div>
                        <div style={{marginTop:'4vh',maxWidth: mobile ? '90vw' : '40vw'}}>
                            <div style={{flexDirection:"row", display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                <p style={{marginBottom:0, fontSize: mobile ? '1.2rem' : '1.4rem', fontFamily: OPENSANS, fontWeight:'700'}}>Property type</p>
                                <IconButton style={{outline:'none'}} onClick={()=>handleReviewEditNav(7)}>
                                    <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                                </IconButton>
                            </div>
                            <div style={{marginTop:'1vh', }}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>{propertyNumberBedroom} Bedroom, {propertyNumberBathroom} Bathroom</p>
                            </div>
                        </div>
                        <div style={{marginTop:'4vh', maxWidth: mobile ? '90vw' : '40vw'}}>
                            <div style={{flexDirection:"row", display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                <p style={{marginBottom:0, fontSize: mobile ? '1.2rem' : '1.4rem', fontFamily: OPENSANS, fontWeight:'700'}}>Roommates</p>
                                <IconButton style={{outline:'none'}} onClick={()=>handleReviewEditNav(8)}>
                                    <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                                </IconButton>
                            </div>
                            <div style={{marginTop:'1vh',flexDirection:'row', display:'flex' }}>
                                <Groups2Icon style={{fontSize:'2vw', color: MEDIUMGREY}} />
                                {propertyRoomates ?
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0, marginLeft: '2vw'}}>There will be {propertyRoomatesGender} roommate</p>
                                :
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0, marginLeft: '2vw'}}>There will be no roommates</p>
                                }
                            </div>
                            <div style={{marginTop:'1vh',flexDirection:'row', display:'flex' }}>
                                <KingBedIcon style={{fontSize:'2vw', color: MEDIUMGREY}} />
                                {propertyShareRoom ?
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0, marginLeft: '2vw'}}>Subtenant will share a room with {propertyShareRoomGender} roommate</p>
                                :
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0, marginLeft: '2vw'}}>Subtenant has a private room</p>
                                }
                            </div>
                        </div>
                        <div style={{marginTop:'4vh', maxWidth: mobile ? '90vw' : '40vw'}}>
                            <div style={{flexDirection:"row", display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                <p style={{marginBottom:0, fontSize:mobile ? '1.2rem' :  '1.4rem', fontFamily: OPENSANS, fontWeight:'700'}}>Description</p>
                                <IconButton style={{outline:'none'}} onClick={()=>handleReviewEditNav(9)}>
                                    <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                                </IconButton>
                            </div>
                            <div style={{marginTop:'1vh', }}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>{propertyDescription}</p>
                            </div>
                        </div>
                        <div style={{marginTop:'4vh', maxWidth: mobile ? '90vw' : '40vw'}}>
                            <div style={{flexDirection:"row", display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                <p style={{marginBottom:0, fontSize: '1.4rem', fontFamily: OPENSANS, fontWeight:'700'}}>Preferred subtenant gender</p>
                                <IconButton style={{outline:'none'}} onClick={()=>handleReviewEditNav(10)}>
                                    <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                                </IconButton>
                            </div>
                            <div style={{marginTop:'1vh', }}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>{propertyPreferenceGender}</p>
                            </div>
                           
                        </div>
                        <div style={{width:'100%', height:'5vh'}}/>
                    </div>
                    <div style={{paddingTop:mobile ? 0 : '4vh', width: mobile ? '90vw' : '40vw', display:'flex', flexDirection:'column', alignItems:'center', }}>
                        <p style={{marginBottom:0, fontSize: '1.4rem', fontFamily: OPENSANS, fontWeight:'700', width:mobile ? '90vw' :  '30vw', }}>Image gallery</p>
                        <div style={{width: mobile ? '90vw' :  '30vw', height: mobile ? '90vw' :  '30vw', borderRadius: MEDIUMROUNDED, backgroundColor: EXTRALIGHT, borderWidth:'1px', borderStyle:'solid', borderColor: LIGHTGREY, position:'relative', marginTop:'2vh' }}>
                            <img src={reviewSelectedImage} style={{height:'100%', width:'100%', borderRadius: MEDIUMROUNDED, objectFit:'cover'}} />
                            <IconButton style={{outline:'none', position:'absolute', top: '2vh', right:'2vw', backgroundColor:'white'}} onClick={()=>handleReviewEditNav(3)}>
                                <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                            </IconButton>
                        </div>
                        <div style={{flexDirection:'row', width:mobile ? '90vw' : '30vw', justifyContent:'space-between', display:'flex', marginTop:'4vh'}}>
                            <div onClick={()=>setReviewSelectedImage(propertyBedroomURL)} style={{width: mobile ? '15vw' : '5vw', height:  mobile ? '15vw' : '5vw', borderRadius: MEDIUMROUNDED,backgroundColor: EXTRALIGHT, borderWidth:'1px', borderStyle:'solid', borderColor: LIGHTGREY, cursor:'pointer' }}>
                                <img src={propertyBedroomURL} style={{height: '100%', width:'100%', borderRadius: MEDIUMROUNDED}}/>
                            </div>
                            <div onClick={()=>setReviewSelectedImage(propertyBathroomURL)} style={{width: mobile ? '15vw' : '5vw', height:  mobile ? '15vw' : '5vw', borderRadius: MEDIUMROUNDED,backgroundColor: EXTRALIGHT, borderWidth:'1px', borderStyle:'solid', borderColor: LIGHTGREY, cursor:'pointer' }}>
                                <img src={propertyBathroomURL} style={{height: '100%', width:'100%', borderRadius: MEDIUMROUNDED}}/>
                            </div>
                            <div onClick={()=>setReviewSelectedImage(propertyKitchenURL)} style={{width: mobile ? '15vw' : '5vw', height:  mobile ? '15vw' : '5vw', borderRadius: MEDIUMROUNDED,backgroundColor: EXTRALIGHT, borderWidth:'1px', borderStyle:'solid', borderColor: LIGHTGREY, cursor:'pointer' }}>
                                <img src={propertyKitchenURL} style={{height: '100%', width:'100%', borderRadius: MEDIUMROUNDED}}/>
                            </div>
                            <div onClick={()=>setReviewSelectedImage(propertyLivingroomURL)} style={{width: mobile ? '15vw' : '5vw', height:  mobile ? '15vw' : '5vw', borderRadius: MEDIUMROUNDED,backgroundColor: EXTRALIGHT, borderWidth:'1px', borderStyle:'solid', borderColor: LIGHTGREY, cursor:'pointer' }}>
                                <img src={propertyLivingroomURL} style={{height: '100%', width:'100%', borderRadius: MEDIUMROUNDED}}/>
                            </div>
                            <div onClick={()=>setReviewSelectedImage(propertyFloorplanURL)} style={{width: mobile ? '15vw' : '5vw', height:  mobile ? '15vw' : '5vw', borderRadius: MEDIUMROUNDED,backgroundColor: EXTRALIGHT, borderWidth:'1px', borderStyle:'solid', borderColor: LIGHTGREY, cursor:'pointer' }}>
                                <img src={propertyFloorplanURL} style={{height: '100%', width:'100%', borderRadius: MEDIUMROUNDED}}/>
                            </div>
                        </div>

                        <div style={{marginTop:'6vh', width: mobile ? '90vw' : '30vw'}}>
                            <div style={{flexDirection:"row", display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                <p style={{marginBottom:0, fontSize: mobile ? '1.2rem' :  '1.4rem', fontFamily: OPENSANS, fontWeight:'700'}}>Amenities</p>
                                <IconButton style={{outline:'none'}} onClick={()=>handleReviewEditNav(6)}>
                                    <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                                </IconButton>
                            </div>
                            <div style={{marginTop:'2vh'}}>
                                {propertyAmenities.map((item, index)=>{
                                    return(
                                        <div style={{flexDirection:'row', display:'flex', marginTop: index == 0 ? 0 : mobile ? '3vh' : '1.5vh', alignItems:'center'}}>
                                            {GetIcon(MEDIUMGREY, mobile ? '5vw' : '2vw', item)}
                                            <p style={{fontFamily: OPENSANS, fontWeight:"400", fontSize:'1rem', marginLeft:'2vw', marginBottom: 0}}>{item.replaceAll("_", " ")}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            }
            </Fade>
        </div>
        
        <div style={{flexDirection:"row" , display: 'flex', justifyContent: postingPage == 0 || review ? 'flex-end' : 'space-between', paddingLeft:"5vw", paddingRight:'5vw', borderTopWidth:'1px', borderTopColor:LIGHTGREY, borderTopStyle: 'solid', alignItems:'center', flex: 1, alignContent:'center', backgroundColor:'white', height:'10vh', outline: 'none', position:'absolute',bottom:0, zIndex: 999, width:'100%'}}>
                {!review && postingPage != 0 &&
                <Button variant='text' onClick={handleBackClick} style={{height:'5vh', textTransform:'none', outline:'none'}}>
                    <p style={{fontFamily: OPENSANS, fontWeight:'600', fontSize:'0.9rem', color: MEDIUMGREY, textDecorationLine:'underline', marginBottom:0}}>Back</p>
                </Button>
                }
                <Button disabled={loading} onClick={handleNextClick} variant='contained' style={{backgroundColor: PRIMARYCOLOR, textTransform:"none", width: mobile ? '30vw' : '8vw', height:'6vh', outline:'none'}}>
                    {loading ?
                    <Lottie animationData={WhiteLoadingAnimation} style={{width:mobile ? '25vw' : '5vw', display:'flex', flex: 1}} />
                    :
                    postingPage == 0 ?
                    <p style={{fontFamily: OPENSANS, fontWeight:'600', fontSize:'0.9rem', color: 'white', marginBottom:0}}>Start</p>
                    :
                    review && postingPage == 11?
                    <p style={{fontFamily: OPENSANS, fontWeight:'600', fontSize:'0.9rem', color: 'white', marginBottom:0}}>Post</p>
                    :
                    review?
                    <p style={{fontFamily: OPENSANS, fontWeight:'600', fontSize:'0.9rem', color: 'white', marginBottom:0}}>Review</p>

                    :
                    <p style={{fontFamily: OPENSANS, fontWeight:'600', fontSize:'0.9rem', color: 'white', marginBottom:0}}>Continue</p>
                        
                    }
                    </Button>
        </div>
        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={postingSuccessModal}
        onClose={handlePostingSuccess}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        >
            <Fade in={postingSuccessModal}>
            <div 
                style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: mobile ? '90vw' : 'auto',
                height:'auto',
                backgroundColor:'white',
                padding: mobile ? '4vw' : '2vw',
                borderRadius: MEDIUMROUNDED,
                display:'flex',
               
                flexDirection:'column',
                
                
                }}>
                <IconButton onClick={handlePostingSuccess} style={{position:'absolute', top: '-7vh', left: 0, backgroundColor:'white'}}>
                    <CloseIcon style={{color: MEDIUMGREY, fontSize:'4vw', color:'black'}} />
                </IconButton>
                <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.1rem', marginBottom: '2vh',}}>Sublease successfully posted!</p>
                <div style={{width: mobile ? '82vw' : '25vw', height:  mobile ? '82vw' : '25vw', backgroundColor: EXTRALIGHT, borderRadius: MEDIUMROUNDED}}>
                    <img src={propertyBedroomURL} style={{width:'100%', height:'100%', borderRadius: MEDIUMROUNDED, objectFit:'cover'}} />
                </div>
                <div style={{marginTop:'1vh'}}>
                    <p style={{fontSize:'1rem', fontWeight:'600', fontFamily: OPENSANS, marginBottom:5}}>{propertyLocation != null && propertyLocation.structured_formatting.main_text}</p>
                    <p style={{fontSize:'0.9rem', fontWeight:'500', fontFamily: OPENSANS, marginBottom:5, color: MEDIUMGREY}}>{new Date(propertyStartDate).toLocaleDateString().split(",")[0]} - {new Date(propertyEndDate).toLocaleDateString().split(",")[0]}</p>
                    <p style={{fontSize:'0.9rem', fontWeight:'500', fontFamily: OPENSANS, marginBottom:0,  color: MEDIUMGREY}}>${propertyPrice} /month</p>
                </div>
            </div>
            </Fade>
        </Modal>
        </LocalizationProvider>
    )
}