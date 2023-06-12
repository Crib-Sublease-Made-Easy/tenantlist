import { borderRadius } from "@mui/system"
import { createRef, useContext, useEffect, useState, useRef, useCallback } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { EXTRALIGHT, LIGHTGREY, MEDIUMGREY, MEDIUMROUNDED, OPENSANS, PRIMARYCOLOR, GetIcon } from "../sharedUtils"
import WhiteLoadingAnimation from '../whiteLoading.json'
import Lottie from "lottie-react";
import SubleaseRequestSent from './subleaseRequestSent.json'
import LoadingAnimation from '../whiteLoading.json' 


//Modal
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';


//Icons
import BoltIcon from '@mui/icons-material/Bolt';
import WifiIcon from '@mui/icons-material/Wifi';
import HomeIcon from '@mui/icons-material/Home';
import KingBedIcon from '@mui/icons-material/KingBed';
import PermPhoneMsgIcon from '@mui/icons-material/PermPhoneMsg';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import GppGoodIcon from '@mui/icons-material/GppGood';
import IosShareIcon from '@mui/icons-material/IosShare';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import PoolIcon from '@mui/icons-material/Pool';

import GoogleMap from 'google-maps-react-markers';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers"
import { UserContext } from "../UserContext"


export default function ListingDetails(){
    const {mobile} = useContext(UserContext)

    //Navigate
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [propData, setPropData] = useState(null)
    const [tenantData, setTenantData] = useState(null)
    const [subleaseLocation, setSubleaseLocation] = useState("Manhattan")

    const [mapReady, setMapReady] = useState(false)

    const [requestStart, setRequestStart] = useState(null)
    const [requestEnd, setRequestEnd] = useState(null)
    const [numberOfOccupants, setNumberOfOccupants] = useState(1)
    const [requestMessage, setRequestMessage] = useState("")

    const [mobilePage, setMobilePage] = useState(0)

    const [requestSuccessModal, setRequestSuccessModal] = useState(false)

    let GoogleMapRef = useRef(null)

    //Image ul ref 
    const imgListRef = useRef(null)
    const { id } = useParams()
    useEffect(()=>{
        fetchProp()
    },[])

    const onGoogleApiLoaded = ({ map, maps }) => {
        GoogleMapRef.current = map
        setMapReady(true)
    }

    async function requestToBook(){
        
        let at = localStorage.getItem("accessToken")

        if(at == null){
            alert("Please login to message tenant.")
            navigate("/login")
            return
        }

        if(requestStart == null || requestEnd == null){
            alert("Please select start and end date.")
           
            return
        }

        if(requestMessage.trim() == ""){
            alert("Please enter a request message.")
        
            return
        }
        let requestS = new Date(requestStart).getTime()
        let subleaseS = new Date(propData.availableFrom).getTime()
        
        if(requestS < new Date().getTime() || (requestS < subleaseS && subleaseS - requestS > 1000*60*60*24)){
            alert("Sublease unavailable on requested start date!")
       
            return;
        }

        let requestE = new Date(requestEnd).getTime()
        let subleaseE = new Date(propData.availableTo).getTime()
       

        if(requestE > subleaseE || (requestE - subleaseE > 1000*60*60*24)){
            alert("Sublease unavailable on requested end date!")
           
            return;
        }
        setLoading(true)
        let USERID = localStorage.getItem("uid")

        //Add this user to the other user's property requestedBy field
        // - Need sublease from and to
        // - Need the user's ID
        // - Need the person's message 
        // - Need the number of Occupants
        await fetch('https://crib-llc.herokuapp.com/properties/automate/addSubtenantRequests', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                "subtenantId": USERID,
                "propId": propData._id,
                "requestStart": new Date(requestStart),
                "requestEnd": new Date(requestEnd),
                "requestMessage": requestMessage,
                "numOfOccupants": numberOfOccupants
            })
        })
        .then(async (res)=>{
            if(res.status == 200){
                smsSubtenantMessageToTenant()
                addRequestSend()
            }
            else{
                alert("Error occured. Please try again later.")
            }
        })     
        setTimeout(()=>{
            setLoading(false)
        },1500)
    }

    async function smsSubtenantMessageToTenant(){
        let uid = localStorage.getItem("uid")
        // console.log(uid)
        // console.log(tenantData.id)
        // console.log(new Date(requestStart))
        // console.log(new Date(requestEnd))
        await fetch('https://crib-llc.herokuapp.com/web/smsSubtenantInterestToUser', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                "tenantID": tenantData.id,
                "subtenantID": uid,
                "requestStart": new Date(requestStart),
                "requestEnd": new Date(requestEnd)
            })
        })
        .catch(e => console.log(e))

    }


    async function addRequestSend(){
        let USERID = localStorage.getItem("uid")

        await fetch('https://crib-llc.herokuapp.com/users/addSubleaseRequestSent', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                "propId": propData._id,
                "userId": USERID
            })
        })
        .then(async (res)=>{
            if(res.status == 200){
                setTimeout(()=> {
                    setRequestEnd(null)
                    setRequestStart(null)
                    setRequestMessage("")
                    setNumberOfOccupants(1)
                    setRequestSuccessModal(true)
                   
                    setLoading(false)
                    
                }, 2000)
            }
            else{
                alert("Error occured. Please try again later.")
            }
        })
        

    }


    async function fetchProp(){
        await fetch('https://crib-llc.herokuapp.com/properties/' + id, {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                viewCount: "false"
            })
        })
        .then(async (res)=>{
            if(res.status == 200){
                let data = await res.json()
                setPropData(data.propertyInfo)
                setTenantData(data.userInfo)
            }
        })
    }

    function getRent(){
        if(requestStart == null || requestEnd == null){
            return "TBD";
        }
        else{
            let sd = new Date(requestStart).getTime()
            let ed = new Date(requestEnd).getTime()

            let months = (ed -sd) / (1000*60*60*24*31)

            return "$" + (months * propData.price).toFixed(2)
        }
    }

    function getTotalRent(){
        if(propData == undefined ||  propData == null || requestStart == null || requestEnd == null){
            return "TBD";
        }
        else{
            let total = 0;
            
            if(propData.securityDeposit != undefined && propData.securityDeposit != null){
                total += Number(propData.securityDeposit)
            }

            let sd = new Date(requestStart).getTime()
            let ed = new Date(requestEnd).getTime()

            let months = (ed -sd) / (1000*60*60*24*31)

            total += Number((months * propData.price).toFixed(2))

            return "$" + Number(total).toFixed(2)
        }
    }

    function handleNav(route){
        setRequestSuccessModal(false)
        navigate(route)
    }

    function handleMobileRequestToBook(){
        if(mobilePage == 0){
            let at = localStorage.getItem("accessToken")
            if(at == null){
                alert("Please login or sign up first.")
                navigate("/login")
                
            }
            else{
                setMobilePage(1)
            }
            
        }
        else{
            requestToBook()
        }
    }

    function getArea(){
        let sa = propData.loc.secondaryTxt;

        let spaceless = sa.toLowerCase().replaceAll(" ","")
        if(spaceless.indexOf("nj") != -1){
            return "New Jersey"
        }
        else if(spaceless.indexOf("queens") != -1){
            return "Queens"
        }
        else if(spaceless.indexOf("brooklyn") != -1){
            return "Brooklyn"
        }
        return "Manhattan"
        
    }

    return(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            {propData == null || tenantData == null ?
            null
            :
            <div>
                {mobilePage == 0 ?
                <div style={{position:'relative',  display:'block', width: mobile ? '100vw' : 'auto', height: mobile ? '80vh' : '90vh', paddingTop: mobile ? 0 : '3vh', overflow:'scroll', }}>
                    
                    <div style={{paddingTop:15, paddingBottom:15, width:'90vw', marginLeft:'auto', marginRight:'auto'}}>
                        <p onClick={()=> navigate("/discoverSubleases")} style={{textDecorationLine:'underline', fontFamily: OPENSANS, fontWeight:'600', color: MEDIUMGREY, fontSize:'0.9rem'}}>Browse other listings</p>

                        <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize:'1.5rem', marginBottom: 5}}>{propData.type} in {getArea()}</p>
                        <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <div style={{flexDirection: mobile ? 'column-reverse' : 'row', display:'flex'}}>
                                <p style={{fontWeight:'500', fontFamily: OPENSANS,}}>Available from: {new Date(propData.availableFrom).getTime() < new Date().getTime() ? "Now" : new Date(propData.availableFrom).toLocaleString().split(",")[0]} - {new Date(propData.availableTo).toLocaleString().split(",")[0]}</p>
                                <p style={{fontWeight:'500', fontFamily: OPENSANS, color:MEDIUMGREY,  marginLeft: mobile ? 0 :'2vw',}}>{propData.loc.streetAddr}</p>
                            </div>
                            <div style={{flexDirection:'row', display:'flex'}}>
                                {/* <div style={{flexDirection:'row', display:'flex'}}>
                                    <IosShareIcon style={{fontSize:'1.5vw', color: MEDIUMGREY}}/>
                                    <p style={{fontWeight:'500', fontFamily: OPENSANS, color:MEDIUMGREY,marginLeft:5, fontSize:'0.9rem'}}>Share</p>
                                </div> */}
                                {/* <div style={{flexDirection:'row', display:'flex', marginLeft:'2vw'}}>
                                    <FavoriteIcon style={{fontSize:'1.5vw', color: MEDIUMGREY}}/>
                                    <p style={{fontWeight:'500', fontFamily: OPENSANS, color:MEDIUMGREY, marginLeft:5, fontSize:'0.9rem'}}>Favorite</p>
                                </div>
                                 */}
                            </div>

                           
                        </div>
                    </div>
                    <ul ref={imgListRef} style={{flexDirection:'row', display: 'flex',   width: mobile ? '100vw' : '90vw',  paddingLeft:0, borderRadius: mobile ? 0 : MEDIUMROUNDED, marginLeft:'auto', marginRight:'auto',  overflow:'scroll', msOverflowStyle:'none'}}>
                        {
                            propData.imgList.map((item, index)=> {
                                return(
                                    <li>
                                        <img key={item + index} src={item} style={{width: mobile ? '100vw' : '40vh', maxHeight: '100vw', marginLeft: index == 0 ? 0  : '0.5vw'}}/>
                                    </li>
                                )
                            })
                        }  
                    </ul>
                    <div style={{width:'90vw', marginLeft:'auto', marginRight:'auto', flexDirection:'row', display:'flex'}}>
                        <div style={{width: mobile ? '100%' : '50%'}}>
                            <div style={{ paddingTop: '2vh', paddingBottom:'4vh',  borderBottomStyle:'solid', borderBottomWidth:0.5, borderColor:'#E0E0E0', flexDirection:'row'}}>
                                <div style={{flexDirection:'row', justifyContent:'space-between', display:'flex'}}>
                                    <div style={{marginTop:'auto', marginBottom:'auto'}}>
                                        <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize:'1.2rem', marginBottom: 10}}>Current tenant, {tenantData.firstName}</p>
                                        <div style={{flexDirection:'row', display:'flex'}}>
                                            <div style={{flexDirection:'row', display:'flex',alignItems:'center'}}>
                                                <PermPhoneMsgIcon style={{fontSize:mobile ? '3.5vw' : '1.25vw'}}/>
                                                <p style={{marginTop:'auto', marginBottom:'auto', marginLeft:  mobile ? '1vw' : '0.5vw', fontFamily:OPENSANS, fontWeight:'500', fontSize:mobile ? '0.9rem' : '1rem'}}>Phone verified</p>
                                            </div>
                                            <div style={{flexDirection:'row', display:'flex',alignItems:'center', marginLeft:'2vw'}}>
                                                <MarkEmailReadIcon style={{fontSize: mobile ? '3.5vw' : '1.25vw'}}/>
                                                <p style={{marginTop:'auto', marginBottom:'auto', marginLeft: mobile ? '1vw' : '0.5vw', fontFamily:OPENSANS, fontWeight:'500', fontSize:mobile ? '0.9rem' : '1rem'}}>Email verified</p>
                                            </div>
                                        </div>
                                    </div>
                                    <img src={tenantData.profilePic} style={{height:mobile ? '8vh' : '10vh', width: mobile ? '8vh' : '10vh', borderRadius: mobile ? '4vh' : '5vh'}} />
                                </div>
                            </div>
                            

                            
                            {/* {propData.roommates && 
                            <div style={{ paddingTop: 15, paddingBottom:15  , borderBottomStyle:'solid', borderBottomWidth:1, borderColor:'#E0E0E0',}}>
                                <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize:'1.1rem', marginBottom: 5}}>Roommates</p>
                                <p style={{marginBottom: 0}}>{propData.roommates && propData.roommatesGender}</p>
                            </div>
                            } */}

                            <div style={{ paddingTop: '4vh', paddingBottom:'5vh',  borderBottomStyle:'solid', borderBottomWidth:0.5, borderColor:'#E0E0E0', flexDirection:'row'}}>
                                <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize:'1.2rem', marginBottom: 10}}>Description</p>
                                <p style={{marginBottom: 0, fontFamily:OPENSANS}}>
                                    {propData.description}
                                </p>
                            </div>

                            <div style={{ paddingTop: '4vh', paddingBottom:'4vh',  borderBottomStyle:'solid', borderBottomWidth:0.5, borderColor:'#E0E0E0', flexDirection:'row'}}>
                                <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize:'1.2rem', marginBottom: 10}}>Sublease details</p>
                               
                                
                                <div style={{flexDirection: mobile ? 'column' : 'row', display:'flex', paddingTop:'1vh', paddingBottom:'1vh', alignItems:'center', width:'80%', justifyContent:'space-between'}}>
                                    <div style={{flexDirection:'row', display:'flex', width:mobile ? '100%' : '40%', alignItems:'center'}}>
                                        <GppGoodIcon style={{color:'black', fontSize:mobile ? '5vw' : '2.5vw', color: MEDIUMGREY}} />
                                        <div style={{marginLeft: mobile ? '3vw' : '1vw', marginTop:'auto', marginBottom:'auto',}}>
                                            <p style={{ fontFamily: OPENSANS, fontWeight:'500', marginBottom:0}}>Security deposit</p>
                                            <p style={{ fontFamily: OPENSANS, fontWeight:'500', fontSize:"0.8rem", marginBottom:0}}>${propData.securityDeposit == undefined ? "0" : propData.securityDeposit}</p>
                                        </div>
                                    </div>
                                    <div style={{flexDirection:'row', display:'flex', width:mobile ? '100%' : '40%', alignItems:'center', marginTop: mobile ? '2vh' : 0}}>
                                        <KingBedIcon style={{color:'black', fontSize:mobile ? '5vw' : '2.5vw',  color: MEDIUMGREY}} />
                                        <div style={{marginLeft:mobile ? '3vw' : '1vw', marginTop:'auto', marginBottom:'auto',}}>
                                            <p style={{ fontFamily: OPENSANS, fontWeight:'500', marginBottom:0}}>{propData.amenities.includes("Mattress") ? "Furnished" : "Not furnished"}</p>
                                            <p style={{ fontFamily: OPENSANS, fontWeight:'500', fontSize:"0.8rem", marginBottom:0}}>{propData.amenities.includes("Mattress") ? "Mattress included" : "Mattress not included"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div style={{flexDirection: mobile ? 'column' : 'row', justifyContent:'space-between', display:'flex', paddingTop:'1vh', paddingBottom:'1vh', alignItems:'center', width:'80%'}}>
                                    <div style={{flexDirection:'row', display:'flex', width:mobile ? '100%' : '40%', alignItems:'center'}}>
                                        <BoltIcon style={{color:'black', fontSize:mobile ? '5vw' : '2.5vw', color: MEDIUMGREY}} />
                                        <div style={{marginLeft:mobile ? '3vw' : '1vw', marginTop:'auto', marginBottom:'auto',}}>
                                            <p style={{ fontFamily: OPENSANS, fontWeight:'500', marginBottom:0}}>Utilities</p>
                                            <p style={{ fontFamily: OPENSANS, fontWeight:'500', fontSize:"0.8rem", marginBottom:0}}>{propData.amenities.includes("Utilities_Included") ? "Utilities included" : "Utilities not included"}</p>
                                        </div>
                                    </div>
                                    <div style={{flexDirection:'row', display:'flex', width:mobile ? '100%' : '40%', alignItems:'center',  marginTop: mobile ? '2vh' : 0}}>
                                        <Diversity3Icon style={{color:'black', fontSize:mobile ? '5vw' : '2.5vw',  color: MEDIUMGREY}} />
                                        <div style={{marginLeft:mobile ? '3vw' : '1vw', marginTop:'auto', marginBottom:'auto',}}>
                                            <p style={{ fontFamily: OPENSANS, fontWeight:'500', marginBottom:0}}>{propData.roommates ? "Roommates" : "No roommates"}</p>
                                            <p style={{ fontFamily: OPENSANS, fontWeight:'500', fontSize:"0.8rem", marginBottom:0}}>{propData.roommates ? propData.roommatesGender == "Both" ? "Male and female" : `${propData.roommatesGender} roommate` : "All to yourself"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div style={{flexDirection:'row', display:'flex', width:mobile ? '100%' : '40%', alignItems:'center',  marginTop: mobile ? '2vh' : 0}}>
                                    <WifiIcon  style={{color:'black', fontSize:mobile ? '5vw' : '2.5vw', color: MEDIUMGREY}} />
                                    <div style={{marginLeft:mobile ? '3vw' : '1vw', marginTop:'auto', marginBottom:'auto',}}>
                                        <p style={{ fontFamily: OPENSANS, fontWeight:'500', marginBottom:0}}>Wifi</p>
                                        <p style={{ fontFamily: OPENSANS, fontWeight:'500', fontSize:"0.8rem", marginBottom:0}}>{propData.amenities.includes("Wifi") ? "Wifi included" : "Wifi not included"}</p>
                                    </div>
                                </div>
                            </div>

                           
                           
                           
                            <div style={{ paddingTop: '4vh', paddingBottom:'6vh',  borderBottomStyle:'solid', borderBottomWidth:0.5, borderColor:'#E0E0E0', flexDirection:'row'}}>
                                <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize:'1.2rem', marginBottom: 10}}>Location</p>
                                <div style={{paddingTop:'2vh'}}>
                                    <div style={{height: '25vh', width: mobile ? '90vw' : '45vw', borderRadius: MEDIUMROUNDED, backgroundColor:'#E0E0E0', overflow:'hidden'}}>
                                    {propData != null &&
                                        <GoogleMap
                                            ref={GoogleMapRef}
                                            onGoogleApiLoaded={onGoogleApiLoaded}
                                            apiKey="AIzaSyBbZGuUw4bqWirb1UWSzu9R6_r13rPj-eI"
                                            defaultCenter={{
                                                lat: propData.loc.coordinates[1],
                                                lng: propData.loc.coordinates[0]
                                            }}
                                            defaultZoom={12}
                                            >
                                            
                                            <div lat={propData.loc.coordinates[1]} lng={propData.loc.coordinates[0]} style={{width: '5vh', height:'5vh', borderRadius:'2.5vh', backgroundColor: PRIMARYCOLOR, display:'flex', justifyContent:'center'}}>
                                                <HomeIcon style={{width: 30, margin:'auto', color:'white'}} />
                                            </div>
                                        
                                        
                                        </GoogleMap>
                                    }
                                        
                                        

                                    </div>
                                </div>
                            </div>
                            <div style={{ paddingTop: '4vh', paddingBottom:'5vh', flexDirection:'row'}}>
                                <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize:'1.3rem', marginBottom: 10}}>Amenities</p>
                                <div style={{ width:mobile ? '100%' : '45vw', columnCount: 2}}>
                                {   propData.amenities.length != 0 ?
                                    propData.amenities.map((item)=>{
                                        return(
                                            <div key={"amenities" + item} style={{width:mobile ? '45vw' : '15vw', flexDirection:'row', display:'flex', alignItems:'center', paddingTop:'2vh', paddingBottom:'2vh' }}>
                                                {GetIcon(MEDIUMGREY, mobile ? '8vw' : '2.5vw', item)}

                                                
                                                <p style={{fontWeight:'500', color: MEDIUMGREY, marginBottom: 0, marginLeft:'1vw', fontSize: mobile ? '0.9rem' : '1rem'}}>{item.replaceAll("_"," ")}</p>
                                            </div>
                                        )
                                    })
                                    :
                                    <p>Ask tenant about their amenities!</p>
                                }
                                </div>
                                
                            </div>
                            {
                                mobile &&
                                <div style={{width:'100%', height:'10vh'}}/>
                            }


                        </div>

                        <div style={{ width:'50%', display:mobile ? 'none' : 'block', flexDirection:'row', paddingTop: '2vh', borderWidth:1, borderColor: MEDIUMGREY,}}>
                            <div style={{width:'70%', borderRadius: 15,  boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)', backgroundColor:'white', padding: 25, display:'block',marginLeft:'auto' }}>
                                <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.3rem', marginBottom: '3vh'}}>Send {tenantData.firstName} a request to sublease</p>
                                <div style={{flexDirection:'row', justifyContent:'space-between', display:'flex'}}>
                                    <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 5,}}>Available from:  {new Date(propData.availableFrom).getTime() < new Date().getTime() ? "Now" : new Date(propData.availableFrom).toLocaleString().split(",")[0]} - {new Date(propData.availableTo).toLocaleString().split(",")[0]}</p>
                                    <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 5, color:PRIMARYCOLOR}}>${propData.price}/month</p>
                                </div>
                                <div style={{flexDirection:'row', display:'flex', marginTop:'4vh', justifyContent:'space-between'}}>
                                    <div style={{width:'47.5%'}}>
                                        <DatePicker
                                        label="Start date"
                                        value={dayjs(requestStart)}
                                        onChange={(event)=>                                
                                            setRequestStart(event)
                                        }
                                        slotProps={{ textField: {error:false, size:"small" } }}
                                        />
                                    </div>
                                    <div style={{width:'47.5%'}}>
                                        <DatePicker
                                        label="End date"
                                        value={dayjs(requestEnd)}
                                        onChange={(event)=> setRequestEnd(event)}
                                        slotProps={{ textField: {error:false, size:"small" } }}
                                        />
                                    </div>
                                </div>
                                <div style={{marginTop:'2vh'}}>
                                    <FormControl fullWidth>
                                        <InputLabel id="number-of-occupants">Number of occupants</InputLabel>
                                        <Select
                                            labelId="number-of-occupants"
                                            value={numberOfOccupants}
                                            label="Number of Occupants"
                                            size="small"
                                            onChange={(val)=> setNumberOfOccupants(val.target.value)}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={2}>2</MenuItem>
                                            <MenuItem value={3}>3</MenuItem>
                                            <MenuItem value={4}>4</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={6}>6</MenuItem>
                                            <MenuItem value={7}>7</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div style={{marginTop:'2vh'}}>
                                    <TextField value={requestMessage} onChange={(val) => setRequestMessage(val.target.value)} helperText={`The more detailed the better`} multiline fullWidth label={`Tell ${tenantData.firstName} a bit about yourself`} rows={2} />
                                </div>

                                <Button onClick={requestToBook} fullWidth style={{backgroundColor: PRIMARYCOLOR, textTransform:'none', marginTop:'3vh', height:'6vh', outline: 'none'}}>
                                    {loading ?
                                    <Lottie animationData={WhiteLoadingAnimation} style={{display:'flex', flex:1, color:'white', height:'6vh', preserveAspectRatio: 'xMidYMid slice'}}/>
                                    :
                                    <p style={{marginBottom:0, color:'white', fontWeight:'600'}}>Request to book</p> 
                                    }
                                </Button>
                                <div style={{marginTop:'2vh'}}>
                                    <div style={{flexDirection: 'row', }}>
                                        <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.3rem', marginBottom: 10}}>Rent summary</p>
                                    </div>
                                    <div style={{flexDirection:'row', marginTop:'2vh', justifyContent:'space-between', display:'flex'}}>
                                        <p style={{fontFamily:OPENSANS, fontWeight:'500', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>Security deposit</p>
                                        <p style={{fontFamily:OPENSANS, fontWeight:'500', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>${propData.securityDeposit == undefined || propData.securityDeposit == null ? "0" : propData.securityDeposit}</p>
                                    </div>
                                    {/* <div style={{flexDirection:'row', marginTop:'2vh', justifyContent:'space-between', display:'flex'}}>
                                        <p style={{fontFamily:OPENSANS, fontWeight:'500', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>1st month</p>
                                        <p style={{fontFamily:OPENSANS, fontWeight:'500', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>${propData.securityDeposit}</p>
                                    </div> */}
                                    <div style={{flexDirection:'row', marginTop:'2vh', justifyContent:'space-between', display:'flex'}}>
                                        <p style={{fontFamily:OPENSANS, fontWeight:'500', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>Toal rent</p>
                                        <p style={{fontFamily:OPENSANS, fontWeight:'500', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>{getRent()}</p>
                                    </div>
                                </div>
                                <div style={{width:'100%', borderTopWidth:'0.5px', borderTopColor: LIGHTGREY, borderTopStyle:'solid', marginTop:'2vh'}}>
                                    <div style={{flexDirection:'row', marginTop:'2vh', justifyContent:'space-between', display:'flex'}}>
                                        <p style={{fontFamily:OPENSANS, fontWeight:'700', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>Total</p>
                                        <p style={{fontFamily:OPENSANS, fontWeight:'700', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>{getTotalRent()}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    
                    {/* <IconButton onClick={()=>scrollImgList("-")} style={{position:'absolute', top:'50%' , left: 20, transform: 'translate(0, -50%)', backgroundColor: 'rgba(0,0,0,0.3)'}}>
                        <KeyboardArrowLeftIcon style={{color:'white'}}/>
                    </IconButton>
                    <IconButton onClick={()=>scrollImgList("+")} style={{position:'absolute', top:'50%' , right: 20, transform: 'translate(0, -50%)', backgroundColor: 'rgba(0,0,0,0.3)'}}>
                        <KeyboardArrowRightIcon style={{color:'white'}}/>
                    </IconButton> */}
                
                </div>
                :
                <div style={{width:'100%', height:'80vh', paddingLeft:'2.5vw', paddingRight:'2.5vw', paddingTop:'3vh', overflow:'scroll', paddingBottom:'20vh'}}>
                    <p onClick={()=> setMobilePage(0)} style={{textDecorationLine:'underline', fontFamily: OPENSANS, fontWeight:'600', color: MEDIUMGREY, fontSize:'0.9rem'}}>Back to listing</p>
                    <>
                        <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.2rem',}}>Send {tenantData.firstName} a request to sublease</p>
                        <div style={{position:'relative'}}>
                            <img src={propData.imgList[0]} style={{width:'100%', height:'25vh', borderRadius: MEDIUMROUNDED, objectFit: 'cover'}}/>
                            <div style={{position:'absolute', bottom: 10, right: 10, backgroundColor:PRIMARYCOLOR, padding: '2vw', borderRadius: MEDIUMROUNDED, borderColor:'white', borderWidth:1, borderStyle:'solid'}}>
                                <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom:0, color:'white'  }}>${propData.price} /month</p>

                            </div>
                        </div>
                        <div style={{flexDirection:'column', justifyContent:'space-between', display:'flex', marginTop:'3vh'}}>
                            <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'1rem', marginBottom: '1vh',}}>Available from:  {new Date(propData.availableFrom).getTime() < new Date().getTime() ? "Now" : new Date(propData.availableFrom).toLocaleString().split(",")[0]} - {new Date(propData.availableTo).toLocaleString().split(",")[0]}</p>
                        </div>
                        <div style={{flexDirection:'row', display:'flex', marginTop:'2vh', justifyContent:'space-between'}}>
                            <div style={{width:'47.5%'}}>
                                <DatePicker
                                label="Start date"
                                value={dayjs(requestStart)}
                                onChange={(event)=>                                
                                    setRequestStart(event)
                                }
                                slotProps={{ textField: {error:false, } }}
                                />
                            </div>
                            <div style={{width:'47.5%'}}>
                                <DatePicker
                                label="End date"
                                value={dayjs(requestEnd)}
                                onChange={(event)=> setRequestEnd(event)}
                                slotProps={{ textField: {error:false, } }}
                                />
                            </div>
                        </div>
                        <div style={{marginTop:'2vh'}}>
                            <FormControl fullWidth>
                                <InputLabel id="number-of-occupants">Number of occupants</InputLabel>
                                <Select
                                    labelId="number-of-occupants"
                                    value={numberOfOccupants}
                                    label="Number of Occupants"
                                   
                                    onChange={(val)=> setNumberOfOccupants(val.target.value)}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={6}>6</MenuItem>
                                    <MenuItem value={7}>7</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{marginTop:'2vh'}}>
                            <TextField value={requestMessage} onChange={(val) => setRequestMessage(val.target.value)} helperText={`The more detailed the better`} multiline fullWidth label={`Tell ${tenantData.firstName} a bit about yourself`} rows={2} />
                        </div>
                   

                    </>
                   
                </div>
                }
                {
                    mobile &&
                    <div style={{height:'10vh', borderTopWidth:'1px', borderTopStyle:'solid', borderTopColor: EXTRALIGHT, paddingLeft:'5vw', paddingRight:'5vw', alignItems:'center', display:'flex', justifyContent:'space-between', position:'absolute', bottom:'-1vh',  width:'100%', zIndex:999, backgroundColor:'white'}}>
                        <p style={{marginBottom:0, fontWeight:'600', fontSize:'1.1rem', fontFamily: OPENSANS}}>${propData.price} /month</p>
                        <Button disabled={loading} onClick={handleMobileRequestToBook} variant="contained" style={{backgroundColor: PRIMARYCOLOR, outline: 'none', color: 'white', textTransform:'none', height: '5vh', width:'40vw'}}>
                            {loading ?
                            <Lottie animationData={LoadingAnimation} style={{width:'20vw'}}/>
                            :
                            <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'600'}}>Request to book</p>
                            }
                            
                        </Button>
                    </div>
                    
                    
                }
               
                </div>
            }

    <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={requestSuccessModal}
        onClose={()=> setRequestSuccessModal(false)}
        closeAfterTransition
       
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={requestSuccessModal}>
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
            alignItems:'center',
            flexDirection:'column',
            
            
            }}>
            <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize:'1.3rem', marginBottom: '2vh',}}>Sublease request sent!</p>
            <Lottie animationData={SubleaseRequestSent} style={{height:'25vh'}} />
            <Button onClick={()=>handleNav('/discoverSubleases')} fullWidth variant="contained" style={{backgroundColor: PRIMARYCOLOR, outline:'none', textTransform:'none', height: '6vh'}}>
                <p style={{fontFamily: OPENSANS, marginBottom:0, fontWeight:'600'}}>
                    Explore other sublease
                </p>
            </Button>
            <Button onClick={()=>handleNav('/myRequests')} fullWidth variant="outlined" style={{backgroundColor: 'white', outline:'none', textTransform:'none', borderColor: PRIMARYCOLOR, marginTop:'2vh',  height: '6vh'}}>
                <p style={{fontFamily: OPENSANS, marginBottom:0, fontWeight:'700', color:PRIMARYCOLOR}}>
                    View my requests
                </p>
            </Button>



          </div>
        </Fade>
      </Modal>

        </LocalizationProvider>
    )
}