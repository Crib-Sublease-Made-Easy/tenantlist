import { MarkEmailRead, PermPhoneMsg } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EXTRALIGHT, LIGHTGREY, MEDIUMGREY, MEDIUMROUNDED, OPENSANS, PRIMARYCOLOR } from "../../sharedUtils";
import { UserContext } from "../../UserContext";

import CribConnections from './CribConnects.json'

import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';

import Lottie from "lottie-react";
import PreparingContractAnim from './preparingContract.json'
import RequestSentAnim from './requestSent.json'



//Modal
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

export default function RequestReceivedCards(props){
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const {mobile} = useContext(UserContext)
    const [messageModal, setMessageModal] = useState(false)
    const subleaseData = props.data
    const subtenantData = props.data.subtenantInfo[0]
  
    const [userData, setUserData] = useState(null)
    const [propData,setPropData] = useState(null)
    const [acceptPage, setAcceptPage] = useState(0)

    const [editFirstName, setEditFirstName] = useState("")
    const [editLastName, setEditLastName] = useState("")
    const [editEmail, setEditEmail] = useState("")

    const [nameEmailConfirmModalVis, setNameEmailConfirmModalVis] = useState(false)

    const [prepareContractModalVis, setPrepareContractModalVis] = useState(false)
    const [contractSent, setContractSent] = useState(false)

    const [paymentAmount, setPaymentAmount] = useState(null)

    useEffect(()=> {
        getToken()
    }, [])


    async function getToken(){
        let uid = localStorage.getItem("uid")
        let at = localStorage.getItem("accessToken")
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
                if (data.postedProperties.length != 0){
                    getPropData(data.postedProperties[0])
                }
                setUserData(data)
                setEditFirstName(data.firstName)
                setEditLastName(data.lastName)
                setEditEmail(data.email)
            }
        })
        .catch( e=> console.log("Error"))
    }

    async function getPropData(id){
        let at = localStorage.getItem("accessToken")
        await fetch('https://crib-llc.herokuapp.com/properties/' + id, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + at,
        }
        })
        .then(async res => {
            if(res.status == 200){
                let data = await res.json();
                setPropData(data.propertyInfo)

            }
        })
    }

    async function getPayment(){
        let at = localStorage.getItem("accessToken")
        console.log(props.data._id)
        // await fetch(`https://crib-llc.herokuapp.com/requests/payment_amount/${props.data._id}`, {
        //     method: 'GET',
        //     headers: {
        //     'Authorization': "Bearer " + at
        //     }
        // })
        // .then ( async res => {
        //     if(res.status == 200){
        //         let data = await res.json()
        //         setPaymentAmount(data.amount)
                
        //     }
        // })
        // .catch( e => {
        //     console.log("error")
        // })
    }




    //Modal 
    const [acceptRequestModalVis, setAcceptRequestModalVis] = useState(false)

    useEffect(()=>{

    }, [])
   

    function getAge(dob){
        let age = dob / (1000*60*60*24*31*12)
        return age.toFixed(0)
    }

    function handleMessageTenantClick(){
        setMessageModal(true)
    }

    function handleNav(){
        navigate("/requestDetails")
    }


    function updateNameEmail(){
        const accessToken = localStorage.getItem("accessToken");
        const USERID = localStorage.getItem("uid")        
        setNameEmailConfirmModalVis(false)
        // if(USERID != null && accessToken != null){
        //     fetch('https://crib-llc.herokuapp.com/users/' + USERID, {
        //         method: 'PUT',
        //         headers: {
        //             Accept: 'application/json',
        //             'Content-Type': 'application/json',
        //             'Authorization': 'Bearer ' + accessToken,
        //         },
        //         body: JSON.stringify({
        //             "email": editEmail,
        //             "firstName": editFirstName,
        //             "lastName": editLastName
        //         })
        //     })
        //     .then((response) => {
        //         if(response.status == 200){
        //             setNameEmailConfirmModalVis(false)
        //             navigate(0)
        //         }
        //     }
        //     )
        //     .catch(e => {
        //         console.log("ERROR --- EDITEDUCATION --- UPDATE")
        //     })
        // }

        setLoading(true)
        setPrepareContractModalVis(true)
        fetch('https://crib-llc.herokuapp.com/requests/requestesignature', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            },
            body: JSON.stringify({
                "subleasor_name": `${editFirstName} ${editLastName}`,
                "subtenant_name": `${subtenantData.firstName} ${subtenantData.lastName}`,
                "property_address":`${propData.loc.streetAddr} ${propData.loc.secondaryTxt}`,
                "subleasor_email": editEmail,
                "subtenant_email": subtenantData.email,
                "sublease_start_date": `${new Date (subleaseData.startDate).toLocaleDateString().split(",")[0]}`,
                "sublease_end_date": `${new Date(subleaseData.endDate).toLocaleDateString().split(",")[0]}`,
                "rent": propData.price,
                "security_deposit": propData.securityDeposit,
                "fee_percentage": "5",
                "request_id":props.data._id
            })
        })
        .then(async res => {
            console.log("RESSSS", res)
            setLoading(false)
            if(res.status == 200){
                let data = await res.json()
                setContractSent(true)
            }
        })
        .catch( e => console.log("error in outer block"))
    }

    function getTotal(){
        let sd = new Date(subleaseData.startDate).getTime()
        let ed = new Date(subleaseData.endDate).getTime()

        let diffInMonths = ((ed - sd) / (1000*60*60*24*30.437))

        let total = diffInMonths * propData.price

        return "$" + total.toFixed(2)
    }


  
    // console.log(props.data)
    return(
        <>
        {propData != null &&
        <div style={{width:'90vw', padding: mobile ? '3vw' : '1.5vw', height: mobile ? 'auto' : '50vh',  borderRadius:MEDIUMROUNDED, backgroundColor:'white',borderWidth:'1px', borderStyle:'solid', borderColor: LIGHTGREY, flexDirection: mobile ? 'column' : 'row', display:'flex'}}>
            <div style={{flexDirection:'column', display:'flex', flex: 1, paddingRight: mobile ? 0 : '1.5vw'}}>
                <p style={{fontSize:"1rem", marginBottom:0, fontFamily: OPENSANS, fontWeight:'600'}}>Tenant Information</p>
                <div style={{flexDirection:'row', display:'flex', marginTop:'2vh', height:'10vh'}}>
                    <img src={subtenantData.profilePic} style={{height:'10vh', width: '10vh', borderRadius:'5vh'}}/> 
                    <div style={{flexDirection:'column', display:'flex', marginLeft:'1vw', justifyContent:'space-between'}}>
                        <p style={{fontSize:"0.9rem", fontWeight:'600', marginBottom:0, fontFamily: OPENSANS}}>{subtenantData.firstName} {subtenantData.lastName}</p>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <p style={{fontSize:"0.8rem", fontWeight:'500', marginBottom:0, fontFamily: OPENSANS}}>{subtenantData.gender}</p>
                            <p style={{fontSize:"0.8rem", fontWeight:'500', marginBottom:0, marginLeft:'2vw', fontFamily: OPENSANS}}>{getAge(subtenantData.dob)}</p>
                        </div>
                        {subtenantData.school != undefined && subtenantData.school.trim() != "" &&
                        <div style={{flexDirection:'row', display:'flex', alignItems:'center', }}>
                            <SchoolIcon style={{color:'black', fontSize:'0.8rem'}} />
                            <p style={{fontSize:"0.8rem", fontWeight:'500', marginBottom:0, fontFamily: OPENSANS, marginLeft:'0.5vw'}}>{subtenantData.school.trim()}</p>
                        </div>
                        }
                        {subtenantData.occupation != undefined && subtenantData.occupation.trim() != "" &&
                        <div style={{flexDirection:'row', display:'flex', alignItems:'center',}}>
                            <WorkIcon style={{color:'black', fontSize:'0.8rem'}} />
                            <p style={{fontSize:"0.8rem", fontWeight:'500', marginBottom:0, fontFamily: OPENSANS, marginLeft:'0.5vw'}}>{subtenantData.occupation.trim()}</p>
                        </div>
                        }
                    </div>
                </div>
                <div style={{flexDirection:'row', display:'flex', marginTop:'4vh'}}>
                    <div style={{flexDirection:'row', display:'flex',alignItems:'center'}}>
                        <PermPhoneMsg style={{fontSize: mobile ? '4vw' : '1vw'}}/>
                        <p style={{marginTop:'auto', marginBottom:0, marginLeft: mobile ? '2vw' : '0.5vw', fontFamily:OPENSANS, fontWeight:'500', fontSize:"0.9rem"}}>Phone verified</p>
                    </div>
                    <div style={{flexDirection:'row', display:'flex',alignItems:'center', marginLeft:'2vw' }}>
                        <PermPhoneMsg style={{fontSize: mobile ? '4vw' : '1vw'}}/>
                        <p style={{marginTop:'auto', marginBottom:0, marginLeft:'0.5vw', fontFamily:OPENSANS, fontWeight:'500', fontSize:"0.9rem",}}>Email verified</p>
                    </div>
                </div>
                <div style={{marginTop:'2vh'}}>
                    <p style={{fontSize:'1rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:5}}>Description</p>
                    <p style={{fontSize:'0.8rem', fontFamily: OPENSANS, fontWeight:"500", marginBottom:5, display:'flex', overflow:'scroll', height: mobile ? 'auto' : '15vh', maxWidth: mobile ? '100%' : '25vw', overflowX:'hidden'}}>{subleaseData.about}</p>
                </div>

            </div>
            <div style={{flexDirection:'column', display:'flex', flex: 1, borderLeftWidth: mobile ? 0 : '0.5px', borderLeftStyle:'solid', borderLeftColor: MEDIUMGREY, borderRightColor: MEDIUMGREY, borderRightStyle:"solid", borderRightWidth: mobile ? 0 : '0.5px' , paddingLeft: mobile ? 0 : '1.5vw', paddingRight: mobile ? 0 : '1.5vw', justifyContent:'space-between',  marginTop: mobile ? '2.5vh' : 0, paddingTop: mobile ? '2.5vh' : 0, borderTopWidth: mobile ? '1px' : 0, borderTopStyle:'solid', borderTopColor: LIGHTGREY}}>
                <div>
                    <p style={{fontSize:"1rem", marginBottom:0, fontFamily: OPENSANS, fontWeight:'600'}}>Sublease Information</p>
                    <div style={{flexDirection:'row', display:'flex', marginTop:'2vh'}}>
                        <div>
                            <p style={{fontSize: mobile ? '0.9rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:5}}>Move in</p>
                            <p style={{fontSize:  mobile ? '0.9rem' : '0.8rem', fontFamily: OPENSANS, fontWeight:"400", marginBottom:5}} >{new Date(subleaseData.startDate).toLocaleDateString().split(","[0])}</p>
                        </div>
                        <div style={{marginLeft:'2vw'}}>
                            <p style={{fontSize: mobile ? '0.9rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:5}}>Move out</p>
                            <p style={{fontSize:  mobile ? '0.9rem' : '0.8rem', fontFamily: OPENSANS, fontWeight:"400", marginBottom:5}} >{new Date(subleaseData.endDate).toLocaleDateString().split(","[0])}</p>
                        </div>
                    </div>
                    <div style={{flexDirection:'column', display:'flex', marginTop:'1vh'}}>
                        <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between'}}>
                            <p style={{fontSize: mobile ? '0.9rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:5}}>Security deposit:</p>
                            <p style={{fontSize: mobile ? '0.9rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:"400", marginBottom:5}}>${propData.securityDeposit}</p>
                        </div>
                        <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between'}}>
                            <p style={{fontSize: mobile ? '0.9rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:5}}>Monthly rent:</p>
                            <p style={{fontSize: mobile ? '0.9rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:"400", marginBottom:5}}>${propData.price} /month</p>
                        </div>
                    </div>
                    <div style={{flexDirection:'column', display:'flex', marginTop:'2vh'}}>
                        <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between'}}>
                            <p style={{fontSize:  '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:5}}>Number of occupants:</p>
                            <p style={{fontSize: mobile ? '0.9rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:"400", marginBottom:5}}>{subleaseData.numberOfOccupants}</p>
                        </div>
                    </div>
                </div>
                {
                <div style={{flexDirection:'column', display:'flex', marginTop:'2vh'}}>
                    <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <p style={{fontSize: mobile ? '1rem' : '1.1rem', fontFamily: OPENSANS, fontWeight:"700", marginBottom:5}}>Total rent receive:</p>
                        <p style={{fontSize: mobile ? '0.9rem' : '1.1rem', fontFamily: OPENSANS, fontWeight:"700", marginBottom:5}}>{getTotal()}</p>
                    </div>
                    <small>First month’s rent will be paid on move-in day</small>
                </div>
                }
            </div>
            <div style={{flexDirection:'column', display:'flex', flex: 1,  paddingLeft: mobile ? 0 : '1.5vw', justifyContent:'space-between',  marginTop: mobile ? '2.5vh' : 0, paddingTop: mobile ? '2.5vh' : 0, borderTopWidth: mobile ? '0.5px' : 0, borderTopColor: LIGHTGREY, borderTopStyle:'solid'}}>
                <div>
                    <p style={{fontSize:"1rem", marginBottom:0, fontFamily: OPENSANS, fontWeight:'600'}}>Your decision</p>
                    <small>You will be prompted to sign a sublease contract upon accepting sublease request</small>
                </div>
                {subleaseData.accepted ?
                <div>
                    <Button onClick={()=>navigate(`/requestDetails/${subleaseData._id}`, { state : {requestDetails: props.data} })} fullWidth varaint="contained" style={{backgroundColor:'black', borderColor:'black', borderWidth:'1px', borderStyle:'solid', textTransform:'none', marginTop:'2vh', outline:'none'}}>
                        <p style={{fontSize: mobile ? '1.1rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:0,color:'white'}}>View details</p>
                    </Button>
                    {/* <Button onClick={() => setNameEmailConfirmModalVis(true)} fullWidth varaint="contained" style={{backgroundColor:'black', borderColor:'black', borderWidth:'1px', borderStyle:'solid', textTransform:'none', marginTop:'2vh', outline:'none'}}>
                        <p style={{fontSize: mobile ? '1.1rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:0,color:'white'}}>View details</p>
                    </Button> */}
                </div>
                :
                <div style={{marginTop: mobile ? '5vh' : 0}}>
                    <Button onClick={()=>props.rejectRequest()} fullWidth varaint="outlined" style={{borderColor:'black', borderWidth:'1px', borderStyle:'solid', textTransform:'none', outline:'none'}}>
                        <p style={{fontSize: mobile ? '1.1rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:0,color:'black'}}>Reject</p>
                    </Button>
                    <Button onClick={()=>setNameEmailConfirmModalVis(true)} fullWidth varaint="contained" style={{backgroundColor:'black', borderColor:'black', borderWidth:'1px', borderStyle:'solid', textTransform:'none', marginTop:'2vh', outline:'none'}}>
                        <p style={{fontSize: mobile ? '1.1rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:0,color:'white'}}>Accept</p>
                    </Button>

                </div>
                }
            </div>
            {/* <img src={propData.imgList[0]} style={{width:'100%', height:'15vw', borderTopLeftRadius:MEDIUMROUNDED, borderTopRightRadius: MEDIUMROUNDED}} /> */}
                {/* <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                    <p style={{fontSize:"0.8rem", fontWeight:'500', marginBottom:0, fontFamily: OPENSANS}}>Requested expires in 3 hours</p>
                    <p style={{fontSize:"0.8rem", marginBottom:0, fontFamily: OPENSANS, textDecorationLine:'underline'}}>Need help?</p>
                </div>
                <div style={{flexDirection:'row', display:'flex', alignItems:'center', marginTop:'2vh' }}>
                    <img src={subtenantData.profilePic} style={{height:'10vh', width: '10vh', borderRadius:'5vh'}}/> 
                    <div style={{paddingLeft:'1vw',display:'flex', flex:1, justifyContent:'space-between',  flexDirection:"column", }}>
                        <div style={{flexDirection:'column',}}>
                            <p style={{fontSize:"0.9rem", fontWeight:'600', marginBottom:0, fontFamily: OPENSANS}}>{subtenantData.firstName} {subtenantData.lastName}</p>
                            <div style={{display:'flex', flexDirection:'row'}}>
                                <p style={{fontSize:"0.8rem", fontWeight:'500', marginBottom:0, fontFamily: OPENSANS}}>{subtenantData.gender}</p>
                                <p style={{fontSize:"0.8rem", fontWeight:'500', marginBottom:0, marginLeft:'2vw', fontFamily: OPENSANS}}>{getAge(subtenantData.dob)}</p>
                            </div>
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
                <div style={{flexDirection:'row', display:'flex', marginTop:'2vh'}}>
                    <div style={{flexDirection:'row', display:'flex',alignItems:'center'}}>
                        <PermPhoneMsg style={{fontSize: mobile ? '4vw' : '1vw'}}/>
                        <p style={{marginTop:'auto', marginBottom:0, marginLeft: mobile ? '2vw' : '0.5vw', fontFamily:OPENSANS, fontWeight:'500', fontSize:"0.9rem"}}>Phone verified</p>
                    </div>
                    <div style={{flexDirection:'row', display:'flex',alignItems:'center', marginLeft:'2vw' }}>
                        <MarkEmailRead style={{fontSize:'1vw'}}/>
                        <p style={{marginTop:'auto', marginBottom:0, marginLeft:'0.5vw', fontFamily:OPENSANS, fontWeight:'500', fontSize:"0.9rem",}}>Email verified</p>
                    </div>
                </div>
                <div>
                    <div style={{flexDirection:'row', display:'flex', marginTop:'2vh'}}>
                        <div>
                            <p style={{fontSize: mobile ? '1.1rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:5}}>Move in</p>
                            <p style={{fontSize:  mobile ? '0.9rem' : '0.8rem', fontFamily: OPENSANS, fontWeight:"400", marginBottom:5}} >{new Date(subleaseData.requestStart).toLocaleDateString().split(","[0])}</p>
                        </div>
                        <div style={{marginLeft:'2vw'}}>
                            <p style={{fontSize: mobile ? '1.1rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:5}}>Move out</p>
                            <p style={{fontSize:  mobile ? '0.9rem' : '0.8rem', fontFamily: OPENSANS, fontWeight:"400", marginBottom:5}} >{new Date(subleaseData.requestEnd).toLocaleDateString().split(","[0])}</p>
                        </div>
                    </div>
                    <div style={{flexDirection:'row', display:'flex', marginTop:'2vh'}}>
                        <div>
                            <p style={{fontSize: mobile ? '1.1rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:5}}>Security deposit</p>
                            <p style={{fontSize:  mobile ? '0.9rem' : '0.8rem', fontFamily: OPENSANS, fontWeight:"400", marginBottom:5}}>$1800</p>
                        </div>
                        <div style={{marginLeft:'2vw'}}>
                            <p style={{fontSize: mobile ? '1.1rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:5}}>Rent</p>
                            <p style={{fontSize:  mobile ? '0.9rem' : '0.8rem', fontFamily: OPENSANS, fontWeight:"400", marginBottom:5}}>$1800 /month</p>
                        </div>
                    </div>
                    <div style={{marginTop:'2vh'}}>
                        <p style={{fontSize:mobile ? '1.1rem' : '0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:5}}>Number of occupants : {subleaseData.numOfOccupants}</p>
                    </div>
                    <div style={{marginTop:'2vh'}}>
                        <p style={{fontSize:'1rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:5}}>Description</p>
                        <p style={{fontSize:'0.8rem', fontFamily: OPENSANS, fontWeight:"500", marginBottom:5}} >Hello my name is Isaac, I am looking for a sublease for my summer inernship. I want to be close to Manhattan if possible and I want to live in a studio.</p>
                    </div>
                    <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', marginTop:'2vh'}}>
                        <Button onClick={()=> setMessageModal(true)} varaint='outlined' style={{flexDirection:'row', display:'flex',borderWidth:'1px', borderColor:'black', borderStyle:'solid',color:'black', height:'5vh', textTransform:'none', marginTop : '2vh', outline: 'none', width:'45%'}}>
                            <p style={{marginBottom:0, fontWeight:'500', }}>Reject</p>
                        </Button>
                        <Button onClick={()=> setAcceptRequestModalVis(true)}varaint='contained' style={{flexDirection:'row', display:'flex', backgroundColor: 'black', color:'white', height:'5vh', textTransform:'none', marginTop : '2vh', outline: 'none',  width:'45%'}}>
                            <p style={{marginBottom:0, fontWeight:'500', }}>Approve</p>
                        </Button>
                    </div>
                </div> */}
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
        <Modal
        aria-labelledby="request-accept-modal"
        aria-describedby="accept-subtenant-request"
        open={nameEmailConfirmModalVis}
        onClose={()=>setNameEmailConfirmModalVis(false)}
        closeAfterTransition
        slotProps={{
        backdrop: {
            timeout: 500,
        },
        }}
        >
            <Fade in={nameEmailConfirmModalVis}>
                <div 
                    style={{
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -30%)',
                    height:'auto',
                    backgroundColor:'white',
                    padding: mobile ? '4vw' : '2vw',
                    borderRadius: MEDIUMROUNDED,
                    display:'flex',
                    flexDirection:'column',
                    width: mobile ? '90vw' : '40vw',
                    
                    }}>
                    { userData != null && acceptPage == 0 ?
                    <>
                        <p style={{fontSize:'1.2rem', fontFamily: OPENSANS, color: 'black', fontWeight:'600', marginBottom:5}}>Confirm legal name and email</p>
                        <p style={{fontSize:'0.9rem', fontFamily: OPENSANS, color: MEDIUMGREY, marginBottom:0}}>Please check if these information are correct before we prepare your sublease contract.</p>
                        <div style={{marginTop:'4vh'}}>
                            <p style={{fontSize:'1rem', fontFamily: OPENSANS, color: 'black', fontWeight:'600'}}>Legal name: <span style={{fontWeight:'400'}}>{userData.firstName} {userData.lastName}</span></p>
                            <p style={{fontSize:'1rem', fontFamily: OPENSANS, color: 'black', fontWeight:'600', marginBottom:0}}>Email: <span style={{fontWeight:'400'}}>{userData.email}</span></p>
                        </div>
                        <div style={{marginTop: '5vh', display:'flex', flexDirection:'row'}}>
                            <Button onClick={()=> setAcceptPage(1)} variant='outlined' style={{borderColor:'black', outline:'none', textTransform:'none', height:'5vh'}}>
                               
                                <p style={{marginBottom:0, fontWeight:'500', fontSize:'0.9rem', fontFamily: OPENSANS, color:'black'}}>Edit</p>
                                
                            </Button>
                            <Button onClick={updateNameEmail} variant='contained' style={{backgroundColor:'black', outline:'none', textTransform:'none', height:'5vh', marginLeft:'2vh'}}>
                               
                                <p style={{marginBottom:0, fontWeight:'500', fontSize:'0.9rem', fontFamily: OPENSANS, color:'white'}}>Confirm</p>
                                
                            </Button>
                        </div>
                    </>
                    :
                    userData != null && acceptPage == 1 &&
                    <>
                        <p style={{fontSize:'1.2rem', fontFamily: OPENSANS, color: 'black', fontWeight:'600', marginBottom:5}}>Enter legal name and email</p>
                        <p style={{fontSize:'0.9rem', fontFamily: OPENSANS, color: MEDIUMGREY, marginBottom:0}}>Please check if these information are correct before we prepare your sublease contract.</p>
                        <div style={{marginTop:'4vh',}}>
                            <div style={{display:'flex', flexDirection:'row',  justifyContent:'space-between'}}>
                                <TextField label="First name" value={editFirstName} onChange={(val)=> setEditFirstName(val.target.value)} style={{width:'48%'}}/>
                                <TextField label="Last name" value={editLastName} onChange={(val)=> setEditLastName(val.target.value)} style={{ width:'48%'}}/>
                            </div>
                            <div style={{marginTop:'2vh'}}>
                                <TextField fullWidth label="Email" value={editEmail} onChange={(val)=> setEditEmail(val.target.value)}/>
                            </div>
                        </div>
                        <div style={{marginTop: '5vh', display:'flex', flexDirection:'row'}}>
                            <Button onClick={()=> setAcceptPage(0)} variant='outlined' style={{borderColor:'black', outline:'none', textTransform:'none', height:'5vh'}}>
                               <p style={{marginBottom:0, fontWeight:'500', fontSize:'0.9rem', fontFamily: OPENSANS, color:'black'}}>Back</p>
                           </Button>
                            <Button onClick={updateNameEmail} variant='contained' style={{backgroundColor:'black', outline:'none', textTransform:'none', height:'5vh', marginLeft:'1vw'}}>
                                <p style={{marginBottom:0, fontWeight:'500', fontSize:'0.9rem', fontFamily: OPENSANS, color:'white'}}>Confirm</p>       
                            </Button>
                        </div>
                    </>
                    }
                </div>
            </Fade>
        </Modal>
        <Modal
        aria-labelledby="request-accept-modal"
        aria-describedby="accept-subtenant-request"
        open={prepareContractModalVis}
        closeAfterTransition
        slotProps={{
        backdrop: {
            timeout: 500,
        },
        }}
        >
            <Fade in={prepareContractModalVis}>
                <div 
                    style={{
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -30%)',
                    height:'auto',
                    backgroundColor:'white',
                    padding: mobile ? '4vw' : '2vw',
                    borderRadius: MEDIUMROUNDED,
                    display:'flex',
                    flexDirection:'column',
                    width: mobile ? '90vw' : '40vw',
                    
                    }}>{contractSent ?
                        <>
                            <p style={{fontSize:'1.2rem', fontFamily: OPENSANS, color: 'black', fontWeight:'600', marginBottom:5}}>Contract successfully sent!</p>
                            <p style={{fontSize:'0.9rem', fontFamily: OPENSANS, color: MEDIUMGREY, marginBottom:0}}>Please check your email at {editEmail}</p>
                            <Lottie animationData={RequestSentAnim} style={{width: mobile ? '50vw' :'20vw', marginTop:'4vh', marginLeft:'auto', marginRight:'auto'}}/>
                            <Button onClick={()=>navigate(`/requestDetails/${subleaseData._id}`, { state : {requestDetails: props.data} })} fullWidth variant='contained' style={{backgroundColor:'black', outline:'none', textTransform:'none', height:'5vh', }}>
                                <p style={{marginBottom:0, fontWeight:'500', fontSize:'0.9rem', fontFamily: OPENSANS, color:'white'}}>View progress</p>       
                            </Button>
                        </>
                        :
                        <>
                            <p style={{fontSize:'1.2rem', fontFamily: OPENSANS, color: 'black', fontWeight:'600', marginBottom:5}}>Preparing your sublease contract...</p>
                            <p style={{fontSize:'0.9rem', fontFamily: OPENSANS, color: MEDIUMGREY, marginBottom:0}}>Please do not close this window, this might take 30 seconds.</p>
                            <Lottie animationData={PreparingContractAnim} style={{width: mobile ? '50vw' : '35vw', marginTop:'6vh'}}/>
                        </>
                        }
                </div>
            </Fade>
        </Modal>
          
        </div>
        }
        </>
    )
}