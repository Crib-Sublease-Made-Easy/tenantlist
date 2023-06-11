import { LIGHTGREY, MEDIUMROUNDED, OPENSANS, PRIMARYCOLOR } from '../sharedUtils'
import WelcomeImage from '../welcomeImage.png'
import SearchingSVG from './searchingImage.svg'
import PostingSVG from './postingImage.svg'
import { Button } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../UserContext'
import { useEffect } from 'react'



export default function WelcomePage(){
    const navigate = useNavigate()
    const {mobile, loggedIn} = useContext(UserContext)


    function handleNav(route){
        navigate(route)
    }


    return(
        <div style={{ height: mobile ? 'auto' : '90vh', width:'100vw', flexDirection: mobile ? 'column-reverse' : 'row', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', justifyContent:'space-between', paddingTop: mobile ? '5vh' : '10vh'}}>
          
            <div style={{height:'auto', flexDirection:'column', marginTop: mobile ? '4vh' : 0}}>
                {mobile ?
                <p style={{fontWeight:'800', fontFamily: OPENSANS, fontSize: mobile ? '2.1rem' : '2.6rem'}}>Sublease with <br/>real people, let's save rent together!</p>
                :
                <p style={{fontWeight:'800', fontFamily: OPENSANS, fontSize: mobile ? '1.8rem' : '2.6rem'}}>Sublease with <br/>real people, let's<br/>save rent together!</p>
                }
                <p style={{fontFamily: OPENSANS, fontWeight:'500'}}>Sublease easier than ever with Crib</p>
                {!mobile &&
                <h5 style={{fontFamily: OPENSANS, fontWeight:'600', marginTop:'3vh'}}>🔍 More than 100+ New York subleases to discover</h5>
                }
                <div style={{flexDirection: mobile ? 'column' : 'row', display:'flex', marginTop: mobile ? '5vh' : '5vh' }}>
                    <Button onClick={()=> handleNav('/discoverSubleases')} style={{backgroundColor: PRIMARYCOLOR, color: 'white', padding: 10, textTransform:'none', outline:'none'}}> 
                        <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'700'}}>Find a sublease</p>
                    </Button>
                    <Button onClick={()=>handleNav('/propertyPosting    ')} variant="outlined" style={{color: PRIMARYCOLOR, padding: 10, borderColor: PRIMARYCOLOR, marginLeft: mobile ? 0 : '2vh', textTransform:'none', marginTop: mobile ? '2vh' : 0, outline:'none'}}>
                        <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'700'}}>Post a sublease</p>
                    </Button>
                </div>
                
            </div>
            <div style={{flexDirection:'column', justifyContent:'flex-start', height:'auto'}}>
                <div style={{ alignItems:'center', display:'flex'}}>
                    <img src={WelcomeImage} style={{width: mobile ? '90vw' : '50vw', height:'auto', alignSelf:'center'}} />
                </div>
            </div>

        </div>
    )
}