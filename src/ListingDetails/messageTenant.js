import { Button, Fade, FormControl, InputLabel, MenuItem, Modal, Select, TextField } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { EXTRALIGHT, LIGHTGREY, MEDIUMROUNDED, OPENSANS, PRIMARYCOLOR, SUBTEXTCOLOR } from "../sharedUtils"
import { UserContext } from "../UserContext"

//Date picker 
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers"

import Lottie from "lottie-react";
import WhiteLoadingAnimation from '../whiteLoading.json'
import SubleaseRequestSent from './subleaseRequestSent.json'


export default function MessageTenantScreen(){
    const {mobile} = useContext(UserContext)
    const {id} = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const [userData, setUserData] = useState(null)
    const [propData,setPropData] = useState(null)
    const [tenantData,setTenantData] = useState(null)
    const [message, setMessage] = useState("")

    const [subleaseStart, setSubleaseStart] = useState(null)
    const [subleaseEnd, setSubleaseEnd] = useState(null)
    const [numberOfOccupants, setNumberOfOccupants] = useState(1)

    //Email confirmation 
    const [requestConfirmationPage, setRequestConfirmationPage] = useState(0)
    const [confirmationEmail, setConfirmationEmail] = useState("")
    const [verificationCode, setVerificationCode] = useState("")

    //Modals 
    const [requestConfirmationModalVis, setRequestConfirmationModalVis] = useState(false)
    const [requestDetailsConfirmationModalVis,setRequestDetailsConfirmationModalVis] = useState(false)

    const [requestSuccessModal, setRequestSuccessModal] = useState(false)


    useEffect(()=> {
        getToken()
        fetchPropData()
    }, [])

    async function handleSendMessageClick(){
       
        //Check start and end date
        let requestS = new Date(subleaseStart).getTime()
        let subleaseS = new Date(propData.availableFrom).getTime()
        
        if(requestS < new Date().getTime() || (requestS < subleaseS && subleaseS - requestS > 1000*60*60*24)){
            alert("Sublease unavailable on requested start date!")
            return;
        }

        let requestE = new Date(subleaseEnd).getTime()
        let subleaseE = new Date(propData.availableTo).getTime()
       

        if(requestE > subleaseE || (requestE - subleaseE > 1000*60*60*24)){
            alert("Sublease unavailable on requested end date!")
            return;
        }

        //Check if the length of the message is 0

        if(message.trim().length == 0){
            alert("Please include a message to the tenant.")
            return
        }

        //Double check the email verification
        if(userData.emailVerified == undefined || userData.emailVerified == false){
            setRequestConfirmationModalVis(true)
            return
        }

        //Create the request 
        sendSubleaseRequest()
        setLoading(false)




        //Send the message

    }

    function handleSuccessSentClose(){

    }

    function handleNav(route){
        setRequestSuccessModal(false)
        navigate(route)
    }

    async function getToken(){
        let at = localStorage.getItem("refreshToken")
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
                "startDate": new Date(subleaseStart),
                "endDate": new Date(subleaseEnd),
                "about": message,
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
                    setSubleaseStart(null)
                    setSubleaseEnd(null)
                    setMessage("")
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

    function sendEmailVerification(){
        // let uid = localStorage.getItem("uid")
        // let at = localStorage.getItem("accessToken")
        // console.log(uid)
        // console.log(at)

        setLoading(true)

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
            setLoading(false)
            setRequestConfirmationPage(1)
        })
        .catch( e => {
            alert("Invalid email. Please enter a valid email before verification.")
            setLoading(false)
            setRequestConfirmationPage(0)
        })
    }

    async function verifyEmail(){
        
        setLoading(true)
        let USERID = localStorage.getItem("uid")
        let at = localStorage.getItem("accessToken")
        console.log("ACCESSTOKEN", at)
        if(verificationCode.length != 6){
            alert("Please enter a valid verification code")
            return
        }
        await fetch('https://crib-llc.herokuapp.com/users/verifyEmailVerifcationCode', {
            method:'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": confirmationEmail,
                "code": verificationCode,
                "userId": USERID
            })
        })
        .then(async res => {
            console.log(res)
            let data = await res.json()
            console.log(data)
            if(data.data.valid == true){
                await fetch('https://crib-llc.herokuapp.com/users/' + USERID, {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + at,
                    },
                    body: JSON.stringify({
                        "emailVerified": true,
                        "email": confirmationEmail
                    })
                }).then((res) => {
                    setTimeout(() => {
                        setLoading(false)
                        setRequestConfirmationModalVis(false)
                        sendSubleaseRequest()
                    }, 2000);
                })
                .catch((error) => {
        
                });
                 
            }
            else{
                alert("Invalid code, please try again.")
                setLoading(false)
                setVerificationCode("")
            }
            // if(res.status == 200){
            //     setTimeout(() => {
            //         setLoading(false)
            //         setRequestConfirmationModalVis(false)
            //         setRequestDetailsConfirmationModalVis(true)
            //     }, 2000); 
            // }
            // else{
            //     alert("Invalid code, please try again.")
            //     setLoading(false)
            //     setVerificationCode("")
            // }
        })
        .catch( e => console.log("Error"))
        
    }

    async function fetchPropData(){
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

    function getRentPaymentMethods(){
        let s = ""

        propData.rentPaymentMethod.forEach(item => {
            s = s + item + ", "
        })

        return s.substring(0, s.length-2)
    }

    function getRent(){ 
        if(subleaseStart == null || subleaseEnd == null){
            return "TBD"
        }

        let sd = new Date(subleaseStart).getTime()
        let ed = new Date(subleaseEnd).getTime()

        let months = (ed -sd) / (1000*60*60*24*31)

        return "$" + (months * propData.price).toFixed(2)
    }

    return(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div style={{width:'100vw', height: mobile ? 'auto' : "90vh", paddingLeft:"5%", paddingRight:'5%', flexDirection: mobile ? 'column-reverse' : 'row', display:'flex', paddingTop:'5vh'}}>
            {propData != null &&
            <>
            <div style={{width: mobile ? '100%' : '50%', height:'100%',}}>
                <p onClick={()=> navigate(-1)} style={{textDecorationLine:'underline', fontFamily: OPENSANS, fontWeight:'600', color: SUBTEXTCOLOR, fontSize:'0.9rem', marginBottom:0, cursor:'pointer', display: mobile ? 'none' : 'block'}}>Back to listing</p>
                <div style={{marginTop:"3vh", borderBottomWidth:"1px",}}>
                    <div style={{flexDirection:'row', justifyContent:'space-between', display:'flex', paddingTop:'4vh', paddingBottom:'4vh', borderBottomWidth:'1px',borderBottomColor: EXTRALIGHT, borderBottomStyle:"solid"}}>
                        <div style={{marginTop:'auto', marginBottom:'auto'}}>
                            <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize:'1.3rem', marginBottom: 10}}>Contact current tenant, {tenantData.firstName}</p>
                            <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem',marginBottom: 10, color: "#737373"}}>{tenantData.school}</p>
                            <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 0, color: "#737373"}}>{tenantData.occupation}</p>
                        </div>
                        <img src={tenantData.profilePic} style={{height:mobile ? '8vh' : '10vh', width: mobile ? '8vh' : '10vh', borderRadius: mobile ? '4vh' : '5vh', objectFit:'cover'}} />
                    </div>
                    <div style={{ paddingTop:'4vh', paddingBottom:'4vh', borderBottomWidth:'1px',borderBottomColor: EXTRALIGHT, borderBottomStyle:"solid"}}>
                        <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.1rem', marginBottom: 0, }}>Most tenants ask:</p>

                        <div style={{marginTop:"4vh"}}>
                            <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1rem', marginBottom: 0, }}>Is the apartment furnished?</p>
                            <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 0, color: SUBTEXTCOLOR, marginTop:'1vh'}}>{
                                propData.bed == 0 ?
                                "- There are no mattresses in the apartment."
                                :
                                `- There will be ${propData.bed > 1  ?  propData.bed + " beds available" : "1 bed available"}`
                            }</p>
                            {propData.amenities.includes("Pots_Pans") &&
                            <p style={{fontWeight:'400', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 0, color: SUBTEXTCOLOR, marginTop:'1vh'}}>          
                                - There are pots and pans available in the apartment.
                            </p>
                            }
                        </div>
                        <div style={{marginTop:"4vh"}}>
                            <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1rem', marginBottom: 0, }}>Are utilities and WiFi included?</p>
                            <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 0, color: SUBTEXTCOLOR, marginTop:'1vh'}}>{
                                propData.amenities.includes("Utilities_included") ?
                                "- Utilities is included in rent"
                                :
                                `- Utilities is not included, ${ Number(propData.utilitiesFee) == 0 ? "please message tenant for average utilities fee" : `average utilities per month is $${propData.utilitiesFee}`}`
                            }</p>
                            <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 0, color: SUBTEXTCOLOR, marginTop:'1vh'}}>{
                                propData.amenities.includes("Wifi") ?
                                "- Wifi is included in rent"
                                :
                                `- Wifi is not included, ${ Number(propData.wifiFee) == 0 ? "please message tenant for monthly wifi fee." : `monlty wifi fee is $${propData.wifiFee}`}`
                            }</p>
                        </div>
                        <div style={{marginTop:"4vh"}}>
                            <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1rem', marginBottom: 0, }}>How would rent be paid?</p>
                            <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 0, color: SUBTEXTCOLOR, marginTop:'1vh'}}>{
                                propData.rentPaymentTime == null ?
                                "- Please message tenant to ask about when is rent paid"
                                :
                                `- ${propData.rentPaymentTime == "Other" ? `Following is tenant's preferred rent payemnt time: ${propData.otherRentPaymentMethods}` : `Rent is paid in the ${propData.rentPaymentTime.toLowerCase()} of each month`}`
                            }</p>
                            <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 0, color: SUBTEXTCOLOR, marginTop:'1vh'}}>
                                {
                                propData.rentPaymentMethod.length == 0 ?
                                "- Please message tenant for preferred rent payment method"
                                :
                                `- Tenant's preferred rent payment method: ${getRentPaymentMethods()}`
                                }
                            </p>
                        </div>
                    </div>
                    <div style={{ paddingTop:'4vh', paddingBottom:'4vh', borderBottomWidth:'1px',borderBottomColor: EXTRALIGHT, borderBottomStyle:"solid"}}>
                        <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.1rem', marginBottom: 0, }}>Still have a question?</p>
                        <div style={{width:'100%', display: mobile ? 'flex' : 'none', flexDirection:'column'}}>
                            <div style={{flexDirection:'row', display:'flex', marginTop:'4vh', justifyContent:'space-between'}}>
                                <div style={{width:'47.5%'}}>
                                    <DatePicker
                                    label="Start date"
                                    value={dayjs(subleaseStart)}
                                    onChange={(event)=>                                
                                        setSubleaseStart(event)
                                    }
                                    slotProps={{ textField: {error:false, } }}
                                    />
                                </div>
                                <div style={{width:'47.5%'}}>
                                    <DatePicker
                                    label="End date"
                                    value={dayjs(subleaseEnd)}
                                    onChange={(event)=> setSubleaseEnd(event)}
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
                        </div>
                        <div style={{marginTop:'2vh'}}>
                            <TextField value={message} onChange={(val) => setMessage(val.target.value)} helperText={`The more detailed the better`} multiline fullWidth label={`Message`} rows={6} />
                        </div>
                        <div style={{marginTop:'2vh'}}>
                            <Button onClick={handleSendMessageClick} disabled={loading} variant="contained" style={{backgroundColor:"black", textTransform:'none', color:'white', outline:'none'}}>
                                {loading ? 
                                <Lottie animationData={WhiteLoadingAnimation} style={{display:'flex', flex:1, color:'white', height:'6vh', preserveAspectRatio: 'xMidYMid slice'}}/>
                                :
                                <p style={{marginBottom:0}}>Send message</p>
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{width:mobile ? '100%' : '50%', height:'100%'}}>
                <p onClick={()=> navigate(-1)} style={{textDecorationLine:'underline', fontFamily: OPENSANS, fontWeight:'600', color: SUBTEXTCOLOR, fontSize:'0.9rem', marginBottom:0, cursor:'pointer', display: !mobile ? 'none' : 'block'}}>Back to listing</p>

                <div style={{width: mobile ? '100%' : '70%', borderRadius: 15,  boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)', backgroundColor:'white', padding: 25, display:'block',marginLeft:'auto', marginTop: mobile ? '5vh' : 0 }}>
                    <div style={{display:'flex', flexDirection:'row', borderBottomWidth:'1px', borderBottomColor: EXTRALIGHT, borderBottomStyle:'solid', paddingBottom:'4vh'}}>
                        <img src={propData.imgList[0]} style={{height: mobile ? '30vw' : '10vw', width:  mobile ? '30vw' : '10vw', borderRadius: MEDIUMROUNDED}} />
                        <div style={{flexDirection:'column', display:'flex', marginLeft:'2vw', height: mobile ? '30vw' : '10vw', justifyContent:'space-between', flexDirection:'column'}}>
                            <div style={{display:'flex',  flexDirection:'column'}}>
                                <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 5,}}><span style={{fontWeight:'600'}}>{propData.type}</span></p>
                                <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 5,}}>{propData.loc.streetAddr}</p>
                                <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 5,}}>${propData.price} /month</p>
                            </div>
                            <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 5,}}>Current tenant, {tenantData.firstName}</p>
                        </div>
                    </div>
                    <div style={{paddingTop:'4vh',paddingBottom:'4vh',  borderBottomWidth:'1px', borderBottomColor: EXTRALIGHT, borderBottomStyle:'solid', display: mobile ? 'none' : 'flex', flexDirection:'column'}}>
                        <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'1.1rem', marginBottom: 5,}}>Sublease details</p>
                        <div style={{flexDirection:'row', display:'flex', marginTop:'4vh', justifyContent:'space-between'}}>
                            <div style={{width:'47.5%'}}>
                                <DatePicker
                                label="Start date"
                                value={dayjs(subleaseStart)}
                                onChange={(event)=>                                
                                    setSubleaseStart(event)
                                }
                                slotProps={{ textField: {error:false, } }}
                                />
                            </div>
                            <div style={{width:'47.5%'}}>
                                <DatePicker
                                label="End date"
                                value={dayjs(subleaseEnd)}
                                onChange={(event)=> setSubleaseEnd(event)}
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
                    </div>
                    <div style={{paddingTop:'4vh',}}>
                        <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'1.1rem', marginBottom: 5,}}>Payment details</p>
                        <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'2vh'}}>
                            <p style={{fontWeight:'400', fontFamily: OPENSANS, fontSize:'0.8rem', marginBottom: 0}}>Security deposit</p>
                            <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.8rem', marginBottom: 0,}}>${propData.securityDeposit == null ? "0" : propData.securityDeposit }</p>
                        </div>
                        <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'2vh'}}>
                            <p style={{fontWeight:'400', fontFamily: OPENSANS, fontSize:'0.8rem', marginBottom: 0}}>Rent total</p>
                            <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.8rem', marginBottom: 0,}}>{getRent()}</p>
                        </div>

                    </div>
                   
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
                                        <Button disabled={loading} onClick={sendEmailVerification} variant="contained" fullWidth style={{backgroundColor:'black', textTransform:'none', fontSize:'0.9rem', height:'6vh', marginBottom:0, outline:'none', marginTop:"2vh"}}>
                                            {loading ? 
                                            <Lottie animationData={WhiteLoadingAnimation} style={{display:'flex', flex:1, color:'white', height:'6vh', preserveAspectRatio: 'xMidYMid slice'}}/>
                                            :
                                            <p style={{marginBottom:0}}>Continue</p>
                                            }
                                        </Button>
                                    </div>
                                </>
                                :
                                <>
                                    <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.3rem', marginBottom: 5,}}>Enter verification code</p>
                                    <p style={{fontWeight:'400', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: '2vh',}}>If you didn't receive an email, please check spam/junk for confirmation code</p>
                                    <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between', alignItems:"center", }}>
                                        <TextField label="6 digit code" type="number" value={verificationCode} onChange={(val)=> setVerificationCode(val.target.value)} fullWidth style={{marginTop:"4vh"}}/>
                                        <Button disabled={loading} onClick={verifyEmail} variant="contained" fullWidth style={{backgroundColor:'black', textTransform:'none', fontSize:'0.9rem', height:'6vh', marginBottom:0, outline:'none', marginTop:"2vh"}}>
                                            {loading ? 
                                            <Lottie animationData={WhiteLoadingAnimation} style={{display:'flex', flex:1, color:'white', height:'6vh', preserveAspectRatio: 'xMidYMid slice'}}/>
                                            :
                                            <p style={{marginBottom:0}}>Verify</p>
                                            }
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
                        open={requestSuccessModal}
                        onClose={handleSuccessSentClose}
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
                    {/* <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.3rem', marginBottom: '2vh'}}>Send {tenantData.firstName} a request to sublease</p>
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
                    
                    </div>
                    <Button onClick={requestToBook} fullWidth style={{backgroundColor: PRIMARYCOLOR, textTransform:'none', marginTop:'3vh', height:'6vh', outline: 'none'}}>
                        {loading ?
                        <Lottie animationData={WhiteLoadingAnimation} style={{display:'flex', flex:1, color:'white', height:'6vh', preserveAspectRatio: 'xMidYMid slice'}}/>
                        :
                        <p style={{marginBottom:0, color:'white', fontWeight:'600'}}>Request to book</p> 
                        }
                    </Button>
                    <p style={{marginTop:'2vh', fontSize:'0.8rem', fontFamily: OPENSANS, textAlign:'center', marginBottom:0}}>No fees required to request.</p>
                */}

                </div>
            </div>
            </>
            }

        </div>
        </LocalizationProvider>
    )
}