import { AMENITIESLIST, EXTRALIGHT, LIGHTGREY, MEDIUMGREY, MEDIUMROUNDED, OPENSANS, PRIMARYCOLOR, GetIcon, GENDERS, SUBTEXTCOLOR } from '../../sharedUtils'
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

//Example images 
import BedroomExample from './bedroomExample.jpg'
import BathroomExample from './bathroomExample.jpeg'
import KitchenExample from './kitchenExample.jpeg'
import LivingroomExample from './livingroomExample.jpeg'



//Gooogle map
import GoogleMap from 'google-maps-react-markers';

//Datepicker
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers"
import { CheckBox } from '@mui/icons-material'


const IMAGETIPS = 
[
{title: "Open the curtains or turn on the light", content:"No one likes to stay in a dim and gloomy, making the room look brighter makes a huge difference "},
{title: "Organize before taking pictures", content:"We know that many of you are packing or moving out, however, having a clean and tidy room stands out"}, 
{title: "Add a floor plan", content: "Floor plans allows guests to conceptualize how the place would look like in person easily"}
]



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
    const [NYProps, setNYProps] = useState([])

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
    const [propertyPaymentTime, setPropertyPaymentTime] = useState(null)
    const [propertyOtherPaymentTime, setPropertyOtherPaymentTime] = useState("")
    const [propertyPaymentMethod, setPropertyPaymentMethod] = useState([])

    const [proeprtyNumberOfBeds, setPropertyNumberOfBeds] = useState(null)
    const [propertyBedTypes, setPropertyBedTypes] = useState([])
    const [proeprtyNumberOfBaths, setPropertyNumberOfBaths] = useState(null)
    const [privateBathroom, setPrivateBathroom] = useState(false)

    const [utilitiesIncluded, setUtilitiesIncluded] = useState(false)
    const [utilitiesFee, setUtilitiesFee] = useState("")
    const [wifiIncluded, setWifiIncluded] = useState(false)
    const [wifiFee, setWifiFee] = useState("")
    const [inUnitWasherDryer, setInUnitWasherDryer] = useState(false)
    const [washerDryerLocation, setWasherDryerLocation] = useState(null)
    


    const [propertyStartDate, setPropertyStartDate] = useState(null)
    const [propertyEndDate, setPropertyEndDate] = useState(null)

    const [propertyAmenities, setPropertyAmenities] = useState([])

    const [propertyNumberBedroom, setPropertyNumberBedroom] = useState(null)
    const [propertyNumberBathroom, setPropertyNumberBathroom] = useState(null)

    const [propertyRoomates, setPropertyRoommates] = useState(false)
    const [propertyRoomatesGender, setPropertyRoommatesGender] = useState(null)
    const [propertyNumberOfRoommates, setPropertyNumberOfRoommates] = useState(null)
    const [propertyShareRoom, setPropertyShareRoom] = useState(false)
    const [propertyShareRoomGender, setPropertyShareRoomGender] = useState(null)

    const [propertyDescription, setPropertyDescription] = useState("")
    const [propertyToSubtenantMessage, setPropertyToSubtenantMessage] = useState("")

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
        fetchProps()
    }, [])

    async function fetchProps(){
        await fetch("https://crib-llc.herokuapp.com/properties/getAllNewYorkPosting?&page=0&latitude=40.730610&longitude=-73.935242")
        .then((res) => {return res.json()})
        .then( async data => {
            setNYProps(data)
        })
    }
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
        console.log(postingPage)
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
        if(postingPage == 13){
            postProperty()
           
            return
        }
       
        if(review && postingPage != 13){
            
            setLoading(true)
            setFading(false)
            setTimeout(()=>{
                setPostingPage(13)
                setLoading(false)
                setFading(true)
            },1500)
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

        if(postingPage == 1 ){
            if(propertyType == null){
                alert("Please select a property type.")
                return
            }  
        }
        if(postingPage == 2 ){
            if(propertyLocation == null){
                alert("Please select your property location.")
                return
            }  
        }
        if(postingPage == 3 ){
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
            let pass = /^\d+$/.test(propertyPrice)

            if(!pass){
                alert("Please enter a valid monthly rent.")
                return
            }
            if(propertyPrice == null){
                alert("Please enter sublease monthly rent.")
                return
            }
            let sdpass = /^\d+$/.test(propertySecurityDeposit)
            if(!sdpass){
                alert("Please enter a valid security deposit.")
                return
            }
            if(propertyPaymentTime == null){
                alert("Please select a rent payment time.")
                return
            }
            if(propertyPaymentTime == "Other" && propertyOtherPaymentTime.trim() == ""){
                alert("Please enter a rent payment time, or select from options.")
                return
            }
            if(propertyPaymentMethod.length == 0){
                alert("Please select at least one rent payment method.")
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
        if(postingPage == 6){
            if(proeprtyNumberOfBeds == null){
                alert("Please enter a valid number of bedrooms.")
                return
            }
            if(proeprtyNumberOfBaths== null){
                alert("Please enter a valid number of bathrooms.")
                return
            }
            
        }
        if(postingPage == 7){
            if(!utilitiesIncluded && utilitiesFee.trim() == ""){
                alert("Please enter average monthly utlities fee.")
                return
            }
            if(!wifiIncluded && wifiFee.trim() == ""){
                alert("Please enter monthly wifi fee.")
                return
            }
            if(!inUnitWasherDryer && washerDryerLocation == null){
                alert("Please select location of washer and dryer.")
                return
            }
        }
        if(postingPage == 9){
            if(propertyRoomates){
                if(propertyNumberOfRoommates == null){
                    alert("Please select the number of roommates present during subtenant stay.")
                    return
                }
                if(propertyRoomatesGender == null){
                    alert("Please select roommate gender.")
                    return
                }
            }
            if(propertyShareRoom){
                if(propertyShareRoomGender == null){
                    alert("Please select the roommates' gender in the shared room.")
                    return
                }
            }
        }
        if(postingPage == 10){
            if(propertyDescription.length < 150){
                alert("Property description has to be more than 150 characters.")
                return
            }
        }
        if(postingPage == 11){
            if(propertyPreferenceGender == null){
                alert("Please select preferred gender.")
                return
            }
            // setReview(true)
        }
        if(postingPage == 12){
            if(propertyToSubtenantMessage.length < 100){
                alert("Please include a message to the subtenant. It serves as a great first impression.")
                return
            }
            setReview(true)
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
        
        if(utilitiesIncluded){
            propertyAmenities.push("Utilities_Included")
        }
        if(wifiFee){
            propertyAmenities.push("Wifi")
        }
        if(inUnitWasherDryer){
            propertyAmenities.push("Washer_Dryer")
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
            postingData.append("rentPaymentTime", propertyPaymentTime)
            propertyPaymentMethod.forEach(element => {
                postingData.append("rentPaymentMethod", element);
            });
            postingData.append("privateBathroom", privateBathroom)
            postingData.append("utilitiesFee", utilitiesFee)
            postingData.append("wifiFee", wifiFee)
            postingData.append("WDLocation", washerDryerLocation)
            postingData.append("numberOfRoommates", propertyNumberOfRoommates)
            postingData.append("messageToSubtenant", propertyToSubtenantMessage)
           
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
        navigate("/mySublease")
    }

    function getBedTypes(){
        let items = [];
        
        for(let i = 0; i < propertyNumberBedroom; i++){
            items.push(i)
        }
        let bedtypes = items
        return(
            items.map(item=>{
                function setBed(type,index){
                    bedtypes[index] = type
                }
                return (
                    <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'2vh'}}>
                        <p style={{marginBottom:0, fontFamily: OPENSANS, color: SUBTEXTCOLOR, fontWeight:'500'}}>Size of bed {item+1}</p>
                        <Select
                            size='small'
                            value={bedtypes[item]}
                            onChange={(val)=> setBed(val.target.value,item)}
                        >
                            <MenuItem value={"Twin"}>Twin</MenuItem>
                            <MenuItem value={"TwinXL"}>Twin XL</MenuItem>
                            <MenuItem value={"Full"}>Full</MenuItem>
                            <MenuItem value={"Queen"}>Queen</MenuItem>
                            <MenuItem value={"King"}>King</MenuItem>
                        </Select>
                    </div>
                )
            })
        )
    }

    function getProeprtyPaymentMethod(){
        let arr = propertyPaymentMethod;

        let ret = ""

        arr.map((item) => {
            ret = ret + item +  ","
        })

        ret = ret.substring(0, ret.length-1)

        return ret
    }


    return(
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{ height: mobile ? '70vh' : '80vh', width:'100vw', flexDirection: 'column', display:'flex', paddingLeft: '5vw', paddingRight:'5vw',  overflowY:'scroll'}}>
            <Fade in={fading}>
            { postingPage == 0 ?
                <>
                    <div style={{flexDirection: mobile ? 'column' : 'row', display:'flex', justifyContent: 'space-between', alignItems:'center', height: '80vh', overflow:'scroll'}}> 
                        <div style={{height:'auto', flexDirection:'column', marginTop:  0,  paddingTop: mobile ? '3vh' : 0,display:'flex', justifyContent:'center',}}>
                            {mobile ?
                            <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize: mobile ? '1.8rem' : '2.6rem', textAlign:'center', marginTop:'5vh'}}><span style={{color: PRIMARYCOLOR}}>Save thousands today,</span><br/>sublease your Crib<br/>faster, safer, and easier.</p>
                            :
                            <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize: mobile ? '1.8rem' : '2.6rem'}}><span style={{color: PRIMARYCOLOR}}>Save thousands today,</span><br/>sublease your Crib<br/>faster, safer, and easier.</p>
                            }
                            <p style={{marginBottom: 0, fontSize: mobile ? '1rem' : '1.2rem', fontWeight:'500', fontFamily: OPENSANS, color: SUBTEXTCOLOR, textAlign: mobile ? 'center' : 'left'}}>Join 1000+ tenants who posted on Crib</p>

                        </div>
                        <div style={{flexDirection: 'column', justifyContent: 'center', alignItems:'center', display:'flex', marginTop: mobile ? '5vh' : 0}}>            
                            <div style={{}}>
                                <div style={{ alignItems:'center', display:'flex', flexDirection: mobile ? 'column-reverse' : 'row', marginTop: mobile ? '2vh' : 0, textAlign: mobile ? 'center' : 'left' }}>                                
                                        
                                        <div style={{width: mobile ? '90vw' : '25vw'}}>
                                            <p style={{marginBottom: 10, fontSize: mobile ? '1.2rem' : '1.2rem', fontWeight:'600', fontFamily: OPENSANS, marginTop: mobile ? '5vh' : 0}}>We make your listing informative </p>
                                            <p style={{marginBottom: 0, fontSize: '0.9rem', fontWeight:'500',fontFamily: OPENSANS, color: SUBTEXTCOLOR, width: mobile ? '90vw' : '25vw'}}>Add all the important details of you so subtenants won't miss your sublease</p>
                                        </div>
                                        <img src={PostingImage1} style={{width: mobile ? '70vw' : '15vw', height:'auto', marginTop: mobile ? '3vh' : 0 }} />
                                        
                                    
                                </div>
                                <div style={{alignItems:'center', display:'flex', flexDirection: mobile ? 'column' : 'row-reverse', marginTop:'8vh',  textAlign: mobile ? 'center' : 'left' }}>                                
                                    <img src={PostingImage2} style={{width: mobile ? '70vw' : '15vw', height:'auto', marginTop: mobile ? '3vh' : 0 }} />
                                    <div style={{width: mobile ? '90vw' : '25vw',}}>
                                        <p style={{marginBottom: 10, fontSize: mobile ? '1.2rem' : '1.2rem', fontWeight:'600', fontFamily: OPENSANS, marginTop: mobile ? '5vh' : 0}}>We verify subtenants</p>
                                        <p style={{marginBottom: 0, fontSize:'0.9rem',fontWeight:'500',fontFamily: OPENSANS, color: SUBTEXTCOLOR,  width: mobile ? '90vw' : '25vw'}}>No one likes to sublease to a stranger, we do our best to verify all subtenants.</p>
                                    </div>
                                
                                    
                                </div>
                                <div style={{alignItems:'center', display:'flex', flexDirection: mobile ? 'column' : 'row-reverse', marginTop:'8vh',  textAlign: mobile ? 'center' : 'left', paddingBottom: mobile ? '5vh' : 0 }}>                                
                                        <img src={PostingImage3} style={{width: mobile ? '70vw' : '15vw', height:'auto', marginTop: mobile ? '3vh' : 0 }} />
                                        <div style={{width: mobile ? '90vw' : '25vw',}}>
                                            <p style={{marginBottom: 10, fontSize: mobile ? '1.2rem' : '1.2rem', fontWeight:'600', fontFamily: OPENSANS,  marginTop: mobile ? '5vh' : 0}}>We take care of everything</p>
                                            <p style={{marginBottom: 0, fontSize:'0.9rem',fontWeight:'500',fontFamily: OPENSANS, color: SUBTEXTCOLOR,  width: mobile ? '90vw' : '25vw'}}>We take care of everything, including writing up a sublease contract to keep you safe.</p>
                                        </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </>
                :
                postingPage == 1 ?
                <div style={{flexDirection:'column', display:'block', justifyContent:'center',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto', textAlign: mobile ? 'left' : 'center'}}>
                    <p style={{fontSize: '1.5rem', fontFamily: OPENSANS, fontWeight:'500'}}>Choose the type of sublease you're posting</p>
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
                    <p style={{fontSize: '1.5rem', fontFamily: OPENSANS, fontWeight:'500'}}>What is the address of your sublease?</p>
                    <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'400', }}>Please enter the street address for best result.</p>
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
                <div style={{width:'90vw', flexDirection: mobile ? 'column-reverse' : 'row', display:'flex',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto', justifyContent:'space-between'}}>
                    <div style={{display:'flex', flexDirection:'column', width: mobile ? '90vw' : '55vw', textAlign:'left' , marginTop: mobile ? "5vh" : 0}}>
                        <p style={{fontSize: '1.5rem', fontFamily: OPENSANS, fontWeight:'500'}}>Upload images of your sublease</p>
                        <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'400', display: mobile ? 'none' : 'block', color: SUBTEXTCOLOR}}>Uploading actual images of your sublease increase chances of success by 70%.</p>
                       
                        <div style={{width:'100%', flexDirection:'row', display:'flex', paddingTop:'2vh', paddingBottom:'6vh', borderBottomWidth:'1px', borderBottomColor:LIGHTGREY, borderBottomStyle:'solid', justifyContent: mobile ? 'space-between' : 'flex-start'}}>
                            <div style={{flexDirection:"column", display:'flex', flex: 1}}>
                                <p style={{fontSize: '1.1rem', fontFamily: OPENSANS, fontWeight:'500'}}>Bedroom</p>
                                <img onClick={()=>handleImageSelect("Bedroom")} src={ propertyBedroomURL} style={{width: mobile ? '40vw' : '17vw', height: mobile ? '40vw' : '17vw', backgroundColor:EXTRALIGHT, borderRadius: MEDIUMROUNDED, objectFit:'cover', borderWidth:'1px', borderColor:LIGHTGREY, borderStyle:'solid',cursor:'pointer'}}/>
                                <input onChange={(event)=>handleImageChange(event, "Bedroom")}  ref={bedroomImageRef} type="file" accept="image/*" style={{display: 'none'}} />

                            </div>
                            <div style={{flexDirection:"column", display:'flex', flex: 1}}>
                                <p style={{fontSize: '1.1rem', fontFamily: OPENSANS, fontWeight:'500'}}>Example image</p>
                                <img src={BedroomExample} style={{width: mobile ? '40vw' : '17vw', height: mobile ? '40vw' : '17vw', backgroundColor:EXTRALIGHT, borderRadius: MEDIUMROUNDED, objectFit:'cover', borderWidth:'1px', borderColor:LIGHTGREY, borderStyle:'solid', }}/>
                            </div>

                        </div>

                        <div style={{width:'100%', flexDirection:'row', display:'flex', paddingTop:'6vh', paddingBottom:'6vh', borderBottomWidth:'1px', borderBottomColor:LIGHTGREY, borderBottomStyle:'solid'}}>
                            <div style={{flexDirection:"column", display:'flex', flex: 1}}>
                                <p style={{fontSize: '1.1rem', fontFamily: OPENSANS, fontWeight:'500'}}>Bathroom</p>
                                <img onClick={()=>handleImageSelect("Bathroom")} src={ propertyBathroomURL} style={{width: mobile ? '40vw' : '17vw', height: mobile ? '40vw' : '17vw', backgroundColor:EXTRALIGHT, borderRadius: MEDIUMROUNDED, objectFit:'cover', borderWidth:'1px', borderColor:LIGHTGREY, borderStyle:'solid',cursor:'pointer'}}/>
                                <input onChange={(event)=>handleImageChange(event, "Bathroom")}  ref={bathroomImageRef} type="file" accept="image/*" style={{display: 'none'}} />

                            </div>
                            <div style={{flexDirection:"column", display:'flex', flex: 1}}>
                                <p style={{fontSize: '1.1rem', fontFamily: OPENSANS, fontWeight:'500'}}>Example image</p>
                                <img src={BathroomExample} style={{width: mobile ? '40vw' : '17vw', height: mobile ? '40vw' : '17vw', backgroundColor:EXTRALIGHT, borderRadius: MEDIUMROUNDED, objectFit:'cover', borderWidth:'1px', borderColor:LIGHTGREY, borderStyle:'solid', }}/>
                            </div>

                        </div>

                        <div style={{width:'100%', flexDirection:'row', display:'flex', paddingTop:'6vh', paddingBottom:'6vh', borderBottomWidth:'1px', borderBottomColor:LIGHTGREY, borderBottomStyle:'solid'}}>
                            <div style={{flexDirection:"column", display:'flex', flex: 1}}>
                                <p style={{fontSize: '1.1rem', fontFamily: OPENSANS, fontWeight:'500'}}>Livingroom</p>
                                <img onClick={()=>handleImageSelect("Livingroom")} src={ propertyLivingroomURL} style={{width: mobile ? '40vw' : '17vw', height: mobile ? '40vw' : '17vw', backgroundColor:EXTRALIGHT, borderRadius: MEDIUMROUNDED, objectFit:'cover', borderWidth:'1px', borderColor:LIGHTGREY, borderStyle:'solid',cursor:'pointer'}}/>
                                <input onChange={(event)=>handleImageChange(event, "Livingroom")}  ref={livingroomImageRef} type="file" accept="image/*" style={{display: 'none'}} />

                            </div>
                            <div style={{flexDirection:"column", display:'flex', flex: 1}}>
                                <p style={{fontSize: '1.1rem', fontFamily: OPENSANS, fontWeight:'500'}}>Example image</p>
                                <img src={KitchenExample} style={{width: mobile ? '40vw' : '17vw', height: mobile ? '40vw' : '17vw', backgroundColor:EXTRALIGHT, borderRadius: MEDIUMROUNDED, objectFit:'cover', borderWidth:'1px', borderColor:LIGHTGREY, borderStyle:'solid', }}/>
                            </div>
                        </div>

                        <div style={{width:'100%', flexDirection:'row', display:'flex', paddingTop:'6vh', paddingBottom:'6vh',  borderBottomWidth:'1px', borderBottomColor:LIGHTGREY, borderBottomStyle:'solid'}}>
                            <div style={{flexDirection:"column", display:'flex', flex: 1}}>
                                <p style={{fontSize: '1.1rem', fontFamily: OPENSANS, fontWeight:'500'}}>Kitchen</p>
                                <img onClick={()=>handleImageSelect("Kitchen")} src={ propertyKitchenURL} style={{width: mobile ? '40vw' : '17vw', height: mobile ? '40vw' : '17vw', backgroundColor:EXTRALIGHT, borderRadius: MEDIUMROUNDED, objectFit:'cover', borderWidth:'1px', borderColor:LIGHTGREY, borderStyle:'solid',cursor:'pointer'}}/>
                                <input onChange={(event)=>handleImageChange(event, "Kitchen")}  ref={kitchenImageRef} type="file" accept="image/*" style={{display: 'none'}} />

                            </div>
                            <div style={{flexDirection:"column", display:'flex', flex: 1}}>
                                <p style={{fontSize: '1.1rem', fontFamily: OPENSANS, fontWeight:'500'}}>Example image</p>
                                <img src={LivingroomExample} style={{width: mobile ? '40vw' : '17vw', height: mobile ? '40vw' : '17vw', backgroundColor:EXTRALIGHT, borderRadius: MEDIUMROUNDED, objectFit:'cover', borderWidth:'1px', borderColor:LIGHTGREY, borderStyle:'solid', }}/>
                            </div>
                        </div>

                        <div style={{width:'100%', flexDirection:'row', display:'flex', paddingTop:'6vh', paddingBottom:'6vh',  borderBottomWidth:'1px', borderBottomColor:LIGHTGREY, borderBottomStyle:'solid'}}>
                            <div style={{flexDirection:"column", display:'flex', flex: 1}}>
                                <p style={{fontSize: '1.1rem', fontFamily: OPENSANS, fontWeight:'500'}}>Floor plan</p>
                                <img onClick={()=>handleImageSelect("Floorplan")} src={ propertyFloorplanURL} style={{width: mobile ? '40vw' : '17vw', height: mobile ? '40vw' : '17vw', backgroundColor:EXTRALIGHT, borderRadius: MEDIUMROUNDED, objectFit:'cover', borderWidth:'1px', borderColor:LIGHTGREY, borderStyle:'solid',cursor:'pointer'}}/>
                                <input onChange={(event)=>handleImageChange(event, "Floorplan")}  ref={floorplanImageRef} type="file" accept="image/*" style={{display: 'none'}} />

                            </div>
                           
                        </div>
                    </div>
                    <div style={{display:'flex', flexDirection:'column', width: mobile ? '90vw' : '30vw' }}>
                        <p style={{fontSize: '1.2rem', fontFamily: OPENSANS, fontWeight:'500'}}>Tips on successfully subleasing</p>
                        <p style={{fontSize: '0.9rem', fontFamily: OPENSANS, fontWeight:'400', display: mobile ? 'none' : 'block', color: SUBTEXTCOLOR}}>Easy things to do to stand out</p>
                        {IMAGETIPS.map((item, index) => {
                            return (
                            <div style={{width:'100%', borderRadius:MEDIUMROUNDED, borderColor: LIGHTGREY, borderStyle:'solid', padding:'2vh', marginTop: index == 0 ? '2vh' :  mobile ? '2vh' : '5vh'}}>
                                <p style={{fontSize: mobile ? '0.8rem' : '1rem', fontFamily: OPENSANS, fontWeight:'600', color: 'black', marginBottom:'1vh'}}>{item.title}</p>
                                <p style={{fontSize: mobile ? '0.8rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:'400', color: SUBTEXTCOLOR, marginBottom:0}}>{item.content}</p>
                            </div>
                            )
                        })}
                    </div>
                </div>
                :
                postingPage == 4 ?
                <div style={{flexDirection:'column', display:'block', justifyContent:'center',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto', textAlign:'center', minWidth: mobile ? '90vw' : '30vw', textAlign: mobile ? 'left' : 'center', paddingBottom: mobile ? '15vh' : 0}}>
                    <p style={{fontSize: '1.5rem', fontFamily: OPENSANS, fontWeight:'600'}}>What is your monthly rent?</p>
                    <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'400'}}>Please enter the monthly rent in USD</p>
                    <div style={{marginTop:'4vh'}}>
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
                
                    <div style={{marginTop:'4vh'}}>
                        <TextField 
                        type="tel"
                        value={propertySecurityDeposit}
                        onChange={(val) => setPropertySecurityDepost(val.target.value)}
                        InputProps={{
                            placeholder: 'Security deposit',
                            startAdornment: <InputAdornment style={{paddingRight:'1vw'}}>$</InputAdornment>
                        }}
                        fullWidth 
                        />
                    </div>
                    <div style={{marginTop:'4vh'}}>
                        <FormControl fullWidth>
                            <InputLabel id="number-of-occupants">When would monthly rent be paid</InputLabel>
                            <Select
                               
                                value={propertyPaymentTime}
                                label="When would monthly rent be paid"
                                
                                onChange={(val)=> setPropertyPaymentTime(val.target.value)}
                            >
                                <MenuItem value={"Beginning"}>Beginning of each month</MenuItem>
                                <MenuItem value={"End"}>End of each month</MenuItem>
                                <MenuItem value={"Other"}>Other</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    {propertyPaymentTime == "Other" &&
                    <div style={{marginTop:'4vh'}}>
                        <TextField label="Please speicfy rent payment time" value={propertyOtherPaymentTime}  onChange={(val)=> setPropertyOtherPaymentTime(val.target.value)} fullWidth/>
                    </div>
                    }
                    <div style={{marginTop:'4vh'}}>
                        <FormControl fullWidth>
                            <InputLabel id="number-of-occupants">How can monthly rent be paid</InputLabel>
                            <Select
                               
                                value={propertyPaymentMethod}
                                label="How would monthly rent be paid"
                                multiple
                                onChange={(val)=> setPropertyPaymentMethod(val.target.value)}
                            >
                                <MenuItem value={"Through the building portal"}>Through the building portal</MenuItem>
                                <MenuItem value={"Bank Transfer"}>Bank Transfer</MenuItem>
                                <MenuItem value={"Zelle"}>Zelle</MenuItem>
                                <MenuItem value={"Venmo"}>Venmo</MenuItem>
                                <MenuItem value={"PayPal"}>Paypal</MenuItem>
                                <MenuItem value={"Open to other payment methods"}>Open to other payment methods</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                :
                postingPage == 5 ?
                <div style={{flexDirection:'column', display:'block', justifyContent:'center',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto',  textAlign: mobile ? 'left' : 'center'}}>
                    <p style={{fontSize: '1.5rem', fontFamily: OPENSANS, fontWeight:'500'}}>What is your sublease's availability?</p>
                    <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'400'}}>Enter the maximum range for a better result</p>
                    <div style={{marginTop:'5vh'}}>
                        <DatePicker
                        label="Earliest move-in date"
                        value={propertyStartDate}
                        onChange={(event)=>   
                            {                     
                            setPropertyStartDate(event)
                            }
                        }
                        slotProps={{  textField: {error:false, fullWidth: true} }}
                        />
                    </div>
                    <div style={{marginTop:'5vh'}}>
                        <DatePicker
                        label="Latest move-out date"
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
                <div style={{flexDirection:'column', display:'block', justifyContent:'center',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto',  textAlign: mobile ? 'left' : 'center', minWidth:'30vw'}}>
                    <p style={{fontSize: '1.5rem', fontFamily: OPENSANS, fontWeight:'500'}}>Let subtenants know more about the place</p>
                    <div style={{marginTop:'5vh'}}>
                        <FormControl fullWidth>
                            <InputLabel id="number-of-beds">How many beds does subtenant have access to?</InputLabel>
                            <Select
                               
                                value={proeprtyNumberOfBeds}
                                label="How many beds does subtenant have access to?"
                               
                                onChange={(val)=> setPropertyNumberOfBeds(val.target.value)}
                            >
                                <MenuItem value={"0"}>0</MenuItem>
                                <MenuItem value={"1"}>1</MenuItem>
                                <MenuItem value={"2"}>2</MenuItem>
                                <MenuItem value={"3"}>3</MenuItem>
                                <MenuItem value={"4"}>4</MenuItem>
                                <MenuItem value={"5"}>5</MenuItem>
                                <MenuItem value={"6"}>6</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div style={{marginTop:'5vh'}}>
                        <FormControl fullWidth>
                            <InputLabel id="number-of-baths">How many baths can subtenant use?</InputLabel>
                            <Select
                               
                                value={proeprtyNumberOfBaths}
                                label="How many baths can subtenant use?"
                               
                                onChange={(val)=> setPropertyNumberOfBaths(val.target.value)}
                            >
                                <MenuItem value={"0"}>0</MenuItem>
                                <MenuItem value={"1"}>1</MenuItem>
                                <MenuItem value={"2"}>2</MenuItem>
                                <MenuItem value={"3"}>3</MenuItem>
                                <MenuItem value={"4"}>4</MenuItem>
                                <MenuItem value={"5"}>5</MenuItem>
                                <MenuItem value={"6"}>6</MenuItem>
                            </Select>
                        </FormControl>
                        <div style={{display:'flex', flexDirection:'row',justifyContent:'space-between', alignItems:'center', marginTop:'5vh'}}>
                            <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'400', marginBottom:0, }}>Does subtenant have a private bathroom?</p>
                            <CheckBox checked={privateBathroom} onClick={()=>setPrivateBathroom(!privateBathroom)} style={{color: privateBathroom ? 'black' : LIGHTGREY, cursor:'pointer'}} />
                        </div>
                    </div>
                    
                </div>
                :
                postingPage == 7 ?
                <div style={{flexDirection:'column', display:'block', justifyContent:'center',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto',  textAlign: mobile ? 'left' : 'center', minWidth:'30vw', paddingBottom: mobile ? '5vh' : 0}}>
                    <p style={{fontSize: '1.5rem', fontFamily: OPENSANS, fontWeight:'500'}}>Are there any extra charges/fees</p>
                    
                    <div style={{marginTop:'5vh'}}>

                        <div style={{display:'flex', flexDirection:'row',justifyContent:'space-between', alignItems:'center', marginTop:'5vh'}}>
                            <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'500', marginBottom:0, }}>Are utilities included?</p>
                            <CheckBox checked={privateBathroom} onClick={()=>setUtilitiesIncluded(!utilitiesIncluded)} style={{color: utilitiesIncluded ? 'black' : LIGHTGREY, cursor:'pointer'}} />
                           
                        </div>
                        {!utilitiesIncluded &&
                            <div style={{marginTop:"3vh"}}>
                                <TextField onChange={(val)=> setUtilitiesFee(val.target.value)} fullWidth label={"Average utlities per month (USD)"} />
                            </div>
                        }
                        <div style={{display:'flex', flexDirection:'row',justifyContent:'space-between', alignItems:'center', marginTop:'5vh'}}>
                            <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'500', marginBottom:0, }}>Is WiFi included?</p>
                            <CheckBox checked={privateBathroom} onClick={()=>setWifiIncluded(!wifiIncluded)} style={{color: wifiIncluded? 'black' : LIGHTGREY, cursor:'pointer'}} />
                        </div>
                        {!wifiIncluded &&
                            <div style={{marginTop:"3vh"}}>
                                <TextField onChange={(val)=> setWifiFee(val.target.value)} fullWidth label={"Wifi fee per month (USD)"} />
                            </div>
                        }
                        <div style={{display:'flex', flexDirection:'row',justifyContent:'space-between', alignItems:'center', marginTop:'5vh'}}>
                            <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'500', marginBottom:0, }}>Is washer and dryer in-unit?</p>
                            <CheckBox checked={privateBathroom} onClick={()=>setInUnitWasherDryer(!inUnitWasherDryer)} style={{color: inUnitWasherDryer ? 'black' : LIGHTGREY, cursor:'pointer'}} />
                        </div>
                        {!inUnitWasherDryer &&
                            <div style={{marginTop:"3vh"}}>
                               <FormControl fullWidth>
                                    <InputLabel id="wd-location">Washer & Dryer location</InputLabel>
                                    <Select
                                        value={washerDryerLocation}
                                        label="Washer & Dryer location"    
                                        onChange={(val)=> setWasherDryerLocation(val.target.value)}
                                    >
                                        <MenuItem value={"Same floor"}>Same floor</MenuItem>
                                        <MenuItem value={"In building"}>In building</MenuItem>
                                        <MenuItem value={"Outside of building"}>Outside of building</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        }

                    </div>
                    
                </div>
                :
                postingPage == 8 ?
                <div style={{flexDirection:'column', display:'block', justifyContent:'center',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto',  textAlign: mobile ? 'left' : 'center', minWidth: mobile ? '90vw' : '40vw'}}>
                    <p style={{fontSize: '1.5rem', fontFamily: OPENSANS, fontWeight:'500'}}>What amenities are included with the sublease?</p>
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
                postingPage == 9 ?
                <div style={{flexDirection:'column', display:'block', justifyContent:'center',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto', textAlign: mobile ? 'left' : 'center', minWidth: mobile ? '90vw' : '35vw', paddingBottom: mobile ? '20vh' : 0}}>
                    <p style={{fontSize:  mobile ? '1.2rem' : '1.3rem', fontFamily: OPENSANS, fontWeight:'500'}}>Are there other roommates during subtenant's stay?</p>
                    <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'2vh'}}>
                        <p style={{fontFamily: OPENSANS, fontWeight:"400", fontSize: mobile ? '1rem' : '1rem', marginBottom:0}}>Yes, there will be roommates</p>
                        <CheckBox onClick={() => setPropertyRoommates(!propertyRoomates)} check={propertyRoomates} style={{color: propertyRoomates ? PRIMARYCOLOR : LIGHTGREY, fontSize: mobile ? '6vw' : '2vw',cursor:'pointer' }} />
                    </div>
                    { propertyRoomates &&
                    <>
                        <div style={{marginTop:'4vh'}}>
                        <FormControl fullWidth>
                            <InputLabel id="wd-location">How many roommates will there be?</InputLabel>
                            <Select
                                value={propertyNumberOfRoommates}
                                label="How many roommates will there be?"    
                                onChange={(val)=> setPropertyNumberOfRoommates(val.target.value)}
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                            </Select>
                        </FormControl>
                        </div>
                        <div style={{marginTop:'4vh'}}>
                            <p style={{fontFamily: OPENSANS, fontWeight:"400", fontSize:'1rem', marginBottom:0, textAlign:'start', marginTop:'2vh' }}>What are roommates' gender?</p>

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
                        </div>
                    </>   
                    }
                    <div style={{marginTop:"4vh", textAlign:'left'}}>
                        <p style={{fontSize:  mobile ? '1.2rem' : '1.3rem', fontFamily: OPENSANS, fontWeight:'500'}}>Does the tenant have to share the room?</p>
                        <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'2vh'}}>
                            <p style={{fontFamily: OPENSANS, fontWeight:"400", fontSize: mobile ? '1rem' : '1rem', marginBottom:0}}>Yes, it is <span style={{textDecorationLine:'underline'}}>not</span> a private bedroom</p>
                            <CheckBox onClick={() => setPropertyShareRoom(!propertyShareRoom)} check={propertyShareRoom} style={{color: propertyShareRoom ? PRIMARYCOLOR : LIGHTGREY,  fontSize: mobile ? '6vw' : '2vw',cursor:'pointer' }} />
                        </div>
                        {
                        propertyShareRoom &&
                        <>
                            <p style={{fontFamily: OPENSANS, fontWeight:"400", fontSize:'1rem', marginBottom:0, textAlign:'start', marginTop:'2vh' }}>What are shared roommates' gender?</p>
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
                     
                </div>
                :
                postingPage == 10 ?
                <div style={{flexDirection:mobile ? 'column-reverse' : 'row', display:'flex', width:'90vw', marginLeft:'auto', marginRight:'auto', paddingBottom:'5vh'}}>
                    <div style={{flexDirection:'column', display:'block', justifyContent:'center',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto', textAlign: 'left' , width: mobile ? '90vw' : '50vw'}}>
                        <p style={{fontSize: '1.5rem', fontFamily: OPENSANS, fontWeight:'600'}}>Sublease description</p>
                        <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'400',  width: mobile ? '100%' :  '90%'}}>Enter useful information about the sublease that would better inform subtenants.</p>
                        <div style={{marginTop:'5vh', width: mobile ? '100%' : '90%'}}>
                            <TextField inputProps={{ maxLength: 1000}} helperText={`${propertyDescription.length} / 1000 (150 characters minimum)`} value={propertyDescription} fullWidth onChange={(val) => setPropertyDescription(val.target.value)} label="Description..."  multiline rows={8}/>
                        </div>
                    </div>
                    <div style={{flexDirection:'column', display:'block', justifyContent:'center',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto', textAlign: mobile ? 'left' : 'left', width: mobile ? '90vw' : '40vw'}}>
                        <p style={{fontSize: '1.2rem', fontFamily: OPENSANS, fontWeight:'600'}}>Nice to include:</p>
                        <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'500'}}>- How far away is the nearest public transportation?</p>
                        <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'500'}}>- Are there supermarkets nearby?</p>
                        <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'500'}}>- Are there restaurants nearby?</p>
                        <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'500'}}>- What’s something subtenant should know about the place?</p>
                        <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'500'}}>- Are there any special facilities (e.g. gym, basketball court) included?</p>
                    </div>
                </div>
                :
                postingPage == 11 ?
                <div style={{flexDirection:'column', display:'block', justifyContent:'center',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto',  textAlign: mobile ? 'left' : 'center', width: mobile ? '90vw' : '45vw'}}>
                    <p style={{fontSize: '1.5rem', fontFamily: OPENSANS, fontWeight:'500'}}>What genders are you comfortable subleasing to? </p>
                    <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'400'}}>Choosing "Both" increases your success by 50%</p>
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
                postingPage == 12 ?
                <div style={{flexDirection:'column', display:'block', justifyContent:'center',paddingTop:'5vh', marginLeft:'auto', marginRight:'auto',  textAlign: mobile ? 'left' : 'center', width: mobile ? '90vw' : '40vw'}}>
                    <p style={{fontSize: '1.5rem', fontFamily: OPENSANS, fontWeight:'600'}}>Message to the subtenant</p>
                    <p style={{fontSize: '1rem', fontFamily: OPENSANS, fontWeight:'400'}}>Consider this a welcome message, let them know why you're subleasing and maybe why is this a perfect fit for them.</p>
                    <div style={{flexDirection:'row', justifyContent:'space-between', display:'flex', marginTop:'6vh', width:'100%'}}>
                        <TextField inputProps={{ maxLength: 500}}  helperText={`${propertyToSubtenantMessage.length} / 500 (100 characters minimum)`} value={propertyToSubtenantMessage} fullWidth onChange={(val) => setPropertyToSubtenantMessage(val.target.value)} label="Message to subtenant ..."  multiline rows={8}/>
                    </div>   
                </div>
                :    
                <div style={{flexDirection: mobile ? 'column' : 'row', display:'flex', flex:1, paddingTop:'3vh', marginLeft:'auto', marginRight:'auto', overflowY:'scroll', overflowX:"hidden"}}>
                  
                    <div style={{ width: mobile ? '90vw' :  '50vw'}}>
                        <p style={{fontSize: mobile ? '2rem' : '2.2rem', fontFamily: OPENSANS, fontWeight:'600'}}>Review</p>
                        <p style={{fontSize: mobile ? '1rem' : '1.1rem', fontFamily: OPENSANS, fontWeight:'400'}}>Take a second look and make sure everything looks good.</p>
                     
                        <div style={{paddingTop:'4vh', paddingBottom: '4vh',  borderBottomWidth:"1px", borderBottomColor: LIGHTGREY, borderBottomStyle:'solid',  maxWidth: mobile ? '90vw' : '40vw'}}>
                            <div style={{flexDirection:"row", display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                <p style={{marginBottom:0, fontSize: mobile ? '1.2rem' : '1.4rem', fontFamily: OPENSANS, fontWeight:'600'}}>Type</p>
                                <IconButton onClick={()=>handleReviewEditNav(1)} style={{outline:'none'}}>
                                    <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                                </IconButton>
                            </div>
                            <div style={{marginTop:'1vh', }}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>{propertyType}</p>
                            </div>
                        </div>

                        <div style={{maxWidth: mobile ? '90vw' : '40vw', paddingTop:'4vh', paddingBottom: '4vh',  borderBottomWidth:"1px", borderBottomColor: LIGHTGREY, borderBottomStyle:'solid',}}>
                            <div style={{flexDirection:"row", display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                <p style={{marginBottom:0, fontSize: mobile ? '1.2rem' : '1.4rem', fontFamily: OPENSANS, fontWeight:'600'}}>Location</p>
                                <IconButton style={{outline:'none'}} onClick={()=>handleReviewEditNav(2)}>
                                    <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                                </IconButton>
                            </div>
                            <div style={{marginTop:'1vh', }}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>{propertyLocation.description}</p>
                            </div>
                        </div>
                        <div style={{maxWidth: mobile ? '90vw' : '40vw', paddingTop:'4vh', paddingBottom: '4vh',  borderBottomWidth:"1px", borderBottomColor: LIGHTGREY, borderBottomStyle:'solid',}}>
                            <div style={{flexDirection:"row", display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                <p style={{marginBottom:0, fontSize:mobile ? '1.2rem' :  '1.4rem', fontFamily: OPENSANS, fontWeight:'600'}}>Rent</p>
                                <IconButton style={{outline:'none'}} onClick={()=>handleReviewEditNav(4)}>
                                    <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                                </IconButton>
                            </div>
                            <div style={{marginTop:'1vh', display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>Security deposit:</p>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>${propertyPrice}</p>
                                
                            </div>
                            <div style={{marginTop:'1vh', display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>Monthly rent: </p>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>${propertySecurityDeposit}</p>
                            </div>
                            <div style={{marginTop:'1vh', display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>Rent is due:</p>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>{propertyPaymentTime} of each month</p>
                            </div>
                            <div style={{marginTop:'1vh', display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>Rent payment method:</p>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}> {getProeprtyPaymentMethod()}</p>
                            </div>
                           
                        </div>
                        <div style={{marginTop:'4vh',maxWidth: mobile ? '90vw' : '40vw',  paddingBottom: '4vh',  borderBottomWidth:"1px", borderBottomColor: LIGHTGREY, borderBottomStyle:'solid',}}>
                            <div style={{flexDirection:"row", display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                <p style={{marginBottom:0, fontSize:mobile ? '1.2rem' :  '1.4rem', fontFamily: OPENSANS, fontWeight:'600'}}>Extra fees and charges</p>
                                <IconButton style={{outline:'none'}} onClick={()=>handleReviewEditNav(7)}>
                                    <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                                </IconButton>
                            </div>
                            
                            <div style={{marginTop:'1vh', display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>Utilities:</p>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>{utilitiesIncluded ? "Included" : `$${utilitiesFee} /month`}</p>
                            </div>
                            <div style={{marginTop:'1vh', display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>WiFi:</p>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>{wifiIncluded ? "Included" : `$${wifiFee} /month`}</p>
                            </div>
                            <div style={{marginTop:'1vh', display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>Washer and dryer:</p>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>{inUnitWasherDryer ? "In-unit" : `Availble ${washerDryerLocation}`}</p>
                            </div>
                           
                        </div>
                        <div style={{maxWidth: mobile ? '90vw' : '40vw', paddingTop:'4vh', paddingBottom: '4vh',  borderBottomWidth:"1px", borderBottomColor: LIGHTGREY, borderBottomStyle:'solid',}}>
                            <div style={{flexDirection:"row", display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                <p style={{marginBottom:0, fontSize: '1.4rem', fontFamily: OPENSANS, fontWeight:'600'}}>Availability</p>
                                <IconButton style={{outline:'none'}} onClick={()=>handleReviewEditNav(5)}>
                                    <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                                </IconButton>
                            </div>
                            <div style={{marginTop:'1vh', display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>Earliest move-in day:</p>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>{new Date(propertyStartDate).toLocaleDateString().split(",")[0]}</p>
                            </div>
                            <div style={{marginTop:'1vh', display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>Latest move-out day:</p>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>{new Date(propertyEndDate).toLocaleDateString().split(",")[0]}</p>
                            </div>
                            
                        </div>
                        <div style={{maxWidth: mobile ? '90vw' : '40vw', paddingTop:'4vh', paddingBottom: '4vh',  borderBottomWidth:"1px", borderBottomColor: LIGHTGREY, borderBottomStyle:'solid',}}>
                            <div style={{flexDirection:"row", display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                <p style={{marginBottom:0, fontSize: mobile ? '1.2rem' : '1.4rem', fontFamily: OPENSANS, fontWeight:'600'}}>Subtenant has access to</p>
                                <IconButton style={{outline:'none'}} onClick={()=>handleReviewEditNav(6)}>
                                    <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                                </IconButton>
                            </div>
                            <div style={{marginTop:'1vh', }}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>{proeprtyNumberOfBeds} bed and {proeprtyNumberOfBaths} bathrooms</p>
                            </div>
                            <div style={{marginTop:'1vh', }}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>Subtenant {privateBathroom == true ? "has their own bathroom" : "has to share a bathroom"}</p>
                            </div>
                        </div>
                        <div style={{ maxWidth: mobile ? '90vw' : '40vw', paddingTop:'4vh', paddingBottom: '4vh',  borderBottomWidth:"1px", borderBottomColor: LIGHTGREY, borderBottomStyle:'solid',}}>
                            <div style={{flexDirection:"row", display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                <p style={{marginBottom:0, fontSize: mobile ? '1.2rem' : '1.4rem', fontFamily: OPENSANS, fontWeight:'600'}}>Roommates</p>
                                <IconButton style={{outline:'none'}} onClick={()=>handleReviewEditNav(9)}>
                                    <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                                </IconButton>
                            </div>
                            <div style={{marginTop:'1vh', }}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>{!propertyRoomates ? "Subtenants has the entire property to themselves" : `There will be ${propertyNumberOfRoommates} roommates`}</p>
                            </div>
                            <div style={{marginTop:'1vh',flexDirection:'row', display:'flex' }}>
                                <Groups2Icon style={{fontSize:'2vw', color: MEDIUMGREY}} />
                                {propertyRoomates ?
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0, marginLeft: '2vw'}}>{propertyRoomatesGender} roommates</p>
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
                        <div style={{maxWidth: mobile ? '90vw' : '40vw', paddingTop:'4vh', paddingBottom: '4vh',  borderBottomWidth:"1px", borderBottomColor: LIGHTGREY, borderBottomStyle:'solid',}}>
                            <div style={{flexDirection:"row", display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                <p style={{marginBottom:0, fontSize:mobile ? '1.2rem' :  '1.4rem', fontFamily: OPENSANS, fontWeight:'600'}}>Description</p>
                                <IconButton style={{outline:'none'}} onClick={()=>handleReviewEditNav(10)}>
                                    <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                                </IconButton>
                            </div>
                            <div style={{marginTop:'1vh', }}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>{propertyDescription}</p>
                            </div>
                        </div>
                        <div style={{maxWidth: mobile ? '90vw' : '40vw', paddingTop:'4vh', paddingBottom: '4vh',  borderBottomWidth:"1px", borderBottomColor: LIGHTGREY, borderBottomStyle:'solid',}}>
                            <div style={{flexDirection:"row", display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                <p style={{marginBottom:0, fontSize:mobile ? '1.2rem' :  '1.4rem', fontFamily: OPENSANS, fontWeight:'600'}}>Message to subtenant</p>
                                <IconButton style={{outline:'none'}} onClick={()=>handleReviewEditNav(12)}>
                                    <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                                </IconButton>
                            </div>
                            <div style={{marginTop:'1vh', }}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>{propertyToSubtenantMessage}</p>
                            </div>
                        </div>
                        <div style={{maxWidth: mobile ? '90vw' : '40vw', paddingTop:'4vh', paddingBottom: '4vh', }}>
                            <div style={{flexDirection:"row", display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                <p style={{marginBottom:0, fontSize: '1.4rem', fontFamily: OPENSANS, fontWeight:'600'}}>Preferred subtenant gender</p>
                                <IconButton style={{outline:'none'}} onClick={()=>handleReviewEditNav(11)}>
                                    <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                                </IconButton>
                            </div>
                            <div style={{marginTop:'1vh', }}>
                                <p style={{fontWeight:'400', fontSize:'1rem', marginBottom:0}}>{propertyPreferenceGender}</p>
                            </div>
                           
                        </div>
                        <div style={{width:'100%', height:'5vh'}}/>
                    </div>
                    <div style={{paddingTop:mobile ? 0 : '4vh', width: mobile ? '90vw' : '40vw', height:'auto', display:'flex', flexDirection:'column',   textAlign:'left'}}>
                        <p style={{marginBottom:0, fontSize: '1.4rem', fontFamily: OPENSANS, fontWeight:'600',}}>Image gallery</p>
                        <div style={{width: mobile ? '90vw' :  '30vw', height: mobile ? '90vw' :  '100vw', borderRadius: MEDIUMROUNDED, backgroundColor: EXTRALIGHT, borderWidth:'1px', borderStyle:'solid', borderColor: LIGHTGREY, position:'relative', marginTop:'2vh', flexDirection:'column' }}>
                            <img src={reviewSelectedImage} style={{width: mobile ? '90vw' :  '30vw', height: mobile ? '90vw' :  '30vw',  borderRadius: MEDIUMROUNDED, }} />
                            <IconButton style={{outline:'none', position:'absolute', top: '2vh', right:'2vw', backgroundColor:'white'}} onClick={()=>handleReviewEditNav(3)}>
                                <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                            </IconButton>
                        </div>
                        <div style={{flexDirection:'row', width:mobile ? '90vw' : '30vw', height: mobile ? 'auto' : '30vw', justifyContent:'space-between', display:'flex', marginTop:'4vh'}}>
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

                        <div style={{marginTop:'6vh', width: mobile ? '90vw' : '30vw', paddingBottom: mobile ? '5vh' : 0}}>
                            <div style={{flexDirection:"row", display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                <p style={{marginBottom:0, fontSize: mobile ? '1.2rem' :  '1.4rem', fontFamily: OPENSANS, fontWeight:'600'}}>Amenities</p>
                                <IconButton style={{outline:'none'}} onClick={()=>handleReviewEditNav(8)}>
                                    <EditNoteIcon style={{fontSize: mobile ? '6vw' : '2vw', color: MEDIUMGREY}} />
                                </IconButton>
                            </div>
                            <div style={{marginTop:'2vh'}}>
                                {propertyAmenities.map((item, index)=>{
                                    return(
                                        <div style={{flexDirection:'row', display:'flex', marginTop: index == 0 ? 0 : mobile ? '3vh' : '2vh', alignItems:'center'}}>
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
        
        <div style={{flexDirection:"row" , display: 'flex', justifyContent: postingPage == 0 || postingPage == 1 || review ? 'flex-end' : 'space-between', paddingLeft:"5vw", paddingRight:'5vw', borderTopWidth:'1px', borderTopColor:LIGHTGREY, borderTopStyle: 'solid', alignItems:'center', flex: 1, alignContent:'center', backgroundColor:'white', height:'10vh', outline: 'none', position:'absolute',bottom:0, zIndex: 999, width:'100%'}}>
                {!review && postingPage != 0 && postingPage != 1 &&
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
                    review && postingPage == 13?
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
                    <CloseIcon style={{color: MEDIUMGREY, fontSize: mobile ?'4vw' : '1.5vw', color:'black'}} />
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