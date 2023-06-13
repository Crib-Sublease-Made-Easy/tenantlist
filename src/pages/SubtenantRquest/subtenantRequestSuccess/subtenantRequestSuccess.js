import { Button } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { LIGHTGREY, MEDIUMROUNDED, PRIMARYCOLOR } from "../../../sharedUtils";
import { UserContext } from "../../../UserContext";
import { SubtenantRequestSubheading, SubtenantRequestText, SubtenantRequestTitle } from "./subtenantRequestSuccessStyle";

export default function SubtenantRequestSuccess(){
    const {mobile} = useContext(UserContext)
    const { id } = useParams()

    const [propData, setPropData] = useState(null)
    const [tenantData, setTenantData] = useState(null)

    useEffect(()=>{
        fetchProp()
     
    },[])

    async function fetchProp(){
        await fetch('https://crib-llc.herokuapp.com/properties/' + id, {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                viewCount: "false"
            })
        })
        .then(async (res)=>{
            if(res.status == 200){
                let data = await res.json()
                setPropData(data.propertyInfo)
                console.log(data.propertyInfo.imgList[0])
                setTenantData(data.userInfo)
            }
        })
    }

    return(
        <div style={{width: '100vw', marginLeft:'auto', marginRight:'auto', paddingTop:'2.5vh', overflowY: 'scroll', height:'90vh', paddingLeft:'5vw', paddingRight:'5vw'}}>
            {
                propData != null && tenantData != null &&
                <>
                    
                    <img src={propData.imgList[0]} style={{width:'90vw', height: '30vh', display:'flex', flex: 1, borderRadius: MEDIUMROUNDED, objectFit:'cover'}}/>
                    <div style={{marginTop: '2vh'}}>
                        <SubtenantRequestTitle>Request sent!</SubtenantRequestTitle>
                        <SubtenantRequestText>We have sent your request to {tenantData.firstName}. {tenantData.firstName} will have 48 hours to approve or deny your request. Once approved, we will send you a notificaiton and you will have 24 hours to sign the sublease agreement and proceed withs payment to secure the sublease.</SubtenantRequestText>
                    </div>
                    <div style={{position:'absolute', bottom: '2vh', width:'90vw', alignItems:'center'}}>
                        <SubtenantRequestSubheading>
                            Want to find a sublease faster?
                        </SubtenantRequestSubheading>
                        <SubtenantRequestText>Request more subleases to have a better chance of securing a sublease.</SubtenantRequestText>

                        <Button fullWidth vaiant="contained" style={{backgroundColor:PRIMARYCOLOR, color:'white', textTransform:'none'}}>
                            <Link to={`/`} style={{display:'flex', flex: 1}}>
                                <SubtenantRequestText style={{fontWeight:'600', textTransform:'none', color:'white', margin: 'auto'}}>Discover more subleases</SubtenantRequestText>
                            </Link>
                        </Button>
                        <div style={{textAlign:'center', marginTop:'2vh'}}>
                            <SubtenantRequestText style={{fontWeight:'600', textTransform:'none', margin: 'auto'}}>See my requests</SubtenantRequestText>
                        </div>
                    </div>
                </>
            }
            
        </div>
    )
}