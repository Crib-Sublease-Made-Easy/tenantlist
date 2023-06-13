import { useContext, useEffect, useRef, useState } from "react";
import { Modal, TextField, Select, MenuItem, InputLabel, FormControl, IconButton, TypeSelect, Checkbox} from "@mui/material";
import Button from '@mui/material/Button';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import DoneIcon from '@mui/icons-material/Done';
import BedIcon from '@mui/icons-material/Bed';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import WifiIcon from '@mui/icons-material/Wifi';


import { EXTRALIGHT, LIGHTGREY, MEDIUMGREY, MEDIUMROUNDED, OPENSANS, PRIMARYCOLOR } from "../sharedUtils";
import { Link } from "react-router-dom";
import { Wifi } from "@mui/icons-material";
import { UserContext } from "../UserContext";


export default function TennatCard(props) {
    const {mobile} = useContext(UserContext)

    useEffect(()=> {
        getSubleaseArea()
    }, [])

    // const tenant = props.data.userInfo
    const tenantData = props.data.userInfo
    const propData = props.data.propertyInfo

    const imgListRef = useRef(null)

    const [subleaseArea, setSubleaseArea] = useState('')
   
    // const [prop, setProp] = useState(null)
    const [showPhoneNum, setShowPhoneNum] = useState(false)

    //Phone Number Modal
    const [open, setOpen] = useState(false);
    const [requestAvailabilityModalVis, setRequestAvailabilityModalVis] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //The person who is looking at the website
    const [subtenantGender, setSubtenantGender] = useState(null)
    const [subtenantName, setSubtenantName] = useState("")
    const [subtenantDescription, setSubtenantDescription] = useState("")
    const [subtenantAge, setSubtenantAge] = useState(null)
    const [subtenantLocation, setSubtenantLocation] = useState("")
    const [subtenantPhoneNumber, setSubtenantPhoneNumber] = useState("")
    const [subtenantStartDate, setSubtenantStartDate] = useState(null)
    const [subtenantEndDate, setSubtenantEndDate] = useState(null)
    const [subtenantBudget, setSubtenantBudget] = useState(0)
    const [subtenantLocationM, setSubtenantLocatioM] = useState(true)
    const [subtenantLocationB, setSubtenantLocatioB] = useState(true)
    const [subtenantLocationQ, setSubtenantLocatioQ] = useState(true)
    const [subtenantLocationJ, setSubtenantLocatioJ] = useState(true)
    
    
    const [requestPage, setRequestPage] = useState(0);


    //Crib Connect User Modal
    const [cribConnectUserModal, setCribConnectUserModal] = useState(false)

    //Crib Gallery Modal
    const [galleryModalVis, setGalleryModalVis] = useState(false)
    
    function loadSubtenantInfo(){
        let sn = localStorage.getItem("subtenantName")
        let sp = localStorage.getItem("subtenantPhoneNumber")
        let sg = localStorage.getItem("subtenantGender")
        let ss = localStorage.getItem("subtenantStartDate")
        let se = localStorage.getItem("subtenantEndDate")
        let sb = localStorage.getItem("subtenantBudget")

        console.log(sn)
        if(sn != null){
          
            setSubtenantName(sn)
        }
        if(sp != null){
            setSubtenantPhoneNumber(sp)
        }
        if(sg != null){
            setSubtenantGender(sg)
        }
        if(ss != null){
            setSubtenantStartDate(ss)
        }
        if(se != null){
            setSubtenantEndDate(se)
        }
        if(sb != null){
            setSubtenantBudget(sb)
        }
    }

    // async function fetchPropData() {
    
    //     await fetch(`https://crib-llc.herokuapp.com/properties/${props.data._id}`, {method: "POST"})
    //     .then( async (res) => {
    //         return res.json()
    //     })
    //     .then ( data => { 
    //         setTenant(data.userInfo)
    //     })
    //     .catch( e => {
    //         console.log(props.data._id)
    //         console.log("Error")
    //     })
    // }

    function handleAvailModalVisOpen(){
        setRequestAvailabilityModalVis(true)
    }
    function handleAvailModalVisClose(){
        setRequestAvailabilityModalVis(false)
    }

    function getSubleaseArea(){
        let addr = propData.loc.secondaryTxt.toLowerCase().replaceAll(" ","")

        if(addr.indexOf("nj") != -1 || addr.indexOf("newjersey") != -1 || addr.indexOf("jerseycity") != -1){
            setSubleaseArea("New Jersey")
        }
        else if(addr.indexOf("queens") != -1){
            setSubleaseArea("Queens")
        }
        else if(addr.indexOf("brooklyn") != -1){
            setSubleaseArea("Brooklyn")
        }
        else{
            setSubleaseArea("Manhattan")
        }
    }

    function getAge(ms){
        return Math.floor(ms / (1000*60*60*24*365));
    }

    async function handlePhoneNumberPress(){
        if(tenantData.cribConnectUser == false){
            loadSubtenantInfo()
            handleAvailModalVisOpen()
            return
        }
        let pn = localStorage.getItem("subtenantPhoneNumber")
        let name = localStorage.getItem("subtenantName")

        if(pn == null){
            setOpen(true)
        }
        else if(name == null){
            setOpen(true)
        }
        else{

            addToContactList(name, pn)
            setCribConnectUserModal(true)
        }

        

    //     //Handle Press
    }

    async function addToContactList(name, phoneNumber) {
     
        await fetch('https://crib-llc.herokuapp.com/users/addContactedBy', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
            body: JSON.stringify({
                "name": name,
                "phoneNumber": phoneNumber,
                "postedById": tenantData._id
            })
        }).catch(e => {
            alert(e)
        })
    }

    function handlePhoneNumberSubmit(){       
        if(subtenantName.trim() == ""){
            alert("Name cannot be empty")
            return;
        }
        if(subtenantPhoneNumber.trim() == ""){
            alert("Phone Number cannot be empty")
            return;
        }

        

        localStorage.setItem("subtenantPhoneNumber", subtenantPhoneNumber)
        localStorage.setItem("subtenantName", subtenantName)
        
        addToContactList(subtenantName, subtenantPhoneNumber)
        //call api to document contacted by 
        setOpen(false)
        setCribConnectUserModal(true)
    }
    
    async function handleRequestAvailFormSubmit(){
        // Check name, phone number, gender and sublease dates
        // Input Validation
        let spacelessName = subtenantName.replaceAll(" ","")
        if(subtenantName.trim() == "" || !/^[A-Za-z]*$/.test(spacelessName)){
            alert("Invalid name.")
            return
        }
        if(subtenantGender == null){
            alert("Invalid gender.")
            return
        }
        let startDate = new Date(dayjs(subtenantStartDate)).getTime()
        let endDate = new Date(dayjs(subtenantEndDate)).getTime()
        if(subtenantStartDate == null || subtenantEndDate == null){
            alert("Invalid date.")
            return
        }
        if(endDate < startDate){
            alert("Sublease end date has to be later than start date.")
            return
        }
        if(startDate < new Date().getTime()){
            alert("Sublease start has to be later than today.")
            return
        }
        if(subtenantBudget == 0){
            alert("Please enter a valid budget.")
            return
        }
        
        //Add to contacts
        addToContactList(subtenantName, subtenantPhoneNumber)

        //Send message to the tenant
        sendMessageToTenant()

        //Close request modal
       
    }


    async function sendMessageToTenant(){
        localStorage.setItem("subtenantName", subtenantName)
        localStorage.setItem("subtenantPhoneNumber", subtenantPhoneNumber)
        localStorage.setItem("subtenantGender", subtenantGender)
        localStorage.setItem("subtenantStartDate", subtenantStartDate)
        localStorage.setItem("subtenantEndDate", subtenantEndDate)
        localStorage.setItem("subtenantBudget", subtenantBudget)
        // console.log(subtenantPhoneNumber)
        // console.log( subtenantGender)
        // console.log( new Date(dayjs(subtenantStartDate)).getTime())
        // console.log(subtenantBudget)
        // console.log( new Date(dayjs(subtenantEndDate)).getTime())
        // console.log(tenantData._id)
        await fetch('https://crib-llc.herokuapp.com/web/sendSubtenantInterest', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
            body: JSON.stringify({
                "subtenantName": subtenantName,
                "subtenantPhoneNumber": subtenantPhoneNumber,
                "subtenantGender": subtenantGender,
                "subtenantSubleaseStart": dayjs(subtenantStartDate),
                "subtenantSubleaseEnd": dayjs(subtenantEndDate),
                "subtenantBudget": subtenantBudget,
                "tenantID": tenantData._id
            })
        })
        .then(res => {
            if(res.status == 200){
                alert("Message successfully sent!")
            }
        })
        .catch(e => {
            alert(e)
        })

        setRequestAvailabilityModalVis(false)
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

    function generateAges(){
        let ageArr = []
        
        for(let i = 18 ; i < 50 ; i++){
            ageArr.push(i)
        }
        
        return(
            ageArr.map((item)=>{
                return(
                    <MenuItem key={"subtenantAge" + item} onClick={()=> setSubtenantAge(item)} value={item}>{item}</MenuItem>
                )
            })
        )
    }

    function handleRequestForm(){
        if(requestPage == 0){
            if(subtenantName.trim() == ""){
                alert("Please enter your name.")
                return;
            }
            if(subtenantPhoneNumber.trim() == ""){
                alert("Please enter your phone number.")
                return;
            }
            if(subtenantAge == null || subtenantAge == undefined){
                alert("Please enter your Age.")
                return;
            }
            if(subtenantDescription.trim() == ""){
                alert("Please enter a short bio.")
                return
            }
            setRequestPage(1)
        }
        else{
            //actual submit
            var input = document.getElementById('searchTextField').value
            console.log(input)
            if(input.trim() == ""){
                alert("Please select a location")
                return
            }
            if(subtenantBudget == 0){
                alert("Please enter a valid budget")
                return 
            }
            if(subtenantStartDate == null || subtenantEndDate == null){
                alert("Please enter a sublease dates")
                return
            }
            if( new Date(subtenantEndDate).getTime() < new Date(subtenantStartDate).getTime()){
                alert("End date cannot be earlier than start date")
                return
            }
            if( new Date(subtenantStartDate).getTime() < new Date().getTime()){
                alert("Please enter a valid start date")
                return
            }
            if(!(subtenantLocationM || subtenantLocationB || subtenantLocationJ || subtenantLocationQ)){
                alert("Please select as least one area that works for you.")
                return
            }
            console.log(subtenantLocationM)
            console.log(subtenantLocationB)
            console.log(subtenantLocationJ)
            console.log(subtenantLocationQ)
            addToContactList(subtenantName, subtenantPhoneNumber)
            handleRequestFormSubmit()
        }
    }

    async function handleRequestFormSubmit(){
        await fetch('https://maps.googleapis.com/maps/api/geocode/json?address='+subtenantLocation+'&key=AIzaSyBbZGuUw4bqWirb1UWSzu9R6_r13rPj-eI', {
        method: 'GET'
        }).then(res => res.json()).then(async jsonresp => {
            let coor = [jsonresp.results[0].geometry.location.lng, jsonresp.results[0].geometry.location.lat]
            return coor
        })
        .then(async (coor) => {
            let dl = []
            if(subtenantLocationB){
                dl.push("Brooklyn")
            }
            if(subtenantLocationM){
                dl.push("Manhattan")
            }
            if(subtenantLocationJ){
                dl.push("Jersey")
            }
            if(subtenantLocationQ){
                dl.push("Queens")
            }
            console.log(coor)
            await fetch('https://crib-llc.herokuapp.com/subtenants/create', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "name": subtenantName,
                "subleaseStart": new Date(subtenantStartDate),
                "subleaseEnd": new Date(subtenantEndDate),
                "budget":  subtenantBudget,
                "bio": subtenantDescription,
                "phoneNumber": subtenantPhoneNumber,
                "age": subtenantAge,
                "gender": subtenantGender,
                "sharedRoomFlexibility": true,
                "roommatesFlexibility": true,
                "location": subtenantLocation,
                "coords": coor,
                "deleted": "false",
                "type": "room",
                "desiredArea": dl   
            })

            }).then(res => {
            
            // Modal for form submitted
            setRequestAvailabilityModalVis(false)
            setCribConnectUserModal(true)
            })
        })
    }



    function loadPlaces(){
        const google = window.google;
        var input = document.getElementById('searchTextField');
        setSubtenantLocation(input.value)
        new google.maps.places.Autocomplete(input);

        setSubtenantLocation(input.value)
        console.log(input.value)
    }

    function handleRequestFormGoBack(){
        var input = document.getElementById('searchTextField').value;
        setSubtenantLocation(input) 
        setRequestPage(0)
    }

    
    return(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        
        <Link target={'_blank'} to={`/listingDetails/${propData._id}`} style={{ color:'black', borderColor: LIGHTGREY, borderWidth: mobile ? 0 :  '1px', borderStyle:'solid',  borderRadius: 10, height: mobile ? 'auto' : '30vh', width: mobile ? '90vw' : '48vw', marginTop: props.index == 0 ? 0 : mobile ? '7vh' : '3vh', flexDirection:  mobile ? 'column' : 'row', display:'flex', textDecorationLine:'none', alignSelf:'center', paddingLeft: mobile ? 'auto' : 0 , paddingRight: mobile ? 'auto' : 0 }}>
        
            <>
            <div  style={{position:'relative',  display:'block', width: mobile ? '90vw' : 'auto', overflow:'hidden'}}>
                 
                 
                <img key={propData.imgList[0]} src={propData.imgList[0]} style={{width: mobile ? '90vw' : '40vh', height: mobile ? '90vw' : '30vh', borderTopLeftRadius:10, borderBottomLeftRadius: 10, borderTopRightRadius: mobile ? MEDIUMROUNDED : 0, borderBottomRightRadius: mobile ? MEDIUMROUNDED : 0, objectFit:'cover' }}/>
                
            
               
                {/* <IconButton onClick={()=>scrollImgList("-")} style={{position:'absolute', top:'50%' , left: 20, transform: 'translate(0, -50%)', backgroundColor: 'rgba(0,0,0,0.3)'}}>
                    <KeyboardArrowLeftIcon style={{color:'white'}}/>
                </IconButton>
                <IconButton onClick={()=>scrollImgList("+")} style={{position:'absolute', top:'50%' , right: 20, transform: 'translate(0, -50%)', backgroundColor: 'rgba(0,0,0,0.3)'}}>
                    <KeyboardArrowRightIcon style={{color:'white'}}/>
                </IconButton> */}
                {/* <Button disabled size="small" variant="contained" style={{position:'absolute', bottom: 10, right: 10, backgroundColor:PRIMARYCOLOR, color: 'white', textTransform:'none', fontWeight:'500'}}>
                {propData.type}
                </Button> */}
                {/* <Button onClick={()=>props.mapScrollToPin()} size="small" variant="contained" style={{position:'absolute', bottom: 10, left: 10, backgroundColor:'white', color: PRIMARYCOLOR, display: mobile ? 'none' : 'block'}}>
                    Show in map
                </Button> */}
            </div>
            <div onTouchin style={{ display:'flex', flexDirection:'column', position:'relative', justifyContent:'space-between',  flex: 1, width: mobile ? '90vw' : '48vw', padding: mobile ? 0 : '1.5vw', paddingTop: mobile ? '3vh' : '1.5vw' }}>
                <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between', flex:1}}>
                    <div >
                        {/* <p style={{fontSize: '0.9rem', fontWeight:'600', marginBottom:0}}>{propData.type} for rent</p> */}

                        <p style={{fontSize: '0.9rem', fontWeight:'700', marginBottom:0,fontFamily: OPENSANS,marginBottom: 5}}>{propData.loc.streetAddr}, {subleaseArea}</p>
                       
                        <p style={{fontSize: '0.9rem', fontWeight:'600', color:'#333333', marginBottom:5, fontFamily: OPENSANS}}>{new Date(propData.availableFrom).getTime() < new Date().getTime() ? "Now" : new Date(propData.availableFrom).toLocaleString().split(",")[0]} - {new Date(propData.availableTo).toLocaleString().split(",")[0]}</p>
                            <div style={{marginTop: mobile ? '2vh' : 0}}>
                            {propData.amenities.includes("Mattress") &&
                            <div style={{flexDirection:'row', display:'flex', alignItems:'center', paddingTop:'0.5vh', paddingBottom:'0.5vh'}}>
                                <BedIcon style={{color:MEDIUMGREY, fontSize: mobile ? '5vw' : '1vw'}}/>
                                <p style={{fontSize: '0.8rem', fontWeight:'600', color:'#333333', marginBottom:0, marginLeft:mobile ? '2vw' :'0.5vw', fontFamily: OPENSANS}}>Furnished</p>
                            </div>
                            }
                            {propData.amenities.includes("Utilities_Included") &&
                            <div style={{flexDirection:'row', display:'flex', alignItems:'center', paddingTop:'0.5vh', paddingBottom:'0.5vh'}}>
                                <ElectricBoltIcon style={{color:MEDIUMGREY, fontSize: mobile ? '5vw' : '1vw'}}/>
                                <p style={{fontSize: '0.8rem', fontWeight:'600', color:'#333333', marginBottom:0, marginLeft:mobile ? '2vw' :'0.5vw', fontFamily: OPENSANS}}>Utilities included</p>
                            </div>
                            }
                            {propData.amenities.includes("Wifi") &&
                            <div style={{flexDirection:'row', display:'flex', alignItems:'center', paddingTop:'0.5vh', paddingBottom:'0.5vh'}}>
                                <WifiIcon style={{color:MEDIUMGREY, fontSize: mobile ? '5vw' : '1vw'}}/>
                                <p style={{fontSize: '0.8rem', fontWeight:'600', color:'#333333', marginBottom:0, marginLeft: mobile ? '2vw' :'0.5vw', fontFamily: OPENSANS}}>Wifi included</p>
                            </div>
                            }
                            </div>
                    </div>
                   
                    
                    <div style={{flexDirection: 'row', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: mobile ? '2vh' : 0 }}>
                        <p style={{fontWeight:'500', color:'#333333', fontFamily: OPENSANS, fontSize:"0.9rem", marginBottom:0}}><span style={{fontWeight:'700'}}>{propData.type}</span> posted by {tenantData.firstName}</p>
                        <p style={{fontFamily:OPENSANS, fontWeight:'600', fontSize:'0.9rem', marginBottom:0}}>${propData.price}/month</p>
                    </div>
                    {/* <p style={{fontSize: '1rem', fontWeight:'600'}}>{propData.loc.streetAddr}</p> */}
                </div>
                {/* <div style={{opacity: showPhoneNum ? 1 : 0 }}>
                    <p>Send {tenantData.firstName.split(" ")[0]} a message: <a href={`tel:+1${tenantData.phoneNumber}`}>+1{tenantData.phoneNumber}</a></p>
                </div> */}
                {/* <div style={{ flexDirection:'row', display:'flex', justifyContent:'space-between', width:'100%' }}>
                        <h5 style={{fontWeight: '600'}}>${propData.price} <span style={{fontWeight:'500', fontSize:15, color: '#333333'}}> /month</span></h5>
                    
                        <Button onClick={handlePhoneNumberPress} style={{backgroundColor:'#2D6674', }} variant="contained">
                        {tenantData.cribConnectUser ?
                        "Message"
                        :
                        "Request"
                            }
                        </Button>
                    
                </div> */}
            </div>
                

                {/* When subtenant click on Crib Connect users */}
                <Modal 
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    display: 'flex',
                    zIndex: 1000
                }}
                >
                    <div style={{width: '95vw', height: 'auto', backgroundColor:'white', alignSelf:'center', maxWidth: 400, borderRadius:20, padding: 20, position: 'absolute', zIndex: 2001,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',}}>
                        {requestPage == 0 ?
                        <>
                        <h4 style={{fontWeight:'700'}}>We will let the tenant know!</h4>
                        <p>Enter the following info to send a sublease request</p>
                        <div style={{marginTop: 20}}>
                            <TextField value={subtenantName} onChange={(val)=>setSubtenantName(val.target.value)} fullWidth label="Name" variant="outlined"/>
                            <TextField value={subtenantPhoneNumber} onChange={(val)=>setSubtenantPhoneNumber(val.target.value)} type="number" fullWidth label="Phone number" variant="outlined" style={{marginTop: 15}}/>
                            <small>* Enter a US phone number if possible<br/>* Only enter digits, no dashes(-) or spaces( )</small>
                            <div style={{marginTop: 15}}>
                                <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={subtenantGender}
                                    label="Gender"
                                    onChange={(val)=> setSubtenantGender(val.target.value)}
                                >
                                    <MenuItem value={"Male"}>Male</MenuItem>
                                    <MenuItem value={"Female"}>Female</MenuItem>
                                    <MenuItem value={"Others"}>Others</MenuItem>
                                </Select>
                                </FormControl>
                            </div>
                            {/* Need to select age */}
                            <div style={{marginTop: 15}}>
                                <FormControl fullWidth>
                                <InputLabel id="demo-age-select-label">Age</InputLabel>
                                <Select
                                    labelId="demo-age-select-label"
                                    id="demo-simple-select"
                                    value={subtenantAge}
                                    label="Age"
                                    
                                >
                                    {generateAges()}
                                </Select>
                                </FormControl>
                            </div>
                            <div style={{marginTop: 15}}>
                                <p>Bio (Tell the tenant a bit about yourself)</p>
                                <TextField onChange={(val)=>setSubtenantDescription(val.target.value)} value={subtenantDescription} fullWidth label="Bio" variant="outlined"/>
                            </div>
                        </div>
                        </>
                        :
                        <>
                            <h4 style={{fontWeight:'700'}}>One last step!</h4>
                            <div style={{marginTop: 15, position:'relative'}}>
                                <p>Where do you want to stay at?</p>
                                <input value={subtenantLocation} onChange={loadPlaces} class="form-control"  id="searchTextField" type="text" style={{position:'relative', zIndex: 1}} />
                            </div>
                            <div style={{marginTop: 15, position:'relative'}}>
                                <p>Budget</p>
                                <TextField onChange={(val)=>setSubtenantBudget(val.target.value)} value={subtenantBudget} fullWidth label="Budget per month ($)" type="number" variant="outlined"/>
                            </div>
                            <div style={{marginTop: 15}}>
                                <p>Sublease dates</p>
                                <div style={{flexDirection:'row', display:'flex', marginTop:15, justifyContent:'space-between'}}>
                                <div style={{width: '45%'}}>
                                    <DatePicker 
                                    label="Request start"
                                    value={ dayjs(subtenantStartDate)}
                                    onChange={(event)=> setSubtenantStartDate(event)}
                                    />
                                </div>
                                <div style={{width: '45%'}}>
                                    <DatePicker 
                                    label="Request end" 
                                    onChange={(event)=> setSubtenantEndDate(event)}
                                    value={dayjs(subtenantEndDate)}/>
                                </div>
                            </div>
                            <div style={{marginTop: 15}}>
                                <p>Which area works for you? (Select all that applies)</p>
                                <div style={{display:"flex", flexDirection:'row', justifyContent:'space-between'}}>
                                    <p>Manhattan</p>
                                    <Checkbox checked={subtenantLocationM} onClick={()=> setSubtenantLocatioM(!subtenantLocationM)} style={{color: PRIMARYCOLOR }}/>
                                </div>
                                <div style={{display:"flex", flexDirection:'row', justifyContent:'space-between'}}>
                                    <p>Queens</p>
                                    <Checkbox checked={subtenantLocationQ} onClick={()=> setSubtenantLocatioQ(!subtenantLocationQ)} style={{color: PRIMARYCOLOR }}/>
                                </div>
                                <div style={{display:"flex", flexDirection:'row', justifyContent:'space-between'}}>
                                    <p>Jersey City</p>
                                    <Checkbox checked={subtenantLocationJ} onClick={()=> setSubtenantLocatioJ(!subtenantLocationJ)} style={{color: PRIMARYCOLOR }}/>
                                </div>
                                <div style={{display:"flex", flexDirection:'row', justifyContent:'space-between'}}>
                                    <p>Brooklyn</p>
                                    <Checkbox checked={subtenantLocationB} onClick={()=> setSubtenantLocatioB(!subtenantLocationB)} style={{color: PRIMARYCOLOR }}/>
                                </div>
                            </div>
                            
                        </div>
                            
                        </>
                        }
                        <div style={{display:'flex', flexDirection:'row', justifyContent: !requestPage ? 'flex-end' : 'space-between'}}>
                            <Button onClick={handleRequestFormGoBack} style={{backgroundColor: '#ABABAB', marginTop:20, display: requestPage == 1 ? 'block' : 'none', color:'white' }} variant="contained">Back</Button>
                            <Button onClick={handleRequestForm} style={{backgroundColor: '#2D6674', marginTop:20, alignSelf:'flex-end' }} variant="contained">{requestPage == 1 ? "Submit" : "Next"}</Button>
                        </div>
                    </div>
                </Modal>
                <Modal 
                open={requestAvailabilityModalVis}
                onClose={handleAvailModalVisClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    display: 'flex',
                }}
                >
                    <div style={{width: '90vw', height: '90vh', backgroundColor:'white', alignSelf:'center', maxWidth: 400, borderRadius:20, padding: 20, position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',}}>
                        <h4 style={{fontWeight:'700'}}>🔊 We will let tenant know</h4>
                        <p>Please answer the questions below so tenant can contact you if there is a fit.</p>
                        <div style={{marginTop: 20}}>
                            <TextField value={subtenantName} onChange={(val)=>setSubtenantName(val.target.value)} fullWidth label="Name" variant="outlined"/>
                            <TextField value={subtenantPhoneNumber} onChange={(val)=>setSubtenantPhoneNumber(val.target.value)} type="number" fullWidth label="Phone number" variant="outlined" style={{marginTop: 15}}/>
                            <small>* Enter a US phone number if possible<br/>* Only enter digits, no dashes(-) or spaces( )</small>
                        </div>

                        <div  style={{marginTop: 20}}>
                            <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={subtenantGender}
                                label="Gender"
                                onChange={(val)=> setSubtenantGender(val.target.value)}
                            >
                                <MenuItem value={"Male"}>Male</MenuItem>
                                <MenuItem value={"Female"}>Female</MenuItem>
                                <MenuItem value={"Others"}>Others</MenuItem>
                            </Select>
                            </FormControl>
                        </div>
                        {/* <div  style={{marginTop: 20}}>
                            <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Age</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={subtenantAge}
                                label="Gender"
                                onChange={(val)=> setSubtenantGender(val.target.value)}
                            >
                                {returnAgeItems()}
                            </Select>
                            </FormControl>
                        </div> */}
                        <div style={{flexDirection:'row', display:'flex', marginTop:20, justifyContent:'space-between'}}>
                            <div style={{width: '45%'}}>
                                <DatePicker 
                                label="Request start"
                                value={ dayjs(subtenantStartDate)}
                                onChange={(event)=> setSubtenantStartDate(event)}
                                />
                            </div>
                            <div style={{width: '45%'}}>
                                <DatePicker 
                                label="Request end" 
                                onChange={(event)=> setSubtenantEndDate(event)}
                                value={dayjs(subtenantEndDate)}/>
                            </div>
                        </div>
                        <div style={{marginTop: 20}}>
                            <TextField 
                            value={subtenantBudget}
                            onChange={(val)=>setSubtenantBudget(val.target.value)} type='number' fullWidth label="Budget per month (USD)" variant="outlined"/>
                        </div>
                        <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                            <Button onClick={handleRequestAvailFormSubmit} style={{position:'absolute', bottom: 20, backgroundColor: '#2D6674', }} variant="contained">Submit</Button>
                            <small>* Please enter your monthly budget (only digits)<br/>* Bare in mind if budget is too low, tenants might not respond.</small>
                        </div>


                    </div>
                </Modal> 
                <Modal 
                open={cribConnectUserModal}
                onClose={() => setCribConnectUserModal(false)}
                aria-labelledby="CC-User-Info"
                aria-describedby="modal-modal-description"
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    display: 'flex',
                }}
                >
                    <div style={{width: mobile ? '90vw' : '25vw',  backgroundColor:'white', alignSelf:'center', borderRadius:20, padding: 20, position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',}}>
                        <h4 style={{fontWeight:'700'}}>Ask {tenantData.firstName.split(" ")[0]} more about the sublease!</h4>
                        <p style={{marginTop:40, fontWeight:'500'}}>Phone Number: <a href={`tel:+1${tenantData.phoneNumber}`}>+1{tenantData.phoneNumber}</a></p>
                        <p style={{fontWeight:'500'}}>Email: <a href={`mailto:${tenantData.email}}`}>{tenantData.email}</a></p>
                        {/* <div style={{marginTop: 20}}>
                            <TextField onChange={(val)=>setSubtenantName(val.target.value)} fullWidth label="Name" variant="outlined"/>
                            <TextField onChange={(val)=>setSubtenantPhoneNumber(val.target.value)} type="number" fullWidth label="Phone number" variant="outlined" style={{marginTop: 15}}/>
                            <small>* Enter a US phone number if possible<br/>* Only enter digits, no dashes(-) or spaces( )</small>
                        </div> */}
                        <div style={{display:'flex', flexDirection: mobile ? 'column' : 'row', justifyContent:'space-between', alignItems:'center', marginTop:40}}>
                            <Button style={{backgroundColor: PRIMARYCOLOR, color:'white' }} variant="contained"><a style={{color:'white', textDecorationLine:'none'}} href="https://subtenant-form.herokuapp.com">Get notified for new subleases?</a></Button>
                        </div>


                    </div>
                </Modal>
                <Modal 
                open={galleryModalVis}
                onClose={() => setGalleryModalVis(false)}
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
                                propData.imgList.map((item, index)=> {
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
                
            </>

        </Link>
    </LocalizationProvider>
    )
}
