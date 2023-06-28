import { LIGHTGREY, MEDIUMGREY, MEDIUMROUNDED, OPENSANS, PRIMARYCOLOR } from '../sharedUtils'
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


import { TypeAnimation } from 'react-type-animation';

//Icon
import CheckIcon from '@mui/icons-material/Check';


const CRIBPROS = [{name : "Budget friendly", content : "Most of our sublets are on a discounted rent price. Request to book before they're gone.", img: BudgetSVG},
{name : "Simple process", content: "Crib provides a seamless and efficient process from start to finish. Secure your ideal sublease in no time.", img: LocalSVG},
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
        <>
        <div style={{ height: mobile ? 'auto' : 'auto', width:'100vw', flexDirection: mobile ? 'column-reverse' : 'row', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', justifyContent:'space-between', paddingTop: mobile ? '5vh' : '10vh', paddingBottom: mobile ? '5vh' : '10vh',  }}>
          
            <div style={{height:'auto', flexDirection:'column', marginTop: mobile ? '3vh' : 0, justifyContent:'center', display:'flex'}}>
                {mobile ?
                <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize: '2.1rem', textAlign:'center', marginBottom:0 }}>Sublease instantly.<br/>Welcome to <span style={{fontFamily:"Righteous", color: PRIMARYCOLOR}}>Crib</span></p>
                :
                <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize: '2.6rem'}}>Sublease instantly.<br/>Welcome to <span style={{fontFamily:"Righteous", color: PRIMARYCOLOR}}>Crib</span></p>
                }
                {/* <p style={{fontFamily: OPENSANS, fontWeight:'500'}}>Sublease easier than ever with Crib</p> */}
           
                <div style={{flexDirection: mobile ? 'column' : 'row', display:'flex', marginTop: mobile ? '4vh' : '2vh' }}>
                    <Button onClick={handleFindSubleaseClick} style={{backgroundColor: PRIMARYCOLOR, color: 'white', padding: 10, textTransform:'none', outline:'none'}}> 
                        <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'500'}}>Find a sublease</p>
                    </Button>
                    <Button onClick={postProperty} variant="contained" style={{color: MEDIUMGREY, padding: 10, backgroundColor:'white', boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.2)', marginLeft: mobile ? 0 : '2vh', textTransform:'none', marginTop: mobile ? '2vh' : 0, outline:'none', }}>
                        <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'500'}}>Post a sublease</p>
                    </Button>
                </div>
                
            </div>
            <div style={{flexDirection:'column', justifyContent:'flex-start', height:'auto',}}>
                <div style={{ alignItems:'center', display:'flex'}}>
                    <img src={WelcomeImage} style={{width: mobile ? '90vw' : '40vw', height: 'auto', alignSelf:'center', marginLeft:'auto', marginRight:'auto', borderRadius: MEDIUMROUNDED, borderWidth:'1px', borderColor: LIGHTGREY, borderStyle:'solid'}} />
                </div>
            </div>
        </div>
        <div style={{ height: 'auto', width:'100vw', flexDirection: mobile ? 'column' : 'row', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', paddingTop: mobile ? '5vh' : '10vh', paddingBottom: mobile ? '5vh' : '10vh', backgroundColor: 'rgba(45,102,116,0.07)', justifyContent:'space-between', alignItems:'center'}}>
            
            <img src={WelcomeImage2} style={{width: mobile ? '90vw' : '35vw', height: mobile ? '40vh' : '50vh', borderRadius:MEDIUMROUNDED, objectFit:'cover'}}/>
            <div style={{display:'flex', flexDirection:'column', width: mobile ? '90vw' : '35vw', marginTop: mobile ? '4vh' : 0}}>
                <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize: mobile ? '1.8rem' : '2.4rem', width:'90%'}}>Sublease safely with<br/><span style={{textDecorationLine:'underline', textDecorationColor: PRIMARYCOLOR}}>verified</span> users</p>
                <p style={{fontFamily: OPENSANS, fontWeight:'400', }}>We perform phone and email verification on all users, we want to construct a safe and comfortable subleasing space for everyone.</p>
                {/* <div style={{marginTop:'2vh'}}>
                    <div style={{flexDirection:'row', display:'flex', alignItems:'center', marginBottom:'1vh'}}>
                        <CheckIcon style={{fontSize:'1rem'}}/>
                        <p style={{fontFamily: OPENSANS, fontWeight:'400', color:'black', marginBottom:0, marginLeft:'2vw', fontSize:'1rem' }}>Drafting sublease contract</p>
                    </div>
                    <div style={{flexDirection:'row', display:'flex', alignItems:'center', marginBottom:'1vh'}}>
                        <CheckIcon style={{fontSize:'1rem'}}/>
                        <p style={{fontFamily: OPENSANS, fontWeight:'400', color:'black', marginBottom:0, marginLeft:'2vw', fontSize:'1rem' }}>Handling security deposit</p>
                    </div>
                    <div style={{flexDirection:'row', display:'flex', alignItems:'center'}}>
                        <CheckIcon style={{fontSize:'1rem'}}/>
                        <p style={{fontFamily: OPENSANS, fontWeight:'400', color:'black', marginBottom:0, marginLeft:'2vw', fontSize:'1rem' }}>Performing background checks</p>
                    </div>
                </div> */}
            </div>
        </div>
        <div style={{ height: 'auto', width:'100vw', flexDirection: 'column', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', paddingTop: mobile ? '5vh' : '10vh', paddingBottom: mobile ? '5vh' : '10vh', justifyContent:'space-between', alignItems:'center'}}>
            <p style={{fontSize: mobile ? '1.5rem' : '2.5rem', fontWeight:'500'}}>Subleasing shouldn’t be hard,</p>
            <TypeAnimation
            sequence={[
                // Same substring at the start will only be typed out once, initially
                'it should be simple!',
                2000, // wait 1s before replacing "Mice" with "Hamsters"
                'it should be easy!',
                2000,
                'it should be safe!',
                2000,
                'it should be affordable!',
                2000,
                'it should be one-click!',
                2000
            ]}
            wrapper="span"
            speed={30}
            style={{ fontSize: mobile ? '1.5rem' : '2.5rem', display: 'inline-block', fontFamily: OPENSANS, fontWeight:'500' }}
            repeat={Infinity}
            />
        </div>
        <div style={{ height: 'auto', width:'100vw', flexDirection: mobile ? 'column' : 'row-reverse', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', paddingTop: mobile ? '5vh' : '10vh', paddingBottom: mobile ? '5vh' : '10vh', backgroundColor: 'rgba(45,102,116,0.07)', justifyContent:'space-between', alignItems:'center'}}>
            
            <img src={WelcomeImage3} style={{width: mobile ? '90vw' : '35vw', height: mobile ? '40vh' : '50vh', borderRadius:MEDIUMROUNDED, objectFit:'cover'}}/>
            <div style={{display:'flex', flexDirection:'column', width: mobile ? '90vw' : '35vw', marginTop: mobile ? '4vh' : 0}}>
                <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize: mobile ? '1.8rem' : '2.4rem', width:'90%'}}>Pay less for more</p>
                <p style={{fontFamily: OPENSANS, fontWeight:'400', }}>Our sublets are usually already 10 - 20% cheaper than original rent prices, so request to book before they are gone!</p>
                <div style={{marginTop:'2vh'}}>
                    <Button onClick={handleFindSubleaseClick} variant='contained' style={{textTransform:'none', backgroundColor:'black', height: mobile ? '6vh' : '5vh', outline:'none'}}>
                        <p style={{marginBottom:0, fontWeight:'0.9rem', fontFamily: OPENSANS, color: 'white'}}>Browse subleases</p>
                    </Button>
                </div>
            </div>
        </div>

        <div style={{ height: 'auto', width:'100vw', flexDirection: 'column', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', paddingTop: mobile ? '5vh' : '10vh', paddingBottom: mobile ? '5vh' : '10vh', justifyContent:'space-between', alignItems:'center'}}>

            <div style={{position:'relative',}}>
                <div style={{width: mobile ? '90vw' : 'auto', marginLeft:'auto', marginRight:'auto'}}>
                    <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize: mobile ? '1.8rem' : '2.4rem',  textAlign:'center'}}>Why Crib?</p>
                    <p style={{fontFamily: OPENSANS, fontWeight:'400',textAlign:'center' }}>Crib makes subleasing easier than ever. Talk to verified tenants and preview all sublease details in one go.</p>
                </div>
                <div style={{flexDirection: mobile ? 'column' : 'row', display:'flex', marginTop: mobile? '5vh' : '10vh', alignItems: 'center' }}>
                    {CRIBPROS.map((item)=> {
                        return(
                        <div key={"CribPros" + item.name} style={{width: mobile ? '90vw' : 'auto', height:'auto',paddingRight:'2vw', flexDirection:'column', marginTop: mobile ? '5vh' : 0,  textAlign: 'center'}}>
                            <img src={item.img}  style={{height:'15vh', }}/> 
                            <p style={{fontFamily: OPENSANS, fontWeight:'600', fontSize:'1.4rem', marginTop:'2vh'}}>{item.name}</p>
                            <p style={{fontFamily: OPENSANS}}>{item.content}</p>
                        </div>
                        )
                    })}
                    
                </div>
            </div>
        </div>
        <div style={{ height: 'auto', width:'100vw', flexDirection: 'column', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', paddingTop: mobile ? '5vh' : '5vh', paddingBottom: mobile ? '5vh' : '10vh', justifyContent:'space-between', alignItems:'center'}}>
            <div style={{justifyContent:'center',flexDirection:'column', display:'flex', alignItems:'center'}}>
                <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize: mobile ? '1.8rem' : '2.2rem', marginBottom:0}}>Find your Crib today!</p>
                <Button onClick={()=> handleNav('/discoverSubleases')} variant='contained' style={{textTransform:'none', backgroundColor: PRIMARYCOLOR,  marginTop:'5vh', outline:'none'}}>
                    <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize: '1rem', marginBottom:0,}}>Browse available subleases</p>
                </Button>
            </div>
        </div>
       
        {/* <div style={{ height: 'auto', width:'100vw', flexDirection: 'column', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', paddingTop: mobile ? '5vh' : '5vh', paddingBottom: mobile ? '5vh' : '10vh', justifyContent:'space-between', alignItems:'center'}}>
            
            <div style={{boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)',  width:'100%',  borderRadius: MEDIUMROUNDED, flexDirection:'row', display:'flex', justifyContent:'space-between'}}>
                <div style={{padding: '2vw',  justifyContent:'center',flexDirection:'column', display:'flex', alignItems:'center'}}>
                    <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize: mobile ? '1.8rem' : '2.2rem', marginBottom:0}}>Find your Crib today!</p>
                    <Button onClick={()=> handleNav('/discoverSubleases')} variant='contained' style={{textTransform:'none', backgroundColor: PRIMARYCOLOR,  marginTop:'5vh', outline:'none'}}>
                        <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize: '1rem', marginBottom:0,}}>Browse available subleases</p>
                    </Button>
                </div>
                <div style={{width:'50vw', }}>
                    <img src={WelcomeImage4} style={{objectFit:'cover', width:'100%', height:'40vh', borderTopRightRadius: MEDIUMROUNDED, borderBottomRightRadius: MEDIUMROUNDED}}/>
                </div>  
            </div>
        </div> */}
        </>
    )
}