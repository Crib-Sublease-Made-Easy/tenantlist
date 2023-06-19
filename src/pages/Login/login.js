import { useContext, useState } from "react"
import { UserContext } from "../../UserContext"
import { LoginSubheading, LoginText } from "./loginStyle"

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Button, TextField } from "@mui/material"
import { PRIMARYCOLOR } from "../../sharedUtils"
import { Link, useNavigate } from "react-router-dom"
import WhiteLoadingAnimation from '../../whiteLoading.json'
import Lottie from "lottie-react";

export default function LoginScreen(){
    const navigate = useNavigate()
    const {mobile, loggedIn, setLoggedIn} = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState("")
    const [countryCode, setCountryCode] = useState("")
    const [OTPCode, setOTPCode] = useState("")
    const [authyId, setAuthyId] = useState("")

    
    const [loginPage, setLoginPage] = useState(0)

    function handlePhoneInput(phone, country){
        setPhoneNumber(phone)
        setCountryCode(country.dialCode)
    }

    async function handleSubmit(){
        if(loginPage == 0){
            if(phoneNumber.trim() == ""){
                alert("Please enter a valid phone number.")
                return
            }
            else{
                let countryCodelength = countryCode.toString().length
                let pn = phoneNumber.substring(countryCodelength, phoneNumber.toString().length)

                //Check if the user exist already
                await fetch('https://crib-llc.herokuapp.com/website/users/authy', {
                    method: 'POST',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({phoneNumber: pn})
                })
                .then(async (res)=>{
                    if(res.status == 200){
                    let data = await res.json();

                    setAuthyId(data.authy_id)
                    send_sms(data.authy_id)

                    } else {
                        alert("A user with this phone number does not exist. Please create a new account.")
                        navigate("/signup")
                    }
                })
            }
        }
        else if (loginPage == 1 ){
            login()
        }
    }

    async function send_sms(id){

        const rawResponse = await fetch('https://crib-llc.herokuapp.com/website/users/OTP/step2', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({authy_id: id})
        });
      
        
        if(rawResponse.status == 200 || rawResponse.status == 201){
          // setShowTokenScreen(true)
          setLoginPage(loginPage+1)
        }
        else{
          alert("You don't have an account. Please sign up.")
        }
    }

    async function login(){
       
        let countryCodelength = countryCode.toString().length
        let pn = phoneNumber.substring(countryCodelength, phoneNumber.toString().length)
        console.log("Inside login")

        if(OTPCode.length != 6){
            alert("Please enter a valid code")
            return
        }
        setLoading(true)
        const rawResponse = await fetch('https://crib-llc.herokuapp.com/website/users/login', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            authy_id: authyId,
            phoneNumber: pn,
            token: OTPCode
          })
        });
        const content = await rawResponse.json();
        if(rawResponse.status == 200 || rawResponse.status == 201){
            setLoggedIn(true)
            //store in local storage 
            //First Name : firstName
            //Last Name: lastName
            //Profile pic: profilePic 
            //School: school
            //Occupation: occupation
            //Refresh Token: refreshToken
            //Access Token: accessToken
            //User ID: uid

            localStorage.setItem("firstName", content.loggedIn.firstName)
            localStorage.setItem("lastName", content.loggedIn.lastName)
            localStorage.setItem("profilePic", content.loggedIn.profilePic)
            localStorage.setItem("refreshToken", content.token.refreshToken)
            localStorage.setItem("accessToken", content.token.accessToken)
          
            // console.log(content.token.refreshToken)
            localStorage.setItem("uid", content.loggedIn._id)

          
            try{
                localStorage.setItem("sendBird", content.loggedIn.sendBird)
            }
            catch{
                console.log("SENDBIRD")
            }

            setTimeout(()=> {
                setLoading(false)
                navigate("/discoverSubleases")
            },2000)
        } 
        else {
            alert("Token is incorrect! Please verify that the phonenumber and token are both correct.")
        }       


    }


    return(
        <div style={{width: mobile ? '100vw' :'40vw', marginLeft:'auto', marginRight:'auto', paddingTop:'2vh', overflowY: 'scroll', height:'90vh', paddingLeft:'5vw', paddingRight:'5vw'}}>
            
            {loginPage == 0 ?
            <div style={{marginTop:'2vh'}}>
                <LoginSubheading>Welcome back to Crib!</LoginSubheading>
                <div style={{marginTop:'2vh'}}>
                    <PhoneInput
                    country={'us'}
                    inputStyle={{width: mobile ? '90vw' : '100%', height: '7vh'}}
                    value={phoneNumber}
                    onChange={ (phone, country) => handlePhoneInput(phone, country)}
                    />
                    <small>By pressing continue, you are agreeing to our <a href="/termsOfServices" style={{color:'black', textDecorationLine: 'underline'}}>terms of services</a> and <a href="/privacy" style={{color:'black', textDecorationLine: 'underline'}}>privacy</a> policy.</small>
                    <Button onClick={handleSubmit} fullWidth style={{marginTop: '4vh', backgroundColor: PRIMARYCOLOR,color: 'white', textTransform:'none', height: '6vh', textAlign:'center', outline:'none'}}>
                        <p  style={{fontWeight:'600', textTransform:'none', color:'white', marginBottom:0, display: 'flex', flex: 1,  justifyContent:'center'}}>Continue</p>
                    </Button>
                    <p onClick={()=>navigate("/signup")} style={{fontWeight:'500', textAlign:'center', marginTop:'10vh', color:'black', cursor:'pointer', fontSize: '0.9rem'}}>New to Crib? Sign up</p>
                </div>
            </div>
            :
            <div>
                <LoginSubheading style={{marginTop:'2vh'}}>Enter verification code</LoginSubheading>
                <LoginText>Please enter the verification code below to verify your phone number.</LoginText>
                <div>
                    <TextField value={OTPCode} autoFocus fullWidth label="6 digit code" onChange={(val) => setOTPCode(val.target.value) } style={{textTransform:'none', marginTop:'2vh'}} />
                    <small>By pressing continue, you are agreeing to our terms of services and privacy policy listed.</small>
                    <Button onClick={handleSubmit} fullWidth style={{marginTop: '4vh', backgroundColor: PRIMARYCOLOR,color: 'white', textTransform:'none', height: '6vh', textAlign:'center', outline:'none'}} >
                        {loading ?
                        <Lottie animationData={WhiteLoadingAnimation} style={{display:'flex', flex:1, color:'white', height:'7vh', preserveAspectRatio: 'xMidYMid slice'}}/>
                        :
                        <p  style={{fontWeight:'600', textTransform:'none', color:'white', marginBottom:0, display: 'flex', flex: 1,  justifyContent:'center'}}>Continue</p>
                        }
                    </Button>
                   
                </div>
            </div>
            }

        </div>
    )
}