import { Button, Fade, Modal } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { EXTRALIGHT, LIGHTGREY, MEDIUMGREY, MEDIUMROUNDED, OPENSANS, PRIMARYCOLOR } from "../../sharedUtils";
import { UserContext } from "../../UserContext";
import RequestCards from "./requestCards";
import RequestReceivedCards from "./requestReceivedCard";

//FAQ Accordian 
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import CloseIcon from '@mui/icons-material/Close';

import MoneySVG from './assets/Money.svg'
import PrivacySVG from './assets/Privacy.svg'
import ContractSVG from './assets/Contract.svg'
import SaveTimeSVG from './assets/SaveTime.svg'

import SunlightSVG from  './assets/SunlightSVG.svg'


//How it works SVG
// import AcceptReqestSVG from './acceptRequest.svg'
// import SubleaseContractSVG from './subleaseContract.svg'
// import MoveInSVG from './moveIn.svg'
// import TransferMoneySVG from './transferMoney.svg'

const HOWITWORKS =
[{name:"Accept request", content:"Once a request is received, you have 48 hours to accept or reject a sublease based on your preference and criteria.",},
 {name:"Sublease contract", content: "After aceepting a request, you will be prompted to sign a sublease contract between you and the subtenant. Upon contract signed, subtenant will have 24 hours to sign the sublease contract and pay security deposit.", },
 {name:"Move-in procedure", content: "Once sublease contract is signed by both parties and security deposit from the subtenant is received by Crib . We will provide you with subtenant’s contact information to discuss more about monthly rent payment method and smove-in procedure.", },
 {name: "Transfer security deposit", content: "Security deposit will be transferred to you on move-in day after you and the subtenant confirmed successfully moves in."}]

 const CRIBPROS = [{name : "Saves you time", content : "Stop responding to 'Is this available?'. Only engage when tenants made up their mind to book.", img: SaveTimeSVG },
{name : "Verified subtenants", content: "All users are phone number verified. Plus, they can choose to be verified through email and ID.", img: PrivacySVG},
{name : "Preview all details", content : "Preview all details in one go. If you still have a question or wants extra information, just message the other user right away.", img: ContractSVG},
{name : "Find the sublease for you", content: "Find and filter the perfect sublease that fits your needs during your stay.  ", img:MoneySVG }]


const TIPSTOSUBLEASE = [
    {name: "Images with natural sunlight", content: "Open your curtains before taking pictures, your room will look more lively", img: SunlightSVG},
    {name: "Select max sublease duration", content: "Select the longest date range so more people are interested in it", img: SaveTimeSVG},
    {name: "Lower sublease price", content: "Give subtenants a discounted price. Don't pay for an empty room", img: MoneySVG}
]

