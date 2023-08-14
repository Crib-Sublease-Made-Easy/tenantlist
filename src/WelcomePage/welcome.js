import { EXTRALIGHT, LIGHTGREY, MEDIUMGREY, MEDIUMROUNDED, OPENSANS, PRIMARYCOLOR } from '../sharedUtils'
import { Button } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../UserContext'
import BudgetSVG from './budgetSVG.svg'
import LocalSVG from './LocalsSVG.svg'
import HassleFreeSVG from './HasstleSVG.svg'
import MoneySVG from './MoneySVG.svg'
import WelcomeImage from './WelcomeImage.jpg'
import WelcomeImage2 from './WelcomeImage2.jpg'
import WelcomeImage3 from './WelcomeImage3.jpg'
import WelcomeImage4 from './WelcomeImage4.png'

import Lottie from "lottie-react";
import StressFreeAnimation from './StressFreeAnimation.json'

import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import ChairOutlinedIcon from '@mui/icons-material/ChairOutlined';

import BlackDudeFeedback from './UserFeedbackImage/feedbackImage1.jpg'
import AsianDudeFeedback from './UserFeedbackImage/feedbackImage2.jpg'

import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import PersonAddDisabledOutlinedIcon from '@mui/icons-material/PersonAddDisabledOutlined';
import DoorFrontOutlinedIcon from '@mui/icons-material/DoorFrontOutlined';

import GroupIcon from '@mui/icons-material/Group';
import SellIcon from '@mui/icons-material/Sell';
import BusinessIcon from '@mui/icons-material/Business';
import ContactMailIcon from '@mui/icons-material/ContactMail';

import { TypeAnimation } from 'react-type-animation';

import LowerManhattanImage from './Locations/lowermanhattan.jpeg'
import UpperManhattanImage from './Locations/uppermanhattan.jpg'
import JerseyCityImage from './Locations/jerseycity.jpg'
import MidtownImage from './Locations/midtown.jpg'
import LICImage from './Locations/lic.jpg'
import BrooklynImage from './Locations/brooklyn.jpg'

//FAQ Accordian 
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


//Icon
import CheckIcon from '@mui/icons-material/Check';


const CRIBPROS = [{name : "Budget friendly", content : "Most of our sublets are on a discounted rent price. Request to book before they're gone.", img: BudgetSVG},
{name : "Simple process", content: "Crib provides a seamless and efficient process from start to finish. Secure your ideal sublease in no time.", img: LocalSVG},
]

const NYLOCATIONS = [
    {name:"Lower Manhattan", image: LowerManhattanImage},
    {name:"Upper Manhattan", image: UpperManhattanImage},
    {name:"Jersey City", image: JerseyCityImage},
    {name:"Midtown", image: MidtownImage},
    {name:"Long Island City", image:LICImage},
    {name:"Brooklyn", image: BrooklynImage}    
]

