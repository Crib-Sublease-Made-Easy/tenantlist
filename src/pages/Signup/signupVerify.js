import { TextField, Button } from "@mui/material";
import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { PRIMARYCOLOR } from "../../sharedUtils";
import { UserContext } from "../../UserContext";
import { SingupSubheading, SingupText } from "./signupStyle";

export default function SignupVerifyScreen(props){
    let location = useLocation()
    const {mobile} =useContext(UserContext)
    function handleSignupClick(){

    }

    return(
        <div style={{width: mobile ? '100vw' :'40vw', marginLeft:'auto', marginRight:'auto', paddingTop:'5vh', overflowY: 'scroll', height:'90vh', paddingLeft:'5vw', paddingRight:'5vw'}}>
            <SingupSubheading>Enter phone number</SingupSubheading>
            <SingupText>We will send a verification code to your phone number.</SingupText>
            <div style={{paddingTop: '2vh'}}>
                <TextField fullWidth label= "Phone number" style={{textTransform:'none',}} />
                <Button  fullWidth style={{marginTop: '2vh', backgroundColor: PRIMARYCOLOR,color: 'white', textTransform:'none', height: '6vh', textAlign:'center'}}>
                    <Link to={{pathname:'/signupVerify'}} onClick={handleSignupClick} style={{fontWeight:'600', textTransform:'none', color:'white', marginBottom:0, display: 'flex', flex: 1,  justifyContent:'center'}}>Continue</Link>
                </Button>
            </div>
        </div>
    )
}