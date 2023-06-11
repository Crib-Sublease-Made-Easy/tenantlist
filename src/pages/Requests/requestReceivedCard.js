import { MarkEmailRead, PermPhoneMsg } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EXTRALIGHT, LIGHTGREY, MEDIUMGREY, MEDIUMROUNDED, OPENSANS, PRIMARYCOLOR } from "../../sharedUtils";
import { UserContext } from "../../UserContext";

import CribConnections from './CribConnects.json'

import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';

import Lottie from "lottie-react";



//Modal
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

export default function RequestReceivedCards(props){
    const navigate = useNavigate()
    const {mobile} = useContext(UserContext)
    const [messageModal, setMessageModal] = useState(false)
    const subleaseData = props.data.subleaseInfo
    const subtenantData = props.data.subtenantInfo

    useEffect(()=>{

    }, [])
   

    function getAge(dob){
        let age = dob / (1000*60*60*24*31*12)
        return age.toFixed(0)
    }

    function handleMessageTenantClick(){
        setMessageModal(true)
    }

  
    // console.log(props.data)
    return(
        <div style={{padding: mobile ? '5vw' : '1.5vw', height:'auto', backgroundColor:'red', borderRadius:MEDIUMROUNDED, backgroundColor:'white', boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)',borderWidth:'0.5px', borderStyle:'solid', borderColor: EXTRALIGHT,}}>
           {/* <img src={propData.imgList[0]} style={{width:'100%', height:'15vw', borderTopLeftRadius:MEDIUMROUNDED, borderTopRightRadius: MEDIUMROUNDED}} /> */}
                <p style={{fontSize:"0.8rem", fontWeight:'700', marginBottom:0, fontFamily: OPENSANS}}>Requested on { new Date(subleaseData.createdAt).toLocaleDateString().split(",")[0]}</p>
                <div style={{flexDirection:'row', display:'flex', alignItems:'center', marginTop:'4vh', }}>
                    <img src={subtenantData.profilePic} style={{height:'10vh', width: '10vh', borderRadius:'5vh'}}/> 
                    <div style={{paddingLeft:'2vw'}}>
                        

                        <div style={{flexDirection:'row', display:'flex', alignItems:'center'}}>
                            <p style={{fontSize:"1rem", fontWeight:'600', marginBottom:0, fontFamily: OPENSANS}}>{subtenantData.firstName} {subtenantData.lastName}</p>
                            <p style={{fontSize:"1rem", fontWeight:'500', marginBottom:0, marginLeft:'2vw', fontFamily: OPENSANS}}>{subtenantData.gender}</p>
                            <p style={{fontSize:"1rem", fontWeight:'500', marginBottom:0, marginLeft:'2vw', fontFamily: OPENSANS}}>{getAge(subtenantData.dob)}</p>
                        </div>
                        {subtenantData.school != undefined && subtenantData.school.trim() != "" &&
                        <div style={{flexDirection:'row', display:'flex', alignItems:'center', marginTop:'0.5vh'}}>
                            <SchoolIcon style={{color:'black', fontSize:'0.9rem'}} />
                            <p style={{fontSize:"0.8rem", fontWeight:'500', marginBottom:0, fontFamily: OPENSANS, marginLeft:'1vw'}}>{subtenantData.school.trim()}</p>
                        </div>
                        }
                        {subtenantData.occupation != undefined && subtenantData.occupation.trim() != "" &&
                        <div style={{flexDirection:'row', display:'flex', alignItems:'center', marginTop:'0.5vh'}}>
                            <WorkIcon style={{color:'black', fontSize:'0.9rem'}} />
                            <p style={{fontSize:"0.8rem", fontWeight:'500', marginBottom:0, fontFamily: OPENSANS, marginLeft:'1vw'}}>{subtenantData.occupation.trim()}</p>
                        </div>
                        }
                    </div>
                    
                </div>
                <div style={{flexDirection:'column', display:'flex', marginTop:'4vh'}}>
                    <div style={{flexDirection:'row', display:'flex',alignItems:'center'}}>
                        <PermPhoneMsg style={{fontSize: mobile ? '4vw' : '1.25vw'}}/>
                        <p style={{marginTop:'auto', marginBottom:'auto', marginLeft: mobile ? '2vw' : '0.5vw', fontFamily:OPENSANS, fontWeight:'500', fontSize:"0.9rem"}}>Phone verified</p>
                    </div>
                    {/* <div style={{flexDirection:'row', display:'flex',alignItems:'center', marginTop: '1vh'}}>
                        <MarkEmailRead style={{fontSize:'1.25vw'}}/>
                        <p style={{marginTop:'auto', marginBottom:'auto', marginLeft:'0.5vw', fontFamily:OPENSANS, fontWeight:'500', fontSize:"0.9rem",}}>Email verified</p>
                    </div> */}
                </div>
                <div>
                    <div style={{marginTop:'2vh'}}>
                        <p style={{fontSize: mobile ? '1.1rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:5}}>Request dates</p>
                        <p style={{fontSize:  mobile ? '0.9rem' : '0.8rem', fontFamily: OPENSANS, fontWeight:"400", marginBottom:5}} >{new Date(subleaseData.requestStart).toLocaleDateString().split(","[0])} - {new Date(subleaseData.requestStart).toLocaleDateString().split(","[1])}</p>
                    </div>
                    {/* <div style={{marginTop:'2vh'}}>
                        <p style={{fontSize:'1rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:5}}>Description</p>
                        <p style={{fontSize:'0.8rem', fontFamily: OPENSANS, fontWeight:"500", marginBottom:5}} >Hello my name is Isaac, I am looking for a sublease for my summer inernship. I want to be close to Manhattan if possible and I want to live in a studio.</p>
                    </div> */}
                    <div style={{marginTop:'2vh'}}>
                        <p style={{fontSize:mobile ? '1.1rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:5}}>Contact information</p>
                        <p style={{fontSize: mobile ? '0.9rem' : '0.8rem', fontFamily: OPENSANS, fontWeight:"400", marginBottom:0,  overflow:'scroll'}} ><span style={{fontWeight:'500'}}>Phone number:</span> {subtenantData.countryCode == undefined || subtenantData.countryCode == "" ? "+1" : `+${subtenantData.countryCode}`}{subtenantData.phoneNumber}</p>
                        <p style={{fontSize: mobile ? '0.9rem' :'0.8rem', fontFamily: OPENSANS, fontWeight:"400", marginBottom:0,  overflow:'scroll'}} ><span style={{fontWeight:'500'}}>Email:</span> {subtenantData.email}</p>
                    </div>
                    <div style={{marginTop:'2vh'}}>
                        <p style={{fontSize: mobile ? '1.1rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:5}}>Request message</p>
                        <p style={{fontSize: mobile ? '0.9rem' : '0.8rem', fontFamily: OPENSANS, fontWeight:"400", marginBottom:0, height: '15vh', overflow:'scroll'}} >{subleaseData.requestMessage}</p>
                    </div>
                    
                   
                    <Button onClick={()=> setMessageModal(true)} fullWidth varaint='contained' style={{flexDirection:'row', display:'flex', backgroundColor: PRIMARYCOLOR, color:'white', height:'5vh', textTransform:'none', marginTop : '2vh', outline: 'none'}}>
                        <p style={{marginBottom:0, fontWeight:'500', }}>Message subtenant</p>
                    </Button>
                </div>
        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={messageModal}
        onClose={()=> setMessageModal(false)}
        closeAfterTransition
        slotProps={{
        backdrop: {
            timeout: 500,
        },
        }}
            >
        <Fade in={messageModal}>
          <div 
            style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width:'auto',
            height:'auto',
            backgroundColor:'white',
            padding: mobile ? '4vw' : '2vw',
            borderRadius: MEDIUMROUNDED,
            display:'flex',
            alignItems:'center',
            flexDirection:'column',
            width: mobile ? '90vw' : 'auto'
            
            }}>
            <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize:'1.3rem', marginBottom: '2vh',}}>Get Crib Connect </p>
            <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: '2vh', width: mobile ? 'auto' : '20vw',textAlign:'center'}}>Crib Connect connects you with {subtenantData.firstName} and many other interested tenants</p>

            <Lottie animationData={CribConnections} style={{width: mobile ? '90%' : '30vw'}} />
            {/* <Button  fullWidth variant="contained" style={{backgroundColor: PRIMARYCOLOR, outline:'none', textTransform:'none', height: '6vh'}}>
                <p style={{fontFamily: OPENSANS, marginBottom:0, fontWeight:'600'}}>
                    Explore other sublease
                </p>
            </Button> */}
            <div style={{marginTop:'2vh'}}>
                <p style={{width: mobile ? 'auto' :'25vw', fontWeight:'700', textAlign:'center', fontSize:'0.8rem'}}>Purchase of Crib Connect is currently only available on mobile app.</p>
            </div>
            <Button variant="contained" fullWidth style={{background: PRIMARYCOLOR, textTransform:'none', outline:'none'}}>
                <p style={{marginBottom:0, fontFamily: OPENSANS, fontSize: '0.9rem', fontWeight:'600'}}>Get Mobile App</p>
                
            </Button>
            



          </div>
        </Fade>
      </Modal>
          
        </div>
    )
}