export default function WelcomePage(){
    const navigate = useNavigate()
    const {mobile, loggedIn} = useContext(UserContext)


    function handleNav(route){
        navigate(route)
    }

    function postProperty(){
        let at = localStorage.getItem("accessToken")
        if(at = null){
            alert("Please login or sign up to post a property")
            navigate("/login")
            return
        }
        else{
            handleNav('/propertyPosting')
        }
        
    }

    function handleFindSubleaseClick(){
        localStorage.setItem("promptSubtenantForm", 1)
        handleNav('/discoverSubleases')
    }

    return(
        <div style={{width:'100vw'}}>
        <div style={{ height: mobile ? 'auto' : 'auto', width:'100vw', flexDirection: mobile ? 'column-reverse' : 'row', display:'flex', paddingLeft: mobile ? 0 : '5vw', justifyContent:'space-between',   }}>
          
            <div style={{height:'auto', flexDirection:'column', marginTop: mobile ? '3vh' : 0, justifyContent:'center', display:'flex', alignItems: 'left', width:'100%', paddingLeft: mobile ? '5vw' : 0  }}>
                
                <div style={{display:'flex', flexDirection:'row', width:'90%'}}>
                    {mobile ?
                    <p style={{fontWeight:'800', fontFamily: OPENSANS, fontSize: '2.1rem'}}>Subleasing Made Easy</p>
                    :
                    <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: '2.8rem'}}>Subleasing made easy</p>
                    }
                </div>
                <div>
                    <p style={{fontFamily: OPENSANS, fontWeight:'500', width: mobile ? '90vw' : '80%', color:'black', textAlign: 'left', fontSize: mobile ? '1rem' : '1.1rem', marginTop:  0}}>Tired of subleasing on Facebook? Sublease with Crib faster, safer and easier just like booking an Uber or an Airbnb.</p>
                </div>
                <div style={{flexDirection: mobile ? 'column' : 'row', display:'flex', marginTop: mobile ? '2vh' : '2vh', }}>
                    <Button onClick={handleFindSubleaseClick} style={{backgroundColor: PRIMARYCOLOR, color: 'white', padding: 15, textTransform:'none', outline:'none', borderRadius: 25, width: mobile ? '90vw' : 'auto'}}> 
                        <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'600'}}>Find a Sublease</p>
                    </Button>
                    <Button onClick={postProperty} variant="contained" style={{color: MEDIUMGREY, padding: 15, backgroundColor:'white', boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.2)', marginLeft: mobile ? 0 : '2vh', textTransform:'none', marginTop: mobile ? '2vh' : 0, outline:'none', borderRadius: 25, borderColor: LIGHTGREY, borderWidth:'1px', borderStyle:'solid', width: mobile ? '90vw' : 'auto' }}>
                        <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'600'}}>Post a Sublease</p>
                    </Button>
                </div>
                
                <div style={{flexDirection:'row', display:'flex', marginTop:'7vh',width: mobile ? '90vw' : 'auto', justifyContent: mobile ? 'space-between': 'flex-start'}}>
                    <div style={{display:"flex", flexDirection:'column', }}>
                        <p style={{fontWeight:'400', fontFamily: OPENSANS, fontSize: '0.9rem', marginBottom:0}}><span style={{fontWeight:"700", fontSize: mobile ? '1.7rem' : '1.3rem'}}>4000+</span><br/>Verified users</p>
                    </div>
                    <div style={{display:"flex", flexDirection:'column', marginLeft:"2vw"}}>
                        <p style={{fontWeight:'400', fontFamily: OPENSANS, fontSize: '0.9rem', marginBottom:0}}><span style={{fontWeight:"700", fontSize: mobile ? '1.7rem' : '1.3rem'}}>1200+</span><br/>Place posted</p>
                    </div>
                    <div style={{display:"flex", flexDirection:'column', marginLeft:"2vw"}}>
                        <p style={{fontWeight:'400', fontFamily: OPENSANS, fontSize: '0.9rem', marginBottom:0}}><span style={{fontWeight:"700", fontSize: mobile ? '1.7rem' : '1.3rem'}}>$2.5M+</span><br/>Rent saved</p>
                    </div>
                   
                </div>
                
            </div>
            <div style={{flexDirection:'column', justifyContent:'flex-start', height:'auto',}}>
                <div style={{ alignItems:'center', display:'flex'}}>
                    <img src={WelcomeImage3} style={{width: mobile ? '100vw' : '45vw', height: mobile ?'auto' : '70vh', alignSelf:'center', marginLeft:'auto', marginRight:'auto',  borderWidth:'1px', borderColor: LIGHTGREY, borderStyle:'solid', objectFit:'cover'}} />
                </div>
            </div>
        </div>
        {/* <div style={{ height: 'auto', width:'100vw', flexDirection: mobile ? 'column' : 'row', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', paddingTop: mobile ? '5vh' : '10vh', paddingBottom: mobile ? '5vh' : '10vh', backgroundColor: 'white', justifyContent:'space-between', alignItems:'center'}}>
            <div style={{width:'90vw', paddingTop:"3vh", paddingBottom:"3vh", backgroundColor: 'rgba(45,102,116,0.07)', borderRadius: MEDIUMROUNDED, flexDirection:'row', marginLeft:"auto", marginRight:'auto', display:'flex', justifyContent:'space-between', paddingLeft:'2.5vw', paddingRight:'2.5vw'}}>
                <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize: '2rem', marginBottom:0}}>Hear from<br/>our users</p>
                <div style={{flexDirection:'row', display:'flex'}}>
                    <div style={{display:"flex", flexDirection:'column', flex: 1}}>
                        <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize: '1rem', marginBottom:0}}><span style={{fontWeight:"700", fontSize: '2.5rem'}}>4000+</span><br/>Verified users</p>
                    </div>
                    <div style={{display:"flex", flexDirection:'column', flex: 1, marginLeft:"5vw"}}>
                        <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize: '1rem', marginBottom:0}}><span style={{fontWeight:"700", fontSize: '2.5rem'}}>1200+</span><br/>Subleases</p>
                    </div>
                    <div style={{display:"flex", flexDirection:'column', flex: 1, marginLeft:"5vw"}}>
                        <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize: '1rem', marginBottom:0}}><span style={{fontWeight:"700", fontSize: '2.5rem'}}>2000+</span><br/>Connections</p>
                    </div>
                    <div style={{display:"flex", flexDirection:'column', flex: 1, marginLeft:"5vw"}}>
                        <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize: '1rem', marginBottom:0}}><span style={{fontWeight:"700", fontSize: '2.5rem'}}>$1.2M+</span><br/>Rent saved</p>
                    </div>
                </div>
            </div>
        </div> */}
        
        {/* <div style={{ height: 'auto', width:'100vw', flexDirection: 'column', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', paddingTop: mobile ? '5vh' : '10vh', paddingBottom: mobile ? '5vh' : '10vh', justifyContent:'space-between', alignItems:'center'}}>
            <TypeAnimation
            sequence={[
                // Same substring at the start will only be typed out once, initially
                'A bad sublease ruins your internship',
                2000, // wait 1s before replacing "Mice" with "Hamsters"
                'A bad sublease ruins your vacation',
                2000,
                'A bad sublease ruins your work',
                2000,
                'A bad sublease ruins your travel!',
                2000,
                'A bad sublease ruins your mood',
                2000
            ]}
            wrapper="span"
            speed={30}
            style={{ fontSize: mobile ? '1.5rem' : '3rem', display: 'inline-block', fontFamily: OPENSANS, fontWeight:'600' }}
            repeat={Infinity}
            />
        </div> */}
        <div style={{ height: 'auto', width:'100vw', flexDirection: 'column', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', paddingTop: mobile ? '5vh' : '10vh', paddingBottom: mobile ? '5vh' : '10vh', justifyContent:'space-between', alignItems:'center', backgroundColor: 'rgba(45,102,116,0.06)', marginTop: mobile ? '7vh' : 0}}>
            
        <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: mobile ? '1.5rem' : '2.1rem', textAlign:'left', width:'100%'}}>Search by location</p>
            <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', width:'100%', marginTop:'5vh',width:'90vw', overflow:'scroll' }}>
                {
                    NYLOCATIONS.map((item, index) => {
                        return (
                            <div style={{cursor:'pointer', marginLeft: index == 0 ? 0 :  mobile ? '5vw' : '2vw',}}>
                                <div style={{height:'25vh', width: mobile ? '30vw' : '12vw',  backgroundColor: EXTRALIGHT, borderRadius: MEDIUMROUNDED, display:'flex', justifyContent:'center', alignItems:'flex-end'}}>
                                    <img src={item.image} style={{height:'100%', width:'100%', borderRadius: MEDIUMROUNDED, objectFit:'cover'}}/>
                                </div>
                                <p style={{fontWeight:"500", fontFamily: OPENSANS, color:'black', textAlign:"center", marginTop:'1vh'}}>{item.name}</p>
                            </div>
                        )
                    })
                }
            </div>
            
        </div>
       
        {/* <div style={{ height: 'auto', width:'100vw', flexDirection: 'column', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', paddingTop: mobile ? '5vh' : '10vh', paddingBottom: mobile ? '5vh' : '10vh', backgroundColor: 'white', justifyContent:'space-between', alignItems:'center'}}>
            <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: '2.1rem',}}>1/3 of your day is spent in your subleases</p>
            <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize: '1.4rem', marginBottom:0, width:'80%', textAlign:'center' }}>A bad sublease can ruin your mood no matter if you're interning, traveling or working. That's why Crib is here to make your subleasing experience easier, cheaper and safety than ever!</p>
        </div> */}
        <div style={{ height: 'auto', width:'90vw', flexDirection: mobile ? 'column-reverse' : 'row', display:'flex', marginLeft: 'auto', marginRight:'auto', paddingTop: mobile ? '5vh' : '15vh', paddingBottom: mobile ? '5vh' : '10vh',  justifyContent:'space-between', alignItems:'center'}}>

            <div style={{height: mobile ? '40vh' : '45vh', display:'flex', flexDirection:'column', width: mobile ? '90vw' : '35vw', marginTop: mobile ? '5vh' : 0, justifyContent:'center'}}>
                <p style={{ fontFamily: OPENSANS, fontWeight:'700',fontSize: mobile ? '1.5rem' : '2.1rem', }}>Find suitable subleases in just 3 steps</p>
                <p style={{fontFamily: OPENSANS, fontWeight:'400', width: mobile ? '100%' : '100%', color:'black', textAlign: 'left', fontSize:'1rem'}}>Filter and locate the sublease that fits your needs. Request to sublease from the tenant and pay a deposit once the tenant accepts your request. Move into your new sublease with no stress!</p>
                <p style={{ fontFamily: OPENSANS, fontWeight:'700',fontSize: mobile ? '1.1rem' : '1.1rem', width:'100%', textDecorationLine:'underline' , color: PRIMARYCOLOR, cursor:'pointer', marginTop:'2vh'}}>How Crib Works?</p>
            </div>
            <img src={WelcomeImage2} style={{width: mobile ? '90vw' : '45vw', height: mobile ? '40vh' : '55vh',  objectFit:'cover'}}/>


        </div>
        <div style={{ height: 'auto', width:'100vw', flexDirection: mobile ? 'column' : 'row', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', paddingTop: '5vh', paddingBottom: '10vh', backgroundColor: 'white', justifyContent:'space-between', alignItems:'center'}}>
            <div style={{flexDirection:"row", display:'flex', width: mobile ? '100%' : '50%', marginLeft:"auto", marginRight:'auto', }}>
                <div style={{width: mobile ? '50%' : '20vw', height: mobile ? '35vh' : '50vh', position:'relative'}}>
                    
                    <img src={WelcomeImage3} style={{width: '100%', height: '100%', objectFit:'cover', borderRadius: MEDIUMROUNDED}}/>
                    <div style={{position:'absolute', width: mobile ? '90%' : '15vw', height:'5vh', bottom:'2.5vh', left:'50%', transform: 'translate(-50%, 0)', backgroundColor:"white", borderRadius:MEDIUMROUNDED, justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column'}}>
                        <p style={{fontFamily: OPENSANS, fontWeight:'500', marginBottom:0, color:'black', fontSize: mobile ? '0.8rem' : '0.9rem',  }}>Other website: <span style={{color:'red', fontWeight:'600'}}>$3750</span></p>
                    </div>
                </div>
                <div style={{width: mobile ? '50%' : '20vw',  height: mobile ? '35vh' : '50vh', position:'relative', marginLeft:'1vw', justifyContent:'center'}}>
                    
                    <img src={WelcomeImage3} style={{width: '100%', height: '100%',objectFit:'cover',  borderRadius: MEDIUMROUNDED}}/>
                    <div style={{position:'absolute',  width: mobile ? '90%' : '15vw', height:'5vh', bottom:'2.5vh',  backgroundColor:"white", left:'50%', transform: 'translate(-50%, 0)', borderRadius:MEDIUMROUNDED, justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column'}}>
                        <p style={{fontFamily: OPENSANS, fontWeight:'500', marginBottom:0, color:'black', fontSize:  mobile ? '0.8rem' : '0.9rem' }}>Crib: <span style={{color:'green', fontWeight:'600'}}>$3000</span></p>
                    </div>
                </div>
            </div>
            <div style={{flexDirection:'column', display:'flex', width: mobile ? '100%' : '50%', height: mobile ? 'auto' : '50vh', justifyContent: mobile ? 'none' : 'center', alignItems:'flex-start',marginTop: mobile ? '5vh' : 0,  }}>
                
                <p style={{ fontFamily: OPENSANS, fontWeight:'700',fontSize: mobile ? '1.5rem' : '2.1rem', }}>Same place, but cheaper</p>
                <p style={{fontFamily: OPENSANS, fontWeight:'400', width: mobile ? '100%' : '100%', color:'black', textAlign: 'left', fontSize:'1rem'}}>You’re subleasing from real locals, not vacation rentals nor property managers. You automatically get the best price or even a discount on rent.</p>
                <div style={{display:"flex", flexDirection:'row', marginTop: mobile ? '2vh' : '4vh',}}>
                    <div style={{flexDirection:'column', display:'flex', textAlign:'center', alignItems:'center'}}>
                        <BedOutlinedIcon style={{fontSize: '2rem', color: '#737373'}}/>
                        <p style={{ fontFamily: OPENSANS, fontWeight:'600',fontSize: mobile ? '1rem' : '1rem', marginBottom:0, marginTop:'1vh'}}>Room</p>
                        <p style={{ fontFamily: OPENSANS, fontWeight:'400',fontSize: mobile ? '0.8rem' : '0.8rem', }}>From $1200</p>
                    </div>
                    <div style={{flexDirection:'column', display:'flex', textAlign:'center', alignItems:'center', marginLeft: '2vw'}}>
                        <ApartmentOutlinedIcon style={{fontSize: '2rem', color: '#737373'}}/>
                        <p style={{ fontFamily: OPENSANS, fontWeight:'600',fontSize: mobile ? '1rem' : '1rem', marginBottom:0, marginTop:'1vh'}}>Apartment</p>
                        <p style={{ fontFamily: OPENSANS, fontWeight:'400',fontSize: mobile ? '0.8rem' : '0.8rem', }}>From $3500</p>
                    </div>
                    <div style={{flexDirection:'column', display:'flex', textAlign:'center', alignItems:'center', marginLeft: '2vw'}}>
                        <ChairOutlinedIcon style={{fontSize: '2rem', color: '#737373'}}/>
                        <p style={{ fontFamily: OPENSANS, fontWeight:'600',fontSize: mobile ? '1rem' : '1rem', marginBottom:0, marginTop:'1vh'}}>Studio</p>
                        <p style={{ fontFamily: OPENSANS, fontWeight:'400',fontSize: mobile ? '0.8rem' : '0.8rem', }}>From $3200</p>
                    </div>
                </div>
                <div style={{display:'block'}}>
                    <p style={{ fontFamily: OPENSANS, fontWeight:'700',fontSize: mobile ? '1.1rem' : '1.1rem',  borderBottomWidth:'2px', borderBottomStyle:'solid', borderBottomColor: PRIMARYCOLOR, paddingBottom:'0.5vh', color: PRIMARYCOLOR, cursor:'pointer', marginTop:'4vh', marginBottom:0,}}>Browse subleases</p>
                </div>
                
            </div>
        </div>

        <div style={{ height: mobile ? 'auto' : 'auto', width:'90%', flexDirection: mobile ? 'column-reverse' : 'row', display:'flex',paddingTop: mobile ? '5vh' : '5vh', paddingBottom: mobile ? '5vh' : '15vh',  justifyContent:'space-between', alignItems:'center', marginLeft:'auto', marginRight:'auto'}}>

            <div style={{display:'flex', flexDirection:'column', width: mobile ? '90vw' : '45vw', marginTop: mobile ? '5vh' : 0, justifyContent:'center', }}>
                
                <div style={{paddingRight:'5%'}}>
                    <p style={{ fontFamily: OPENSANS, fontWeight:'700',fontSize: mobile ? '1.5rem' : '2.1rem', }}>Sublease with a piece of mind</p>
                    <p style={{fontFamily: OPENSANS, fontWeight:'400', width: mobile ? '100%' : '100%', color:'black', textAlign: 'left', fontSize:'1rem'}}>We do our best to verify each tenant and sublease so each subleasing process goes smoothly. Don't risk being scammed for thousands on dollars on other websites and platforms.</p>
                </div>
                <div style={{marginTop:'4vh', flexDirection:'row', display:'flex'}}>
                    <div style={{width:'12vw', }}>
                        <AssignmentIndOutlinedIcon style={{fontSize: '2rem', color: '#737373', marginLeft:'0.5vw', color: PRIMARYCOLOR}}/>
                        <p style={{fontFamily: OPENSANS, fontWeight:'700', width: mobile ? '100%' : '100%', color:'black', textAlign: 'left', fontSize:'0.9rem', color: PRIMARYCOLOR, borderLeftWidth:'2px', borderLeftStyle:'solid', borderLefttColor: PRIMARYCOLOR, paddingLeft:'0.5vw', marginTop:'1vh'}}>Verified users</p>
                        <p style={{fontFamily: OPENSANS, color:'black', textAlign: 'left', fontSize:'0.9rem', color: '#737373'}}>We verify all users with email and phone no.</p>
                    </div>
                    <div style={{width:'12vw', marginLeft:'2vw' }}>
                        <PersonAddDisabledOutlinedIcon style={{fontSize: '2rem', color: '#737373', marginLeft:'0.5vw', color: PRIMARYCOLOR}}/>
                        <p style={{fontFamily: OPENSANS, fontWeight:'700', width: mobile ? '100%' : '100%', color:'black', textAlign: 'left', fontSize:'0.9rem', color: PRIMARYCOLOR, borderLeftWidth:'2px', borderLeftStyle:'solid', borderLefttColor: PRIMARYCOLOR, paddingLeft:'0.5vw', marginTop:'1vh'}}>Low dropout</p>
                        <p style={{fontFamily: OPENSANS, color:'black', textAlign: 'left', fontSize:'0.9rem', color: '#737373'}}>Compensated for last minute dropouts</p>
                    </div>
                    <div style={{width:'12vw', marginLeft:'2vw' }}>
                        <DoorFrontOutlinedIcon style={{fontSize: '2rem', color: '#737373', marginLeft:'0.5vw', color: PRIMARYCOLOR}}/>
                        <p style={{fontFamily: OPENSANS, fontWeight:'700', width: mobile ? '100%' : '100%', color:'black', textAlign: 'left', fontSize:'0.9rem', color: PRIMARYCOLOR, borderLeftWidth:'2px', borderLeftStyle:'solid', borderLefttColor: PRIMARYCOLOR, paddingLeft:'0.5vw', marginTop:'1vh'}}>Seamless move-in</p>
                        <p style={{fontFamily: OPENSANS, color:'black', textAlign: 'left', fontSize:'0.9rem', color: '#737373'}}>Preview all sublease details in one go</p>
                    </div>
                </div>
                {/* <p style={{ fontFamily: OPENSANS, fontWeight:'700',fontSize: mobile ? '1.1rem' : '1.1rem', width:'100%', textDecorationLine:'underline', color: PRIMARYCOLOR, cursor:'pointer', marginTop:'4vh', marginBottom:0}}>Browse Popular Subleases</p> */}

                {/* <div>
                    <p style={{ fontFamily: OPENSANS, fontWeight:'600',fontSize: mobile ? '1.1rem' : '1.1rem', marginTop:'4vh' }}>"Subleasing should be easy, cheap and safe, <br style={{display: mobile ? 'none' : 'flex'}}/> and Crib are here to make that happen."</p>
                    <div style={{flexDirection:'row', display:'flex', width:'100%', alignItems:'center'}}>
                        <img src={WelcomeImage} style={{width: mobile ? '15vw' : '5vw', height: mobile ? '15vw' : '5vw', borderRadius: mobile ? '7.5vw' : '2.5vw'}} />
                        <div style={{paddingLeft: mobile ? '2vw' : '1vw', display:'flex', flexDirection:'column', height:'100%',}}>
                            <p style={{ fontFamily: OPENSANS, fontWeight:'600',fontSize: mobile ? '1rem' : '1rem', marginBottom:0 }}>Isaac Lee</p>
                            <p style={{ fontFamily: OPENSANS, fontWeight:'500',fontSize: mobile ? '0.9rem' : '0.9rem', marginBottom:0 }}>Founder of Crib</p>

                        </div>
                    </div>
                </div> */}
            </div>
            <div style={{height: mobile ? 'auto' : 'auto', display:'flex', width: mobile ? '100%' : '45vw',justifyContent:'center',    }}>
                <img src={WelcomeImage3} style={{width: '100%', height: '100%',objectFit:'cover'}}/>

                {/* <ul style={{columnCount:2,  listStyle:'none', listStyleType:'none', paddingLeft:0, paddingTop: mobile ? '3vh' : 0, paddingBottom:  mobile ? '3vh' : 0, }}>
                    
                    <li style={{textAlign: 'center', width: mobile ? '40vw' : "20vw", height: mobile ? '40vw' : '20vw',  backgroundColor:"white", justifyContent:'center',alignItems:'center', display:'flex', flexDirection:'column', paddingLeft:'5%', paddingRight:'5%', borderRadius:MEDIUMROUNDED, borderWidth: 1, borderStyle:'solid', borderColor: LIGHTGREY }}>
                       
                        <GroupIcon style={{fontSize: mobile ? '2rem': "3rem", color:'black'}}/>
                        <p style={{fontFamily: OPENSANS, fontWeight:'600', marginBottom:0, color:'black', fontSize: mobile ? '0.9rem' : '1.1rem', marginTop:'1vh' }}>Verified users</p>
                        <p style={{fontFamily: OPENSANS, fontWeight:'400', marginBottom:0, fontSize:'0.9rem',  }}>All users have to be verified through email and phone </p>
                    
                    </li>
                    <li style={{textAlign: 'center', width: mobile ? '40vw' : "20vw", height: mobile ? '40vw' : '20vw',  backgroundColor:"white", justifyContent:'center',alignItems:'center', display:'flex', flexDirection:'column', paddingLeft:'5%', paddingRight:'5%', borderRadius:MEDIUMROUNDED, borderWidth: 1, borderStyle:'solid', borderColor: LIGHTGREY,  marginTop:'2vh' }}>
                        
                        <SellIcon style={{fontSize: mobile ? '2rem': "3rem", color:'black'}}/>
                        <p style={{fontFamily: OPENSANS, fontWeight:'600', marginBottom:0, color:'black', fontSize: mobile ? '0.9rem' : '1.1rem', marginTop:'1vh' }}>Money protected</p>
                        <p style={{fontFamily: OPENSANS, fontWeight:'400', marginBottom:0, fontSize:'0.9rem',  }}>We safeguard your deposit before move-in day</p>
                        
                    </li>
                    <li style={{textAlign: 'center', width: mobile ? '40vw' : "20vw", height: mobile ? '40vw' : '20vw', backgroundColor:"white", justifyContent:'center',alignItems:'center', display:'flex', flexDirection:'column', paddingLeft:'5%', paddingRight:'5%', borderRadius:MEDIUMROUNDED,borderWidth: 1, borderStyle:'solid', borderColor: LIGHTGREY }}>
                            <BusinessIcon style={{fontSize: mobile ? '2rem': "3rem", color:'black'}}/>
                            <p style={{fontFamily: OPENSANS, fontWeight:'600', marginBottom:0, color:'black', fontSize: mobile ? '0.9rem' : '1.1rem', marginTop:'1vh' }}>View details</p>
                            <p style={{fontFamily: OPENSANS, fontWeight:'400', marginBottom:0, fontSize:'0.9rem',  }}>Preview all important sublease details in one page</p>
                    </li>
                    <li style={{textAlign: 'center', width: mobile ? '40vw' : "20vw", height: mobile ? '40vw' : '20vw',   backgroundColor:"white", justifyContent:'center',alignItems:'center', display:'flex', flexDirection:'column', paddingLeft:'5%', paddingRight:'5%', borderRadius:MEDIUMROUNDED, borderWidth: 1, borderStyle:'solid', borderColor: LIGHTGREY, marginTop:'2vh' }}>
                        <ContactMailIcon style={{fontSize: mobile ? '2rem': "3rem", color:'black'}}/>
                        <p style={{fontFamily: OPENSANS, fontWeight:'600', marginBottom:0, color:'black', fontSize: mobile ? '0.9rem' : '1.1rem', marginTop:'1vh' }}>Reduce dropouts</p>
                        <p style={{fontFamily: OPENSANS, fontWeight:'400', marginBottom:0, fontSize:'0.9rem',  }}>You will be compensated for dropouts</p>
                    </li>
                </ul> */}
            </div>

        </div>
        <div style={{ height: '45vh', width:'100vw', flexDirection: 'row', display:'flex',backgroundColor: 'white', alignItems:'center',  backgroundColor: 'rgba(45,102,116,0.06)', borderRadius: MEDIUMROUNDED}}>
            
            <img src={WelcomeImage3} style={{width: '25%', height: '100%',objectFit:'cover'}}/>
            <img src={WelcomeImage} style={{width: '25%', height: '100%',objectFit:'cover', marginLeft:'0.5vw'}}/>
            <div style={{flexDirection:'column', display:'flex', paddingLeft:'5%', paddingRight:'5%'}}>
                <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: mobile ? '1.5rem' : '1.8rem', }}>Half your day is spent in the sublease</p>
                <p style={{fontFamily: OPENSANS, fontWeight:'400', width: mobile ? '100%' : '100%', color:'black', textAlign: 'left', fontSize:'1rem'}}>A bad sublease can ruin your mood no matter if you're interning, traveling or working. That's why Crib is here to make your subleasing experience easier, cheaper and safety than ever!</p>
                <div>
                    <p style={{ fontFamily: OPENSANS, fontWeight:'700',fontSize: mobile ? '1.1rem' : '1.1rem',  borderBottomWidth:'2px', borderBottomStyle:'solid', borderBottomColor: PRIMARYCOLOR, paddingBottom:'0.5vh', color: PRIMARYCOLOR, cursor:'pointer', marginTop:'4vh', marginBottom:0,}}>Browse subleases</p>
                </div>
            </div>
            
        </div>

        {/* <div style={{ height: 'auto', width:'100vw', flexDirection: 'column', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', paddingTop: mobile ? '5vh' : '15vh', paddingBottom: mobile ? '5vh' : 0, justifyContent:'space-between', alignItems:'center', }}>

            <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: mobile ? '1.5rem' : '2.1rem', textAlign:'left', width:'100%'}}>Hear from our users</p>
            <div style={{ minHeight:'30vh', width:'100vw', flexDirection: mobile ? 'column' : 'row', display:'flex', paddingLeft: '5vw', paddingRight:'5vw',  marginTop:'5vh', overflow:'scroll'}}>
                <div style={{minWidth: mobile ? '90vw' : '25vw', minHeight:'30vh', borderRadius: MEDIUMROUNDED, backgroundColor:  'rgba(45,102,116,0.06)', flexDirection:'column', display:'flex', justifyContent:'space-between', padding:'1vh'}}>
                    <img src={WelcomeImage2} style={{width: '100%', height: mobile ? '25vh' : '25vh', borderRadius: MEDIUMROUNDED, objectFit: 'cover'}} />

                    <div style={{padding:"3vh", }}>
                        <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: mobile ? '1.5rem' : '1.3rem', marginBottom:'1vh' }}>"I found the perfect sublease in just 5 minutes"</p>
                       
                        <div style={{flexDirection:'row', display:'flex', width:'100%', alignItems:'center', marginTop:"4vh"}}>
                            <img src={BlackDudeFeedback} style={{width: mobile ? '15vw' : '5vw', height: mobile ? '15vw' : '5vw', borderRadius: mobile ? '7.5vw' : '2.5vw', objectFit:'cover'}} />
                            <div style={{paddingLeft: mobile ? '2vw' : '1vw', display:'flex', flexDirection:'column', height:'100%', }}>
                                <p style={{ fontFamily: OPENSANS, fontWeight:'600',fontSize: mobile ? '1rem' : '1rem', marginBottom:0 }}>Isaac Lee</p>
                                <p style={{ fontFamily: OPENSANS, fontWeight:'500',fontSize: '0.8rem', marginBottom:0 }}>Hong Kong University</p>

                            </div>
                        </div>
                    </div>
                </div>
                <div style={{minWidth: mobile ? '90vw' : '25vw', minHeight:'30vh', borderRadius: MEDIUMROUNDED, backgroundColor:  'rgba(45,102,116,0.06)', flexDirection:'column', display:'flex', justifyContent:'space-between', padding:'1vh'}}>
                    <img src={WelcomeImage2} style={{width: '100%', height: mobile ? '25vh' : '25vh', borderRadius: MEDIUMROUNDED, objectFit: 'cover'}} />

                    <div style={{padding:"3vh", }}>
                        <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: mobile ? '1.5rem' : '1.3rem', marginBottom:'1vh' }}>"I found the perfect sublease in just 5 minutes"</p>
                       
                        <div style={{flexDirection:'row', display:'flex', width:'100%', alignItems:'center', marginTop:"4vh"}}>
                            <img src={BlackDudeFeedback} style={{width: mobile ? '15vw' : '5vw', height: mobile ? '15vw' : '5vw', borderRadius: mobile ? '7.5vw' : '2.5vw', objectFit:'cover'}} />
                            <div style={{paddingLeft: mobile ? '2vw' : '1vw', display:'flex', flexDirection:'column', height:'100%', }}>
                                <p style={{ fontFamily: OPENSANS, fontWeight:'600',fontSize: mobile ? '1rem' : '1rem', marginBottom:0 }}>Isaac Lee</p>
                                <p style={{ fontFamily: OPENSANS, fontWeight:'500',fontSize: '0.8rem', marginBottom:0 }}>Hong Kong University</p>

                            </div>
                        </div>
                    </div>
                </div>
                <div style={{minWidth: mobile ? '90vw' : '25vw', minHeight:'30vh', borderRadius: MEDIUMROUNDED, backgroundColor:  'rgba(45,102,116,0.06)', flexDirection:'column', display:'flex', justifyContent:'space-between', padding:'1vh'}}>
                    <img src={WelcomeImage2} style={{width: '100%', height: mobile ? '25vh' : '25vh', borderRadius: MEDIUMROUNDED, objectFit: 'cover'}} />

                    <div style={{padding:"3vh", }}>
                        <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: mobile ? '1.5rem' : '1.3rem', marginBottom:'1vh' }}>"I found the perfect sublease in just 5 minutes"</p>
                       
                        <div style={{flexDirection:'row', display:'flex', width:'100%', alignItems:'center', marginTop:"4vh"}}>
                            <img src={BlackDudeFeedback} style={{width: mobile ? '15vw' : '5vw', height: mobile ? '15vw' : '5vw', borderRadius: mobile ? '7.5vw' : '2.5vw', objectFit:'cover'}} />
                            <div style={{paddingLeft: mobile ? '2vw' : '1vw', display:'flex', flexDirection:'column', height:'100%', }}>
                                <p style={{ fontFamily: OPENSANS, fontWeight:'600',fontSize: mobile ? '1rem' : '1rem', marginBottom:0 }}>Isaac Lee</p>
                                <p style={{ fontFamily: OPENSANS, fontWeight:'500',fontSize: '0.8rem', marginBottom:0 }}>Hong Kong University</p>

                            </div>
                        </div>
                    </div>
                </div>
                <div style={{minWidth: mobile ? '90vw' : '25vw', minHeight:'30vh', borderRadius: MEDIUMROUNDED, backgroundColor:  'rgba(45,102,116,0.06)', flexDirection:'column', display:'flex', justifyContent:'space-between', padding:'1vh'}}>
                    <img src={WelcomeImage2} style={{width: '100%', height: mobile ? '25vh' : '25vh', borderRadius: MEDIUMROUNDED, objectFit: 'cover'}} />

                    <div style={{padding:"3vh", }}>
                        <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: mobile ? '1.5rem' : '1.3rem', marginBottom:'1vh' }}>"I found the perfect sublease in just 5 minutes"</p>
                       
                        <div style={{flexDirection:'row', display:'flex', width:'100%', alignItems:'center', marginTop:"4vh"}}>
                            <img src={BlackDudeFeedback} style={{width: mobile ? '15vw' : '5vw', height: mobile ? '15vw' : '5vw', borderRadius: mobile ? '7.5vw' : '2.5vw', objectFit:'cover'}} />
                            <div style={{paddingLeft: mobile ? '2vw' : '1vw', display:'flex', flexDirection:'column', height:'100%', }}>
                                <p style={{ fontFamily: OPENSANS, fontWeight:'600',fontSize: mobile ? '1rem' : '1rem', marginBottom:0 }}>Isaac Lee</p>
                                <p style={{ fontFamily: OPENSANS, fontWeight:'500',fontSize: '0.8rem', marginBottom:0 }}>Hong Kong University</p>

                            </div>
                        </div>
                    </div>
                </div>
                <div style={{width: mobile ? '90vw' : '25vw', minHeight:'30vh', borderRadius: MEDIUMROUNDED, backgroundColor:  'rgba(45,102,116,0.06)', flexDirection:'column', display:'flex', justifyContent:'space-between', padding:'1vh', marginLeft:'2vw'}}>
                    <img src={WelcomeImage2} style={{width: '100%', height: mobile ? '25vh' : '25vh', borderRadius: MEDIUMROUNDED, objectFit: 'cover'}} />

                    <div style={{padding:"3vh", }}>
                        <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: mobile ? '1.5rem' : '1.3rem', marginBottom:'1vh' }}>"I found the perfect sublease in just 5 minutes"</p>
                       
                        <div style={{flexDirection:'row', display:'flex', width:'100%', alignItems:'center', marginTop:"4vh"}}>
                            <img src={BlackDudeFeedback} style={{width: mobile ? '15vw' : '5vw', height: mobile ? '15vw' : '5vw', borderRadius: mobile ? '7.5vw' : '2.5vw', objectFit:'cover'}} />
                            <div style={{paddingLeft: mobile ? '2vw' : '1vw', display:'flex', flexDirection:'column', height:'100%', }}>
                                <p style={{ fontFamily: OPENSANS, fontWeight:'600',fontSize: mobile ? '1rem' : '1rem', marginBottom:0 }}>Isaac Lee</p>
                                <p style={{ fontFamily: OPENSANS, fontWeight:'500',fontSize: '0.8rem', marginBottom:0 }}>Hong Kong University</p>

                            </div>
                        </div>
                    </div>
                </div>
            
            </div>
        </div> */}

        <div style={{ height: 'auto', width:'100vw', flexDirection: 'column', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', paddingTop: mobile ? '5vh' : '10vh', paddingBottom: mobile ? '5vh' : '10vh', justifyContent:'space-between', alignItems:'center', }}>
            {/* <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: mobile ? '1.5rem' : '2.1rem', textAlign:'left', }}>Your questions, <br/>answered</p> */}
            <div style={{width: '90vw', height:'auto', marginLeft:'auto', marginRight:'auto', textAlign:'center', marginTop: mobile ? '10vh' : "5vh", flexDirection: mobile ? 'column' : 'row', display:'flex', justifyContent:'space-between', paddingBottom:'5vh' }}>
                <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: mobile ? '1.5rem' : '2.1rem', textAlign:'left',}}>Your questions, <br/>answered.</p>
                <div style={{width: mobile ? '100%' : '50%', textAlign: mobile ? 'left' : 'center' }}>
                    <Accordion style={{ borderBottomWidth:'1px', borderBottomColor:'#e0e0e0', borderBottomStyle:'solid', paddingTop:'1vh', paddingBottom:'1vh', boxShadow:'none'}}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                        <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'600', fontSize:'1.1rem'}}>How does subleasing on Crib work?</p>
                        </AccordionSummary>
                        <AccordionDetails>

                        <Typography style={{textAlign:'left'}}>
                        <strong>1. Request a booking</strong><br/><br/>
With Crib, subleasing has never been easier. Simply browse through our listings and find the perfect space for your needs. Once you've found the ideal sublet, you can request a booking with just a few clicks.<br/><br/>

<strong>2. Tenant Approves Booking</strong><br/><br/>
After submitting your booking request, the tenant will review your application. Our streamlined process ensures quick responses, allowing you to secure your desired sublease as soon as possible. Once the tenant approves your booking, you're one step closer to moving into your new home.<br/><br/>
<strong>3. Tenant & Subtenant sign sublease contract</strong><br/><br/>
At Crib, we prioritize the legal and financial security of both parties involved. Once your booking is approved, both the tenant and subtenant will sign a comprehensive sublease contract. This contract outlines the terms and conditions of the sublease, ensuring a transparent and mutually beneficial agreement.<br/><br/>
<strong>4. Subtenant pays security deposit</strong><br/><br/>
To provide peace of mind for all parties, we require subtenants to pay a security deposit. This deposit safeguards against any potential damages and ensures a smooth and worry-free subleasing experience. Rest assured that your security deposit will be handled securely and returned to you promptly upon completion of the sublease.<br/><br/>
<strong>5. Seamless move-in</strong><br/><br/>
We understand that moving can be a stressful process. That's why Crib aims to make your move-in as seamless as possible. Once you've signed the sublease contract and paid the security deposit, you're ready to move into your new sublet. We'll provide you with all the necessary information and support to ensure a hassle-free transition, allowing you to settle into your new space effortlessly.<br/><br/>

With Crib, subleasing becomes a breeze. Experience the convenience and efficiency of our platform, and let us help you find the perfect sublet for your needs.
                        </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion style={{ borderBottomWidth:'1px', borderBottomColor:'#e0e0e0', borderBottomStyle:'solid', paddingTop:'1vh', paddingBottom:'1vh', boxShadow:'none'}}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                        >
                            <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'600', fontSize:'1.1rem'}}>What happens after you request a booking?</p>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography style={{textAlign:'left'}}>
                        So you’ve found sublease that you like and requested a booking. Now what? Requesting a booking for a sublease is similar to applying for that sublease. Now that you’ve expressed interest, the tenant of that sublease will take a look at your information and your personal sublease requirements to see if you’d be a good potential subtenant. If the tenant finds that you to be a suitable fit, then you’ll move forward with the subleasing process!
                        </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion style={{ borderBottomWidth:'1px', borderBottomColor:'#e0e0e0', borderBottomStyle:'solid', paddingTop:'1vh', paddingBottom:'1vh', boxShadow:'none'}}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                        >
                            <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'600', fontSize:'1.1rem'}}>When does tenant get the security deposit?</p>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography style={{textAlign:'left'}}>
                        The tenant will receive the security deposit upon a successful move-in. At Crib, we prioritize the satisfaction and protection of both parties involved in the sublease. We ensure that both the tenant and subtenant confirm the move-in before transferring the security deposit to the tenant, providing a secure and reliable process for all parties.
                        </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion style={{ borderBottomWidth:'1px',borderBottomColor: LIGHTGREY, borderBottomStyle:'solid', paddingTop:'1vh', paddingBottom:'1vh',boxShadow:'none'}}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3a-content"
                        id="panel3a-header"
                        >
                        <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'600', fontSize:'1.1rem'}}>Can I tour the place?</p>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography style={{textAlign:'left'}}>To ensure a fair and secure process for both parties, we kindly request that the security deposit and fees are paid first. Once the payment is completed, we would be more than happy to schedule a tour of the place at your convenience. We strive to prioritize the safety and satisfaction of all our users, and this approach helps maintain a smooth and trustworthy subleasing experience. Feel free to let us know when you are ready to proceed, and we'll be glad to assist you further.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion style={{ borderBottomWidth:'1px', borderBottomColor: LIGHTGREY, borderBottomStyle:'solid', paddingTop:'1vh', paddingBottom:'1vh', boxShadow:'none'}}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3a-content"
                        id="panel3a-header"
                        >
                            <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'600', fontSize:'1.1rem'}}>How would subtenant move-in?</p>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography style={{textAlign:'left'}}>The move-in procedure at Crib is designed to be simple and seamless. Once all necessary agreements and payments are in place, the subtenant can proceed with the move-in process. Specific details regarding key exchange, property access, and any additional instructions will be communicated between the tenant and subtenant directly. Our goal is to ensure a smooth transition and a successful move-in experience for all parties involved.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion style={{ borderBottomWidth:'1px',borderBottomColor: LIGHTGREY, borderBottomStyle:'solid', paddingTop:'1vh', paddingBottom:'1vh', boxShadow:'none'}}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3a-content"
                        id="panel3a-header"
                        >
                        <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'600', fontSize:'1.1rem'}}>How do we ensure the subtenant doesn’t bail?</p>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography style={{textAlign:'left'}}>At Crib, we have measures in place to ensure that the subtenant doesn't bail before move-in. We collect the security deposit and require a legally binding sublease contract to be signed before the scheduled move-in date. These steps provide assurance and commitment from the subtenant, reducing the likelihood of any last-minute changes or cancellations. Our goal is to create a trustworthy and reliable subleasing experience for both tenants and subtenants.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion style={{ borderBottomWidth:'1px',borderBottomColor: LIGHTGREY, borderBottomStyle:'solid', paddingTop:'1vh', paddingBottom:'1vh',boxShadow:'none'}}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3a-content"
                        id="panel3a-header"
                        >
                        <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'600', fontSize:'1.1rem'}}>How will rent be paid?</p>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography style={{textAlign:'left'}}>Rent payments for subleases facilitated through Crib are made directly between the tenant and subtenant off our platform. We provide a secure and user-friendly environment for subleasing, but the specifics of rent payment, including methods and schedules, are agreed upon between the involved parties outside of our platform.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    
                </div>
            </div>
        </div>
       
        <div style={{ height: 'auto', width:'100vw', flexDirection: mobile ? 'column' : 'column', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', paddingTop: mobile ? '5vh' : '10vh', paddingBottom: mobile ? '5vh' : '10vh', justifyContent:'space-between', alignItems:'center', backgroundColor: '#F6FDFF', borderBottomWidth:'1px', borderBottomColor: PRIMARYCOLOR, borderBottomStyle:'solid'}}>
            
        <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: mobile ? '1.5rem' : '1.8rem', textAlign:'center', color: PRIMARYCOLOR }}>Crib is the new stree-free way<br/> to find your next sublease</p>
            <Button onClick={handleFindSubleaseClick} style={{backgroundColor: PRIMARYCOLOR, color: 'white', paddingLeft:25, paddingRight:25, paddingTop:15, paddingBottom:15, textTransform:'none', outline:'none', borderRadius: 30, marginTop:"4vh"}}> 
                <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'600', fontSize:'1rem'}}>Find Subleases</p>
            </Button>
        </div>


        
       
        {/* <div style={{ height: 'auto', width:'100vw', flexDirection: mobile ? 'column' : 'row-reverse', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', paddingTop: mobile ? '5vh' : '10vh', paddingBottom: mobile ? '5vh' : '10vh', backgroundColor: 'rgba(45,102,116,0.07)', justifyContent:'space-between', alignItems:'center'}}>
            
            <img src={WelcomeImage3} style={{width: mobile ? '90vw' : '35vw', height: mobile ? '40vh' : '50vh', borderRadius:MEDIUMROUNDED, objectFit:'cover'}}/>
            <div style={{display:'flex', flexDirection:'column', width: mobile ? '90vw' : '35vw', height: mobile ? '40vh' : '50vh', marginTop: mobile ? '4vh' : 0, justifyContent:'space-between'}}>
                <div>
                    <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize: mobile ? '1.8rem' : '2.4rem', width:'90%'}}>Sublease your place</p>
                    <p style={{fontFamily: OPENSANS, fontWeight:'400', color:'#737373' }}>Crib makes it very simple to quickly and safely sublease your place. Making a posting in less than a minute and discover all the tenants who are interested in your place.</p>
                </div>
                <div style={{flexDirection:"row", display:'flex', alignItems:'center', width: mobile ? '100%' : 'auto', justifyContent: mobile ? 'space-between' :'flex-start'}}>
              
                    <div style={{flexDirection:'row', display:'flex', textAlign:'center', alignItems:'center'}}>
                        <GroupIcon style={{fontSize:"2rem", color:PRIMARYCOLOR}}/>
                        <p style={{fontFamily: OPENSANS, fontWeight:'500', color:'black', marginBottom:0, fontSize: "0.9rem", marginLeft:'1vw'}}>Verified users</p>
                    </div>
                    <div style={{flexDirection:'row', display:'flex', textAlign:'center', alignItems:'center',  marginLeft:"2vw"}}>
                        <ContactMailIcon style={{fontSize:"2rem", color: PRIMARYCOLOR}}/>
                        <p style={{fontFamily: OPENSANS, fontWeight:'500', color:'black', marginBottom:0, fontSize:"0.9rem",  marginLeft:'1vw'}}>Low dropout rate</p>
                    </div>
                   
                </div>
                <div style={{flexDirection:"row", display:'flex', marginTop: mobile ? '4vh' : 0}}>
                    <div style={{display:"flex", flexDirection:'column', }}>
                        <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize: '1rem', marginBottom:0}}><span style={{fontWeight:"700", fontSize: mobile ? '1.8rem' : '2.5rem'}}>1200+</span><br/>users posted</p>
                    </div>
                    <div style={{display:"flex", flexDirection:'column', marginLeft:'4vw'}}>
                        <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize: '1rem', marginBottom:0}}><span style={{fontWeight:"700", fontSize:  mobile ? '1.8rem' :  '2.5rem'}}>2.5 months</span><br/>average rent saved</p>
                    </div>

                </div>
               
                
                <div style={{marginTop: mobile ? '4vh' : '2vh'}}>
                    <Button onClick={handleFindSubleaseClick} variant='contained' style={{textTransform:'none', backgroundColor:'black', height: mobile ? '6vh' : '5vh', outline:'none'}}>
                        <p style={{marginBottom:0, fontWeight:'0.9rem', fontFamily: OPENSANS, color: 'white'}}>Post my sublease</p>
                    </Button>
                </div>
            </div>
        </div> */}
       

        </div>
    )
}