import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { PRIMARYCOLOR, MEDIUMGREY, OPENSANS } from "../../sharedUtils";
import { SingupSubheading, SingupText } from "./signupStyle";
import { DatePicker } from "@mui/x-date-pickers"

import WhiteLoadingAnimation from '../../whiteLoading.json'
import Lottie from "lottie-react";


import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../UserContext";
import { useRef } from "react";

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import SendBird from 'sendbird'

const appId = 'EF181665-2473-42C6-9376-A340AF716169';
const sb = new SendBird({ appId: appId});


export default function SingupScreen(){
    const navigate = useNavigate()
    const {mobile, setLoggedIn} = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumberwCC, setPhoneNumberWCC] = useState("")
    const [countryCode, setCountryCode] = useState("")
    const [gender, setGender] = useState(null)
    const [dob, setDob] = useState(null)

    const hiddenFileInput = useRef(null);
    const [profImg, setProfImg] = useState(null)
    const [profileImage, setProfileImage] = useState(null)


    //OTP verificaiton code
    const [OTPCode, setOTPCode] = useState("")
    const [authyID, setAuthyID] = useState("")



    const [signupStep, setSignupStep] = useState(0)


    async function handleSubmit(){
        if(signupStep == 0){
            if(firstName.trim() == ""){
                alert("Please enter a valid first name.")
                return;
            }
            if(lastName.trim() == ""){
                alert("Please enter a valid last name.")
                return;
            }
            if(gender == null){
                alert("Please select a gender")
                return;
            }
            if(dob == null || new Date(dob).getTime() > new Date().getTime()){
                
                alert("Please select a valid date of birth.")
                return;
            }
            let age = (new Date().getTime() - new Date(dob).getTime())/(1000*60*60*24*31*12)
            if(age < 18){
                alert("You have to be over 18 to join Crib.")
                return
            }
            if(age > 70){
                alert("Please enter a valid age.")
                return
            }
            if(email.trim() == ""){
                alert("Please enter a valid email")
                return;
            }

            setSignupStep(1)
        }
        if(signupStep == 1){
            if(profImg == null){
                alert("Please select a profile image.")
                return;
            }
            setSignupStep(2)
        }
        if(signupStep == 2){
            if(phoneNumberwCC.trim() == ""){
                alert("Please enter a valid phone number")
                return;
            }

            let countryCodelength = countryCode.toString().length
         
            let phoneNumber = phoneNumberwCC.substring(countryCodelength, phoneNumberwCC.toString().length)
           

            // Check if user already exist 
            await fetch('https://crib-llc.herokuapp.com/users/check', {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phoneNumber: phoneNumber
                })
            }).then(async res => {
                if(res.status == 409){
                    alert("Account exists, please login.")
                    return;
                }
                else{
                    console.log("Going into signup step 1 ")
                    signupStep1(phoneNumber);

                    return;
                }
            })
        }
        if(signupStep == 3){
            if(OTPCode.length != 6){
                alert("Please enter a valid OTP")
                return;
            }
            signupStep3()
        }
    }

    async function signupStep1(phoneNumber){
        setLoading(true)
        await fetch('https://crib-llc.herokuapp.com/users/OTP/step1', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber: phoneNumber,
                email: email,
                countryCode: countryCode
            })
        }) 
        .then(async res => {
            const data = await res.json();
            if(res.status == 201){
                if(data.response.user.id != undefined){
                    signupStep2(data.response.user.id);
                    setAuthyID(data.response.user.id)
                }
                else{
                    alert("Invalid phone number or email.")
                    setLoading(false)
                    setSignupStep(signupStep-1)
                }
            }
            else if(data.error != undefined){
               
            }
            else{
                alert("An error has occured. Please try again later!")
                setLoading(false)
                setSignupStep(0)
            }
        })
        .catch( e => {

        })
    }

    function signupStep2(id){
        console.log("STEP2");
        fetch('https://crib-llc.herokuapp.com/users/OTP/step2', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authy_id: id
            })
        })
        .then(async res => {
            const test = await res.json()
            if(res.status == 201){
                setLoading(false)

                setSignupStep(signupStep+1)
            }
            else{
                setLoading(false)
                alert("An error has occured. Please try again later!")
                setSignupStep(0)
            }
        })
        .catch( e => {
            alert("An error has occured!")
        }) 
    }
    async function signupStep3(){ 

        let countryCodelength = countryCode.toString().length
         
        let phoneNumber = phoneNumberwCC.substring(countryCodelength, phoneNumberwCC.toString().length)

        setLoading(true)
        try{
            const formData = new FormData();

            formData.append("firstName", firstName);                     
            formData.append("lastName", lastName);  
            formData.append("dob", new Date(dob).getTime());      
            formData.append("gender", gender);
            formData.append("phoneNumber", phoneNumber);                       
            formData.append("occupation", "")
            formData.append("school", "");                       
            formData.append("email", email);      
            formData.append("token", OTPCode);      
            formData.append("authy_id", authyID);      
            // formData.append("oneSignalUserId", oneSignalUserId);    
            formData.append("type", "Both")  
            formData.append("countryCode",countryCode)  

    
            formData.append("userImage", profileImage);

            fetch('https://crib-llc.herokuapp.com/website/users/OTP/step3', {
                    method: 'POST',
                    headers: {
                    Accept: 'application/json',
                    
                    },
                    body: formData
                })
                .then(async res => {
                    console.log(res)
                    // console.log("SIGN UP STEP 3 RESPONSE: ", res.status)
                    const data = await res.json();
                    // console.log("SIGN UP STEP 3 DATA: ", data)
                        console.log("RESPONSE 201")
                        try {
                            sb.connect(data.createdUser._id, function(user, error) {
                                console.log("before if")
                                if (error) {
                                    // Handle error.
                                    console.log("sendbird error in connect")
                                }
                                else{
                                    console.log("sendbird connected")
                                    sb.updateCurrentUserInfo(data.createdUser.firstName, data.createdUser.profilePic, (user, err) => {
                                        if (!err) {
                                            console.log("Successfully updated current user")
                                            
                    
                                            localStorage.setItem("accessToken",data.token.accessToken)
                                            localStorage.setItem("refreshToken",data.token.refreshToken)
                                            localStorage.setItem("sendbirdId",data.token.sendBirdId)
                                            localStorage.setItem("firstName", data.createdUser.firstName)
                                            localStorage.setItem("lastName", data.createdUser.lastName)
                                            localStorage.setItem("profilePic", data.createdUser.profilePic)
                                            localStorage.setItem("uid", data.createdUser._id)
                                            setTimeout(()=> {
                                                setLoggedIn(true)
                                                setLoading(false)
                                                navigate("/discoverSubleases")
                                            }, 2500)

                                        } else {
                                            console.log("Error with updating current user", err)
                                        }
                                    });
                                }
                                // The user is connected to Sendbird server.
                            });
                            // The user is connected to the Sendbird server.
                        } catch (err) {
                            alert("An error has occured.")
                        }

                       

                })
                .catch( e => {  
                    console.log(e)
                    alert("Error occured. Please try again later!")
                    
                })
            
        }
        catch{
            alert("Error. Please try again later!")
        }
         setLoading(false)
        
    }



    function handlePhoneInput(phone, country){
        setPhoneNumberWCC(phone)
        setCountryCode(country.dialCode)

    }

    function handleImageClick(){
        (hiddenFileInput.current).click()
    }
    
    function handleImageChange(event){
        const fileUploaded = event.target.files[0];
        
        const url = URL.createObjectURL(fileUploaded)
        setProfImg(url)
        setProfileImage(fileUploaded)
     
    }

    function resendMessage(){
        fetch('https://crib-llc.herokuapp.com/website/users/OTP/step2', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authy_id: authyID
            })
        })
        .then(res => {
            if(res.status == 201){
                alert("Message sent!")
            }
            else if(res.status == 401){
                alert("Invalid phone number, please try again!")
                setSignupStep(signupStep-1)
            }
            else{
                alert("An error has occured. Please try again later!")
                navigate("/")
            }
        }).catch( e=>{
            alert("An error has occured. Please try again later!")
            navigate("/")
        })
    }
   

    return(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div style={{width: mobile ? '100vw' :'40vw', marginLeft:'auto', marginRight:'auto', paddingTop:'2vh', overflowY: 'scroll', height:'90vh', paddingLeft:'5vw', paddingRight:'5vw'}}>
            {/* <div style={{flexDirection:'row', display:'flex', justifyContent:'flex-start',}}>
                <KeyboardArrowLeftIcon style={{color: MEDIUMGREY,fontSize:30}} />
            </div> */}
            { signupStep != 0  && signupStep != 3 &&
            <small onClick={()=> setSignupStep(signupStep -1)} style={{textDecorationLine:'underline', color: MEDIUMGREY, cursor:'pointer'}}>Back</small>
            }
            { signupStep == 0 ?
            <div >
                <SingupSubheading style={{marginTop:'2vh'}}>Welcome to Crib</SingupSubheading>
                <div>
                    
                    <TextField fullWidth label="First name" value={firstName} onChange={(val) => setFirstName(val.target.value) } style={{textTransform:'none', marginTop: '2vh'}} />
                    
                    <TextField fullWidth label= "Last name" value={lastName} onChange={(val) => setLastName(val.target.value) }  style={{textTransform:'none', marginTop: '2vh',}} />
                    <div  style={{marginTop: '2vh'}}>
                        <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={gender}
                            label="Gender"
                            onChange={(val)=> setGender(val.target.value)}
                        >
                            <MenuItem value={"Male"}>Male</MenuItem>
                            <MenuItem value={"Female"}>Female</MenuItem>
                            <MenuItem value={"Others"}>Others</MenuItem>
                        </Select>
                        </FormControl>
                    </div>
                    <div style={{marginTop:'2vh'}}>
                        <DatePicker
                        label="Date of Birth"
                        value={dayjs(dob)}
                        onChange={(event)=> setDob(event)}
                        slotProps={{ textField: { fullWidth: true, error:false } }}
                        />
                    </div>
                    <div style={{marginTop:'2vh'}}>
                        <TextField value={email} fullWidth label="Email" onChange={(val)=>setEmail(val.target.value)} style={{textTransform:'none',}} />
                    </div>

                    <Button onClick={handleSubmit} fullWidth style={{marginTop: '2vh', backgroundColor: PRIMARYCOLOR,color: 'white', textTransform:'none', height: '6vh', textAlign:'center', outline:'none'}}>
                        <p  state={{firstName:firstName, lastName: lastName, dob:dob, gender: gender}}  style={{fontWeight:'600', textTransform:'none', color:'white', marginBottom:0, display: 'flex', flex: 1,  justifyContent:'center'}}>Continue</p>
                    </Button>
                </div>
            </div>
            :
            signupStep == 1 ?
            <div>
                <SingupSubheading style={{marginTop:'2vh'}}>Upload a profile picture</SingupSubheading>
                <SingupText>Please ensure your face can be clearly seen in the image for a better result</SingupText>
                <div  style={{flexDirection:'column', display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <img onClick={handleImageClick} src={profImg} style={{width: mobile ? '50vw' : '15vw', height: mobile ? '50vw' : '15vw', backgroundColor:'#E0E0E0', borderRadius: mobile ? '25vw' : '7.5vw', marginTop:'3vh', objectFit:'cover', cursor:'pointer'}}/>
                    <input onChange={handleImageChange} ref={hiddenFileInput} className="mt-5" style={{display:'none'}} type="file" accept="image/*" />
                    {/* <Button onClick={handleImageClick} variant="contained" style={{backgroundColor:PRIMARYCOLOR}}sx={{textTransform:'none', marginTop:3}}>Upload Profile Pic</Button> */}
                    <Button onClick={handleSubmit} fullWidth style={{marginTop: '5vh', backgroundColor: PRIMARYCOLOR,color: 'white', textTransform:'none', height: '6vh', textAlign:'center', outline:'none'}}>
                        <p  state={{firstName:firstName, lastName: lastName, dob:dob, gender: gender}}  style={{fontWeight:'600', textTransform:'none', color:'white', marginBottom:0, display: 'flex', flex: 1,  justifyContent:'center'}}>Continue</p>
                    </Button>
                </div>
                {/* <div>
                    <TextField autoFocus fullWidth label="Phone number" onChange={(val) => setFirstName(val.target.value) } style={{textTransform:'none', marginTop:'2vh'}} />
                    <small>By pressing continue, you are agreeing to our terms of services and privacy policy listed.</small>
                    <Button  fullWidth style={{marginTop: '4vh', backgroundColor: PRIMARYCOLOR,color: 'white', textTransform:'none', height: '6vh', textAlign:'center'}}>
                        <p onClick={handleSubmit} state={{firstName:firstName, lastName: lastName, dob:dob, gender: gender}}  style={{fontWeight:'600', textTransform:'none', color:'white', marginBottom:0, display: 'flex', flex: 1,  justifyContent:'center'}}>Continue</p>
                    </Button>
                   
                </div> */}
            </div>
            :
            signupStep == 2 ?
            <div>
                <SingupSubheading style={{marginTop:'2vh'}}>Enter your phone number</SingupSubheading>
                <SingupText>We will send you a verification code to your number.</SingupText>
                <div>
                    {/* <TextField autoFocus fullWidth label="Phone number" onChange={(val) => setFirstName(val.target.value) } style={{textTransform:'none', marginTop:'2vh'}} /> */}
                    <PhoneInput
                    country={'us'}
                    inputStyle={{width: mobile ? '90vw' : '100%', height: '7vh'}}
                    value={phoneNumberwCC}
                    onChange={ (phone, country) => handlePhoneInput(phone, country)}
                    />
                    <small>By pressing continue, you are agreeing to our <a target="_blank" href="termsOfServices" style={{color:'black', textDecorationLine:'underline'}}>terms of services</a> and <a target="_blank" href="/privacy" style={{color:'black', textDecorationLine:'underline'}}>privacy</a> policy listed.</small>
                    <Button onClick={handleSubmit} fullWidth style={{marginTop: '4vh', backgroundColor: PRIMARYCOLOR,color: 'white', textTransform:'none', height: '6vh', textAlign:'center', outline:'none'}}>
                        <p  state={{firstName:firstName, lastName: lastName, dob:dob, gender: gender}}  style={{fontWeight:'600', textTransform:'none', color:'white', marginBottom:0, display: 'flex', flex: 1,  justifyContent:'center'}}>Continue</p>
                    </Button>
                   
                </div>
            </div>
            :
            <div>
                <SingupSubheading style={{marginTop:'2vh'}}>Enter verification code</SingupSubheading>

                <SingupText>We've sent a verification code to +{phoneNumberwCC}. Please enter the code revieced to get verified.</SingupText>
                <div>
                    <TextField value={OTPCode} autoFocus fullWidth label="6 digit code" onChange={(val) => setOTPCode(val.target.value) } style={{textTransform:'none', marginTop:'2vh'}} />
                    <small>By pressing continue, you are agreeing to our terms of services and privacy policy listed.</small>
                    <Button disabled={loading} onClick={handleSubmit} fullWidth style={{marginTop: '4vh', backgroundColor: PRIMARYCOLOR,color: 'white', textTransform:'none', height: '7vh', textAlign:'center', outline:'none'}}>
                        {loading ?
                        <Lottie autoPlay animationData={WhiteLoadingAnimation} style={{display:'flex', flex:1, color:'white', height:'7vh', preserveAspectRatio: 'xMidYMid slice'}}/>
                        :
                        <p  style={{fontWeight:'600', textTransform:'none', color:'white', marginBottom:0, display: 'flex', flex: 1,  justifyContent:'center'}}>Continue</p>
                        }
                    </Button>
                    <p onClick={()=>setSignupStep(signupStep-1)} style={{marginTop:'2vh',fontFamily: OPENSANS, cursor:'pointer', fontSize:"0.9rem"}}>Wrong number?</p>
                    <p onClick={resendMessage} style={{marginTop:'2vh',fontFamily: OPENSANS, cursor:'pointer', fontSize:"0.9rem"}}>Resend code</p>
                </div>
            </div>
            
            }
            
        </div>
        </LocalizationProvider>
    )
}