import { Button } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { PRIMARYCOLOR } from "../../sharedUtils"

import TenantSVG1 from '../../tenantSVG1.svg'
import TenantSVG2 from '../../tenantSVG2.svg'
import TenantSVG3 from '../../tenantSVG3.svg'
import NYnight from '../../NYnight.jpeg'
import worldSVG from '../../worldSVG.svg'


import { Fade } from "react-awesome-reveal";

//SVG icons


export default function TenantRequestPage(){

    const [mobile, setMobile] = useState(null)

    useEffect(()=>{
        getDeviceWidth()
    },[])

    function getDeviceWidth(){
        let width = window.innerWidth
        setMobile(width < 400)
    }

    function handleTryNowClick(){
        window.location = 'https://apps.apple.com/us/app/crib-subleasing-made-easy/id1645127110'
    }

    function handleHowItWorksClick(){
        let height = window.innerHeight*0.9
        window.scrollTo({
            top: height,
            behavior: 'smooth'
        });
    }

    return (
        <div style={{ height: '90vh', alignSelf:'center',textAlign:'center',}}>
            <div style={{paddingTop: mobile ? '5vh' : '10vh', paddingBottom: mobile ? '5vh' : '10vh', }}>
                <Fade delay={200} duration={1200} direction='up' triggerOnce>
                    <p style={{fontWeight:'700', textAlign:'center', fontSize: mobile ? '1.5rem' : '3rem', alignSelf:'center', justifyContent:'center',}}>We find suitable tenants for you, <br/>so you don't have to!</p>
                    <p style={{textAlign:'center', alignSelf:'center', justifyContent:'center', fontSize: mobile ? '1rem' : '1.2rem', maxWidth:500, margin: 'auto' }}>Tell us some basic information about your sublease and we will find a suitable tenant for you.</p>
                
                    <div style={{width: mobile ? '90vw' : '60vw', margin: 'auto', marginTop: 40, height: '30vh',  borderRadius: 25, display: mobile ? 'block' : 'none'}}>
                        <img src={NYnight} style={{ borderRadius: 5, objectFit:'cover', width: '100%', height:'100%'}} />
                    </div>
                    <div style={{flexDirection:'row',  alignSelf: 'center', justifyContent:'center', alignItems:'center', maxWidth: '400', marginTop: 20, }}>
                        <Button onClick={handleHowItWorksClick} style={{color: PRIMARYCOLOR, borderColor: PRIMARYCOLOR, marginTop: mobile ? 40 : 20}} variant="outlined">How does it work?</Button>
                        <Button onClick={handleTryNowClick} style={{backgroundColor: PRIMARYCOLOR,  marginLeft: mobile ? 20 : 20, marginTop: mobile ? 40 : 20, }} variant="contained">Try now</Button>
                    </div>
                </Fade>
                <div style={{width: '90vw', paddingTop:'2.5vh', paddingBottom: '2.5vh', backgroundColor: 'rgba(45, 102, 116,0.2)', marginTop: '10vh', marginLeft:'auto', marginRight:'auto', borderRadius:20, flexDirection: mobile ? 'column' : 'row', display:'flex', justifyContent:'space-between'}}>
                    <div style={{flex: 1, }}>
                        <p style={{fontWeight:'700', textAlign: 'center', fontSize: mobile ? '2rem' : '3rem', alignSelf:'center', justifyContent:'center', color: PRIMARYCOLOR, paddingBottom:0, marginBottom:0 }}>917+</p>
                        <p style={{fontWeight:'500', textAlign: 'center', fontSize: mobile ? '1rem' : '1.1rem', alignSelf:'center', justifyContent:'center', }}>User trusted us</p>
                    </div>
                    <div style={{flex: 1,  }}>
                        <p style={{fontWeight:'700', textAlign: 'center' , fontSize: mobile ? '2rem' : '3rem', alignSelf:'center', justifyContent:'center',  color: PRIMARYCOLOR, paddingBottom:0, marginBottom:0}}>1017+</p>
                        <p style={{fontWeight:'500', textAlign: 'center', fontSize: mobile ? '1rem' : '1.1rem', alignSelf:'center', justifyContent:'center', }}>Properties posted</p>

                    </div>
                    <div style={{flex: 1,  }}>
                        <p style={{fontWeight:'700', textAlign: 'center' , fontSize: mobile ? '2rem' : '3rem', alignSelf:'center', justifyContent:'center',  color: PRIMARYCOLOR, paddingBottom:0, marginBottom:0}}>4.3</p>
                        <p style={{fontWeight:'500', textAlign: 'center', fontSize: mobile ? '1rem' : '1.1rem', alignSelf:'center', justifyContent:'center', }}>Average days to find a tenant</p>

                    </div>
                </div>
            </div>
            <div style={{justifyContent:'center', alignItems:'center', paddingBottom: mobile ? '5vh' : '10vh', paddingTop:'5vh'}}>
                <Fade  duration={1200} direction='up' triggerOnce>
                    <p style={{fontWeight:'700', textAlign:'center', fontSize: mobile ? '1.5rem' : '3rem', alignSelf:'center', justifyContent:'center',}}>How does it work?</p>
                    <p style={{textAlign:'center', alignSelf:'center', justifyContent:'center', fontSize: mobile ? '1rem' : '1.2rem', maxWidth:500, margin: 'auto' }}>We find the perfect tenant for your sublease</p>
                </Fade>
                {/* <p style={{fontWeight:'600', textAlign: mobile ? 'center' : 'start', fontSize: mobile ? '1.5rem' : '2.2rem', alignSelf:'center', justifyContent:'center', width:'90vw', margin:'auto'}}>How does it work?</p> */}
                
                    <div style={{alignItems:'center', flexDirection: mobile ? 'column' : 'row', display:'flex', marginTop: mobile ? "10vh" : '15vh', paddingBottom: mobile ? '5vh' : '5vh', }}>
                        <Fade duration={800}  cascade style={{flex: 1, displat:'flex'}} triggerOnce>
                            <div style={{maxWidth: mobile ? '90vw' : '25vw', marginLeft:'auto', marginRight: 'auto'}}>
                                <div style={{ height: '20vh', }}>
                                    <img src={TenantSVG1} style={{height: '100%'}}/>
                                </div>
                                <p style={{fontWeight:'600', textAlign:'center', fontSize: mobile ? '1.3rem' : '1.5rem', alignSelf:'center', justifyContent:'center', marginTop: 20}}>Enter sublease info</p>
                                <p style={{textAlign:'center', alignSelf:'center', justifyContent:'center', fontSize: mobile ? '1rem' : '1.2rem', maxWidth: 500, margin: 'auto' }}>Tell us a little bit about your sublease, such as location, availabilit, rent etc.</p>
                            </div>

                            <div style={{maxWidth: mobile ? '90vw' : '25vw', marginTop: mobile ? '10vh' : 0,  marginLeft:'auto', marginRight: 'auto' }}>
                                <div style={{ height: '20vh',}}>
                                    <img src={TenantSVG2} style={{height: '100%'}}/>
                                </div>
                                <p style={{fontWeight:'600', textAlign:'center', fontSize: mobile ? '1.3rem' : '1.5rem', alignSelf:'center', justifyContent:'center', marginTop: 20}}>We find tenants</p>
                                
                                <p style={{textAlign:'center', alignSelf:'center', justifyContent:'center', fontSize: mobile ? '1rem' : '1.2rem', maxWidth:500, margin: 'auto' }}>We have a database of over 100k users, we find the most suitable tenant for you</p>
                            </div>

                            <div style={{maxWidth: mobile ? '90vw' : '25vw', marginLeft:'auto', marginRight: 'auto', marginTop: mobile ? '10vh' : 0,}}>
                                <div style={{ height: '20vh',}}>
                                    <img src={TenantSVG3} style={{height: '100%'}}/>
                                </div>
                                <p style={{fontWeight:'600', textAlign:'center', fontSize: mobile ? '1.3rem' : '1.5rem', alignSelf:'center', justifyContent:'center', marginTop: 20}}>Connect with tenants</p>
                                <p style={{textAlign:'center', alignSelf:'center', justifyContent:'center', fontSize: mobile ? '1rem' : '1.2rem', maxWidth:500, margin: 'auto' }}>Connect with preverified tenants so you can save thousands each month in rent</p>
                            </div>
                        </Fade>
                    </div>
                
            </div>
            <div>
                <Fade  duration={1200} direction='up' triggerOnce>
                    <p style={{fontWeight:'700', textAlign:'center', fontSize: mobile ? '1.5rem' : '3rem', alignSelf:'center', justifyContent:'center',}}>Maximize your savings</p>
                    <p style={{textAlign:'center', alignSelf:'center', justifyContent:'center', fontSize: mobile ? '1rem' : '1.2rem', maxWidth:500, margin: 'auto' }}>Save thousands each month in rent right now</p>
                </Fade>

            </div>
            
            {/* <p style={{fontWeight:'700', textAlign:'center', fontSize: mobile ? '1.5rem' : '2.2rem', alignSelf:'center', justifyContent:'center',}}>Why us</p> */}
            <div style={{flexDirection: mobile ? 'column-reverse' : 'row', display:'flex', width: '90vw', marginLeft: 'auto', marginRight: 'auto',  paddingBottom: mobile ? '25vh' : '15vh', marginTop: '10vh'}}>
                <div style={{flex: 1, alignItems:'flex-start', textAlign:'start', marginTop: mobile ? '5vh' : 0}}>
                    <div>
                        <p style={{ fontWeight: '800', color: PRIMARYCOLOR, fontSize: '4rem', marginBottom:0,}}>O1</p>
                        <p style={{ fontWeight: '700', fontSize: '2rem'}}>Advertise daily</p>
                        <p style={{ fontWeight: '500', fontSize: '1rem', width: mobile ? '90vw' : '90%'}}>We advertise daily on all social media channels to acheive best results, we analyze when's best time to reach the most amount of audiences.</p>
                    </div>
                    <div>
                        <p style={{ fontWeight: '800', color: PRIMARYCOLOR, fontSize: '4rem', marginBottom:0,}}>O2</p>
                        <p style={{ fontWeight: '700', fontSize: '2rem'}}>Smarter reach</p>
                        <p style={{ fontWeight: '500', fontSize: '1rem', width: mobile ? '90vw' : '90%'}}>We have access and knowledge to subleasing platforms used by majority of students and digital nomads.</p>
                    </div>
                    <div>
                        <p style={{ fontWeight: '800', color: PRIMARYCOLOR, fontSize: '4rem', marginBottom:0,}}>O3</p>
                        <p style={{ fontWeight: '700', fontSize: '2rem'}}>We do all the work</p>
                        <p style={{ fontWeight: '500', fontSize: '1rem', width: mobile ? '90vw' : '90%'}}>Once you tell us about your sublease, that's it! It is hands off from your side and we will take over and find the best tenant for you.</p>
                    </div>
                </div>
                <div style={{flex: 1,maxWidth: mobile ? '80vw' :'45vw', alignItems:'center', display:'flex', alignSelf:'center'}}>
                    <img src={worldSVG} style={{width: '100%', margin:'auto'}}/>
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}