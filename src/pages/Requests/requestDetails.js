import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { useContext, useEffect, useState } from 'react';
import { EXTRALIGHT, LIGHTGREY, MEDIUMROUNDED, OPENSANS, PRIMARYCOLOR } from '../../sharedUtils';

//Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WatchLaterIcon from '@mui/icons-material/WatchLater';


import { Button, Paper } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../UserContext';

const steps = [
    {
      label: 'Accepted sublease request',
      description: `For each ad campaign that you create, you can control how much
                you're willing to spend on clicks and conversions, which networks
                and geographical locations you want your ads to show on, and more.`,
    },
    {
      label: 'Contract and payments',
      description:
        'Tenant and subtenant has 24 hours to review and sign sublease contract. Also, subtenant will pay Crib a security deposit which would be transferred to tenant upon move-in day.',
    },
    {
      label: 'Move-in procedure',
      description: `Tenant and subtenant will discuss monthly rent payment methods and move-in procedure.`,
    },
    {
        label: 'Move-in confirmation',
        description: `Please confirm on move-in day upon arrival to sublease`,
    },
];

export default function RequestDetailsScreen(props){
    const { id } = useParams()
    const navigate = useNavigate()
    const {mobile} = useContext(UserContext)
    const [activeStep, setActiveStep] = useState(1)
    const [subleaseStatus, setSubleaseStatus] = useState(null)
    const [propData, setPropData] = useState(null)
    const [subtenantData, setSubtenantData] = useState(null)
    const [tenantData, setTenantData] = useState(null)



    useEffect(()=> {
        getStatus()
    }, [])

    async function getStatus(){
        
        let at = localStorage.getItem("accessToken")
        if(at == null){
            alert("Please login or sign up.")
            navigate("/login")
        }

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
                setSubtenantData(data[0].subtenantInfo[0])
               if(data[0].paid && data[0].tenantSignedContract && data[0].subtenantSignedContract){
                setActiveStep(2)
               }
            }
        })
        .catch( e => {
            console.log("error")
        })
               
    }

    async function endProcessForTenant(){
       
           
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
        <>
        {propData != null && subleaseStatus != null && subtenantData != null && tenantData != null &&
        // <div style={{width:'100vw', height:'90vh', paddingLeft:'5vw', paddingRight:'5vw', flexDirection: 'column', display:'flex'}}>
        //     <div style={{marginTop:'5vh', width:'100%', display:'flex', alignItems:'center',}}>
        //         <ArrowBackIcon onClick={()=>navigate("/myRequests")} style={{fontSize:'5vw', cursor:'pointer'}}/>
        //     </div>
        //     <div style={{height: 'auto', width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', paddingTop:'2vh', paddingBottom:'5vh'}}>
        //         <div style={{backgroundColor: EXTRALIGHT, display: activeStep == 1 ? 'display' : 'none' }}>
        //         { !requestDetails.tenantSignedContract ?
        //                 <div style ={{flexDirection:'row', display:'flex'}}>
        //                 <CheckCircleIcon style={{fontSize:'1.5rem'}}/>
        //                 <p style={{marginBottom:0, fontSize:'1rem', fontWeight:'500',marginLeft:'1vw', width:'40vw'}}>{subtenantData.firstName} will be prompted to sign sublease contract and pay secuirty deposit within 24 hours once after you signed the contract.</p>
        //             </div>
        //             :
        //             requestDetails.paid ?
                    
        //             <div style ={{flexDirection:'row', display:'flex'}}>
        //                 <CheckCircleIcon style={{fontSize:'1.2rem'}}/>
        //                 <p style={{marginBottom:0, fontSize:'0.9rem', fontWeight:'500',marginLeft:'1vw'}}>{subtenantData.firstName} paid security deposit</p>
        //             </div>
        //             :
        //             <div style ={{flexDirection:'row', display:'flex'}}>
        //                 <CancelIcon style={{fontSize:'1.2rem'}}/>
        //                 <p style={{marginBottom:0, fontSize:'0.9rem', fontWeight:'500',marginLeft:'1vw'}}>Waiting for {subtenantData.firstName} to pay security deposit</p>
        //             </div>
        //         }
        //         <div style={{marginTop:'1vh'}}>
        //         { 
        //             requestDetails.subtenantSignedContract?
        //             <div style ={{flexDirection:'row', display:'flex'}}>
        //                 <CheckCircleIcon style={{fontSize:'1.2rem'}}/>
        //                 <p style={{marginBottom:0, fontSize:'0.9rem', fontWeight:'500',marginLeft:'1vw'}}>{subtenantData.firstName} signed sublease contract</p>
        //             </div>
        //             :
        //             <div style ={{flexDirection:'row', display:'flex'}}>
        //                 <CancelIcon style={{fontSize:'1.2rem'}}/>
        //                 <p style={{marginBottom:0, fontSize:'0.9rem', fontWeight:'500',marginLeft:'1vw'}}>Waiting for {subtenantData.firstName} to sign sublease contract</p>
        //             </div>
        //         }
        //         </div>
        //         </div>
        //     </div>
        //     <div>
        //         <Stepper 
        //         sx={{
        //             width:'100%',
        //             '& .MuiStepLabel-root .Mui-completed': {
        //               color: 'black', // circle color (COMPLETED)
        //             },
        //             '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
        //               {
        //                 color: 'grey.500', // Just text label (COMPLETED)
        //               },
        //             '& .MuiStepLabel-root .Mui-active': {
        //               color: 'black', // circle color (ACTIVE)
        //             },
        //             '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
        //               {
        //                 color: 'common.white', // Just text label (ACTIVE)
        //               },
        //             '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
        //               fill: 'white', // circle's number (ACTIVE)
        //             },
        //           }}
                  
                
                
        //         activeStep={activeStep} orientation={"vertical"} >
        //             {steps.map((step, index) => (
        //             <Step key={step.label}>
        //                 <StepLabel style={{ fontWeight:'500', fontFamily: OPENSANS}}>
                     
        //                 <Typography style={{marginBottom:0, fontWeight:'600', fontFamily: OPENSANS}} >{step.label}</Typography>
        //                 </StepLabel>
        //                 <StepContent>
        //                 <Typography style={{marginBottom:0, fontSize:'0.9rem', fontFamily: OPENSANS, width:'100%'}}>{step.description}</Typography>
        //                 <Box sx={{mb:6}}/>
        //                 </StepContent>
        //             </Step>
        //             ))}
        //         </Stepper>
        //     </div>
        //     {
        //         activeStep == 1 ?
        //         <div>
                    
        //         </div>
        //         :
        //         activeStep == 2 ?
        //         <>
        //         </>
        //         :
        //         <></>
        //     }
        // </div>
        // :
        <div style={{width: '90vw', height:'90vh', marginLeft:'auto', marginRight:'auto', flexDirection: mobile ? 'column' : 'row', display:'flex'}}>
            <div style={{width: mobile ? '90vw' : '30vw', borderRightWidth: mobile ? 0 :  '0.5px', borderRightColor: LIGHTGREY, borderRightStyle:'solid', height:'100%'}}>
                <div style={{height: mobile ? '8vh' : '10vh', width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <ArrowBackIcon onClick={()=>navigate("/myRequests")} style={{fontSize: mobile ? '5vw' : '1.5vw', cursor:'pointer'}}/>
                    <Button variant="contained" style={{backgroundColor: 'black', textTransform:'none', height:'5vh', outline:'none', marginRight: mobile ? 0 : '1vw'}}>
                        <a href="tel:+16085158038" style={{marginBottom:0, fontWeight:'500', color:'white' }}>Contact us</a>
                    </Button>
                </div>
                {/* <div style={{width: mobile ? '90vw' : '25vw', height: mobile ? 'auto' : '10vh', backgroundColor:'white', boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)', borderRadius: MEDIUMROUNDED, display:'flex', alignItems:'center', padding:'1.5vw', flexDirection:"row"}} >
                    
                    <div style={{padding:4, borderWidth:'2px', borderColor:'black', borderStyle:'solid', justifyContent:'center', alignItems:'center', display:'flex', borderRadius:100}}>
                        {requestDetails.tenantSignedContract ? 
                        <CheckCircleIcon style={{fontSize:'1.5rem'}}/>
                        :
                        <CancelIcon style={{fontSize:'1.5rem'}}/>
                        }
                    {requestDetails.tenantSignedContract ? 
                    <p style={{marginBottom:0, fontSize:'0.9rem', marginLeft:'1vw', fontWeight:'600', fontFamily: OPENSANS, }}>You're all set!</p>
                    :
                    <p style={{marginBottom:0, fontSize:'0.9rem', marginLeft:'1vw', fontWeight:'600', fontFamily: OPENSANS, }}>Please sign contract to proceed</p>
                    }
                </div> */}
                <p style={{marginBottom:0, fontSize: mobile ? '1.8rem' : '1.5rem', fontWeight:'500', paddingTop:"2vh", paddingBottom:'2vh'}}>Progress</p>

                <Stepper 
                sx={{
                    marginTop:mobile ? 0 : '5vh',
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
                  
                
                
                activeStep={activeStep} orientation={"vertical"} >
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
            </div>
            <div style={{width: mobile ? '100%' : '60vw', height: mobile ? 'auto' : "90vh", display:'flex', flexDirection:'column', justifyContent: mobile ? 'space-between' : 'flex-start', paddingLeft: mobile ? 0 : "2vw"}}>
            
                    <div style={{ width:'100%', display:'flex', flexDirection:'column', justifyContent:'center',paddingTop:'2vh', paddingBottom:'2vh'}}>
                       
                        {!subleaseStatus.tenantSignedContract ?
                            
                             <div style ={{flexDirection:'row', display:'flex'}}>
                                <PlaylistAddCheckCircleIcon style={{fontSize:'1.5rem', color:'gold'}}/>
                                <p style={{marginBottom:0, fontSize:'1rem', fontWeight:'500',marginLeft:'1vw', width: mobile ? '90vw' : '40vw'}}>Please sign sublease contract to proceed</p>
                            </div>
                            
                            :
                            subleaseStatus.paid ?
                            
                            <div style ={{flexDirection:'row', display:'flex'}}>
                                <PlaylistAddCheckCircleIcon style={{fontSize:'1.5rem', color:'green'}}/>
                                <p style={{marginBottom:0, fontSize:'1rem', fontWeight:'400',marginLeft:'1vw'}}>{subtenantData.firstName} paid security deposit</p>
                            </div>
                            :
                            <div style ={{flexDirection:'row', display:'flex'}}>
                                <WatchLaterIcon style={{fontSize:'1.5rem', color:'red'}}/>
                                <p style={{marginBottom:0, fontSize:'1rem', fontWeight:'500',marginLeft:'1vw'}}>Waiting for {subtenantData.firstName} to pay security deposit</p>
                            </div>
                        }
                        <div style={{marginTop:'1vh'}}>
                        {   !subleaseStatus.tenantSignedContract ?
                            null
                            :
                            subleaseStatus.subtenantSignedContract?
                            <div style ={{flexDirection:'row', display:'flex'}}>
                                <PlaylistAddCheckCircleIcon style={{fontSize:'1.5rem', color:'green'}}/>
                                <p style={{marginBottom:0, fontSize:'1rem', fontWeight:'400',marginLeft:'1vw'}}>{subtenantData.firstName} signed sublease contract</p>
                            </div>
                            :
                            <div style ={{flexDirection:'row', display:'flex'}}>
                                <WatchLaterIcon style={{fontSize:'1.5rem', color:'red'}}/>
                                <p style={{marginBottom:0, fontSize:'1rem', fontWeight:'500',marginLeft:'1vw'}}>Waiting for {subtenantData.firstName} to sign sublease contract</p>
                            </div>
                        }
                        </div>
                        
                        
                    </div>
                    
                   
                    <div style={{height: mobile ? 'auto' : 'auto', width:'100%', borderTopWidth: mobile ? '1px' : 0, borderTopColor: LIGHTGREY, borderTopStyle:'solid', paddingTop: mobile ? '2vh' : 0}}>
                        {activeStep == 1 ?
                            <div style={{marginTop: mobile ? '3vh' : '5vh'}}>
                                <p style={{marginBottom:0, fontSize: mobile ? '1.2rem' : '1.5rem', fontWeight:'600'}}>Sublease contract</p>
                                <p style={{marginBottom:0, fontSize: mobile ? '0.9rem' : '1rem', fontWeight:'400'}}>{subleaseStatus.tenantSignedContract ? "You have signed the sublease contract!" : `Contract has been emailed to ${tenantData.email}` }</p>
                            </div>
                        :
                            <div style={{paddingBottom: mobile ? '10vh' : 0}}>
                                <p style={{marginBottom:0, fontSize: mobile ? '1.8rem' : '1.5rem', fontWeight:'500', paddingTop:"2vh", paddingBottom:'2vh'}}>Confirm move-in procedure</p>
                                <p style={{marginBottom:0, fontSize: mobile ? '1.2rem' : '1.1rem', fontWeight:'400'}}>Please contact {subtenantData.firstName} for move-in details and further procedures.</p>
                                <div style={{marginTop:'2vh'}}>
                                    <p style={{marginBottom:0, fontSize: mobile ? '1.2rem' : '1.1rem', fontWeight:'500'}}>{subtenantData.firstName}'s contact information:</p>
                                    <p style={{marginBottom:0, fontSize: mobile ? '1rem' : '1rem', fontWeight:'400', marginTop:'2vh', fontFamily: OPENSANS}}><span style={{fontWeight:'600'}}>Phone number:</span> +{subtenantData.countryCode == undefined ? "1" : subtenantData.countryCode}{subtenantData.phoneNumber}</p>
                                    <p style={{marginBottom:0, fontSize: mobile ? '1rem' : '1rem', fontWeight:'400',  fontFamily: OPENSANS}}><span style={{fontWeight:'600'}}>Email:</span> {subtenantData.email}</p>
                                </div>
                            </div>
                        }
                    </div>
                    
                    <div style={{height: mobile ? 'auto' : '20vh', width:'100%',  alignItems:'center', display: activeStep >1 ? 'none' : 'flex', flexDirection:'row', justifyContent:'space-between', marginTop:mobile? '5vh' : 0, paddingBottom: mobile ? '5vh' : 0 }}>
                        <p style={{marginBottom:0, fontSize:'1rem', fontWeight:'500'}}>No longer want to sublease?</p>
                        
                        <p onClick={endProcessForTenant} style={{marginBottom:0, fontWeight:'500', textDecorationLine:'underline', cursor:'pointer' }}>End process</p>
                        
                    </div>
                
            </div>
        </div>
        }
        </>
    )
}