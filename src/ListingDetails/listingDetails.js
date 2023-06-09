import { createRef, useContext, useEffect, useState, useRef, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { EXTRALIGHT, LIGHTGREY, MEDIUMGREY, MEDIUMROUNDED, OPENSANS, PRIMARYCOLOR, GetIcon, SUBTEXTCOLOR } from "../sharedUtils"
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
import Diversity3Icon from '@mui/icons-material/Diversity3';
import ShowerIcon from '@mui/icons-material/Shower';    
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';

import GoogleMap from 'google-maps-react-markers';
import { Button, Checkbox, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers"


import { UserContext } from "../UserContext"
import { CheckBox } from "@mui/icons-material";

export default function ListingDetails(){
    const {mobile, setLoggedIn} = useContext(UserContext)

    //Navigate
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [propData, setPropData] = useState(null)
    const [tenantData, setTenantData] = useState(null)

    const [mapReady, setMapReady] = useState(false)

    const [requestStart, setRequestStart] = useState(null)
    const [requestEnd, setRequestEnd] = useState(null)
    const [numberOfOccupants, setNumberOfOccupants] = useState(1)
    const [requestMessage, setRequestMessage] = useState("")
    const [userData, setUserData] = useState(null)

    const [mobilePage, setMobilePage] = useState(0)

    const [requestSuccessModal, setRequestSuccessModal] = useState(false)
    const [requestConfirmationModalVis, setRequestConfirmationModalVis] = useState(false)

    const [confirmationEmail, setConfirmationEmail] = useState("")
    const [requestConfirmationPage, setRequestConfirmationPage] = useState(0)
    const [verificationCode, setVerificationCode] = useState("")

    const [requestDetailsConfirmationModalVis, setRequestDetailsConfirmationModalVis] = useState(false)
    const [requestConfirmationCheckbox, setRequestConfirmationCheckbox] = useState(false)

    let GoogleMapRef = useRef(null)

    //Image ul ref 
    const imgListRef = useRef(null)
    const { id } = useParams()
    useEffect(()=>{
        refreshAccessToken()
        fetchProp()
        fetchUserData()
    },[])

    async function fetchUserData(){
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
                setConfirmationEmail(userData.email)
                setUserData(userData)
            })
            .catch(e=>{
              console.log("Error")
            })
        } 
    }

    const refreshAccessToken = async () => {
        try{
            const rt = localStorage.getItem("refreshToken")
            const id = localStorage.getItem("uid");
                
            //If refresh token is undefined, meaning user have not logged in
            if (rt != undefined && id != undefined) {
            
            
            
            await fetch('https://crib-llc.herokuapp.com/tokens/accessRefresh', {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + rt
                }
            }).then(async e => {
                const response = await e.json();
                if(e.status == 200){
                console.log("Successfully refreshed the accessToken")
                try {
                    if(response.accessToken != undefined ?? response.accessToken != null){
                    localStorage.setItem("accessToken", response.accessToken)
                    
                    setLoggedIn(true)
                    }
                    
                } catch (err) {
                    alert(err)
                }
                }
                else if(e.status == 401){
                    setLoggedIn(false)
                    localStorage.clear()
                    alert("Please log in.")
                    navigate("/login")
                    return
                }
                else{
                    setLoggedIn(false)
                    localStorage.clear()
                    alert("Please log in.")
                    navigate("/login")
                    return
                }
            })
            .catch ( e => {
                console.log("failing")
                alert(e)
            })
            }
            else{
                console.log("Refresh Token is undefined. User is not logged in.")
            }
        }
        catch{
            console.log("ERROR --- APP --- REFRESHTOKEN")
        }
    }

    const onGoogleApiLoaded = ({ map, maps }) => {
        GoogleMapRef.current = map
        setMapReady(true)
    }

    async function requestToBook(){
        let at = localStorage.getItem("accessToken")
        if(at == null){
            alert("Please login or sign up first.")
            navigate("/login")
            return
        }
        if(requestStart == null){
            alert("Please select a sublease start date.")
            return
        }
        if(requestEnd == null){
            alert("Please select a sublease end date.")
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
        console.log("before" , new Date(requestStart).getTime())
        navigate(`/requestConfirm/${propData._id}/${new Date(requestStart).getTime()}/${new Date(requestEnd).getTime()}/${numberOfOccupants}`)
        
        // let at = localStorage.getItem("accessToken")

        // if(at == null){
        //     alert("Please login to message tenant.")
        //     navigate("/login")
        //     return
        // }

        // if(requestStart == null || requestEnd == null){
        //     alert("Please select start and end date.")
           
        //     return
        // }

        // if(requestMessage.trim() == ""){
        //     alert("Please enter a request message.")
        
        //     return
        // }
        // let requestS = new Date(requestStart).getTime()
        // let subleaseS = new Date(propData.availableFrom).getTime()
        
        // if(requestS < new Date().getTime() || (requestS < subleaseS && subleaseS - requestS > 1000*60*60*24)){
        //     alert("Sublease unavailable on requested start date!")
       
        //     return;
        // }

        // let requestE = new Date(requestEnd).getTime()
        // let subleaseE = new Date(propData.availableTo).getTime()
       

        // if(requestE > subleaseE || (requestE - subleaseE > 1000*60*60*24)){
        //     alert("Sublease unavailable on requested end date!")
           
        //     return;
        // }
        // if(userData.emailVerified == undefined || userData.emailVerified == false){
        //     setRequestConfirmationModalVis(true)
        //     return
        // }
        // setRequestDetailsConfirmationModalVis(true)
    }

    async function sendSubleaseRequest(){
        setRequestDetailsConfirmationModalVis(false)
        setLoading(true)
        let USERID = localStorage.getItem("uid")
        let at = localStorage.getItem("accessToken")

        await fetch('https://crib-llc.herokuapp.com/requests', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + at
            },
            body:JSON.stringify({
                "subtenantId": USERID,
                "tenantId": propData.postedBy,
                "propId": propData._id,
                "startDate": new Date(requestStart),
                "endDate": new Date(requestEnd),
                "about": requestMessage,
                "numberOfOccupants": numberOfOccupants
            })
        })
        .then(async (res)=>{
            if(res.status == 200){
                // smsSubtenantMessageToTenant()
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

    // if(res.status == 200){
    //     await fetch('https://crib-llc.herokuapp.com/users/' + USERID, {
    //         method: 'PUT',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //             'Authorization': 'Bearer ' + at,
    //         },
    //         body: JSON.stringify({email: confirmationEmail})
    //     })
    //     .then((response) => {
    //         if(response.status == 200){
                
    //         }
    //     })
    //     .catch( e => {
    //         alert("Invalid email. Please enter a valid email before verification.")
    //         setConfirmationEmail(0)
    //     })
    // }
    // else{
    //     alert("Invalid email. Please enter a valid email before verification.")
    //     setConfirmationEmail(0)
    // }

    function sendEmailVerification(){
    
        fetch('https://crib-llc.herokuapp.com/users/sendEmailVerification', {
            method:'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": confirmationEmail
            })
        })
        .then(async res => {
            setRequestConfirmationPage(1)
        })
        .catch( e => {
            alert("Invalid email. Please enter a valid email before verification.")
            setRequestConfirmationPage(0)
        })
      
    }

    async function verifyEmail(){
        console.log("hello")
        let USERID = localStorage.getItem("uid")
        let at = localStorage.getItem("accessToken")
        if(verificationCode.length != 6){
            alert("Please enter a valid verification code")
            return
        }
        fetch('https://crib-llc.herokuapp.com/users/verifyEmailVerifcationCode', {
            method:'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": confirmationEmail,
                "code": verificationCode,
                "userId": userData._id
            })
        })
        .then(async res => {
            if(res.status == 200){
                
                await fetch('https://crib-llc.herokuapp.com/users/' + USERID, {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + at,
                    },
                    body: JSON.stringify({"email": confirmationEmail})
                })
                .then((response) => {
                    setRequestConfirmationModalVis(false)
                    setRequestDetailsConfirmationModalVis(true)
                })
                .catch( e => {
                    alert("Invalid email. Please try again!")
                    setRequestConfirmationPage(0)
                })
                setRequestConfirmationModalVis(false)
            }
            else{
                alert("Invalid code, please try again.")
                setLoading(false)
                setVerificationCode("")
            }
        })
        .catch( e => console.log("Error"))
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
                console.log(data.propertyInfo)
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
    function getFees(){
      
        if(requestStart == null || requestEnd == null){
            return "TBD";
        }
        else{
            let sd = new Date(requestStart).getTime()
            let ed = new Date(requestEnd).getTime()

            let months = (ed -sd) / (1000*60*60*24*31)

            return "$" + (months * propData.price*0.05).toFixed(2)
        }
    }

    function getTotalRent(){
        if(propData == undefined ||  propData == null || requestStart == null || requestEnd == null){
            return "TBD";
        }
        else{
            let total = 0;
            
            // if(propData.securityDeposit != undefined && propData.securityDeposit != null){
            //     total += Number(propData.securityDeposit)
            // }

            let sd = new Date(requestStart).getTime()
            let ed = new Date(requestEnd).getTime()

            let months = (ed -sd) / (1000*60*60*24*31)

            total += Number((months * propData.price).toFixed(2))

         
            let fees = Number(propData.price * months * 0.05)
            
            total += Number(fees.toFixed(2))

            return "$" + total.toFixed(2)
        }
    }

    function getPaymentMethod(){
        let ret = ""

        propData.rentPaymentMethod.forEach(item =>{
            ret = ret + item + ", "
        })
        return ret.substring(0, ret.length-2)
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
                return
            }
            else{
                setMobilePage(1)
            }
            
        }
        else{
            requestToBook()
        }
    }

    function handleMessageTenantClick(){
        let at = localStorage.getItem("accessToken")
        if(at == null){
            alert("Please login or sign up first.")
            navigate("/login")
            return
        }
        navigate(`/messageTenant/${propData._id}`)
    }

    function getRentPaymentMethods(){
        let s = ""

        propData.rentPaymentMethod.forEach(item => {
            s = s + item + ", "
        })

        return s.substring(0, s.length-2)
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
                <div style={{position:'relative',  display:'block', width: mobile ? '100vw' : 'auto', height: mobile ? '78vh' : '90vh', paddingTop: mobile ? 0 : '3vh', overflow:'scroll', }}>
                    
                    <div style={{paddingTop:15, paddingBottom:15, width:'90vw', marginLeft:'auto', marginRight:'auto'}}>
                        <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between'}}>
                            <p onClick={()=> navigate("/discoverSubleases")} style={{textDecorationLine:'underline', fontFamily: OPENSANS, fontWeight:'600', color: MEDIUMGREY, fontSize:'0.9rem', cursor:"pointer"}}>Browse other listings</p>
                            <p style={{fontWeight:'500', fontFamily: OPENSANS, color:PRIMARYCOLOR}}>{propData.numberOfViews == 0 ? 1 : propData.numberOfViews} user views</p>
                        </div>
                        <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize:'1.5rem', marginBottom: 5}}>{propData.type} in {getArea()}</p>
                        <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <div style={{flexDirection: mobile ? 'column-reverse' : 'row', display:'flex'}}>
                                <p style={{fontWeight:'500', fontFamily: OPENSANS,}}>Available from: {new Date(propData.availableFrom).getTime() < new Date().getTime() ? "Now" : new Date(propData.availableFrom).toLocaleString().split(",")[0]} - {new Date(propData.availableTo).toLocaleString().split(",")[0]}</p>
                                <p style={{fontWeight:'500', fontFamily: OPENSANS, color:MEDIUMGREY,  marginLeft: mobile ? 0 :'2vw', textDecorationLine:'underline'}}>{propData.loc.streetAddr}</p>
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
                    <ul ref={imgListRef} style={{flexDirection:'row', display: 'flex',   width: mobile ? '100vw' : '90vw',  paddingLeft:0, borderRadius: mobile ? 0 : MEDIUMROUNDED, marginLeft:'auto', marginRight:'auto',  overflow:'scroll', msOverflowStyle:'none', listStyle:'none'}}>
                        {
                            propData.imgList.map((item, index)=> {
                                return(
                                    <li>
                                        <img key={item + index} src={item} style={{width: mobile ? '100vw' : '40vh', height:'40vh' , marginLeft: index == 0 ? 0  : '0.5vw', objectFit:'cover'}}/>
                                    </li>
                                )
                            })
                        }  
                    </ul>
                    <div style={{width:'90vw', marginLeft:'auto', marginRight:'auto', flexDirection:'row', display:'flex'}}>
                        <div style={{width: mobile ? '100%' : '50%'}}>
                            <div style={{ paddingTop: '3vh', paddingBottom:'5vh',  borderBottomStyle:'solid', borderBottomWidth:0.5, borderColor:'#E0E0E0', flexDirection:'row'}}>
                                <div style={{flexDirection:'row', justifyContent:'space-between', display:'flex'}}>
                                    <div style={{marginTop:'auto', marginBottom:'auto'}}>
                                        <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize:'1.3rem', marginBottom: 10}}>Current tenant, {tenantData.firstName}</p>
                                        <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem',marginBottom: 10, color: "#737373"}}>{tenantData.school}</p>
                                        <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 0, color: "#737373"}}>{tenantData.occupation}</p>
                                    </div>
                                    <img src={tenantData.profilePic} style={{height:mobile ? '8vh' : '10vh', width: mobile ? '8vh' : '10vh', borderRadius: mobile ? '4vh' : '5vh', objectFit:'cover'}} />
                                </div>
                                <div style={{flexDirection:'row', display:'flex', marginTop:'4vh'}}>
                                    <div style={{flexDirection:'row', display:'flex',alignItems:'center', borderRadius: MEDIUMROUNDED, backgroundColor: EXTRALIGHT, padding:'1vh', borderColor: LIGHTGREY, borderWidth:'1px', borderStyle:'solid'}}>
                                        <PermPhoneMsgIcon style={{fontSize:mobile ? '3.5vw' : '1rem'}}/>
                                        <p style={{marginTop:'auto', marginBottom:'auto', marginLeft:  mobile ? '1vw' : '0.5vw', fontFamily:OPENSANS, fontWeight:'500', fontSize:mobile ? '0.9rem' : '0.9rem'}}>Phone verified</p>
                                    </div>
                                    <div style={{flexDirection:'row', display:'flex',alignItems:'center', borderRadius: MEDIUMROUNDED, backgroundColor: EXTRALIGHT, padding:'1vh', borderColor: LIGHTGREY, borderWidth:'1px', borderStyle:'solid', marginLeft:'1vw'}}>
                                        <MarkEmailReadIcon style={{fontSize: mobile ? '3.5vw' : '1rem'}}/>
                                        <p style={{marginTop:'auto', marginBottom:'auto', marginLeft: mobile ? '1vw' : '0.5vw', fontFamily:OPENSANS, fontWeight:'500', fontSize:mobile ? '0.9rem' : '0.9rem'}}>Email verified</p>
                                    </div>
                                </div>
                                <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.2rem', marginTop:'4vh', marginBottom:10}}>Message to subtenant</p>
                                <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem',marginBottom: 0, color: "#737373"}}>
                                    {propData.messageToSubtenant}
                                </p>

                            </div>
                            

                            
                            {/* {propData.roommates && 
                            <div style={{ paddingTop: 15, paddingBottom:15  , borderBottomStyle:'solid', borderBottomWidth:1, borderColor:'#E0E0E0',}}>
                                <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize:'1.1rem', marginBottom: 5}}>Roommates</p>
                                <p style={{marginBottom: 0}}>{propData.roommates && propData.roommatesGender}</p>
                            </div>
                            } */}

                            <div style={{ paddingTop: '5vh', paddingBottom:'5vh',  borderBottomStyle:'solid', borderBottomWidth:0.5, borderColor:'#E0E0E0', flexDirection:'row'}}>
                                <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.2rem', marginBottom: 10}}>Sublease description</p>
                                <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem',marginBottom: 0, color: "#737373"}}>
                                    {propData.description}
                                </p>
                            </div>

                            <div style={{ paddingTop: '5vh', paddingBottom:'5vh',  borderBottomStyle:'solid', borderBottomWidth:0.5, borderColor:'#E0E0E0', flexDirection:'row'}}>
                                <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.2rem', marginBottom: 10}}>Sublease details</p>
                                <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem',marginBottom: 0, color: "#737373"}}>
                                    Subtenants will have access to:
                                </p>
                                <div style={{flexDirection:'row', display:'flex', alignItems:'center', marginTop:'4vh'}}>
                                    <div style={{flexDirection:'column', display:'flex', borderWidth:'1px', borderColor: LIGHTGREY, borderStyle:'solid', borderRadius: MEDIUMROUNDED, padding:'1vh'}}>
                                        <KingBedIcon style={{fontSize:'2.5rem', color:"black"}}/>
                                        <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem',marginBottom: 0, color: "#737373"}}>
                                           {Number(propData.bed) == 0 ? "No" : Number(propData.bed)} beds 
                                        </p>
                                    </div>
                                    <div style={{flexDirection:'column', display:'flex', borderWidth:'1px', borderColor:LIGHTGREY, borderStyle:'solid', borderRadius: MEDIUMROUNDED, padding:'1vh', marginLeft:'2vh'}}>
                                        <ShowerIcon style={{fontSize:'2.5rem', color:"black"}}/>
                                        <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem',marginBottom: 0, color: "#737373"}}>
                                            {propData.privateBathroom || propData.numberOfRoommates == 0 ? "A private bathroom" : "A shared bathroom"}
                                        </p>
                                    </div>
                                </div>
                                
                                <div style={{flexDirection: mobile ? 'column' : 'row', display:'flex', paddingTop:'1vh', paddingBottom:'1vh', alignItems:'center', width:'80%', justifyContent:'space-between', marginTop:'4vh'}}>
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
                                            <p style={{ fontFamily: OPENSANS, fontWeight:'500', marginBottom:0}}>{Number(propData.bed) == 0 ? "Not Furnished" : "Furnished"}</p>
                                            <p style={{ fontFamily: OPENSANS, fontWeight:'500', fontSize:"0.8rem", marginBottom:0}}>{Number(propData.bed) == 0 ? "Mattress not included" : "Mattress included"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div style={{flexDirection: mobile ? 'column' : 'row', justifyContent:'space-between', display:'flex', paddingTop:'1vh', paddingBottom:'1vh', alignItems:'center', width:'80%'}}>
                                    <div style={{flexDirection:'row', display:'flex', width:mobile ? '100%' : '40%', alignItems:'center'}}>
                                        <BoltIcon style={{color:'black', fontSize:mobile ? '5vw' : '2.5vw', color: MEDIUMGREY}} />
                                        <div style={{marginLeft:mobile ? '3vw' : '1vw', marginTop:'auto', marginBottom:'auto',}}>
                                            <p style={{ fontFamily: OPENSANS, fontWeight:'500', marginBottom:0}}>Utilities</p>
                                            <p style={{ fontFamily: OPENSANS, fontWeight:'500', fontSize:"0.8rem", marginBottom:0}}>{propData.amenities.includes("Utilities_Included") ? "Utilities included" : Number(propData.utilitiesFee) == 0 ? "Message tenant" : `Around $${propData.utilitiesFee} /month` }</p>
                                        </div>
                                    </div>
                                    <div style={{flexDirection:'row', display:'flex', width:mobile ? '100%' : '40%', alignItems:'center',  marginTop: mobile ? '2vh' : 0}}>
                                        <Diversity3Icon style={{color:'black', fontSize:mobile ? '5vw' : '2.5vw',  color: MEDIUMGREY}} />
                                        <div style={{marginLeft:mobile ? '3vw' : '1vw', marginTop:'auto', marginBottom:'auto',}}>
                                            <p style={{ fontFamily: OPENSANS, fontWeight:'500', marginBottom:0}}>{propData.roommates ? `${propData.numberOfRoommates == 0 || propData.numberOfRoommates == 1 ? `1 Roommate` : `${propData.numberOfRoommates} Roommates`}` : "No roommates"}</p>
                                            <p style={{ fontFamily: OPENSANS, fontWeight:'500', fontSize:"0.8rem", marginBottom:0}}>{propData.roommates ? propData.roommatesGender == "Both" ? "Male and female" : `${propData.roommatesGender} roommate` : "All to yourself"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div style={{flexDirection: mobile ? 'column' : 'row', justifyContent:'space-between', display:'flex', paddingTop:'1vh', paddingBottom:'1vh', alignItems:'center', width:'80%'}}>
                                    <div style={{flexDirection:'row', display:'flex', width:mobile ? '100%' : '40%', alignItems:'center',  marginTop: mobile ? '2vh' : 0}}>
                                        <WifiIcon  style={{color:'black', fontSize:mobile ? '5vw' : '2.5vw', color: MEDIUMGREY}} />
                                        <div style={{marginLeft:mobile ? '3vw' : '1vw', marginTop:'auto', marginBottom:'auto',}}>
                                            <p style={{ fontFamily: OPENSANS, fontWeight:'500', marginBottom:0}}>Wifi</p>
                                            <p style={{ fontFamily: OPENSANS, fontWeight:'500', fontSize:"0.8rem", marginBottom:0}}>{propData.amenities.includes("Wifi") ? `Wifi included` : Number(propData.wifiFee) == 0 ? "Message tenant" : `$${propData.wifiFee} /month`}</p>
                                        </div>
                                    </div>
                                    <div style={{flexDirection:'row', display:'flex', width:mobile ? '100%' : '40%', alignItems:'center',  marginTop: mobile ? '2vh' : 0}}>
                                        <LocalLaundryServiceIcon style={{color:'black', fontSize:mobile ? '5vw' : '2.5vw',  color: MEDIUMGREY}} />
                                        <div style={{marginLeft:mobile ? '3vw' : '1vw', marginTop:'auto', marginBottom:'auto',}}>
                                            <p style={{ fontFamily: OPENSANS, fontWeight:'500', marginBottom:0}}>Washer & Dryer</p>
                                            <p style={{ fontFamily: OPENSANS, fontWeight:'500', fontSize:"0.8rem", marginBottom:0}}>{propData.amenities.includes("Washer_Dryer") ? "In-unit" : propData.WDLocation}</p>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>

                            <div style={{ paddingTop: '4vh', paddingBottom:'4vh',  borderBottomStyle:'solid', borderBottomWidth:0.5, borderColor:'#E0E0E0', flexDirection:'row'}}>
                                <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.2rem', marginBottom: 10}}>Rent payment details</p>
                                <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem', color: "#737373"}}>
                                - {" "}
                                {propData.rentPaymentTime == null ? 
                                    "Please message tenant for rent payment time"
                                :
                                propData.rentPaymentTime == "Other" ?
                                    `Rent payment method provided by tenant: ${propData.otherRentPaymentMethod}` 
                                :
                                propData.rentPaymentTime == "Beginning" ?
                                    "Rent is paid in the beginning of each month"
                                :
                                    "Rent is paid in the end of each month"
                                    }
                                </p>
                                <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem',marginBottom: 0, color: "#737373"}}>
                                    - {" "} {propData.rentPaymentMethod.length == 0 ? "please message tenant for preferred payment method" : `tenent preferred to receive rent through ${getPaymentMethod()}`}
                                </p>
                            </div>
                           
                           
                           
                            <div style={{ paddingTop: '4vh', paddingBottom:'6vh',  borderBottomStyle:'solid', borderBottomWidth:0.5, borderColor:'#E0E0E0', flexDirection:'row'}}>
                                <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.2rem', marginBottom: 10}}>Location</p>
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
                            <div style={{ paddingTop: '4vh', paddingBottom:'5vh', flexDirection:'row',  borderBottomStyle:'solid', borderBottomWidth:0.5, borderColor:'#E0E0E0',}}>
                                <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.3rem', marginBottom: 10}}>Amenities</p>
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
                            <div style={{ paddingTop: '4vh', paddingBottom:'5vh', flexDirection:'row'}}>
                                <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.3rem', marginBottom: 10}}>Still have a questions?</p>
                                <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.1rem', marginBottom: 10, color: SUBTEXTCOLOR}}>Contact {tenantData.firstName}</p>
                                <div style={{ width:mobile ? '100%' : '40vw'}}>
                                    <p style={{fontWeight:'400', fontFamily: OPENSANS, fontSize:'1rem', marginBottom: 10, color: SUBTEXTCOLOR}}>To ensure a safe subleasing experience and to protect your payment, never transfer money or communicate outside of the Crib website.</p>
                                </div>
                                <Button onClick={handleMessageTenantClick} style={{backgroundColor: 'black', textTransform:'none', marginTop:'2vh', height:'6vh', outline: 'none'}}>
                                    {loading ?
                                    <Lottie animationData={WhiteLoadingAnimation} style={{display:'flex', flex:1, color:'white', height:'6vh', preserveAspectRatio: 'xMidYMid slice'}}/>
                                    :
                                    <p style={{marginBottom:0, color:'white', fontWeight:'500'}}>Message current tenant</p> 
                                    }
                                </Button>
                            </div>
                            {
                                mobile &&
                                <div style={{width:'100%', height:'10vh'}}/>
                            }


                        </div>

                        <div style={{ width:'50%', display:mobile ? 'none' : 'block', flexDirection:'row', paddingTop: '2vh', borderWidth:1, borderColor: MEDIUMGREY,}}>
                            <div style={{width:'70%', borderRadius: 15,  boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)', backgroundColor:'white', padding: 25, display:'block',marginLeft:'auto' }}>
                                <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.3rem', marginBottom: '2vh'}}>Send {tenantData.firstName} a request to sublease</p>
                                <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'1.2rem', marginBottom: '2vh', }}>${propData.price}/month</p>
                                <div style={{flexDirection:'row', justifyContent:'space-between', display:'flex'}}>
                                    <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 5,}}>Available from:  {new Date(propData.availableFrom).getTime() < new Date().getTime() ? "Now" : new Date(propData.availableFrom).toLocaleString().split(",")[0]} - {new Date(propData.availableTo).toLocaleString().split(",")[0]}</p>
                                </div>
                                <div style={{flexDirection:'row', display:'flex', marginTop:'4vh', justifyContent:'space-between'}}>
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
                                {/* <div style={{marginTop:'2vh'}}>
                                    <TextField value={requestMessage} onChange={(val) => setRequestMessage(val.target.value)} helperText={`The more detailed the better`} multiline fullWidth label={`Tell ${tenantData.firstName} a bit about yourself`} rows={2} />
                                </div> */}

                                <div>
                                    

                                </div>

            
                                <div style={{marginTop:'2vh'}}>
                                    <div style={{flexDirection: 'row', }}>
                                        <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.3rem', marginBottom: 10}}>Payment summary</p>
                                    </div>
                                    <div style={{flexDirection:'row', marginTop:'2vh', justifyContent:'space-between', display:'flex'}}>
                                        <p style={{fontFamily:OPENSANS, fontWeight:'500', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>Security deposit</p>
                                        <p style={{fontFamily:OPENSANS, fontWeight:'500', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>${propData.securityDeposit == undefined || propData.securityDeposit == null ? "0" : propData.securityDeposit}</p>
                                    </div>
                                   
                                    <div style={{flexDirection:'row', marginTop:'2vh', justifyContent:'space-between', display:'flex'}}>
                                        <p style={{fontFamily:OPENSANS, fontWeight:'500', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>Toal rent</p>
                                        <p style={{fontFamily:OPENSANS, fontWeight:'500', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>{getRent()}</p>
                                    </div>
                                    {/* <div style={{flexDirection:'row', marginTop:'2vh', justifyContent:'space-between', display:'flex'}}>
                                        <p style={{fontFamily:OPENSANS, fontWeight:'500', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>Service fees (5% of total rent)</p>
                                        <p style={{fontFamily:OPENSANS, fontWeight:'500', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>{getFees()}</p>
                                    </div> */}
                                </div>
                                <Button onClick={requestToBook} fullWidth style={{backgroundColor: PRIMARYCOLOR, textTransform:'none', marginTop:'3vh', height:'6vh', outline: 'none'}}>
                                    {loading ?
                                    <Lottie animationData={WhiteLoadingAnimation} style={{display:'flex', flex:1, color:'white', height:'6vh', preserveAspectRatio: 'xMidYMid slice'}}/>
                                    :
                                    <p style={{marginBottom:0, color:'white', fontWeight:'600'}}>Request to book</p> 
                                    }
                                </Button>
                                <p style={{marginTop:'2vh', fontSize:'0.8rem', fontFamily: OPENSANS, textAlign:'center', marginBottom:0}}>No fees required to request.</p>
                                {/* <div style={{width:'100%', borderTopWidth:'0.5px', borderTopColor: LIGHTGREY, borderTopStyle:'solid', marginTop:'2vh'}}>
                                    <div style={{flexDirection:'row', marginTop:'2vh', justifyContent:'space-between', display:'flex'}}>
                                        <p style={{fontFamily:OPENSANS, fontWeight:'700', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>Total</p>
                                        <p style={{fontFamily:OPENSANS, fontWeight:'700', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>{getRent()}</p>
                                    </div>
                                    <p style={{marginTop:'2vh', fontSize:'0.8rem', fontFamily: OPENSANS}}>No fees required to request. You will be able to message the tenant after you request.</p>
                                </div> */}

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
                <div style={{width:'100%', height:'78vh', paddingLeft: mobile ? '5vw' : '2.5vw', paddingRight:  mobile ? '5vw' : '2.5vw', paddingTop: '3vh', overflow:'scroll', paddingBottom: '15vh'}}>
                    <p onClick={()=> setMobilePage(0)} style={{textDecorationLine:'underline', fontFamily: OPENSANS, fontWeight:'600', color: SUBTEXTCOLOR, fontSize:'0.9rem', marginBottom:0}}>Back to listing</p>
                    <>
                        <div style={{paddingTop:'4vh', paddingBottom:'4vh', borderBottomWidth:'1px', borderBottomColor: LIGHTGREY, borderBottomStyle:'solid'}}>
                            <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.4rem',}}>Sublease details</p>
                            <div style={{position:'relative', display:'flex', flexDirection:'row'}}>
                                {/* <img src={propData.imgList[0]} style={{width:'100%', height:'25vh', borderRadius: MEDIUMROUNDED, objectFit: 'cover'}}/> */}
                                <div style={{width:"50%"}}>
                                    <img src={propData.imgList[0]} style={{width:'40vw', height:'15vh', borderRadius: MEDIUMROUNDED, objectFit: 'cover'}}/>
                                </div>
                                <div style={{width:"50%", display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                                    <div> 
                                        <p style={{fontSize:'0.9rem', fontFamily: OPENSANS, fontWeight:'500', marginBottom:0}}>{propData.type}</p>
                                        <p style={{fontSize:'0.9rem', fontFamily: OPENSANS, fontWeight:'500', marginBottom:0}}>{propData.loc.streetAddr}</p>
                                    </div>
                                    <div>
                                        <p style={{fontSize:'0.9rem', fontFamily: OPENSANS, fontWeight:'500', marginBottom:0, color: SUBTEXTCOLOR}}>{new Date(propData.availableFrom).getTime() < new Date().getTime() ? "Now" : new Date(propData.availableFrom).toLocaleString().split(",")[0]} - {new Date(propData.availableTo).toLocaleString().split(",")[0]}</p>
                                    </div>
                                    <div>
                                        <p style={{fontSize:'0.9rem', fontFamily: OPENSANS, fontWeight:'600', marginBottom:0}}>${propData.price} /month</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{paddingTop:'4vh', paddingBottom:'4vh', borderBottomWidth:'1px', borderBottomColor: LIGHTGREY, borderBottomStyle:'solid'}}>
                            <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.4rem',}}>Request details</p>
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
                                <TextField value={requestMessage} onChange={(val) => setRequestMessage(val.target.value)} helperText={`The more detailed the better`} multiline fullWidth label={`Tell ${tenantData.firstName} a bit about yourself`} rows={6} />
                            </div>
                        </div>
                        <div style={{paddingTop:'4vh', paddingBottom:'4vh', borderBottomWidth:'1px', borderBottomColor: LIGHTGREY, borderBottomStyle:'solid'}}>
                           
                            <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.4rem',}}>Payment details:</p>
                            <div style={{flexDirection:'column', display:'flex', justifyContent:'space-between', marginTop:'2vh'}}>
                                <p style={{fontWeight:'400', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 0}}>
                                {propData.rentPaymentTime == null ?
                                    "- Please message tenant to ask about when is rent paid"
                                    :
                                    `- ${propData.rentPaymentTime == "Other" ? `Following is tenant's preferred rent payemnt time: ${propData.otherRentPaymentMethods}` : `Rent is paid in the ${propData.rentPaymentTime.toLowerCase()} of each month`}`
                                
                                }
                                </p>
                                <p style={{fontWeight:'400', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 0, marginTop:'1vh'}}>
                                    {
                                    propData.rentPaymentMethod.length == 0 ?
                                    "- Please message tenant for preferred rent payment method"
                                    :
                                    `- Tenant's preferred rent payment method: ${getRentPaymentMethods()}`
                                    }
                                </p>
                            </div>
                           
                        </div>
                        
                        <div style={{paddingTop:'4vh', paddingBottom:'4vh', borderBottomWidth:'1px', borderBottomColor: LIGHTGREY, borderBottomStyle:'solid'}}>
                            <div style={{flexDirection: 'row', }}>
                                <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.4rem',}}>Rent Summary</p>
                            </div>
                            <div style={{flexDirection:'row', marginTop:'2vh', justifyContent:'space-between', display:'flex'}}>
                                <p style={{fontFamily:OPENSANS, fontWeight:'500', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>Security deposit</p>
                                <p style={{fontFamily:OPENSANS, fontWeight:'500', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>${propData.securityDeposit == undefined || propData.securityDeposit == null ? "0" : propData.securityDeposit}</p>
                            </div>
                            
                            {/* <div style={{flexDirection:'row', marginTop:'2vh', justifyContent:'space-between', display:'flex'}}>
                                <p style={{fontFamily:OPENSANS, fontWeight:'500', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>Toal rent</p>
                                <p style={{fontFamily:OPENSANS, fontWeight:'500', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>{getRent()}</p>
                            </div> */}
                            {/* <div style={{flexDirection:'row', marginTop:'2vh', justifyContent:'space-between', display:'flex'}}>
                                <p style={{fontFamily:OPENSANS, fontWeight:'500', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>Service fees (5% of total rent)</p>
                                <p style={{fontFamily:OPENSANS, fontWeight:'500', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>{getFees()}</p>
                            </div> */}
                        </div>
                        <div style={{width:'100%', marginTop:'2vh'}}>
                            <div style={{flexDirection:'row', marginTop:'2vh', justifyContent:'space-between', display:'flex'}}>
                                <p style={{fontFamily:OPENSANS, fontWeight:'700', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>Total rent</p>
                                <p style={{fontFamily:OPENSANS, fontWeight:'700', marginBottom:0, color: MEDIUMGREY, fontSize:'0.9rem'}}>{getRent()}</p>
                            </div>
                            <p style={{marginTop:'2vh', fontSize:'0.8rem', fontFamily: OPENSANS}}>No fees required to request to book. The total rent amount is shown for your convenience.</p>
                        </div>
                    </>
                   
                </div>
                }
                {
                    mobile &&
                    <div style={{height:'10vh', borderTopWidth:'1px', borderTopStyle:'solid', borderTopColor: EXTRALIGHT, paddingLeft:'5vw', paddingRight:'5vw', alignItems:'center', display:'flex', justifyContent:'space-between', position:'absolute', bottom: '-0.5vh',  width:'100%', zIndex:999, backgroundColor:'white'}}>
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
            <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize:'1.3rem', marginBottom: '2vh',}}>Request successfully sent!</p>
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
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={requestConfirmationModalVis}
        onClose={()=> setRequestConfirmationModalVis(false)}
        closeAfterTransition
       
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={requestConfirmationModalVis}>
          <div 
            style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: mobile ? '90vw' : '35vw',
            height:'auto',
            backgroundColor:'white',
            padding: mobile ? '4vw' : '2vw',
            borderRadius: MEDIUMROUNDED,
            display:'flex',
            
            flexDirection:'column',
            }}>
            { requestConfirmationPage == 0 ?
                <>
                    <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.3rem', marginBottom: 5,}}>Let's confirm your email first</p>
                    <p style={{fontWeight:'400', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: '2vh',}}>We will send a verification code to your email</p>
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between', alignItems:"center", }}>
                        <TextField value={confirmationEmail} onChange={(val)=>setConfirmationEmail(val.target.value)} label="Email" fullWidth style={{marginTop:"4vh"}}/>
                        <Button onClick={sendEmailVerification} variant="contained" fullWidth style={{backgroundColor:'black', textTransform:'none', fontSize:'0.9rem', height:'6vh', marginBottom:0, outline:'none', marginTop:"2vh"}}>
                            <p style={{marginBottom:0}}>Continue</p>
                        </Button>
                    </div>
                </>
                :
                <>
                    <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.3rem', marginBottom: 5,}}>Enter verification code</p>
                    <p style={{fontWeight:'400', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: '2vh',}}>If you didn't receive an email, please check spam/junk for confirmation code</p>
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between', alignItems:"center", }}>
                        <TextField label="6 digit code" type="number" value={verificationCode} onChange={(val)=> setVerificationCode(val.target.value)} fullWidth style={{marginTop:"4vh"}}/>
                        <Button onClick={verifyEmail} variant="contained" fullWidth style={{backgroundColor:'black', textTransform:'none', fontSize:'0.9rem', height:'6vh', marginBottom:0, outline:'none', marginTop:"2vh"}}>
                            <p style={{marginBottom:0}}>Verify</p>
                        </Button>
                    </div>
                    <p onClick={()=>setRequestConfirmationPage(0)} style={{fontWeight:'400', fontSize:'0.9rem', marginTop:'2vh', cursor:'pointer'}}>Edit email</p>
                </>

            }
            </div>
        </Fade>
    </Modal>
    <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={requestDetailsConfirmationModalVis}
        onClose={()=> setRequestDetailsConfirmationModalVis(false)}
        closeAfterTransition
       
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={requestDetailsConfirmationModalVis}>
          <div 
            style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: mobile ? '90vw' : '35vw',
            height:'auto',
            backgroundColor:'white',
            padding: mobile ? '4vw' : '2vw',
            borderRadius: MEDIUMROUNDED,
            display:'flex',
            
            flexDirection:'column',
            }}>
                
                <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.2rem', marginBottom: 0}}>Confirm request details</p>
                <p style={{fontWeight:'400', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 0}}>You're one step away from requesting this sublease</p>
                {propData != null &&
                <>
                    <div style={{padding:'2vh', borderRadius: MEDIUMROUNDED, borderColor: LIGHTGREY, borderWidth:'1px', borderStyle:'solid', marginTop:'4vh'}}>
                        <p style={{marginBottom:'1vh', fontFamily: OPENSANS, fontSize:'1rem', fontWeight:'600'}}>Sublease location</p>    
                        <p style={{marginBottom:0, fontFamily: OPENSANS, fontSize:'0.9rem', fontWeight:'400'}}>{propData.loc.streetAddr}</p>    
                    </div>    
                    <div style={{padding:'2vh', borderRadius: MEDIUMROUNDED, borderColor: LIGHTGREY, borderWidth:'1px', borderStyle:'solid', marginTop:'2vh'}}>
                        <p style={{marginBottom:'1vh', fontFamily: OPENSANS, fontSize:'1rem', fontWeight:'600'}}>Requested dates</p>    
                        <p style={{marginBottom:0, fontFamily: OPENSANS, fontSize:'0.9rem', fontWeight:'400'}}>{new Date(requestStart).toLocaleDateString().split(",")[0]} - {new Date(requestEnd).toLocaleDateString().split(",")[0]}</p>    
                    </div>  
                </>  
                }
           
                <div style={{ marginTop:'4vh', width:'100%'}}>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                        <Checkbox onChange={()=>setRequestConfirmationCheckbox(!requestConfirmationCheckbox)} checked={requestConfirmationCheckbox} style={{cursor:'pointer', color:'black'}} />
                        <p style={{marginBottom:0,  color: '#737373', fontWeight:'400', fontSize:'0.8rem',}}>By clicking the checkbox, you are agreeing to our terms of services and privacy details</p>
                    </div>
                    <Button fullWidth onClick={sendSubleaseRequest} variant="contained" style={{backgroundColor:'black', outline:'none', textTransform:'none', height: mobile ? '6vh' : '5vh', marginTop:'2vh'}}>
                        <p style={{marginBottom:0, fontFamily: OPENSANS, fontSize:'0.8rem', fontWeight:'600'}}>Confirm request</p>
                    </Button>
                    <Button fullWidth onClick={()=>setRequestDetailsConfirmationModalVis(false)}  style={{ boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.2)', color:'black', borderColor:'black' , outline:'none', textTransform:'none', height: mobile ? '6vh' : '5vh', marginTop:'2vh'}}>
                        <p style={{marginBottom:0, fontFamily: OPENSANS, fontSize:'0.8rem', fontWeight:'600'}}>Edit</p>
                    </Button>
                </div>
            </div>

        </Fade>
    </Modal>


        </LocalizationProvider>
    )
}