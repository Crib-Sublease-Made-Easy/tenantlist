import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, InputAdornment } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { PRIMARYCOLOR, MEDIUMGREY, OPENSANS, LIGHTGREY } from "../../sharedUtils";
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

import SearchIcon from '@mui/icons-material/Search';
import BedIcon from '@mui/icons-material/Bed';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const appId = 'EF181665-2473-42C6-9376-A340AF716169';
const sb = new SendBird({ appId: appId});

const PURPOSEOFSUBLEASINGOPTIONS = ["Travel", "Internship", "Work", "Others"]

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
    const [purposeOfSubleasing, setPurposeOfSubleasing] = useState(null)
    const [findingPosting, setFindingPosting] = useState(null)
    const [student, setStudent] = useState(false)
    const [school, setSchool] = useState("")
    const [schoolEmail, setSchoolEmail] = useState("")
    const [occupation, setOccupation] = useState("")
    const [linkedIn, setLinkedIn] = useState("")
    const [instagram, setInstagram] = useState("")
    const [wechat, setWechat] = useState("")


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
            if(purposeOfSubleasing == null){
                alert("Please select your purpose of subleasing.")
                return;
            }
            if(student){
                if(school.trim() == ""){
                    alert("Please specify your school.")
                    return;
                }
                if(schoolEmail.trim() == ""){
                    alert("Please specify your school email.")
                    return;
                }
            }
            if(occupation.trim() == ""){
                alert("Please specify your occupation.")
                return;
            }
            setSignupStep(signupStep+1)
        }
        if(signupStep == 3){
            if(findingPosting == null){
                alert("Please specify if you're finding or posting subleases.")
                return
            }
            setSignupStep(signupStep+1)
        }
        if(signupStep == 4){
            setSignupStep(signupStep+1)
        }
        
        
        if(signupStep == 5){
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
        if(signupStep == 6){
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
        console.log("AUTHY ID IS" , id)
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
        console.log("inside step 3 ")
        let countryCodelength = countryCode.toString().length
         
        let phoneNumber = phoneNumberwCC.substring(countryCodelength, phoneNumberwCC.toString().length)

        setLoading(true)
        console.log( student)
        console.log(findingPosting)
        console.log(purposeOfSubleasing)
        console.log(schoolEmail)
        console.log(occupation)
        console.log(school)
        console.log(wechat)
        console.log(linkedIn)
        console.log(instagram)
        try{
            const formData = new FormData();

            formData.append("firstName", firstName);                     
            formData.append("lastName", lastName);  
            formData.append("dob", new Date(dob).getTime());      
            formData.append("gender", gender);
            formData.append("phoneNumber", phoneNumber);                                  
            formData.append("email", email);      
            formData.append("token", OTPCode);      
            formData.append("authy_id", authyID);      
            // formData.append("oneSignalUserId", oneSignalUserId);    
            formData.append("countryCode",countryCode)  

            //New add
            formData.append("student", student)
            formData.append("type", findingPosting)  
            formData.append("purposeOfSubleasing", purposeOfSubleasing)
            formData.append("schoolEmail", schoolEmail)
            formData.append("occupation", occupation)
            formData.append("school", school)
            formData.append("wechat", wechat)
            formData.append("linkedIn", linkedIn)
            formData.append("instagram", instagram)
          


    
            formData.append("userImage", profileImage);

            console.log("FORM DATA", formData)

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
                                                if(findingPosting == "Finding"){
                                                    navigate("/discoverSubleases")
                                                }
                                                else{
                                                    navigate("/propertyPosting")
                                                }
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
        catch(e){ 
            console.log(e)
            alert("catch error")
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
        <div style={{width: mobile ? '100vw' :'45vw', marginLeft:'auto', marginRight:'auto', paddingTop:'2vh', overflowY: 'scroll', height:'90vh', paddingLeft:'5vw', paddingRight:'5vw'}}>
            {/* <div style={{flexDirection:'row', display:'flex', justifyContent:'flex-start',}}>
                <KeyboardArrowLeftIcon style={{color: MEDIUMGREY,fontSize:30}} />
            </div> */}
            { signupStep != 0 &&
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
                <SingupText>Please upload an image of yourself to guarantee the best result. Over 90% of tenants are more willing to sublease to a subtenant if their face is clearly shown in the image</SingupText>
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
                <SingupSubheading style={{marginTop:'2vh'}}>Let others know a bit about you</SingupSubheading>
                <SingupText>No one likes to sublease to a stranger, let’s build trust by first letting tenants know a bit about yourself</SingupText>
                <div>
                    <div style={{marginTop: '4vh'}}>
                        <FormControl fullWidth>
                        <InputLabel id="demo-age-select-label">Purpose of subleasing</InputLabel>
                        <Select
                            labelId="demo-age-select-label"
                            id="demo-simple-select"
                            value={purposeOfSubleasing}
                            label="Purpose of subleasing"
                            onChange={(val)=> setPurposeOfSubleasing(val.target.value)}
                            
                        >
                            {
                                PURPOSEOFSUBLEASINGOPTIONS.map((item)=>{
                                    return(
                                        <MenuItem value={`${item}`}>{item}</MenuItem>
                                    )
                                })
                            }
                            
                        </Select>
                        </FormControl>
                    </div>
                    <div style={{marginTop: '4vh', display:"flex", flexDirection:'row', justifyContent:"space-between", alignItems:'center'}}>
                        <p style={{color:"black", marginBottom:0}}>Are you a student?</p>
                        <Checkbox checked={student} onChange={()=> setStudent(!student)} style={{color: PRIMARYCOLOR}}/>
                    </div>
                    {student &&
                    <div style={{marginTop: '4vh'}}>
                        <TextField value={school} onChange={(val)=> setSchool(val.target.value)} fullWidth label="Where do you go to school?" />
                        <div style={{marginTop:'2vh'}}>
                            <TextField value={schoolEmail} onChange={(val)=> setSchoolEmail(val.target.value)} fullWidth label="Enter school email" />
                        </div>
                    </div>
                    }
                    <div style={{marginTop: '4vh'}}>
                        <TextField fullWidth value={occupation} onChange={(val)=> setOccupation(val.target.value)}  label="What is your occupation?" />
                    </div>
                    <Button onClick={handleSubmit} fullWidth style={{marginTop: '4vh', backgroundColor: PRIMARYCOLOR,color: 'white', textTransform:'none', height: '6vh', textAlign:'center', outline:'none'}}>
                        <p  state={{firstName:firstName, lastName: lastName, dob:dob, gender: gender}}  style={{fontWeight:'600', textTransform:'none', color:'white', marginBottom:0, display: 'flex', flex: 1,  justifyContent:'center'}}>Continue</p>
                    </Button>
                   
                </div>
            </div>
            :
            signupStep == 3 ?
            <div>
                <SingupSubheading style={{marginTop:'2vh'}}>Are you...</SingupSubheading>
                <div style={{marginTop:"4vh", display:'flex', flexDirection:'row', alignItems:"center", justifyContent:'space-between' }}>
                    <Button onClick={()=> setFindingPosting("Finding")} variant={findingPosting == "Finding" ? "contained" : "outlined"} style={{justifyContent:'center', display:'flex', alignItems:'center', textTransform:'none', backgroundColor:"white", borderColor: LIGHTGREY, flexDirection:'column', width:'47.5%', outlineColor: MEDIUMGREY, borderWidth: findingPosting == "Finding" ? '2px' : 0, borderColor: PRIMARYCOLOR, borderStyle:'solid'}}>
                        <SearchIcon style={{fontSize:'7rem', color: '#737373'}} />
                        <p style={{color:MEDIUMGREY, marginBottom:0, fontSize:'1rem', fontWeight:"600", fontFamily: OPENSANS}}>Finding a sublease</p>
                    </Button>
                    <Button onClick={()=> setFindingPosting("Posting")}  variant={findingPosting == "Posting" ? "contained" : "outlined"} style={{justifyContent:'center', display:'flex', alignItems:'center', textTransform:'none', backgroundColor:"white", borderColor: LIGHTGREY, flexDirection:'column', width:'47.5%',  outlineColor: MEDIUMGREY, borderWidth: findingPosting == "Posting" ? '2px' : 0, borderColor: PRIMARYCOLOR, borderStyle:'solid'}}>
                        <BedIcon style={{fontSize:'7rem', color: '#737373'}} />
                        <p style={{color:MEDIUMGREY, marginBottom:0, fontSize:'1rem', fontWeight:"600", fontFamily: OPENSANS}}>Posting a sublease</p>
                    </Button>

                </div>
                    
                    
                <Button onClick={handleSubmit} fullWidth style={{marginTop: '4vh', backgroundColor: PRIMARYCOLOR,color: 'white', textTransform:'none', height: '6vh', textAlign:'center', outline:'none'}}>
                    <p  state={{firstName:firstName, lastName: lastName, dob:dob, gender: gender}}  style={{fontWeight:'600', textTransform:'none', color:'white', marginBottom:0, display: 'flex', flex: 1,  justifyContent:'center'}}>Continue</p>
                </Button>
                
                
            </div>
            :
            signupStep == 4 ?
            <div>
                <SingupSubheading style={{marginTop:'2vh'}}>If social media is your thing</SingupSubheading>
                <p style={{fontFamily: OPENSANS, color: "#737373" , fontSize:"0.9rem"}}>Showing users your social media presence greatly increase trusts between you and them.</p>
                <div>
                    <p style={{color:MEDIUMGREY, marginBottom:0, fontSize:'0.9rem', fontWeight:"600", fontFamily: OPENSANS}}>LinkedIn</p>
                    <div style={{marginTop:'1vh'}}>
                        <TextField 
                            fullWidth
                            onChange={(val)=> setLinkedIn(val.target.value)}
                            InputProps={{
                                placeholder: 'Linkedin handle',
                                startAdornment: 
                                <InputAdornment style={{paddingRight:'1vw'}}>
                                    <LinkedInIcon style={{color: MEDIUMGREY, fontSize:'1.5rem'}} />
                                </InputAdornment>,
                            }}
                        />      
                    </div>    
                </div>
                <div style={{marginTop:'4vh'}}>
                    <p style={{color:MEDIUMGREY, marginBottom:0, fontSize:'0.9rem', fontWeight:"600", fontFamily: OPENSANS}}>Instagram</p>
                    <div style={{marginTop:'1vh'}}>
                        <TextField 
                            onChange={(val)=> setInstagram(val.target.value)}
                            fullWidth
                            InputProps={{
                                placeholder: 'Instagram handle',
                                startAdornment: 
                                <InputAdornment style={{paddingRight:'1vw'}}>
                                    <InstagramIcon style={{color: MEDIUMGREY, fontSize:'1.5rem'}} />
                                </InputAdornment>,
                            }}
                        />      
                    </div>
                </div>
                <div style={{marginTop:'4vh'}}>
                    <p style={{color:MEDIUMGREY, marginBottom:0, fontSize:'0.9rem', fontWeight:"600", fontFamily: OPENSANS}}>WeChat</p>
                    <div style={{marginTop:'1vh'}}>
                        <TextField 
                            onChange={(val) => setWechat(val.target.value)}
                            fullWidth
                            InputProps={{
                                placeholder: 'WeChat username',
                                startAdornment: 
                                <InputAdornment style={{paddingRight:'1vw'}}>
                                    <QuestionAnswerIcon style={{color: MEDIUMGREY, fontSize:'1.5rem'}} />
                                </InputAdornment>,
                            }}
                        />      
                    </div>
                </div>
                        
                <Button onClick={handleSubmit} fullWidth style={{marginTop: '4vh', backgroundColor: PRIMARYCOLOR,color: 'white', textTransform:'none', height: '6vh', textAlign:'center', outline:'none'}}>
                    <p  state={{firstName:firstName, lastName: lastName, dob:dob, gender: gender}}  style={{fontWeight:'600', textTransform:'none', color:'white', marginBottom:0, display: 'flex', flex: 1,  justifyContent:'center'}}>Continue</p>
                </Button>
                   
               
            </div>
            :
            signupStep == 5 ?
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