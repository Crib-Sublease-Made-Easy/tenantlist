//Pages
import LandingPage from './pages/Landing/landing';
import TenantRequestPage from './pages/Tenant/tenantRequests';
import ListingDetails from './ListingDetails/listingDetails';


import NavBar from './NavBar/navbar';
import './App.css';
import {UserContext} from './UserContext';
import { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom"
import SubtenantRequest from './pages/SubtenantRquest/subtenantRequest';
import SubtenantRequestSuccess from './pages/SubtenantRquest/subtenantRequestSuccess/subtenantRequestSuccess.js';
import SingupScreen from './pages/Signup/signup';
import SignupVerifyScreen from './pages/Signup/signupVerify';

import WelcomePage from './WelcomePage/welcome';

import SendBird from 'sendbird'
import LoginScreen from './pages/Login/login';
import MyRequestsScreen from './pages/Requests/myRequests';
import TermsOfServicesScreen from './pages/Docs/termsOfServices';
import PrivacyScreen from './pages/Docs/privacy';
import PropertyPostingScreen from './pages/Posting/posting';
const appId = 'EF181665-2473-42C6-9376-A340AF716169';



const sb = new SendBird({ appId: appId});   // The `localCacheEnabled` is optional. The default is false.


function App() {



  //Location base
  const [manhattanDL, setManhattanDL] = useState(true)
  const [queensDL, setQueensDL] = useState(true)
  const [brooklynDL, setBrooklynDL] = useState(true)
  const [jerseyDL, setJerseyDL] = useState(true)
  const [roomType, setRoomType] = useState(true)
  const [studioType, setStudioType] = useState(true)
  const [apartmentType, setApartmentType] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)

  const [requestStart, setRequestStart] = useState(null)
  const [requestEnd, setRequestEnd] = useState(null)
  const [USERID, setUSERID] = useState("")

  const [mobile, setMobile] = useState(true)

  //Price base
  const [price, setPrice] = useState(10000)

  useEffect(()=>{
    refreshAccessToken()
    getDeviceWidth()
},[])

function getDeviceWidth(){
    let width = window.innerWidth
    setMobile(width < 500)
}

const refreshAccessToken = async () => {
  try{
    const rt = localStorage.getItem("refreshToken")
    const id = localStorage.getItem("uid");
    setUSERID(id)

    //If refresh token is undefined, meaning user have not logged in
    if (rt != undefined && id != undefined) {
      
      connectSendbird(id)
    
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
          alert("An error has occured.");
          setLoggedIn(false)
        }
        else{
          alert("An error has occured.")
        }
      })
      .catch ( e => {
        alert("An error has occured.")
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

const connectSendbird = async (UID) => {
  try {
    // console.log("connecting to sendbird")
    await sb.connect(UID, function (user, error) {
      if (error) {
        // Handle error.
        console.log("Error connecting to sendbird in the App.Js")
        console.log(error)
      }
      else {
        // The user is connected to Sendbird server.
        // console.log("sendbird connected")
      }
    });
  } 
  catch (err) {
    // Handle error.
    console.log("SENDBIRD ERROR")
  }
}





  return (
    <UserContext.Provider value={{manhattanDL, setManhattanDL, queensDL, setQueensDL, brooklynDL, setBrooklynDL, jerseyDL, setJerseyDL, price, setPrice, roomType, setRoomType, studioType, setStudioType, apartmentType, setApartmentType, mobile, loggedIn, setLoggedIn, requestStart, setRequestStart, requestEnd, setRequestEnd, USERID  }}>
      <NavBar/>
      <Routes>
        
        <Route path="/" element={ <WelcomePage/> } />
        <Route path="/discoverSubleases" element={ <LandingPage/> } />
        <Route path="/subleasemyroomintro" element={ <TenantRequestPage/> } />
        <Route path="/listingDetails/:id" element={ <ListingDetails/> } />
        <Route path="/subtenantRequest/:id" element={ <SubtenantRequest/> } />
        <Route path="/subtenantRequestSuccess/:id" element={ <SubtenantRequestSuccess/> } />
        <Route path="/signup" element={ <SingupScreen/> } />
        <Route path="/login" element={ <LoginScreen/> } />
        <Route path="/signupVerify" element={ <SignupVerifyScreen/> } />
        <Route path="/termsOfServices" element={ <TermsOfServicesScreen/> } />
        <Route path="/privacy" element={ <PrivacyScreen/> } />
        <Route path="/propertyPosting" element={ <PropertyPostingScreen/> } />
        {
          loggedIn &&
          <>
            <Route path="/myRequests" element={ <MyRequestsScreen/> } />
          </>
        }
        
      </Routes>
      {/* <LandingPage/> */}
      
    </UserContext.Provider>
  );
}

export default App;
