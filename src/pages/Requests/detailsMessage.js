import { Button, InputAdornment, TextField } from "@mui/material"
import { createRef, useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { EXTRALIGHT, OPENSANS } from "../../sharedUtils"
import { UserContext } from "../../UserContext"
import { animateScroll } from "react-scroll";

export default function DetailsMessageScreen(){
    const {id} = useParams()
    const {mobile} = useContext(UserContext)
    const [message, setMessage] = useState("")
    const [convo, setConvo] = useState([])
    const [uid, setUid] = useState("")
    
    
    const TEST = [1,1,1,1,1,1,1,1,1,1,1,1,1]
    const convosRef = useRef(null)

    useEffect(()=> {
        fetchConvo()
        const interval = setInterval(() => {
            fetchConvo()
        }, 1000);
        
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
        animateScroll.scrollToBottom({
          containerId: "messageContainer"
        });
    }
    
    return(
        <div style={{width:'100vw', height:'auto', paddingLeft:'5vw', paddingRight:'5vw'}}>
            <div id="messageContainer" ref={convosRef} style={{height:'auto', overflow:'scroll', height: mobile ? '60vh' : '70vh'}}>
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