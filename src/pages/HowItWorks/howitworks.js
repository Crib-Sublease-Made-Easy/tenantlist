import { Button, FormControl, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { EXTRALIGHT, LIGHTGREY, MEDIUMROUNDED, OPENSANS, PRIMARYCOLOR } from "../../sharedUtils";
import Lottie from "lottie-react";
import PreparingContractAnim from '../Requests/preparingContract.json'
import NYDayImage from '../../NYCDay.jpeg'
import { useContext } from "react";
import { UserContext } from "../../UserContext";

//FAQ Accordian 
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import WelcomeImage from '../../WelcomePage/WelcomeImage.jpg'
import WelcomeImage3 from '../../WelcomePage/WelcomeImage3.jpg'


export default function HowItWorksScreen(){
    const {mobile} = useContext(UserContext)
    return(
        <div style={{width:'100%', paddingLeft:"5vw", paddingRight:'5vw', display:'flex', flexDirection:'column', alignItems:'center' }}>
            <div style={{marginTop:"10vh"}}>
                <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: mobile ? '1.5rem' : '2.4rem', textAlign:'center', color: 'black' }}>Finding the perfect sublease<br/> is just 3 steps away</p>
            </div>
            <div style={{width: '80vw', paddingTop: mobile ? '5vh' : '10vh', paddingBottom:'10vh', flexDirection: mobile ? 'column' : 'row', display:'flex', alignItems:'center',  marginTop:'5vh'}}>
                <div style={{width: mobile ?'100%' : '40vw',  display:'flex', flexDirection:'column', paddingRight:'5%', }}>
                    <div style={{width: mobile ? '100%' : '35vw'}}>
                        <p style={{fontFamily: OPENSANS, fontWeight:'700',fontSize: mobile ? '1.4rem' : '1.5rem',}}>1. Browse subleases</p>
                        <p style={{fontFamily: OPENSANS, fontWeight:'400',fontSize: mobile ? '1rem' : '1.1rem', marginBottom:0, color:'#737373', }}>Simply browse through our listings and find the perfect space for your needs. Once you've found the ideal sublet, you can request a booking with just a few clicks.</p>
                    </div>
                </div>
                <div style={{width: mobile ?'100%' : '40vw',  position:'relative', display:'flex', flexDirection:'column', alignItems:'center', flex:1  }}>
                    {/* <div style={{width: mobile ? '100%' : '35vw', marginTop: mobile ? '5vh' : 0, height:'auto', borderRadius: MEDIUMROUNDED, borderColor: EXTRALIGHT,  borderWidth:'1px', borderStyle:'solid', padding: mobile ? '4vw' : '2vw', boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)'}}>
                        <p style={{fontFamily: OPENSANS, fontWeight:'600',fontSize:'1.2rem', marginBottom:0, color:'black', width:'85%' }}>Request a sublease</p>
                        <div style={{flexDirection:'row', display:'flex', marginTop:'2vh'}}>
                            <TextField label="Move in" />
                            <TextField label="Move out" style={{marginLeft:'1vw'}}/>
                        </div>
                        <div style={{marginTop:'2vh'}}>
                            <TextField label="Number of occupants" fullWidth/>
                        </div>
                        <div style={{marginTop:'2vh'}}>
                            <TextField label="Message to tenant" fullWidth rows={3} multiline/>
                        </div>
                        <div style={{marginTop:'4vh'}}>
                            <Button  fullWidth variant="contained"  style={{backgroundColor: 'black', textTransform:'none', height: mobile ? '6vh' : '5vh', outline:'none'}}>Send request</Button>
                        </div>
                    </div> */}
                    <p>fwefw</p>
                </div>
            </div>
            <div style={{width:'80vw', paddingTop:'10vh', paddingBottom:'10vh', flexDirection: mobile ? 'column' : 'row', display:'flex', alignItems:'center'}}>
                
                <div style={{width: mobile ?'100%' : '40vw',  position:'relative', display:'flex', flexDirection:'column', alignItems:'center',  }}>
                    {/* <div style={{width: mobile ? '100%' : '35vw', height:'auto', marginTop: mobile ? '5vh' : 0, borderRadius: MEDIUMROUNDED, borderColor: EXTRALIGHT,  borderWidth:'1px', borderStyle:'solid', padding: mobile ? '4vw' : '2vw', boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)'}}>
                        <p style={{fontFamily: OPENSANS, fontWeight:'600',fontSize:'1.2rem', marginBottom:0, color:'black', width:'85%' }}>Tim submitted a request to sublease your place</p>
                        <div style={{marginTop:'4vh'}}>
                            <Button  fullWidth variant="outlined"  style={{borderColor: 'black', borderWidth: '1px',  textTransform:'none', height: mobile ? '6vh' : '5vh', outline:'none', color:'black'}}>Reject</Button>
                            <Button  fullWidth variant="contained"  style={{backgroundColor: 'black', textTransform:'none', height: mobile ? '6vh' : '5vh', outline:'none', marginTop:'2vh'}}>Accept</Button>
                        </div>
                    </div> */}
                    <p>dewdwedewdew</p>
                </div>
                <div style={{width: mobile ?'100%' : '40vw',  position:'relative', display:'flex', flexDirection:'column', alignItems:'flex-end', paddingLeft:"5%",   }}>
                   
                    <p style={{fontFamily: OPENSANS, fontWeight:'700',fontSize: mobile ? '1.4rem' : '1.5rem',width:"100%", textAlign:'left'}}>2. Request to book</p>
                    <p style={{fontFamily: OPENSANS, fontWeight:'400',fontSize: mobile ? '1rem' : '1.1rem', marginBottom:0, color:'#737373', }}>After submitting your request, the tenant will review your application. Our streamlined process ensures quick responses, allowing you to secure your desired sublease as soon as possible. Once the tenant approves your booking, you're one step closer to moving into your new home.</p>
                    
                </div>
            </div> 
            <div style={{width: '80vw', paddingTop: mobile ? '5vh' : '10vh', paddingBottom:'15vh', flexDirection: mobile ? 'column' : 'row', display:'flex', alignItems:'center',  marginTop:'5vh'}}>
                <div style={{width: mobile ?'100%' : '40vw',  display:'flex', flexDirection:'column', paddingRight:'5%', }}>
                    <div style={{width: mobile ? '100%' : '35vw'}}>
                        <p style={{fontFamily: OPENSANS, fontWeight:'700',fontSize: mobile ? '1.4rem' : '1.5rem',}}>3. Seamless move-in</p>
                        <p style={{fontFamily: OPENSANS, fontWeight:'400',fontSize: mobile ? '1rem' : '1.1rem', marginBottom:0, color:'#737373', }}>Simply browse through our listings and find the perfect space for your needs. Once you've found the ideal sublet, you can request a booking with just a few clicks.</p>
                    </div>
                </div>
                <div style={{width: mobile ?'100%' : '40vw',  position:'relative', display:'flex', flexDirection:'column', alignItems:'center', flex:1  }}>
                    {/* <div style={{width: mobile ? '100%' : '35vw', marginTop: mobile ? '5vh' : 0, height:'auto', borderRadius: MEDIUMROUNDED, borderColor: EXTRALIGHT,  borderWidth:'1px', borderStyle:'solid', padding: mobile ? '4vw' : '2vw', boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)'}}>
                        <p style={{fontFamily: OPENSANS, fontWeight:'600',fontSize:'1.2rem', marginBottom:0, color:'black', width:'85%' }}>Request a sublease</p>
                        <div style={{flexDirection:'row', display:'flex', marginTop:'2vh'}}>
                            <TextField label="Move in" />
                            <TextField label="Move out" style={{marginLeft:'1vw'}}/>
                        </div>
                        <div style={{marginTop:'2vh'}}>
                            <TextField label="Number of occupants" fullWidth/>
                        </div>
                        <div style={{marginTop:'2vh'}}>
                            <TextField label="Message to tenant" fullWidth rows={3} multiline/>
                        </div>
                        <div style={{marginTop:'4vh'}}>
                            <Button  fullWidth variant="contained"  style={{backgroundColor: 'black', textTransform:'none', height: mobile ? '6vh' : '5vh', outline:'none'}}>Send request</Button>
                        </div>
                    </div> */}
                    <p>fwefw</p>
                </div>
            </div>
            <div style={{ height: '45vh', width:'100vw', flexDirection: 'row', display:'flex',backgroundColor: 'white', alignItems:'center',  backgroundColor: 'rgba(45,102,116,0.06)', borderRadius: MEDIUMROUNDED, marginTop:'5vh', marginBottom: '5vh'}}>
            
                <img src={WelcomeImage} style={{width: '25%', height: '100%',objectFit:'cover'}}/>
                <img src={WelcomeImage3} style={{width: '25%', height: '100%',objectFit:'cover', marginLeft:'0.5vw'}}/>
                <div style={{flexDirection:'column', display:'flex', paddingLeft:'5%', paddingRight:'5%'}}>
                    <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: mobile ? '1.5rem' : '1.8rem', }}>Half your day is spent in the sublease</p>
                    <p style={{fontFamily: OPENSANS, fontWeight:'400', width: mobile ? '100%' : '100%', color:'black', textAlign: 'left', fontSize:'1rem'}}>A bad sublease can ruin your mood no matter if you're interning, traveling or working. That's why Crib is here to make your subleasing experience easier, cheaper and safety than ever!</p>
                    <div>
                        <p style={{ fontFamily: OPENSANS, fontWeight:'700',fontSize: mobile ? '1.1rem' : '1.1rem',  borderBottomWidth:'2px', borderBottomStyle:'solid', borderBottomColor: PRIMARYCOLOR, paddingBottom:'0.5vh', color: PRIMARYCOLOR, cursor:'pointer', marginTop:'4vh', marginBottom:0,}}>Start Searching</p>
                    </div>
                </div>
                
            </div>
            <div style={{ height: 'auto', width:'100%', flexDirection: 'column', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', paddingTop: mobile ? '5vh' : '10vh', paddingBottom: mobile ? '5vh' : '10vh', justifyContent:'space-between', alignItems:'center', }}>
            {/* <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: mobile ? '1.5rem' : '2.1rem', textAlign:'left', }}>Your questions, <br/>answered</p> */}
            <div style={{width: '100%', height:'auto', marginLeft:'auto', marginRight:'auto', textAlign:'center', marginTop: mobile ? '10vh' : "5vh", flexDirection: mobile ? 'column' : 'row', display:'flex', justifyContent:'space-between', paddingBottom:'5vh' }}>
                <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: mobile ? '1.5rem' : '2.1rem', textAlign:'left',}}>Your questions, <br/>answered.</p>
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
            </div>
        </div>
        </div>

        
        // <div style={{height:'90vh', width:'100%', display:'flex', flexDirection:'column', paddingTop:'30vh', alignItems:'center'}}>
        //     <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: mobile ? '1.6rem' : '2.8rem', textAlign:'center', color: 'black' }}>Crib will be back soon!</p>
        //     <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize: mobile ? '1.6rem' : '1.1rem', textAlign:'center', color: 'black', width:'50%' }}>We are currently maintaining our website to enhance your user experience.</p>
        //     <div>
        //     <FormControl style={{width:"30vw", marginTop:"5vh"}} variant="outlined">
        //         <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
        //         <OutlinedInput
        //             endAdornment={
        //             <InputAdornment position="end">
        //                 <Button variant="contained" style={{background: PRIMARYCOLOR, textTransform:'none', outline:'none'}}>
        //                     Submit
        //                 </Button>
        //             </InputAdornment>
        //             }
        //             label="Email"
        //         />
        //     </FormControl>
        //     </div>
        // </div>
    )
}