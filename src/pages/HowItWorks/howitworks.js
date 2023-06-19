import { Button, TextField } from "@mui/material";
import { EXTRALIGHT, MEDIUMROUNDED, OPENSANS } from "../../sharedUtils";
import Lottie from "lottie-react";
import PreparingContractAnim from '../Requests/preparingContract.json'
import NYDayImage from '../../NYCDay.jpeg'
import { useContext } from "react";
import { UserContext } from "../../UserContext";

export default function HowItWorksScreen(){
    const {mobile} = useContext(UserContext)
    return(
        <div style={{width:'100%', paddingLeft:"5vw", paddingRight:'5vw', display:'flex', flexDirection:'column'}}>
           
            <div style={{width:'100%', paddingTop: mobile ? '5vh' : '10vh', paddingBottom:'10vh', flexDirection: mobile ? 'column' : 'row', display:'flex', alignItems:'center'}}>
                <div style={{width: mobile ?'100%' : '50%', alignItems:'center', display:'flex', flexDirection:'column' }}>
                    <div style={{width: mobile ? '100%' : '35vw'}}>
                        <p style={{fontFamily: OPENSANS, fontWeight:'600',fontSize: mobile ? '1.4rem' : '1.6rem',}}>1. Request a sublease</p>
                        <p style={{fontFamily: OPENSANS, fontWeight:'400',fontSize: mobile ? '1rem' : '1.1rem', marginBottom:0, color:'#737373', }}>Simply browse through our listings and find the perfect space for your needs. Once you've found the ideal sublet, you can request a booking with just a few clicks.</p>
                    </div>
                </div>
                <div style={{width: mobile ?'100%' : '50%',  position:'relative', display:'flex', flexDirection:'column', alignItems:'center',  }}>
                    <div style={{width: mobile ? '100%' : '35vw', marginTop: mobile ? '5vh' : 0, height:'auto', borderRadius: MEDIUMROUNDED, borderColor: EXTRALIGHT,  borderWidth:'1px', borderStyle:'solid', padding: mobile ? '4vw' : '2vw', boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)'}}>
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
                    </div>
                </div>
            </div>
            <div style={{width:'100%', paddingTop:'5vh', paddingBottom:'10vh', flexDirection: mobile ? 'column' : 'row', display:'flex', alignItems:'center'}}>
                <div style={{width: mobile ?'100%' : '50%',  position:'relative', display:'flex', flexDirection:'column', alignItems:'center'  }}>
                    <div style={{width: mobile ? '100%' : '35vw'}}>
                        <p style={{fontFamily: OPENSANS, fontWeight:'600',fontSize: mobile ? '1.4rem' : '1.6rem',}}>2. Tenant’s decision</p>
                        <p style={{fontFamily: OPENSANS, fontWeight:'400',fontSize: mobile ? '1rem' : '1.1rem', marginBottom:0, color:'#737373', }}>After submitting your request, the tenant will review your application. Our streamlined process ensures quick responses, allowing you to secure your desired sublease as soon as possible. Once the tenant approves your booking, you're one step closer to moving into your new home.</p>
                    </div>
                </div>
                <div style={{width: mobile ?'100%' : '50%',  position:'relative', display:'flex', flexDirection:'column', alignItems:'center',  }}>
                    <div style={{width: mobile ? '100%' : '35vw', height:'auto', marginTop: mobile ? '5vh' : 0, borderRadius: MEDIUMROUNDED, borderColor: EXTRALIGHT,  borderWidth:'1px', borderStyle:'solid', padding: mobile ? '4vw' : '2vw', boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)'}}>
                        <p style={{fontFamily: OPENSANS, fontWeight:'600',fontSize:'1.2rem', marginBottom:0, color:'black', width:'85%' }}>Tim submitted a request to sublease your place</p>
                        <div style={{marginTop:'4vh'}}>
                            <Button  fullWidth variant="outlined"  style={{borderColor: 'black', borderWidth: '1px',  textTransform:'none', height: mobile ? '6vh' : '5vh', outline:'none', color:'black'}}>Reject</Button>
                            <Button  fullWidth variant="contained"  style={{backgroundColor: 'black', textTransform:'none', height: mobile ? '6vh' : '5vh', outline:'none', marginTop:'2vh'}}>Accept</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{width:'100%', paddingTop:'5vh', paddingBottom:'10vh', flexDirection: mobile ? 'column' : 'row', display:'flex', alignItems:'center'}}>
                <div style={{width: mobile ?'100%' : '50%', alignItems:'center', display:'flex', flexDirection:'column' }}>
                    <div style={{width: mobile ? '100%' : '35vw'}}>
                        <p style={{fontFamily: OPENSANS, fontWeight:'600',fontSize: mobile ? '1.4rem' : '1.6rem',}}>3. Sublease contract</p>
                        <p style={{fontFamily: OPENSANS, fontWeight:'400',fontSize: mobile ? '1rem' : '1.1rem', marginBottom:0, color:'#737373', }}>At Crib, we prioritize the legal and financial security of both parties involved. Once your booking is approved, both the tenant and subtenant will sign a comprehensive sublease contract. This contract outlines the terms and conditions of the sublease, ensuring a transparent and mutually beneficial agreement.</p>
                    </div>
                </div>
                <div style={{width: mobile ?'100%' : '50%',  position:'relative', display:'flex', flexDirection:'column', alignItems:'center',  }}>
                    <div style={{width: mobile ? '100%' : '35vw', height:'auto', marginTop: mobile ? '5vh' : 0, borderRadius: MEDIUMROUNDED, borderColor: EXTRALIGHT,  borderWidth:'1px', borderStyle:'solid', padding: mobile ? '4vw' : '2vw', boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)'}}>
                        <p style={{fontFamily: OPENSANS, fontWeight:'600',fontSize:'1.2rem', marginBottom:0, color:'black', width:'85%' }}>Tenant has signed sublease contract. Your turn now.</p>
                        <Lottie animationData={PreparingContractAnim} style={{width:'100%', marginTop:'6vh'}} />
                        <div style={{marginTop:'4vh'}}>
                            <Button  fullWidth variant="contained"  style={{backgroundColor: 'black', textTransform:'none', height: mobile ? '6vh' : '5vh', outline:'none'}}>View sublease contract</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{width:'100%', paddingTop:'5vh', paddingBottom:'10vh', flexDirection: mobile ? 'column' : 'row', display:'flex', alignItems:'center'}}>
                <div style={{width: mobile ?'100%' : '50%', alignItems:'center', display:'flex', flexDirection:'column' }}>
                    <div style={{width: mobile ? '100%' : '35vw'}}>
                        <p style={{fontFamily: OPENSANS, fontWeight:'600',fontSize: mobile ? '1.4rem' : '1.6rem',}}>4. Security deposit</p>
                        <p style={{fontFamily: OPENSANS, fontWeight:'400',fontSize: mobile ? '1rem' : '1.1rem', marginBottom:0, color:'#737373', }}>To provide peace of mind for all parties, we require subtenants to pay a security deposit. This deposit safeguards against any potential damages and ensures a smooth and worry-free subleasing experience. Rest assured that your security deposit will be handled securely and returned to you promptly upon completion of the sublease.</p>
                    </div>
                </div>
                <div style={{width: mobile ?'100%' : '50%',  position:'relative', display:'flex', flexDirection:'column', alignItems:'center',  }}>
                    <div style={{width: mobile ? '100%' : '35vw', height:'auto', marginTop: mobile ? '5vh' : 0, borderRadius: MEDIUMROUNDED, borderColor: EXTRALIGHT,  borderWidth:'1px', borderStyle:'solid', padding: mobile ? '4vw' : '2vw', boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)'}}>
                        <p style={{fontFamily: OPENSANS, fontWeight:'600',fontSize:'1.2rem', marginBottom:0, color:'black',  }}>Pay security deposit to secure your sublease.</p>
                        <p style={{fontFamily: OPENSANS, fontWeight:'500',fontSize:'0.9rem', marginBottom:0, color:'#737373', width:'100', marginTop:'2vh' }}>We safeguard your payment until move in day. Security deposit will only be transfer to tenant after successful move-in</p>
                        <div style={{marginTop:'4vh'}}>
                            <Button  fullWidth variant="contained"  style={{backgroundColor: 'black', textTransform:'none', height:'5vh', outline:'none', marginTop:'2vh'}}>Proceed to payments</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{width:'100%', paddingTop:'5vh', paddingBottom:'10vh', flexDirection: mobile ? 'column' : 'row', display:'flex', alignItems:'center'}}>
                <div style={{width: mobile ?'100%' : '50%', alignItems:'center', display:'flex', flexDirection:'column' }}>
                    <div style={{width: mobile ?'100%' :'35vw',}}>
                        <p style={{fontFamily: OPENSANS, fontWeight:'600',fontSize:'1.6rem',}}>5. Seamless move-in</p>
                        <p style={{fontFamily: OPENSANS, fontWeight:'400',fontSize:'1.1rem', marginBottom:0, color:'#737373', }}>Once you've signed the sublease contract and paid the security deposit, you're all set! We'll provide you with all the necessary information and support to ensure a hassle-free transition, allowing you to settle into your new space effortlessly.</p>
                    </div>
                </div>
                <div style={{width: mobile ?'100%' : '50%',  position:'relative', display:'flex', flexDirection:'column', alignItems:'center',  }}>
                    <div style={{width: mobile ? '100%' : '35vw', height: mobile ? '90vw' : 'auto', marginTop: mobile ? '5vh' : 0, borderRadius: MEDIUMROUNDED, borderColor: EXTRALIGHT,  borderWidth:'1px', borderStyle:'solid', padding: mobile ? '4vw' : '2vw', boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)'}}>
                        <div style={{width: '100%', height: mobile ? '100%' : '30vw',}}>
                            <img src={NYDayImage} style={{height:'100%', width:'100%', borderRadius: MEDIUMROUNDED}} />
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}