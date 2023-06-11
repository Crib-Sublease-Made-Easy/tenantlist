import { LIGHTGREY, MEDIUMROUNDED, OPENSANS, PRIMARYCOLOR } from '../../sharedUtils'
import WelcomeImage from '../../welcomeImage.png'
import AppStoreDownload from './appStoreDownload.png'
import TwoPhonesImage from './twoPhonesImage.png'
import { Button } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../../UserContext'
import { useEffect } from 'react'



export default function PropertyPostingScreen(){
    const navigate = useNavigate()
    const {mobile, loggedIn} = useContext(UserContext)


    function handleNav(route){
        navigate(route)
    }

    function AppStoreNav(){
        window.open('https://apps.apple.com/us/app/crib-subleasing-made-easy/id1645127110', '_blank')
    }


    return(
        <div style={{ height: mobile ? 'auto' : '90vh', width:'100vw', flexDirection: mobile ? 'column' : 'row', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', justifyContent:'space-between'}}>
          
            <div style={{height:'auto', flexDirection:'column', marginTop:  0,  paddingTop: mobile ? '3vh' : '10vh'}}>
                {mobile ?
                <p style={{fontWeight:'800', fontFamily: OPENSANS, fontSize: mobile ? '2.1rem' : '2.6rem'}}>Sublease your room<br/>easier, safer, faster with Crib.</p>
                :
                <p style={{fontWeight:'800', fontFamily: OPENSANS, fontSize: mobile ? '1.8rem' : '2.6rem'}}>Sublease your room<br/>safer, faster, easier,<br/>with Crib.</p>
                }
                <p style={{fontFamily: OPENSANS, fontWeight:'500'}}>Post a sublease in just 30 seconds and tenants will contact you automatically.</p>
                <img onClick={AppStoreNav} src={AppStoreDownload} style={{width: mobile ? '30vw' : '10vw', marginTop:mobile ? '2vh' : '5vh', cursor:'pointer'}}/>
                {/* <div style={{flexDirection: mobile ? 'column' : 'row', display:'flex', marginTop: mobile ? '5vh' : '5vh' }}>
                    <Button onClick={()=> handleNav('/discoverSubleases')} style={{backgroundColor: PRIMARYCOLOR, color: 'white', padding: 10, textTransform:'none', outline:'none'}}> 
                        <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'700'}}>Find a sublease</p>
                    </Button>
                    <Button onClick={()=>handleNav('/subleasemyroomintro')} variant="outlined" style={{color: PRIMARYCOLOR, padding: 10, borderColor: PRIMARYCOLOR, marginLeft: mobile ? 0 : '2vh', textTransform:'none', marginTop: mobile ? '2vh' : 0, outline:'none'}}>
                        <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'700'}}>Post a sublease</p>
                    </Button>
                </div> */}
                
            </div>
            <div style={{flexDirection:'row', justifyContent: mobile ? 'center' : 'flex-end', display:'flex', height:'auto',flex : 1, marginTop: mobile ? '5vh' : 0 }}>
                <div style={{ alignItems:'center', display:'flex', justifyContent:'center'}}>
                    <img src={TwoPhonesImage} style={{width: mobile ? '60vw' : 'auto', height: mobile ? 'auto' : '70vh', alignSelf:'center', marginRight: mobile ? 0 : '10vw'}} />
                </div>
            </div>

        </div>
    )
}