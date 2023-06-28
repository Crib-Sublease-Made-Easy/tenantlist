import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import Lottie from "lottie-react";

import CribConnectAnimation1 from './CribConnectAnimation1.json'
import CribConnectAnimation2 from './CribConnectAnimation2.json'
import CribConnectAnimation3 from './CribConnectAnimation3.json'
import CribConnectAnimation4 from './CribConnectAnimation4.json'


import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';


import { LIGHTGREY, MEDIUMGREY, OPENSANS, PRIMARYCOLOR } from '../sharedUtils';
import { useState, useRef, useContext } from 'react';
import { Checkbox, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';


export default function TenantPaymentScreen(){
    const {mobile} = useContext(UserContext)
    const navigate = useNavigate()
    const [slideIndex, setSlideIndex] = useState(0)
    const [termsOfServices, setTermsOfServices] = useState(false)
    const SliderRef1 = useRef(null)
    const SliderRef2 = useRef(null)
    const SliderRef3 = useRef(null)
    const SliderRef4 = useRef(null)


    function handleSlideClick(index){
        if(index  < 0 || index > 3 ){
            return
        }
        setSlideIndex(index)
      
        if(index == 0){
            SliderRef1.current.scrollIntoView({behavior:'smooth'})
        }
        if(index == 1){
            SliderRef2.current.scrollIntoView({behavior:'smooth'})
        }
        if(index == 2){
            console.log("inside 2 ")
            SliderRef3.current.scrollIntoView({behavior:'smooth'})
        }
        if(index == 3){
            SliderRef4.current.scrollIntoView({behavior:'smooth'})
        }
    }

    return(
        <div style={{height: mobile ? 'auto' : '80vh', width:'100%', display:"flex", flexDirection:'row',}}>
            <div style={{width:'90vw', marginLeft:'auto', marginRight:'auto', flexDirection: mobile ? 'column' : 'row', display:'flex'}}>
                <div style={{flexDirection:"column", display:'flex', width: mobile ? '90vw' : "45vw", height:'100%', justifyContent:'center', alignItems:'center',}}>
                    <div  style={{width: mobile ? '90vw' : '40vw', overflow: mobile ? 'scroll' : "hidden", flexDirection:'row', display:'flex', paddingBottom: '5vh' }}>
                        <div ref={SliderRef1} style={{width: mobile ? '90vw' :  '40vw', flexDirection:'column', display:'flex', textAlign:'center'}}>
                            <Lottie animationData={CribConnectAnimation1} loop={false} style={{height:'40vh', width: mobile ? '90vw' : "40vw"}} />
                            <div style={{paddingTop:"2vh",  width: mobile ? '90vw' : "40vw"}}>
                                <p style={{fontFamily: OPENSANS, fontWeight:'700', fontSize:'1.3rem'}}>Unlimited messaging</p>
                                <p style={{fontFamily: OPENSANS, fontWeight:'400', fontSize:'0.9rem', color:'#737373'}}>You will be able to connect with all interested current and future subtenants. We have more than 100+ new subtenants everyday.</p>
                            </div>
                        </div>
                        <div ref={SliderRef2} style={{width: mobile ? '90vw' : '40vw',    flexDirection:'column', display:'flex',  textAlign:'center'}}>
                            <Lottie animationData={CribConnectAnimation2} loop={false} style={{height:'40vh', width: mobile ? '90vw' : "40vw"}} />
                            <div style={{paddingTop:"2vh", }}>
                                <p style={{fontFamily: OPENSANS, fontWeight:'700', fontSize:'1.3rem'}}>Verified subtenants</p>
                                <p style={{fontFamily: OPENSANS, fontWeight:'400', fontSize:'0.9rem', color:'#737373'}}>Safety is our first priority. All subtenants are verified by both email and phone verification to ensure a safe subleasing space.</p>
                            </div>
                        </div>
                        <div ref={SliderRef3} style={{width: mobile ? '90vw' : '40vw',    flexDirection:'column', display:'flex', textAlign:'center'}}>
                            <Lottie animationData={CribConnectAnimation3} loop={false} style={{height:'40vh', width: mobile ? '90vw' : "40vw"}} />
                            <div style={{paddingTop:"2vh"}}>
                                <p style={{fontFamily: OPENSANS, fontWeight:'700', fontSize:'1.3rem'}}>Expand your reach</p>
                                <p style={{fontFamily: OPENSANS, fontWeight:'400', fontSize:'0.9rem', color:'#737373'}}>We advertise your sublease in all social media channel. Don't just settle with any subtenant, find the best subtenant that fits you!</p>
                            </div>
                        </div>
                        <div ref={SliderRef4} style={{width: mobile ? '90vw' :  '40vw',    flexDirection:'column', display:'flex', textAlign:'center'}}>
                            <Lottie animationData={CribConnectAnimation4} loop={false} style={{height:'40vh', width: mobile ? '90vw' :  "40vw"}} />
                            <div style={{paddingTop:"2vh"}}>
                                <p style={{fontFamily: OPENSANS, fontWeight:'700', fontSize:'1.3rem'}}>Prefessional sublease advice</p>
                                <p style={{fontFamily: OPENSANS, fontWeight:'400', fontSize:'0.9rem', color:'#737373'}}>Get in touch with one of our staffs for sublease advice, tips and tricks. We were once students too, so we understand what makes a sublease stand out.</p>
                            </div>
                        </div>
                    </div>
                    <div style={{flexDirection:"row", display:'flex', justifyContent: 'space-between', alignItems:'center', display: mobile ? 'none' : 'flex' }}>
                        <ArrowCircleLeftIcon onClick={()=> handleSlideClick(slideIndex-1)} style={{ fontSize:"2rem", color: slideIndex == 0 ? LIGHTGREY : 'black', cursor:'pointer', display: mobile ? 'none' : 'flex'}}/>
                        <div style={{display:'flex', flexDirection:'row', marginLeft:'5vw'}}>
                            <div style={{height:10, width:10, borderRadius:5, backgroundColor: slideIndex == 0 ? PRIMARYCOLOR : LIGHTGREY}}/>
                            <div style={{height:10, width:10, borderRadius:5, marginLeft:"1vw", backgroundColor:slideIndex == 1 ? PRIMARYCOLOR : LIGHTGREY}}/>
                            <div style={{height:10, width:10, borderRadius:5, marginLeft:"1vw", backgroundColor: slideIndex == 2 ? PRIMARYCOLOR :LIGHTGREY}}/>
                            <div style={{height:10, width:10, borderRadius:5, marginLeft:"1vw",backgroundColor: slideIndex == 3 ? PRIMARYCOLOR :LIGHTGREY}}/>
                        </div>
                       
                        <ArrowCircleRightIcon  onClick={() => handleSlideClick(slideIndex+1)} style={{marginLeft:'5vw', fontSize:"2rem",  cursor:'pointer', color: slideIndex == 3 ? LIGHTGREY : 'black', display: mobile ? 'none' : 'flex'}}/>
                     
                    </div>
                </div>
                <div style={{width: mobile ? '90vw' : '45vw', height: mobile ? 'auto' : "80vh", justifyContent:'center',  flexDirection:'column', display:'flex', paddingTop: '10vh', paddingBottom:'5vh'}}>
                    <div style={{width: mobile ? '90vw' : '30vw', marginLeft:"auto", marginRight:"auto"}}>
                    <p style={{fontFamily: OPENSANS, fontWeight:'700', fontSize:'1.5rem'}}>Save thousands in rent today</p>
                    <p style={{fontFamily: OPENSANS, fontWeight:'500', fontSize:'1.1rem', marginTop: mobile ? "5vh" : "10vh"}}>Only $49.99 /month</p>
                    {/* <div style={{flexDirection:'row', display:'flex', marginTop:"3vh", alignItems:'center'}}>
                        <Checkbox checked={termsOfServices}  onChange={()=>setTermsOfServices(!termsOfServices)} style={{color:'black'}}/>
                        <p style={{fontFamily: OPENSANS, fontWeight:'400', fontSize:'0.7rem', marginBottom:0, color: '#737373'}}>Check clicking this checkbox, you are agreeing to our terms of services and privacy policy</p>
                    </div> */}
                    <div style={{marginTop:'2vh'}}>
                        <PaymentForm
            
                            applicationId="sq0idp-UOw8W4Z92X4y6u6NPJgWow"
                            cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
                                let USERID = localStorage.getItem("uid")
                              
                                await fetch("https://crib-llc.herokuapp.com/payments/receiveCribConnectWebPayments", {
                                  method: "POST",
                                  headers: {
                                    "Content-type": "application/json",
                                  },

                                  body: JSON.stringify({
                                    sourceId: token.token,
                                    uid: USERID
                                })
                                }).then( async res => {
                                    if(res.status == 200){
                                        
                                        navigate(-1)
                                       
                                    }
                                })
                                .catch( e => {
                                    alert("Error. Please try again.")
                                    console.log("Error")
                                })
                                
                                
                               
                            }}
                            createPaymentRequest={() => ({
                            countryCode: "US",
                            currencyCode: "USD",
                            total: {
                                amount: "49.99",
                                label: "Total",
                            },
                            })}
                            
                            locationId='LR8HZ3WMREHHJ'
                        >
                            <CreditCard />
                        </PaymentForm>
                        <p style={{fontFamily: OPENSANS, marginTop:'2vh', fontSize:'0.9rem', color: MEDIUMGREY}}>The charges will not be auto-renewed</p>
                    </div>

                    </div>
                </div>
                
            </div>
            {/* <div style={{width:'40vw', marginLeft:'auto', marginRight:'auto'}}>
                <div style={{width:'40vw', overflow:"scroll", flexDirection:'row', display:'flex', paddingBottom:'5vh' }}>
                    <div style={{width:'40vw', flexDirection:'column', display:'flex'}}>
                        <Lottie animationData={CribConnectAnimation1} style={{height:'40vh', width:"40vw"}} />
                        <div style={{paddingTop:"2vh", paddingRight:'5vw'}}>
                            <p style={{fontFamily: OPENSANS, fontWeight:'700', fontSize:'1.3rem'}}>Unlimited messaging</p>
                            <p style={{fontFamily: OPENSANS, fontWeight:'400', fontSize:'0.9rem', color:'#737373'}}>You will be able to connect with all interested subtenants in the future</p>
                        </div>
                    </div>
                    <div style={{width:'40vw',    flexDirection:'column', display:'flex'}}>
                        <Lottie animationData={CribConnectAnimation2} style={{height:'40vh', width:"40vw"}} />
                        <div style={{paddingTop:"2vh",  paddingRight:'5vw'}}>
                            <p style={{fontFamily: OPENSANS, fontWeight:'700', fontSize:'1.3rem'}}>Verified subtenants</p>
                            <p style={{fontFamily: OPENSANS, fontWeight:'400', fontSize:'0.9rem', color:'#737373'}}>You will be able to connect with all interested subtenants in the future</p>
                        </div>
                    </div>
                    <div style={{width:'40vw',    flexDirection:'column', display:'flex'}}>
                        <Lottie animationData={CribConnectAnimation3} style={{height:'40vh', width:"40vw"}} />
                        <div style={{paddingTop:"2vh",paddingRight:'5vw'}}>
                            <p style={{fontFamily: OPENSANS, fontWeight:'700', fontSize:'1.3rem'}}>Expand your reach</p>
                            <p style={{fontFamily: OPENSANS, fontWeight:'400', fontSize:'0.9rem', color:'#737373'}}>We advertise your sublease in all social media. Don't just settle with any subtenant, find the best subtenant that fits you!</p>
                        </div>
                    </div>
                    <div style={{width:'40vw',    flexDirection:'column', display:'flex'}}>
                        <Lottie animationData={CribConnectAnimation4} style={{height:'40vh', width:"40vw"}} />
                        <div style={{paddingTop:"2vh",paddingRight:'5vw'}}>
                            <p style={{fontFamily: OPENSANS, fontWeight:'700', fontSize:'1.3rem'}}>Verified subtenants</p>
                            <p style={{fontFamily: OPENSANS, fontWeight:'400', fontSize:'0.9rem', color:'#737373'}}>You will be able to connect with all interested subtenants in the future</p>
                        </div>
                    </div>
                </div>
                
                <PaymentForm
                    applicationId="sq0idp-UOw8W4Z92X4y6u6NPJgWow"
                    cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
                        // const response = await fetch("localhost:8082/payments/receiveCribConnectWebPayments", {
                        //   method: "POST",
                        //   headers: {
                        //     "Content-type": "application/json",
                        //   },

                        //   body: JSON.stringify({sourceId: token.token})
                        // });
                        
                        // console.log(await response.json());
                        console.log(token)
                    }}
                    createPaymentRequest={() => ({
                    countryCode: "US",
                    currencyCode: "USD",
                    total: {
                        amount: "0.50",
                        label: "Total",
                    },
                    })}
                    
                    locationId='LR8HZ3WMREHHJ'
                >
                    <CreditCard />
                </PaymentForm>
            </div> */}

        </div>
    )
}