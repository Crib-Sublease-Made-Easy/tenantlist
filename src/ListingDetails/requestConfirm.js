import { Button, Fade, FormControl, InputLabel, MenuItem, Modal, Select, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EXTRALIGHT, LIGHTGREY, MEDIUMGREY, MEDIUMROUNDED, OPENSANS, PRIMARYCOLOR, SUBTEXTCOLOR } from "../sharedUtils";

import SubleaseRequestSent from './subleaseRequestSent.json'



//Date picker 

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers"


//Icon 
import CloseIcon from '@mui/icons-material/Close';

import Lottie from "lottie-react";
import WhiteLoadingAnimation from '../whiteLoading.json'

import { UserContext } from "../UserContext";

export default function RequestSubleaseConfirmScreen(){
    const navigate = useNavigate()
    const {mobile} = useContext(UserContext)
    const {id, startDate, endDate, numberOfOccupants } = useParams()
    const [propData, setPropData] = useState(null)
    const [tenantData, setTenantData] = useState(null)

    const [confirmStart, setConfirmStart] = useState(new Date(Number(startDate)).getTime())
    const [confirmEnd, setConfirmEnd] = useState(new Date(Number(endDate)).getTime())
    const [confirmOccupants, setConfirmOccupants] = useState(numberOfOccupants)
    const [requestDetailsConfirmationModalVis, setRequestDetailsConfirmationModalVis] = useState(false)
    const [requestConfirmationModalVis, setRequestConfirmationModalVis] = useState(false)
    const [requestConfirmationPage, setRequestConfirmationPage] = useState(0)
    const [verificationCode, setVerificationCode] = useState("")
    const [loading, setLoading] = useState(false)

    const [requestSuccessModal, setRequestSuccessModal] = useState(false)




    //Edit Date Modal 
    const [editDateModalVis, setEditDateModalVis] = useState(false)
    const [editOccupantsModalVis, setEditOccupantsModalVis] = useState(false)

    const [message, setMessage] = useState("")


    //Check if user email is correct and verified
    const [confirmationEmail, setConfirmationEmail] = useState("")
    const [userData, setUserData] = useState(null)

    


    useEffect(()=> {
        fetchPropData()
        fetchUserData()
    }, [])

    function getRentPaymentMethods(){
        let s = ""

        propData.rentPaymentMethod.forEach(item => {
            s = s + item + ", "
        })

        return s.substring(0, s.length-2)
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
                "startDate": new Date(confirmStart),
                "endDate": new Date(confirmEnd),
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
                setRequestSuccessModal(true)
                setLoading(false)
                
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
                        setRequestDetailsConfirmationModalVis(true)
                        setLoading(false)
                        setRequestConfirmationModalVis(false)
                        
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

    function getRent(){ 
        let sd = new Date(confirmStart).getTime()
        let ed = new Date(confirmEnd).getTime()

        let months = (ed -sd) / (1000*60*60*24*31)

        return "$" + (months * propData.price).toFixed(2)
    }

    function handleNav(route){
        setRequestSuccessModal(false)
        navigate(route)
    }

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
    
    function handleSuccessSentClose(){
        setRequestSuccessModal(false)
        navigate(-1)
    }
    function handleConfirmRequestClick(){

        //Check start and end date
        let requestS = new Date(confirmStart).getTime()
        let subleaseS = new Date(propData.availableFrom).getTime()
        
        if(requestS < new Date().getTime() || (requestS < subleaseS && subleaseS - requestS > 1000*60*60*24)){
            alert("Sublease unavailable on requested start date!")
            return;
        }

        let requestE = new Date(confirmEnd).getTime()
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

        //Confirm dates and occupants before sending it to the tenant
        setRequestDetailsConfirmationModalVis(true)
    }

    return(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div style={{width:'100vw', height: mobile ? 'auto' : "90vh", paddingLeft:"5%", paddingRight:'5%', flexDirection: mobile ? 'column-reverse' : 'row', display:'flex', paddingTop:'5vh', }}>
            {propData != null && tenantData != null && userData != null &&
            <>
                <div style={{width: mobile ? '100%' : '50%', height:'100%',}}>
                    <p onClick={()=> navigate(-1)} style={{textDecorationLine:'underline', fontFamily: OPENSANS, fontWeight:'600', color: SUBTEXTCOLOR, fontSize:'0.9rem', marginBottom:0, cursor:'pointer', display: mobile ? 'none' : 'flex'}}>Back to listing</p>
                    <div style={{marginTop:"3vh", borderBottomWidth:"1px", borderBottomColor: LIGHTGREY, borderBottomStyle:"solid", paddingBottom:"4vh"}}>
                        <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'1.2rem', marginBottom: 0, }}>Confirm sublease details</p>
                        <div style={{marginTop:"2vh"}}>
                            <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'1rem', marginBottom: 0}}>Dates:</p>
                            <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'1vh'}}>
                                <p style={{fontWeight:'400', fontFamily: OPENSANS, fontSize:'0.8rem', marginBottom: 0}}>{new Date(Number(confirmStart)).toLocaleDateString()} - {new Date(Number(confirmEnd)).toLocaleDateString()}</p>
                                <p onClick={()=> setEditDateModalVis(true)} style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.8rem', marginBottom: 0, textDecorationLine:'underline', cursor:"pointer"}}>Edit</p>
                            </div>

                            <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'1rem', marginBottom: 0, marginTop:'4vh'}}>Number of occupants:</p>
                            <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'1vh'}}>
                                <p style={{fontWeight:'400', fontFamily: OPENSANS, fontSize:'0.8rem', marginBottom: 0}}>{confirmOccupants}</p>
                                <p onClick={()=> setEditOccupantsModalVis(true)} style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.8rem', marginBottom: 0, textDecorationLine:'underline', cursor:'pointer'}}>Edit</p>
                            </div>   
                        </div>
                    </div> 
                    <div style={{paddingTop:"4vh", paddingBottom:'4vh', borderBottomWidth:"1px", borderBottomColor: LIGHTGREY, borderBottomStyle:"solid",}}>
                        <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'1.2rem', marginBottom: 0,}}>Payment details:</p>
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

                    <div style={{paddingTop:'4vh'}}>
                        <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'1.2rem', marginBottom: 0, }}>Message to tenant</p>
                        <p style={{fontWeight:'400', fontFamily: OPENSANS, fontSize:'0.8rem', marginBottom: 0, marginTop:'1vh', color: SUBTEXTCOLOR}}>No one likes to rent to a stranger, tell the tenant a bit about yourself.</p>
                        <div style={{marginTop:'2vh'}}>
                            <TextField value={message} onChange={(val) => setMessage(val.target.value)} helperText={`The more detailed the better`} multiline fullWidth label={`About me`} rows={ mobile ? 6 :  4} />
                        </div>
                        <div style={{marginTop:'2vh'}}>
                            <Button onClick={handleConfirmRequestClick} variant="contained" style={{backgroundColor:"black", textTransform:'none', color:'white', outline:'none'}}>
                                <p style={{marginBottom:0, fontSize:'1rem', fontWeight:'400'}}>Confirm Request</p>
                            </Button>
                        </div>



                    </div>
                    <div style={{height:"10vh", width:'100%'}} />

                </div>
                <div style={{width: mobile ? '100%' : '50%', height:'100%', }}>
                    <p onClick={()=> navigate(-1)} style={{textDecorationLine:'underline', fontFamily: OPENSANS, fontWeight:'600', color: SUBTEXTCOLOR, fontSize:'0.9rem', marginBottom:0, cursor:'pointer', display: !mobile ? 'none' : 'flex'}}>Back to listing</p>

                    <div style={{width: mobile ? '100%' : '70%', borderRadius: 15,  boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)', backgroundColor:'white', padding: 25, display:'block',marginLeft:'auto', marginTop: mobile ? '4vh' : 0 }}>
                        <div style={{display:'flex', flexDirection:'row', borderBottomWidth:'1px', borderBottomColor: EXTRALIGHT, borderBottomStyle:'solid', paddingBottom:'4vh'}}>
                            <img src={propData.imgList[0]} style={{height:'10vw', width: '10vw', borderRadius: MEDIUMROUNDED}} />
                            <div style={{flexDirection:'column', display:'flex', marginLeft:'2vw', height:'10vw', justifyContent:'space-between', flexDirection:'column'}}>
                                <div style={{display:'flex',  flexDirection:'column'}}>
                                    <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 5,}}><span style={{fontWeight:'600'}}>{propData.type}</span> at {propData.loc.secondaryTxt}</p>
                                    <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 5,}}>{propData.loc.streetAddr}</p>
                                    <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 5,}}>${propData.price} /month</p>
                                </div>
                                <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: 5,}}>Current tenant, {tenantData.firstName}</p>
                            </div>
                        </div>
                        <div style={{paddingTop:'4vh',}}>
                            <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'1.1rem', marginBottom: 5,}}>Payment details</p>
                            <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'2vh'}}>
                                <p style={{fontWeight:'400', fontFamily: OPENSANS, fontSize:'0.8rem', marginBottom: 0}}>Security deposit</p>
                                <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.8rem', marginBottom: 0,}}>${propData.securityDeposit}</p>
                            </div>
                            <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'2vh'}}>
                                <p style={{fontWeight:'400', fontFamily: OPENSANS, fontSize:'0.8rem', marginBottom: 0}}>Rent total</p>
                                <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.8rem', marginBottom: 0,}}>{getRent()}</p>
                            </div>

                        </div>
                    </div>
                    <div style={{width:mobile ? '100%' : '70%',  borderRadius: 15,  boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)', backgroundColor:'white', padding: 25, display:'block',marginLeft:'auto', marginTop:'4vh' }}>
                        <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1rem', marginBottom: 5,}}><span style={{color: PRIMARYCOLOR}}>{propData.numberOfViews == 0 ? 1 : propData.numberOfViews} user</span> have viewed this property since posted</p>
                    </div>
                </div>
                <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={editDateModalVis}
                
                closeAfterTransition
                slotProps={{
                backdrop: {
                    timeout: 500,
                },
                }}
            >
                <Fade in={editDateModalVis}>
                    <div 
                        style={{
                        position: 'absolute',
                        top: '30%',
                        left: '50%',
                        transform: 'translate(-50%, -30%)',
                        width: mobile ? '90vw' : 'auto',
                        height:'auto',
                        backgroundColor:'white',
                        padding: mobile ? '4vw' : '2vw',
                        borderRadius: MEDIUMROUNDED,
                        display:'flex',
                        
                        flexDirection:'column',
                       
                        minWidth:'35vw'
                        }}>
                            <div onClick={()=>setEditDateModalVis(false)} style={{display:'flex', flexDirection:'row', alignItems:'center', cursor:'pointer'}}>
                                <CloseIcon style={{color:'black', fontSize:'1.5rem'}}/>
                            </div>
                            <p style={{fontSize:'1.2rem', fontFamily: OPENSANS, color: 'black', fontWeight:'600', marginBottom:5, marginTop:'2vh'}}>Edit sublease dates</p>
                            <p style={{fontSize:'0.9rem', fontFamily: OPENSANS, color: MEDIUMGREY}}>Sublease availability: {new Date(propData.availableFrom).getTime() < new Date().getTime() ? "Now" : new Date(propData.availableFrom).toLocaleString().split(",")[0]} - {new Date(propData.availableTo).toLocaleString().split(",")[0]}</p>
                            <div style={{marginTop:'2vh', display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:"center"}}>
                                <div style={{width:'45%'}}>
                                    <DatePicker
                                    label="Start date"
                                    value={dayjs(confirmStart)}
                                    onChange={(event)=>                                
                                        setConfirmStart(event)
                                    }
                                    slotProps={{ textField: {error:false,} }}
                                    />
                                </div>
                                <p style={{marginBottom:0}}>-</p>
                                <div style={{width:'45%'}}>
                                <DatePicker
                                label="End date"
                                value={dayjs(confirmEnd)}
                                onChange={(event)=>                                
                                    setConfirmEnd(event)
                                }
                                slotProps={{ textField: {error:false, } }}
                                />
                                </div>
                            </div>
                    </div>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={editOccupantsModalVis}
                
                closeAfterTransition
                slotProps={{
                backdrop: {
                    timeout: 500,
                },
                }}
            >
                <Fade in={editOccupantsModalVis}>
                    <div 
                        style={{
                        position: 'absolute',
                        top: '30%',
                        left: '50%',
                        transform: 'translate(-50%, -30%)',
                        width: mobile ? '90vw' : 'auto',
                        height:'auto',
                        backgroundColor:'white',
                        padding: mobile ? '4vw' : '2vw',
                        borderRadius: MEDIUMROUNDED,
                        display:'flex',
                        
                        flexDirection:'column',
                       
                        minWidth:'35vw'
                        }}>
                            <div onClick={()=>setEditOccupantsModalVis(false)} style={{display:'flex', flexDirection:'row', alignItems:'center', cursor:'pointer'}}>
                                <CloseIcon style={{color:'black', fontSize:'1.5rem'}}/>
                            </div>
                            <p style={{fontSize:'1.2rem', fontFamily: OPENSANS, color: 'black', fontWeight:'600', marginBottom:5, marginTop:'2vh'}}>Edit sublease dates</p>
                            <p style={{fontSize:'0.9rem', fontFamily: OPENSANS, color: MEDIUMGREY}}>Number of occupants selected: {confirmOccupants}</p>
                            <div style={{marginTop:'2vh', display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:"center"}}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Number of occupants</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={confirmOccupants}
                                        label="Number of occupants"
                                        onChange={(val)=> setConfirmOccupants(val.target.value)}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={2}>2</MenuItem>
                                        <MenuItem value={3}>3</MenuItem>
                                        <MenuItem value={4}>4</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={6}>6</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
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
                                <p style={{marginBottom:0, fontFamily: OPENSANS, fontSize:'0.9rem', fontWeight:'400'}}>{new Date(confirmStart).toLocaleDateString().split(",")[0]} - {new Date(confirmEnd).toLocaleDateString().split(",")[0]}</p>    
                            </div>  
                        </>  
                        }
                
                        <div style={{ marginTop:'4vh', width:'100%'}}>
                            {/* <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                <Checkbox onChange={()=>setRequestConfirmationCheckbox(!requestConfirmationCheckbox)} checked={requestConfirmationCheckbox} style={{cursor:'pointer', color:'black'}} />
                                <p style={{marginBottom:0,  color: '#737373', fontWeight:'400', fontSize:'0.8rem',}}>By clicking the checkbox, you are agreeing to our terms of services and privacy details</p>
                            </div> */}
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
            </>
            
            }

        </div>
        </LocalizationProvider>
    )
}