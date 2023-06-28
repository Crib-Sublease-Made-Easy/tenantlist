import { Button, Fade, InputAdornment, Modal, TextField } from "@mui/material"
import { createRef, useContext, useEffect, useRef, useState,  } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { EXTRALIGHT, MEDIUMGREY, MEDIUMROUNDED, OPENSANS, SUBTEXTCOLOR } from "../../sharedUtils"
import { UserContext } from "../../UserContext"
import AnnouncementIcon from '@mui/icons-material/Announcement';
import Lottie from "lottie-react";
import CommunityAnimation from './communityAnimation.json'


export default function DetailsMessageScreen(){
    const navigate = useNavigate()
    const {id} = useParams()
    const {mobile} = useContext(UserContext)
    const {state} = useLocation()
    const requestDetails = state.requestDetails
    const [message, setMessage] = useState("")
    const [convo, setConvo] = useState([])
    const [uid, setUid] = useState("")
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState(null)
    const [tenantPaymentModalVis, setTenantPaymentModalVis] = useState(false)
    
    const convosRef = useRef(null)

    useEffect(()=> {
        fetchUserData()
        fetchConvo()
        const interval = setInterval(() => {
            fetchConvo()
        }, 500);
        
          return () => clearInterval(interval);
    }, [message])

    async function fetchUserData(){
        
        let at = localStorage.getItem("accessToken")
        let uid = localStorage.getItem("uid")
        setUid(uid)
        if(at != null && uid != null){

            await fetch('https://crib-llc.herokuapp.com/users/' + uid, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + at,
            }
            }) 
            .then(res => res.json()).then(async userData =>{
                setUserData(userData)
            })
            .catch(e=>{
              console.log("Error")
            })
        } 
        else{
            navigate("/login")
        }
    }
    

    function checkAuth(){
        let at = localStorage.getItem("accessToken")
        let rt = localStorage.getItem("refreshToken")
        if(at == null && rt != null){
            window.location.reload()
        }
        else if(at == null && rt == null){
            alert("Please login first.")
            navigate("/login")
        }
    }

    async function fetchConvo(){
      
        let uid = localStorage.getItem("uid")
        let at = localStorage.getItem("accessToken")
        if(at == null){
            checkAuth()
            return
        }
        // POST /req_messages
        // fetch("")
        if(at != null && id != null){
            await fetch(`https://crib-llc.herokuapp.com/req_messages/${id}`, {
                method: 'GET',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + at
                }
            })
            .then( async res => {
                console.log(res)
                if(res.status == 200){
                    let data = await res.json();
                    setConvo(data)
                    
                }
                if(res.status == 401){
                    checkAuth()
                }
            })
        
          
        }
        setLoading(false)
        
    }


    async function handleSendMessage(){
        
        
        let at = localStorage.getItem("accessToken")
        let uid = localStorage.getItem("uid")

        //Check if the person paid
        if(uid == requestDetails.tenantId){
           if(userData.cribPremium.paymentDetails.status == false){
            setTenantPaymentModalVis(true)
            return
           }
        }

        if(message == ""){
            return
        }
        setLoading(true)
        await fetch('https://crib-llc.herokuapp.com/req_messages', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + at
            },
            body:JSON.stringify({
                "requestId": `${id}`,
                "senderId": `${uid}`,
                "message": `${message}`
            })
        })
       
        setMessage("")
        fetchConvo()  
        setTimeout(()=> {
            scrollToBottom()
        },500)
        
    }

    function scrollToBottom() {
        convosRef.current.scrollTo({
            top: 100000000000000
        });
    }
    
    return(
        <>
        <div style={{width:'100vw', height:'auto', paddingLeft:'5vw', paddingRight:'5vw'}}>
            <div style={{minHeight:'5vh', paddingTop:'1vh', paddingBottom:'1vh', width:'100%', display:'flex', flexDirection:'row', alignItems:'center'}}>
                <AnnouncementIcon style={{color:MEDIUMGREY, fontSize: '1.2rem'}} />
                <p style={{marginLeft:'1vw', color: SUBTEXTCOLOR, fontWeight:"500", marginBottom:0}}>For you own and the other user's safety, please communicate only on Crib platform. </p>
            </div>
            <div id="messageContainer" ref={convosRef} style={{ overflow:'scroll', height: mobile ? '53vh' : '65vh'}}>
                {
                    convo.map((item, index) => {
                        
                        
                        
                        
                        
                        return (
                            <div key={item._id} style={{width:'100%', paddingTop:"2vh", paddingBottom:'2vh', backgroundColor: EXTRALIGHT }}>
                                <p style={{marginBottom:0, paddingLeft: mobile ? '5vw' : '1vw', fontFamily: OPENSANS}}><span style={{fontWeight:'600'}}>{uid == item.senderId ? "You" : item.senderName}</span>: {item.message}</p>
                            </div>
                        )
                    })
                }
            </div>
            <div style={{ width:'90vw', height: mobile ? '15vh' : '20vh', flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center',  }}>
                <TextField 
                value={message}
                onChange={(val) => setMessage(val.target.value)}
                style={{width:'100%', height: mobile ? '6vh' : '5vh',}} label="Enter message" 
                 InputProps={{
                    placeholder: 'Enter message',
                    endAdornment: 
                    <InputAdornment>
                     <Button disabled={loading} onClick={handleSendMessage} variant="contained" style={{backgroundColor:'black', outline:'none', color:'white', textTransform:'none', height: mobile ? '6vh' : '5vh',  }}>
                        {loading ?
                         <p style={{marginBottom:0, color:'white', fontFamily: OPENSANS, fontWeight:'500',  }}>...</p>
                         :
                        <p style={{marginBottom:0, color:'white', fontFamily: OPENSANS, fontWeight:'500',  }}>Send</p>
                        }
                    </Button>
                    </InputAdornment>,
                }}/>
               
            </div>
        </div>
        <Modal
        aria-labelledby="subtenant-form"
        aria-describedby="subtenant-form"
        open={tenantPaymentModalVis}
        onClose={()=> setTenantPaymentModalVis(false)}
        closeAfterTransition
    
        slotProps={{
        backdrop: {
            timeout: 500,
        },
        }}
    >
        <Fade in={tenantPaymentModalVis}>
        <div 
            style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: mobile ? '90vw' : '40vw',
            height:'auto',
            backgroundColor:'white',
            padding: mobile ? '4vw' : '2vw',
            borderRadius: MEDIUMROUNDED,
            display:'flex',
          
            flexDirection:'column',
            }}>
                <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.2rem', marginBottom: 5,}}>Get Crib Connect to message interested tenants</p>
                <p style={{fontWeight:'400', fontFamily: OPENSANS, fontSize:'0.9rem', marginBottom: '2vh', color: "#737373"}}>You will be able to connect with all users who are intersted in subleasing around your area.</p>
                <Lottie animationData={CommunityAnimation} style={{height:'30vh'}}/>
                <Button onClick={()=> navigate('/tenantPaymentScreen')} fullWidth variant="contained" style={{backgroundColor: 'black', outline:'none', textTransform:'none', height: '6vh', marginTop:'4vh'}}>
                    <p style={{fontFamily: OPENSANS, marginBottom:0, fontWeight:'600', objectFit:'cover'}}>
                        Check out Crib Connect
                    </p>
                </Button>
            </div>
        </Fade>
    </Modal>
    </>
    )
}