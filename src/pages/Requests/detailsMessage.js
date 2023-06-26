import { Button, InputAdornment, TextField } from "@mui/material"
import { createRef, useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { EXTRALIGHT, MEDIUMGREY, OPENSANS, SUBTEXTCOLOR } from "../../sharedUtils"
import { UserContext } from "../../UserContext"
import AnnouncementIcon from '@mui/icons-material/Announcement';

export default function DetailsMessageScreen(){
    const {id} = useParams()
    const {mobile} = useContext(UserContext)
    const [message, setMessage] = useState("")
    const [convo, setConvo] = useState([])
    const [uid, setUid] = useState("")
    const [scrolling, setScrolling] = useState(false)
    
    const convosRef = useRef(null)

    useEffect(()=> {
        fetchConvo()
        const interval = setInterval(() => {
            fetchConvo()
        }, 500);
        
          return () => clearInterval(interval);
    }, [message])

    async function fetchConvo(){
      
        let uid = localStorage.getItem("uid")
        let at = localStorage.getItem("accessToken")
        setUid(uid)
        // POST /req_messages
        // fetch("")
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
                console.log(data[data.length-1]._id)
               
               
            }
        })
      
        scrollToBottom()
        
    }


    async function handleSendMessage(){
        
        let at = localStorage.getItem("accessToken")
        let uid = localStorage.getItem("uid")

        if(message == ""){
            return
        }
        
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
        
    }

    function scrollToBottom() {
        convosRef.current.scrollTo({
            top: 100000000000000
        });
    }
    
    return(
        <div style={{width:'100vw', height:'auto', paddingLeft:'5vw', paddingRight:'5vw'}}>
            <div style={{minHeight:'5vh', paddingTop:'1vh', paddingBottom:'1vh', width:'100%', display:'flex', flexDirection:'row', alignItems:'center'}}>
                <AnnouncementIcon style={{color:MEDIUMGREY, fontSize: '1.2rem'}} />
                <p style={{marginLeft:'1vw', color: SUBTEXTCOLOR, fontWeight:"500", marginBottom:0}}>For you own and the other user's safety, please communicate only on Crib platform. </p>
            </div>
            <div id="messageContainer" ref={convosRef} style={{ overflow:'scroll', height: mobile ? '55vh' : '65vh'}}>
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
                     <Button onClick={handleSendMessage} variant="contained" style={{backgroundColor:'black', outline:'none', color:'white', textTransform:'none', height: mobile ? '6vh' : '5vh',  }}>
                        <p style={{marginBottom:0, color:'white', fontFamily: OPENSANS, fontWeight:'500',  }}>Send</p>
                    </Button>
                    </InputAdornment>,
                }}/>
               
            </div>
        </div>

    )
}