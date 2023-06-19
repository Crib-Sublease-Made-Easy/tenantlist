import { useContext, useEffect, useRef, useState } from 'react';
import { LIGHTGREY, MEDIUMGREY, MEDIUMROUNDED, OPENSANS } from '../../sharedUtils';

import Lottie from "lottie-react";
import WhiteLoadingAnimation from '../../whiteLoading.json'


//Icon 
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import PhonelinkRingIcon from '@mui/icons-material/PhonelinkRing';
import MailIcon from '@mui/icons-material/Mail';
import PersonIcon from '@mui/icons-material/Person';
import { Button, Fade, Modal, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';


const ProfileItems = ['Legal name', 'Phone number', 'Email','School', 'Occupation']

export default function ProfileScreen(){
    const [loading, setLoading] = useState(false)
    const {mobile} = useContext(UserContext)
    const navigate = useNavigate()
    const [userData, setUserData] = useState(null)
    const [itemEditing, setItemEditing] = useState("")


    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [school, setSchool] = useState("")
    const [occupation, setOccupation] = useState("")
    const [governmnetIDFile, setGovernmentIDFile] = useState(null)

    const hiddenGovernmentIDFileInput = useRef(null)

    //Email verification
    const [emailVerifCode, setEmailVerifCode] = useState("")
    const [EmailVerifModalVis, setEmailVerifModalVis] = useState(false)


    useEffect(()=> {
        getToken()
    }, [itemEditing])

    async function getToken(){
        let at = localStorage.getItem("refreshToken")
        let uid = localStorage.getItem("uid")

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
    }

    function getProfileItemValue(item){
        if(item == 'Legal name'){
            return userData.firstName + " " + userData.lastName
        }
        else if(item == "Phone number"){
            let number = userData.phoneNumber;
            let cc = userData.countryCode
            return  "+"+cc+number 
        }
        else if(item == "Email"){
            return userData.email
        }
        else if(item == "Government ID"){
            return ""
        }
        else if(item == "School"){
            return userData.school
        }
        else if(item == "Occupation"){
            return userData.occupation
        }
        else if(item == "Email"){
            return userData.email
        }
        else if(item == "Video bio"){
            return "Add a video bio"
        }
    }

    function handleGovernmentIDChange(event){
        const fileUploaded = event.target.files[0];
        
        const url = URL.createObjectURL(fileUploaded)
        setGovernmentIDFile(fileUploaded)
     
    }

    function handleEditClick(item){
        if(item == "" && item != itemEditing){
            setItemEditing("")
        }
        else if(item != "" && item == itemEditing){
            setItemEditing("")
        }
        else{
            setItemEditing(item)
        }
    }

    async function UpdateTextItem(item){
        const accessToken = localStorage.getItem("refreshToken");
        const USERID = localStorage.getItem("uid")

        let toChange = {}
        if(item == "Email"){
            toChange = {"email":email.trim()}
        }
        if(item == "School"){
            toChange = {"school": school.trim()}
        }
        if(item == "Occupation"){
            toChange = {"occupation": occupation.trim()}
        }
        if(item == "Legal name"){
            toChange = {"firstName": firstName.trim(), "lastName": lastName.trim()}
        }
        

        if(USERID != null && accessToken != null){
            fetch('https://crib-llc.herokuapp.com/users/' + USERID, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                },
                body: JSON.stringify(toChange)
            })
            .then((response) => {
                if(response.status == 200){
                    setItemEditing("")    
                }
            }
            )
            .catch(e => {
                console.log("ERROR --- EDITEDUCATION --- UPDATE")
            })
        }
        
    }

    function sendVerificationEmail(){
        fetch('https://crib-llc.herokuapp.com/users/sendEmailVerification', {
            method:'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": userData.email
            })
        })
        .then( res => {
            if(res.status == 200){
                setEmailVerifModalVis(true)
            }
            else{
                alert("Invalid email. Please enter a valid email before verification.")
            }
        })
        .catch( e => console.log("Error"))
    }

    function handleTextChange(val, item){
       
        if(item == "Email"){
            setEmail(val)
        }
        if(item == "School"){
            setSchool(val)
        }
        if(item == "Occupation"){
            setOccupation(val)
        }
    }

    function verifyEmail(){
        if(emailVerifCode.length != 6){
            alert("Please enter a valid verification code")
            return
        }
        setLoading(true)
        fetch('https://crib-llc.herokuapp.com/users/verifyEmailVerifcationCode', {
            method:'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": userData.email,
                "code": emailVerifCode,
                "userId": userData._id
            })
        })
        .then( res => {
            if(res.status == 200){
                setTimeout(()=>{
                    setLoading(false)
                    setEmailVerifModalVis(false)
                    navigate(0)
                },2000)
            }
            else{
                alert("Invalid code, please try again.")
                setLoading(false)
                setEmailVerifCode("")
            }
        })
        .catch( e => console.log("Error"))

    }


    return(
        <div style={{width: '90vw', height: mobile ? 'auto' : '90vh', marginLeft:'auto', marginRight:'auto',  overflow:'scroll' }}>
            <div style={{height:'15vh', width:'100%', display:'flex', alignItems:'center', flexDirection: 'row'}}>
                {/* <ArrowBackIcon  style={{fontSize:'1.5vw', cursor:'pointer'}}/> */}
                <p style={{marginBottom:0, marginLeft:'2vw', fontWeight:'600', fontFamily: OPENSANS, fontSize:'1.2rem'}}>Personal information</p>
            </div>
        { userData != null &&
        <div style={{display:'flex', flexDirection: mobile ? 'column-reverse' : 'row'}}>
            
            <div style={{flexDirection: mobile ? 'column-reverse' : 'row', display:'flex',overflow:'scroll', justifyContent:'center'}}>
                <div style={{width: mobile ? '100%' : '40vw', }}>
                    {ProfileItems.map((item)=>{
                        return(
                        <div key={"edit" + item} style={{paddingTop:"3vh", paddingBottom:'3vh', borderBottomWidth:'0.5px', borderBottomColor: LIGHTGREY, borderBottomStyle:'solid'}}>
                            <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:5}}>
                                <p style={{marginBottom:0, fontWeight:'600', fontFamily:OPENSANS, fontSize:'1rem'}}>{item}</p>
                                <p onClick={()=> handleEditClick(item)} style={{marginBottom:0, fontWeight:'600', fontFamily:OPENSANS, fontSize:'0.8rem', textDecorationLine:"underline", color:MEDIUMGREY, cursor:'pointer'}}>{item == itemEditing ? "Cancel" : "Edit"}</p>
                            </div>
                            <p style={{marginBottom:0, color:'#737373'}}>{getProfileItemValue(item)}</p>
                            <div style={{marginTop:'2vh', display: item == itemEditing ? 'flex' : 'none', flexDirection: mobile ? 'column' : 'row', color:'white', justifyContent:'space-between', alignItems: mobile ? 'flex-start' : 'center'}}>
                                {item == "Legal name" ? 
                                <div style={{flexDirection: mobile ? 'column' : "row", display:'flex'}}>
                                    <TextField fullWidth={mobile ? true : false} onChange={(val)=>setFirstName(val.target.value, item)} label={`First name`} />
                                    <TextField fullWidth={mobile ? true : false} onChange={(val)=>setLastName(val.target.value, item)} label={`Last name`} style={{marginLeft: mobile ? 0 : '1vw', marginTop: mobile ? '2vh' : 0, }}/>
                                </div>
                                :
                                item == "Government ID" ?
                                <div style={{flexDirection:'row', display:'flex', alignItems:'center'}}>
                                    <input onChange={handleGovernmentIDChange} ref={hiddenGovernmentIDFileInput} style={{display:'none'}} type="file" accept="image/*" />
                                    <Button onClick={()=>(hiddenGovernmentIDFileInput.current).click()} variant="contained" style={{backgroundColor:'white',  outline:'none', textTransform:'none', height:'6vh', width:'10vw'}}>
                                        <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'500', color:'black'}}>
                                            Upload image
                                        </p>
                                    </Button>
                                    {governmnetIDFile != null && <p style={{color:'black', marginLeft:'1vw', marginBottom:0, fontFamily: OPENSANS, fontSize:'0.8rem'}}>File uploaded!</p>}
                                </div>
                                :
                                <TextField onChange={(val)=>handleTextChange(val.target.value, item)} label={`${item}`} style={{width:'30vw'}}/>
                                }
                                <Button onClick={()=>UpdateTextItem(item)} style={{backgroundColor:'black', outline:'none', textTransform:'none', height:'6vh', width:'7vw', marginTop: mobile ? '2vh' : 0 }}>
                                    <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'600', color:'white'}}>
                                        Update
                                    </p>
                                </Button>
                            </div>
                        </div>
                        )
                    })}
                </div>
                <div style={{width: mobile ? '100%' : '40vw', alignItems:'flex-end', display:'flex', paddingTop: mobile ? 0 : '2vh', flexDirection:'column'}}>
                    <div style={{width: mobile ? '100%' : '75%',  backgroundColor:'white', boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)', borderRadius:MEDIUMROUNDED, display:'flex', alignItems:'center', padding: mobile ? '5vw' : '1.5vw', flexDirection:"row", justifyContent:'space-between', borderWidth:'1px', borderColor: LIGHTGREY, borderStyle:'solid'}} >
                        <div style={{alignItems:'center', flexDirection:'row', display:'flex'}}>
                            <PhonelinkRingIcon style={{fontSize:'1.2rem',}}/>
                            <p style={{marginBottom:0, fontSize:'0.9rem', marginLeft:'1vw', fontWeight:'600', fontFamily: OPENSANS, }}>Phone number verified</p>
                        </div>
                        <div style={{padding:3, backgroundColor:'black',justifyContent:'center', alignItems:'center', display:'flex', borderRadius:100}}>
                            <CheckIcon style={{fontSize:'1rem', fontWeight:"600", color:'white'}}/>
                        </div>
                    </div>
                    <div style={{width: mobile ? '100%' : '75%',  backgroundColor:'white', boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)', borderRadius:MEDIUMROUNDED, display:'flex', alignItems:'center', padding: mobile ? '5vw' : '1.5vw', flexDirection:"row", justifyContent:'space-between', marginTop:'3vh',  borderWidth:'1px', borderColor: LIGHTGREY, borderStyle:'solid'}} >
                        <div style={{ display:'flex', alignItems:'center',flexDirection:"row", justifyContent:'space-between', width:'100%'}}>
                            <div style={{alignItems:'center', flexDirection:'row', display:'flex'}}>
                                <MailIcon style={{fontSize:'1.2rem',}}/>
                                <p style={{marginBottom:0, fontSize:'0.9rem', marginLeft:'1vw', fontWeight:'600', fontFamily: OPENSANS, }}>Email {userData.emailVerified ? null : "not"} verified</p>
                            </div>
                            <div style={{padding:3, backgroundColor:'black',justifyContent:'center', alignItems:'center', display:'flex', borderRadius:100}}>
                                <CheckIcon style={{fontSize:'1rem', color:'white',}}/>
                            </div>
                        </div>
                        {!userData.emailVerified &&
                            <p style={{marginBottom:0, fontWeight:'400', fontSize:'0.8rem',  marginTop:'1vh'}}><span onClick={sendVerificationEmail} style={{textDecorationLine: 'underline', cursor:'pointer'}}>Send verificaiton email</span> to {userData.email}</p>
                        }
                        </div>
                    <div style={{width: mobile ? '100%' : '75%',  backgroundColor:'white', boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)', borderRadius:MEDIUMROUNDED, display:'flex', alignItems:'center', padding: mobile ? '5vw' : '1.5vw', flexDirection:"row", justifyContent:'space-between', marginTop:'3vh',  borderWidth:'1px', borderColor: LIGHTGREY, borderStyle:'solid'}} >
                        <div style={{ display:'flex', alignItems:'center',flexDirection:"row", justifyContent:'space-between', width:'100%'}}>
                            <div style={{alignItems:'center', flexDirection:'row', display:'flex'}}>
                            <PersonIcon style={{fontSize:'1.2rem',}}/>
                                <p style={{marginBottom:0, fontSize:'0.9rem', marginLeft:'1vw', fontWeight:'600', fontFamily: OPENSANS, }}>ID not verified</p>
                            </div>
                            <div style={{padding:3, backgroundColor:'black',justifyContent:'center', alignItems:'center', display:'flex', borderRadius:100}}>
                                <CheckIcon style={{fontSize:'1rem', color:'white',}}/>
                            </div>
                        </div>
                        <p style={{marginBottom:0, fontWeight:'400', fontSize:'0.8rem',  marginTop:'1vh', textDecorationLine: 'underline', cursor:'pointer'}}>Upload ID for verification</p>
                    </div>
                   
                    {/* <div style={{width: mobile ? '100%' : '75%',  backgroundColor:'white', boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)', borderRadius:MEDIUMROUNDED, display:'flex', alignItems:'center', padding: mobile ? '5vw' : '1.5vw', flexDirection:"row", justifyContent:'space-between', marginTop:'3vh'}} >
                        <div style={{alignItems:'center', flexDirection:'row', display:'flex'}}>
                            <VideoCameraFrontIcon style={{fontSize:'1.2rem',}}/>
                            <p style={{marginBottom:0, fontSize:'0.9rem', marginLeft:'1vw', fontWeight:'600', fontFamily: OPENSANS, }}>Video bio not uploaded</p>
                        </div>
                        <div style={{padding:3, backgroundColor:'black',justifyContent:'center', alignItems:'center', display:'flex', borderRadius:100}}>
                            <CheckIcon style={{fontSize:'1rem', fontWeight:"600", color:'white'}}/>
                        </div>
                    </div> */}
                </div>
            </div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={EmailVerifModalVis}
                
                closeAfterTransition
                slotProps={{
                backdrop: {
                    timeout: 500,
                },
                }}
            >
                <Fade in={EmailVerifModalVis}>
                    <div 
                        style={{
                        position: 'absolute',
                        top: '30%',
                        left: '50%',
                        transform: 'translate(-50%, -30%)',
                        width:'auto',
                        height:'auto',
                        backgroundColor:'white',
                        padding: mobile ? '4vw' : '2vw',
                        borderRadius: MEDIUMROUNDED,
                        display:'flex',
                        
                        flexDirection:'column',
                        width: 'auto',
                        minWidth:'35vw'
                        }}>
                            <div onClick={()=>setEmailVerifModalVis(false)} style={{display:'flex', flexDirection:'row', alignItems:'center', cursor:'pointer'}}>
                                <CloseIcon style={{color:'black', fontSize:'1.5rem'}}/>
                            </div>
                            <div style={{marginTop:'2vh'}}>
                                <p style={{fontSize:'1.2rem', fontFamily: OPENSANS, color: 'black', fontWeight:'600', marginBottom:5}}>Verification email sent</p>
                                <p style={{fontSize:'0.9rem', fontFamily: OPENSANS, color: MEDIUMGREY}}>Please enter the 6 digit verificaiton code below</p>
                                <div style={{flexDirection:'column', display:'flex', justifyContent:'space-between', marginTop:'6vh',}}>
                                    <TextField fullWidth value={emailVerifCode} label="Verificaiton code" onChange={(val) => setEmailVerifCode(val.target.value)}  />
                                    <Button onClick={verifyEmail} variant='contained' style={{backgroundColor:'black', outline:'none', textTransform:'none', height:'5vh', marginTop:'2vh'}}>
                                        { loading  ?
                                        <Lottie animationData={WhiteLoadingAnimation} style={{display:'flex', flex:1, color:'white', height:'8vh', preserveAspectRatio: 'xMidYMid slice'}}/>
                                        :
                                        <p style={{marginBottom:0, fontWeight:'500', fontSize:'0.9rem', fontFamily: OPENSANS}}>Verify</p>
                                        }
                                    </Button>
                                    <small style={{marginTop:'2vh', fontFamily:OPENSANS}}>Didn't get an email? <span style={{fontWeight:'500', cursor:'pointer'}}>Resend email</span></small>
                                </div>
                            </div>
                    </div>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={EmailVerifModalVis}
                
                closeAfterTransition
                slotProps={{
                backdrop: {
                    timeout: 500,
                },
                }}
            >
                <Fade in={EmailVerifModalVis}>
                    <div 
                        style={{
                        position: 'absolute',
                        top: '30%',
                        left: '50%',
                        transform: 'translate(-50%, -30%)',
                        width:'auto',
                        height:'auto',
                        backgroundColor:'white',
                        padding: mobile ? '4vw' : '2vw',
                        borderRadius: MEDIUMROUNDED,
                        display:'flex',
                        
                        flexDirection:'column',
                        width: 'auto',
                        minWidth:'35vw'
                        }}>
                            <div onClick={()=>setEmailVerifModalVis(false)} style={{display:'flex', flexDirection:'row', alignItems:'center', cursor:'pointer'}}>
                                <CloseIcon style={{color:'black', fontSize:'1.5rem'}}/>
                            </div>
                            <div style={{marginTop:'2vh'}}>
                                <p style={{fontSize:'1.2rem', fontFamily: OPENSANS, color: 'black', fontWeight:'600', marginBottom:5}}>Verification email sent</p>
                                <p style={{fontSize:'0.9rem', fontFamily: OPENSANS, color: MEDIUMGREY}}>Please enter the 6 digit verificaiton code below</p>
                                <div style={{flexDirection:'column', display:'flex', justifyContent:'space-between', marginTop:'6vh',}}>
                                    <TextField fullWidth value={emailVerifCode} label="Verificaiton code" onChange={(val) => setEmailVerifCode(val.target.value)}  />
                                    <Button onClick={verifyEmail} variant='contained' style={{backgroundColor:'black', outline:'none', textTransform:'none', height:'5vh', marginTop:'2vh'}}>
                                        { loading  ?
                                        <Lottie animationData={WhiteLoadingAnimation} style={{display:'flex', flex:1, color:'white', height:'8vh', preserveAspectRatio: 'xMidYMid slice'}}/>
                                        :
                                        <p style={{marginBottom:0, fontWeight:'500', fontSize:'0.9rem', fontFamily: OPENSANS}}>Verify</p>
                                        }
                                    </Button>
                                    <small style={{marginTop:'2vh', fontFamily:OPENSANS}}>Didn't get an email? <span style={{fontWeight:'500', cursor:'pointer'}}>Resend email</span></small>
                                </div>
                            </div>
                    </div>
                </Fade>
            </Modal>
        </div>
        }
        </div>
    )
}