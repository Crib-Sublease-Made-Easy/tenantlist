import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { useContext, useEffect, useState } from 'react';
import { LIGHTGREY, MEDIUMGREY, MEDIUMROUNDED, OPENSANS, PRIMARYCOLOR } from '../../sharedUtils';

//Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import WatchLaterIcon from '@mui/icons-material/WatchLater';


import { Button, Paper } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../UserContext';

const steps = [
    {
      label: 'Tenant accepted your request',
      description: `Tenant has accepted your request to sublease and has 24 hours to sign sublease contract for request to proceed. Once tenant signs the sublease contract, we will email notify you immediately.`,
    },
    {
      label: 'Contract & security deposit',
      description:
        'You have 24 hours to sign sublease contract and pay security despoit. Security deposit will only be transferred to tenant after successful move-in.',
    },
    {
      label: 'Move-in procedure',
      description: `Tenant and subtenant will agree upon a payment procedure for monthly rent payment methods and move-in procedure.`,
    },
    {
        label: 'Confirmation on move-in day',
        description: `Please confirm on move-in day upon arrival to sublease`,
    },
];

export default function SubtenantRequestDetailsScreen(props){
    const {id} = useParams()
    const {mobile} = useContext(UserContext)
    const navigate = useNavigate()
    const [activeStep, setActiveStep] = useState(1)
   
   
    const [subleaseStatus, setSubleaseStatus] = useState(null)
    const [propData, setPropData] = useState(null)
    const [tenantData, setTenantData] = useState(null)
    const [paymentLink, setPaymentLink] = useState("")
    const [paymentAmount, setPaymentAmount] = useState(null)


    useEffect(()=> {
        getStatus()
    }, [])

    async function getStatus(){
        let at = localStorage.getItem("accessToken")
        await fetch(`https://crib-llc.herokuapp.com/requests/getOne/${String(id)}`, {
            method: 'GET',
            headers: {
            'Authorization': "Bearer " + at
            }
        })
        .then(async (res)=>{
            if(res.status == 200){
               let data = await res.json()
                setSubleaseStatus(data[0])
                setPropData(data[0].propInfo[0])
                setTenantData(data[0].tenantInfo[0])
                if(!data[0].tenantSignedContract){
                    setActiveStep(0)
                }
                else if(data[0].paid && data[0].tenantSignedContract && data[0].subtenantSignedContract){
                    setActiveStep(2)
                }
                if(data[0].tenantSignedContract){
                    await fetch(`https://crib-llc.herokuapp.com/requests/payment_link/${id}`, {
                        method: 'GET',
                        headers: {
                        'Authorization': "Bearer " + at
                        }
                    })
                    .then ( async res => {
                        if(res.status == 200){
                            let data = await res.json()
                            setPaymentLink(data.link)
                        }
                    })
                    .catch( e => {
                        console.log("error")
                    })
                }

                await fetch(`https://crib-llc.herokuapp.com/requests/payment_amount/${id}`, {
                    method: 'GET',
                    headers: {
                    'Authorization': "Bearer " + at
                    }
                })
                .then ( async res => {
                    if(res.status == 200){
                        let data = await res.json()
                        setPaymentAmount(data.amount)
                        
                    }
                })
                .catch( e => {
                    console.log("error")
                })

            }
        })
        .catch( e => {
            console.log("error")
        })
       
    }

    function getHourToExpire(){
        let expireTime = new Date(subleaseStatus.createdAt).getTime() + (1000*60*60*24)
        let curTime = new Date().getTime()

        let hoursUntilExpire = (expireTime - curTime) / (1000*60*60)

        return hoursUntilExpire.toFixed(0)
    }

    function getFees(){
        let duration = ((new Date(subleaseStatus.endDate).getTime()) - (new Date(subleaseStatus.startDate).getTime())) / (1000*60*60*24*31)
        let total = duration * propData.price;
        
        return (total*0.05).toFixed(2) 
    }

    function getReminder(){
        if(activeStep == 0){
            return "Please check back soon!"
        }
        if(activeStep == 1 && subleaseStatus.tenantSignedContract){
            return "Please sign sublease contract and finalize payments!"
        }
        if(activeStep == 2 && !subleaseStatus.tenantSignedContract){
            return "You're all set!"
        }
        if(activeStep >= 2){
            return "You're all set!"
        }
        
        return null
        
    }

    function handlePaymentLinkClick(){
        window.open(paymentLink, '_blank')
    }

    async function endProcessForSubtenant(){
       
           
        let at = localStorage.getItem("accessToken")
        await fetch(`https://crib-llc.herokuapp.com/requests/${subleaseStatus._id}`, {
            method: 'DELETE',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + at
            },
        })
        .then( res => {
            if(res.status == 200){
                navigate("/myRequests")
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

    return(
        <div style={{width:'90vw', height: mobile ? 'auto' : '90vh', marginLeft:'auto', marginRight:'auto', flexDirection: mobile ? 'column' : 'row', display:'flex'}}>
        {subleaseStatus != null && tenantData != null && propData != null && 
        <>
            <div style={{width: mobile ? '90vw' : '30vw', borderRightWidth: mobile ? 0 : '0.5px', borderRightColor: LIGHTGREY, borderRightStyle:'solid', height:'100%'}}>
                <div style={{height:'10vh', width:'100%', display:'flex', alignItems:'center'}}>
                    <ArrowBackIcon onClick={()=>navigate("/myRequests")} style={{fontSize: mobile ? '1.2rem' : '1.5vw', cursor:'pointer'}}/>
                </div>
                {subleaseStatus != null &&
                <div style={{width: mobile ? '90vw' : '25vw', height: mobile ? '8vh' : '10vh', backgroundColor:'white', boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)', borderRadius: MEDIUMROUNDED, display:'flex', alignItems:'center', padding: mobile ? '2.5vw' : '1.5vw', flexDirection:"row"}} >
                 
                    {activeStep == 0 ? 
                    <CheckCircleIcon style={{fontSize:'1.5rem', color:'green'}}/>
                    :
                    activeStep == 1 && subleaseStatus.tenantSignedContract ?
                    <CancelIcon style={{fontSize:'1.5rem', color:'red'}}/>
                    :
                    activeStep == 2 && !subleaseStatus.tenantSignedContract ?
                    <CheckCircleIcon style={{fontSize:'1.5rem', color:'green'}}/>
                    :
                    <CheckCircleIcon style={{fontSize:'1.5rem', color:'green'}}/>
                    }
                  
                    <p style={{marginBottom:0, fontSize:'0.9rem', marginLeft: mobile ? '2vw' : '1vw', fontWeight:'600', fontFamily: OPENSANS, }}>{getReminder()}</p>
                                        
                </div>
                }
                <Stepper 
                sx={{
                    marginTop: mobile ? '3vh' : '5vh',
                    '& .MuiStepLabel-root .Mui-completed': {
                      color: 'black', // circle color (COMPLETED)
                    },
                    '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                      {
                        color: 'grey.500', // Just text label (COMPLETED)
                      },
                    '& .MuiStepLabel-root .Mui-active': {
                      color: 'black', // circle color (ACTIVE)
                    },
                    '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                      {
                        color: 'common.white', // Just text label (ACTIVE)
                      },
                    '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                      fill: 'white', // circle's number (ACTIVE)
                    },
                  }}
                  
                
                
                activeStep={activeStep} orientation="vertical" >
                    {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel style={{ fontWeight:'500', fontFamily: OPENSANS}}>
                     
                        <Typography style={{marginBottom:0, fontWeight:'600', fontFamily: OPENSANS}} >{step.label}</Typography>
                        </StepLabel>
                        <StepContent>
                        <Typography style={{marginBottom:0, fontSize:'0.9rem', fontFamily: OPENSANS, width: mobile ? '100%' : '25vw'}}>{step.description}</Typography>
                        <Box sx={{mb: mobile ? 0 : 6}}/>
                        </StepContent>
                    </Step>
                    ))}
                </Stepper>
                <Button onClick={()=>navigate(`/detailsMessage/${subleaseStatus._id}`)} style={{backgroundColor: 'black', outline: 'none', color:'white', height: mobile ? '6vh' : '5vh', textTransform:'none', width: mobile ? '100%' : "80%", marginTop:'5vh'}}>
                    <p style={{marginBottom:0}}>Message</p>
                </Button>
            </div>
            <div style={{width: mobile ? '90vw' : '60vw', height:"90vh", display:'flex', flexDirection:'column', justifyContent:'space-between', paddingTop: mobile && '5vh', marginTop: mobile && '5vh',  borderTopWidth: mobile ? '1px' :0, borderTopColor: LIGHTGREY, borderTopStyle:"solid" }}>
                {activeStep == 1 ?
                <div style={{height: mobile ? 'auto' : '15vh', width:'100%', display:'flex', flexDirection: mobile ? 'column-reverse' : 'row', justifyContent:'space-between', alignItems: mobile ? 'flex-start' : 'center',paddingLeft: mobile ? 0 : "2vw",}}>
                    {!subleaseStatus.subtenantSignedContract ?

                    <div style ={{flexDirection:'row', display:'flex', marginTop: mobile ? '2vh' : 0, alignItems:'center' }}>
                        <PlaylistAddCheckCircleIcon style={{fontSize:'1.5rem', color:'gold'}}/>
                        {
                        <p style={{marginBottom:0, fontSize:'1rem', fontWeight:'500',marginLeft: mobile ? '2vw' : '1vw', width: mobile ? 'auto' : '40vw', }}>Please sign contract to proceed</p>
                        }
                    </div>  
                    :
                    !subleaseStatus.paid ?
                    <div style ={{flexDirection:'row', display:'flex', marginTop: mobile ? '2vh' : 0, alignItems:'center' }}>
                        <PlaylistAddCheckCircleIcon style={{fontSize:'1.5rem', color:'gold'}}/>
                        {
                        <p style={{marginBottom:0, fontSize:'1rem', fontWeight:'500',marginLeft: mobile ? '2vw' : '1vw', width: mobile ? 'auto' : '40vw', }}>Please pay security deposit</p>
                        }
                    </div>  
                    :
                    <div style ={{flexDirection:'row', display:'flex', marginTop: mobile ? '2vh' : 0, alignItems:'center' }}>
                        <PlaylistAddCheckCircleIcon style={{fontSize:'1.5rem', color:'green'}}/>
                        {
                        <p style={{marginBottom:0, fontSize:'1rem', fontWeight:'500',marginLeft: mobile ? '2vw' : '1vw', width: mobile ? 'auto' : '40vw', }}>You're all set!</p>
                        }
                    </div>  
                    }
                    <p style={{marginBottom:0, fontSize:'1rem', fontWeight:'400',}}>Expires in {getHourToExpire()} hours</p>
                </div>
                :
                activeStep == 0 ?
                <div style={{height: '15vh', width:'100%', display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center',paddingLeft: mobile ? 0 : "2vw",}}>
                   <div style ={{flexDirection:'row', display:'flex'}}>
                        <WatchLaterIcon style={{fontSize:'1.5rem', color: 'gold'}}/>
                        <p style={{marginBottom:0, fontSize:'1rem', fontWeight:'500',marginLeft:'1vw', width:'40vw'}}>Waiting for tenant to sign sublease contract</p>
                    </div> 
                </div>
                :
                <div style={{height: '15vh', width:'100%', display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center',paddingLeft: mobile ? 0 : "2vw",}}>
                   <div style ={{flexDirection:'row', display:'flex'}}>
                        <CheckCircleIcon style={{fontSize:'1.5rem', color:'gold'}}/>
                        <p style={{marginBottom:0, fontSize:'1rem', fontWeight:'500',marginLeft:'1vw', width: mobile ? '100%' : '40vw'}}>Please confirm move-in procedure and monthly rent payment method</p>
                    </div> 
                </div>
                }
                <div style={{height:'75vh', width: mobile ? '90vw' : '100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                    { activeStep == 1 ?
                    <div>
                        <div style={{display:'flex', flexDirection: mobile ? 'column' : 'row', justifyContent:'space-between', alignItems: mobile ? 'flex-start' : 'center', paddingLeft: mobile ? 0 : "2vw", paddingTop: mobile ? '5vw' : 0, paddingBottom: mobile ? '10vw' : 0 ,borderBottomWidth: mobile ? '1px' : 0, borderBottomColor: LIGHTGREY, borderBottomStyle: 'solid'}}>
                            <p style={{marginBottom:0, fontSize:'1.4rem', fontWeight:'600'}}>Sublease contract and payments</p>
                            <Button variant="contained" style={{backgroundColor: 'black', textTransform:'none', height:'5vh', outline:'none', marginTop: mobile ? '2vh' : 0}}>
                                <a href="tel:+16085158038" style={{marginBottom:0, fontWeight:'500', color:'white' }}>Contact us</a>
                            </Button>
                        </div>
                        <div style={{flexDirection: mobile ? 'column' : 'row', display:'flex', marginTop: '5vh',  height: mobile ? 'auto' : '30vh', }}>
                            <div style={{flex:1, display:'flex', flexDirection:'column', paddingLeft: mobile ? 0 : "2vw", paddingRight: mobile ? 0 :'2vw', borderRightStyle:'solid', borderRightWidth: mobile ? 0 : '0.5px', borderRightColor: LIGHTGREY, height:'100%', justifyContent:'space-between', paddingBottom: mobile ? '5vh' : 0, borderBottomColor: LIGHTGREY, borderBottomStyle:'solid', borderBottomWidth: mobile ? '1px' : 0  }}>
                                <div>
                                    <p style={{marginBottom:0, fontSize: mobile ? '1.4rem' : '1.2rem', fontWeight:'500'}}>Sublease contract</p>
                                    <p style={{marginBottom:0, fontSize:'0.9rem', fontWeight:'400', color:'#737373'}}>Sublease contract provided by DocuSign</p>
                                </div>
                                <Button fullWidth variant={subleaseStatus.subtenantSignedContract ? "contained" : "text"} style={{backgroundColor:subleaseStatus.subtenantSignedContract ? 'green' : 'none',  borderColor: 'black', textTransform:'none',height: mobile ? '6vh': '5vh', outline:'none', marginTop:'5vh', color:'black',}}>
                                    <p style={{marginBottom:0, fontWeight:'500', color: subleaseStatus.subtenantSignedContract ? 'white' : 'black' }}>{subleaseStatus.subtenantSignedContract ? "Contract signed" : "Contract was sent to your email"}</p>
                                </Button>
                            </div>
                            {paymentAmount != null &&
                            <div style={{flex:1, display:'flex', flexDirection:'column',  paddingLeft: mobile ? 0 : "2vw", height: '100%', justifyContent:'space-between', paddingTop: mobile ? '5vh' : 0, paddingBottom: mobile ? '5vh' : 0, borderBottomWidth: mobile ? '1px' : 0, borderBottomColor: LIGHTGREY, borderBottomStyle: 'solid', }}>
                                <div>
                                    <p style={{marginBottom:0, fontSize: mobile ? '1.4rem' : '1.2rem', fontWeight:'500'}}>Security deposit + fees</p>
                                    <p style={{marginBottom:0, fontSize:'0.9rem', fontWeight:'400', color:'#737373'}}>Payment method provided by Square</p>
                                </div>
                                <div style={{marginTop: mobile ? '4vh' : 0}}>                            
                                    <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                        <p style={{marginBottom: mobile ? 5 :0, fontSize:'0.9rem', fontWeight:'500', color:'black'}}>Security deposit:</p>
                                        <p style={{marginBottom: mobile ? 5 : 0, fontSize:'0.9rem', fontWeight:'500', color:'#737373'}}>${paymentAmount.securityDeposit}</p>
                                    </div>
                                    <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                        <p style={{marginBottom:mobile ? 5 : 0, fontSize:'0.9rem', fontWeight:'500', color:'black'}}>Fees <span style={{fontWeight:'400'}}>(5% of total rent)</span></p>
                                        <p style={{marginBottom:mobile ? 5 : 0, fontSize:'0.9rem', fontWeight:'500', color:'#737373'}}>${paymentAmount.fee}</p>
                                    </div>                                
                                </div>
                                <div style={{marginTop: mobile ? '4vh' : 0}}>          
                                    <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                        <p style={{marginBottom:0, fontSize:'1.1rem', fontWeight:'500', color:'black'}}>Total due:</p>
                                        <p style={{marginBottom:0, fontSize:'1.1rem', fontWeight:'500', color:'black'}}>${paymentAmount.total}</p>
                                    </div>                           
                                
                                    <Button onClick={handlePaymentLinkClick} fullWidth variant="contained" style={{backgroundColor: subleaseStatus.paid ? 'green' : 'black', textTransform:'none', height: mobile ? '6vh': '5vh', outline:'none', marginTop:'2vh'}}>
                                        <p style={{marginBottom:0, fontWeight:'500' }}>{subleaseStatus.paid ? "Security deposit and fees paid"  : "Pay security deposit and fees"}</p>
                                    </Button>
                                    <small>Security deposit will be transferred to tenant only after successful move in.</small>
                                </div>
                            </div>
                            }
                        </div>
                       
                    </div>
                    :
                    activeStep == 0 ?
                    <div>
                    </div>
                    :
                    <div style={{paddingBottom: mobile ? '10vh' : 0, marginLeft: mobile ? 0 : '2vw'}}>
                        <p style={{marginBottom:0, fontSize: mobile ? '1.8rem' : '1.5rem', fontWeight:'500', paddingTop:"2vh", paddingBottom:'2vh'}}>Confirm move-in procedure</p>
                        <p style={{marginBottom:0, fontSize: mobile ? '1.2rem' : '1.1rem', fontWeight:'400'}}>Please contact {tenantData.firstName} for move-in details and further procedures</p>

                        <div style={{marginTop:'2vh'}}>
                            <p style={{marginBottom:0, fontSize: mobile ? '1.2rem' : '1.1rem', fontWeight:'500'}}>{tenantData.firstName}'s contact information:</p>
                            <p style={{marginBottom:0, fontSize: mobile ? '1rem' : '1rem', fontWeight:'400', marginTop:'2vh', fontFamily: OPENSANS}}><span style={{fontWeight:'600'}}>Phone number:</span> +{tenantData.countryCode == undefined ? "1" : tenantData.countryCode}{tenantData.phoneNumber}</p>
                            <p style={{marginBottom:0, fontSize: mobile ? '1rem' : '1rem', fontWeight:'400',  fontFamily: OPENSANS}}><span style={{fontWeight:'600'}}>Email:</span> {tenantData.email}</p>
                        </div>
                    </div>
                    }
                    {activeStep == 1 &&
                    <div style={{height: '20vh', width:'100%',  alignItems:'center', display:'flex', flexDirection:'row', justifyContent:'space-between', paddingTop: mobile ? '5vh' : 0, paddingBottom: mobile ? '5vh' : 0}}>
                        <p style={{marginBottom:0, fontSize: mobile ? '1rem' : '1.2rem', fontWeight:'500', paddingLeft:'2vw'}}>No longer want to sublease?</p>
                        <p onClick={endProcessForSubtenant} style={{marginBottom:0, fontWeight:'500', textDecorationLine:'underline', cursor:'pointer' }}>End process</p>
                    </div>
                    }
                </div>    
            </div>
        </>
        }
        </div>
    )
}