export default function MyRequestsScreen(){
    const navigate = useNavigate()
    const {USERID, loggedIn, mobile} = useContext(UserContext)
    const [index, setIndex] = useState(0)
    const [requestsSent, setRequestsSent] = useState([])
    const [requestsReceived, setRequestsReceived] = useState([])

    const requestsListRef = useRef()

    //How it works modal
    const [howItWorksModalVis, setHowItWorksModalVis] = useState(false)

    //Delete 

    useEffect(()=> {
        checkAccessToken()
        getToken()
    }, [])

    function checkAccessToken(){
        let at = localStorage.getItem("accessToken")
        let rt = localStorage.getItem("refreshToken")

        if ( at == null && rt != null){
            window.location.reload()
        }
        else if(at == null && rt == null){
            navigate("/login")
        }
    }

    async function getToken(){
        let at = localStorage.getItem("accessToken")
        let uid = localStorage.getItem("uid")
        if(at == null || at == undefined){
            navigate("/")
            return
        }

        await fetch('https://crib-llc.herokuapp.com/users/' + uid, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + at,
            }
        }) 
        .then(async  res => {
            if(res.status == 200){
                let data = await res.json()
                if(data.postedProperties.length != 0){
                    getRequestsReceived(data.postedProperties[0])
                }
                if(data.requestsSent.legnth != 0){
                    getRequestsSent()
                }
                
            }
        })
        .catch( e => console.log("In the get token"))
    }

    async function getRequestsReceived(propId){
        console.log("The prop id", propId)
        const at = localStorage.getItem("accessToken")
        await fetch('https://crib-llc.herokuapp.com/requests/myreceivedrequests', {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + at
            },
        })
        .then(async (res)=>{
            if(res.status == 200){
                let data = await res.json()
              
                const reversedData = data.reverse();
              
                // for(let i = data.length -1; i >= 0 ; i --){
                //     reversed.push(data[i])
                // }
                setRequestsReceived(reversedData)
               
            }
            else{
                console.log(res.status)
            }
        })
        .catch( e => console.log("Error"))
    }

    async function rejectRequest(request){
        console.log(request)
        let at = localStorage.getItem("accessToken")
        await fetch(`https://crib-llc.herokuapp.com/requests/${request._id}`, {
            method: 'DELETE',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + at
            },
        })
        .then( res => {
            if(res.status == 200){
                let index = requestsReceived.indexOf(request);
                setRequestsReceived([...requestsReceived.slice(0, index), ...requestsReceived.slice(index + 1, requestsReceived.length)])
            }
            else{
                alert("Error in rejecting request, please try again later")
            }
        })
        .catch( e => {
            alert("Error occured, please try again later!")
            console.log(e)
        })
    }

    async function getRequestsSent(){
        let at = localStorage.getItem("accessToken")
        if(at == null){
            return
        }
        let uid = localStorage.getItem("uid")
      
        await fetch('https://crib-llc.herokuapp.com/requests/myrequests', {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + at
            }
        })
        .then(async (res)=>{
            if(res.status == 200){
                let data = await res.json()
                const reversedData = data.reverse();
                let reversed = [];
               
                setRequestsSent(reversedData)
            }
            else{
                console.log(res.status)
            }
        })
    }

    function scrollListDown(op){
        if(op == "+"){
            requestsListRef.current.scrollToItem({
                
                left: 0,
                behavior: "smooth",
              });
        }
    }

    return(
        <>
            <div style={{width: '100vw', height:'auto', marginLeft:'auto', marginRight:'auto', flexDirection:'row',}}>
               
                    <div style={{height: '10vh', width:'100%',  alignItems:'center', display:'flex', justifyContent:'space-between', paddingLeft:'5%', paddingRight:'5%'}}>
                        <div style={{flexDirection:'row', display:'flex',}}>
                            <p style={{marginBottom:0, fontSize:'1.2rem', fontWeight:'500'}}>My requests</p>
                            {!mobile &&
                            <div style={{flexDirection:'row', display:'flex', marginLeft:'2vw'}}>
                                <Button onClick={()=> setIndex(0)} size="small" variant={ index == 0 ? "contained" : 'outlined'} style={{backgroundColor: index == 0 ? 'black' : 'white', textTransform:"none",  borderColor:'black', outline:'none'}}>
                                    <p  style={{fontSize: mobile ? '1.1rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:0,color: index == 0 ? 'white' : 'black'}}>Requests received ({requestsReceived.length})</p>
                                </Button>
                                <Button onClick={()=> setIndex(1)} variant={ index == 1 ? "contained" : 'outlined'} size="small" style={{backgroundColor: index == 1 ? 'black' : 'white',  textTransform:"none", marginLeft:'1vw', borderColor:'black', outline:'none'}}>
                                    <p  style={{fontSize: mobile ? '1.1rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:0,color: index == 1 ? 'white' : 'black'}}>Requests sent ({requestsSent.length})</p>
                                </Button>
                            </div>
                            }
                        </div>
                        <div style={{ paddingLeft:'5%'}}>
                            <p onClick={()=> navigate("/howItWorks")} style={{marginBottom:0, fontSize:'1rem', fontWeight:'500', textDecorationLine:'underline', color: MEDIUMGREY, cursor:'pointer'}}>How does it work?</p>
                        </div>
                    </div>
                    {mobile &&
                    <div style={{flexDirection:'row', display:'flex', width:'100%',paddingLeft:'5%'}}>
                        <Button onClick={()=> setIndex(0)} size="small" variant={ index == 0 ? "contained" : 'outlined'} style={{backgroundColor: index == 0 ? 'black' : 'white', textTransform:"none",  borderColor:'black', outline:'none'}}>
                            <p  style={{fontSize: '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:0,color: index == 0 ? 'white' : 'black'}}>Requests received ({requestsReceived.length})</p>
                        </Button>
                        <Button onClick={()=> setIndex(1)} variant={ index == 1 ? "contained" : 'outlined'} size="small" style={{backgroundColor: index == 1 ? 'black' : 'white',  textTransform:"none", marginLeft: mobile ? '2vw' : '1vw', borderColor:'black', outline:'none'}}>
                            <p  style={{fontSize: '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:0,color: index == 1 ? 'white' : 'black'}}>Requests sent ({requestsSent.length})</p>
                        </Button>
                    </div>
                    }
                    <div style={{width:'100vw', height: 'auto',  }}>
                        {
                        index == 1 ?
                        <Row style={{display:'flex', flex: 1, marginTop:'5vh', width:'90vw', marginLeft:'auto', marginRight:'auto', rowGap: '5vh'}}>
                        {
                       
                                requestsSent.map((item) => {
                                    return(
                                        <Col key={"requestsSent" + item._id} xs={12} sm={12} md={3} style={{ paddingLeft: mobile && 0, paddingRight: mobile && 0}}>
                                            <RequestCards data={item}/>
                                        </Col>
                                    )
                                })
                        }
                        </Row>
                        :
                        requestsReceived.length != 0 ?
                        <>
                            <ul ref={requestsListRef} style={{width: '100vw', height: 'auto',  marginTop:'5vh', display:'flex', flexDirection:'column', overflow:'scroll' , listStyle:'none', paddingLeft: 0, columnCount: 1, columnGap:0,display:'flex', alignItems:'center'}}>
                            {
                                requestsReceived.map((item, index) => {
                                    
                                    return(
                                        <li style={{marginTop: index == 0 ? 0 : '5vh', display:'flex', alignItems:'center'}} key={item._id + index}>
                                            <RequestReceivedCards key={index + "requestCards"} data={item}  rejectRequest={()=>rejectRequest(item)} />
                                        </li>
                                    )
                                })
                            }
                            </ul>      
                        </>
                        :
                        <div style={{width:'90vw', marginLeft:'auto', marginRight:'auto'}}>
                            <p style={{fontFamily: OPENSANS, fontWeight:'600', fontSize:'1.4rem', marginTop:'4vh'}}>Try these steps to get more attention</p>
                            <div style={{flexDirection: mobile ? 'column' : 'row', display:'flex', marginTop: mobile ? '3vh' : '5vh'}}>
                                {TIPSTOSUBLEASE.map((item, index) => {
                                    return(
                                        <div key={"TipsToSublease" + item.name} style={{borderRadius: MEDIUMROUNDED, borderColor: MEDIUMGREY, borderWidth:'1px', borderStyle:'solid', padding: mobile ? '2vw' : '1vw', width:'auto', width: mobile ? '100%' : '25vw', flexDirection:'row', display:'flex', justifyContent:'space-between', marginTop: mobile && index == 0 ? 0 : '3vh', marginLeft:index == 0 ? 0 : mobile ? 0 : '2vw'}}>
                                            <div>
                                                <img src={item.img} style={{width:mobile ? '6vw' : '2vw'}} />
                                            </div>
                                            <div style={{marginLeft: mobile ? '3vw' : '1vw'}}>
                                                <p style={{fontFamily: OPENSANS, fontWeight:'600', fontSize:'1rem',marginBottom:0}}>{item.name}</p>
                                                <p style={{fontFamily: OPENSANS, fontWeight:'400', fontSize:'0.9rem',marginBottom:0, color:'#737373'}}>{item.content}</p>
                                            </div>
                                        </div>
                                    )
                                    
                                })}
                                

                            </div>
                        </div>
                        }
                        
                    </div>
               

                <div style={{ width: mobile ? '90vw' : '40vw', display:'none', }}>
                    <div style={{height: '10vh', width:'100%',  alignItems:'center', display:'flex'}}>
                        <p style={{marginBottom:0, fontSize:'1.2rem', fontWeight:'500'}}>How does it work?</p>
                    </div>
                </div>
            </div>
            <div style={{position:'relative', width:'90vw', marginLeft:"auto", marginRight:'auto', marginTop: '15vh'}}>
                <div style={{width: mobile ? '90vw' : '40vw'}}>
                    <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize: mobile ? '1.8rem' : '2.2rem', marginBottom:'1vh'}}>What's next?</p>
                    <p style={{fontFamily: OPENSANS, fontWeight:'400', }}>Crib's 2 step procces streamlines subleasing like never before. Our all-in-one platform assists you from start to finish to make it easy, efficient, and seamless. It doesn't get easier than this!</p>
                </div>
                <Button onClick={()=> navigate("/howItWorks")} variant="contained" style={{backgroundColor:'black', outline:'none', color:'white', height: mobile ?'6vh' : '5vh', textTransform:'none'}}>
                    <p style={{fontFamily: OPENSANS, marginBottom:0, fontWeight:'500'}}>How it works</p>
                </Button>
                <div style={{width: mobile ? '90vw' : '40vw', marginTop: mobile ? '10vh' : '15vh', }}>
                    <p style={{fontWeight:'600', fontFamily: OPENSANS, fontSize: mobile ? '1.8rem' : '2.2rem', marginBottom:'1vh'}}>Sublease with confidence</p>
                </div>
                <div style={{flexDirection: mobile ? 'column' :'row', display:'flex', marginTop: mobile ? '5vh' : '7vh', textAlign: mobile ? 'center' : 'left'}}>
                    {CRIBPROS.map((item)=> {
                        return(
                        <div key={"CribPros" + item.name} style={{width: mobile ? '90vw' : '22.5vw', height:'auto',paddingRight:'2vw', flexDirection:'column', marginTop: mobile ? '5vh' : 0}}>
                            <img src={item.img}  style={{height:'15vh', }}/> 
                            <p style={{fontFamily: OPENSANS, fontWeight:'700', fontSize:'1.4rem', marginTop:'2vh'}}>{item.name}</p>
                            <p style={{fontFamily: OPENSANS}}>{item.content}</p>
                        </div>
                        )
                    })}
                    
                </div>
            </div>
           
            {/* <div style={{width: '90vw', height:'auto', marginLeft:'auto', marginRight:'auto', textAlign:'center', marginTop: mobile ? '10vh' : "15vh", flexDirection: mobile ? 'column' : 'row', display:'flex', justifyContent:'space-between', paddingBottom:'10vh' }}>
                <p style={{fontFamily: OPENSANS, fontWeight:'600', fontSize:"2rem", textAlign: mobile ? 'center' : 'left'}}>Your questions, <br/>answered.</p>
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
            </div> */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={howItWorksModalVis}
                
                closeAfterTransition
                slotProps={{
                backdrop: {
                    timeout: 500,
                },
                }}
            >
                <Fade in={howItWorksModalVis}>
                    <div 
                        style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        height:'auto',
                        backgroundColor:'white',
                        padding: mobile ? '4vw' : '2vw',
                        borderRadius: MEDIUMROUNDED,
                        display:'flex',
                        
                        flexDirection:'column',
                        width: mobile ? '95vw' : 'auto',
                        minWidth:'35vw'
                        }}>
                            <div onClick={()=>setHowItWorksModalVis(false)} style={{display:'flex', flexDirection:'row', alignItems:'center', cursor:'pointer'}}>
                                <CloseIcon style={{color:'black', fontSize:'1.5rem'}}/>
                            </div>
                            <div style={{marginTop:'2vh'}}>
                            {
                                HOWITWORKS.map((item, index)=> {
                                    return(
                                        <div key={"howitworks" + item.name}>
                                            <p style={{marginBottom: '1vh', fontSize: mobile ? '1rem' : '1.2rem', fontWeight:'600', fontFamily: OPENSANS}}>{index+1}. {item.name}</p>
                                            <p style={{fontSize: mobile ? '0.8rem' : '0.9rem', fontWeight:'400', fontFamily: OPENSANS, color:'#737373'}}>{item.content}</p>
                                        </div>
                                    )
                                })
                            }
                            </div>
                            <div style={{display:'flex', flexDirection:'row',  alignItems:'center', marginTop:'2vh', justifyContent:'space-between'}}>
                                <p style={{fontSize: '1rem', fontWeight:'600', fontFamily: OPENSANS, marginBottom:0}}>Still have a question?</p>
                                <Button  varaint="contained" style={{backgroundColor:'black', borderColor:'black', borderWidth:'1px', borderStyle:'solid', textTransform:'none',outline:'none'}}>
                                    <a href="tel:+16085158038" style={{fontSize: '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:0,color:'white'}}>Contact us</a>
                                </Button>
                            </div>
                    </div>
                </Fade>
            </Modal>
                   
        </>

        

    )
}