import { DatePicker } from "@mui/x-date-pickers"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { LIGHTGREY, MEDIUMGREY, MEDIUMROUNDED, PRIMARYCOLOR, } from "../../sharedUtils"
import { SubleaseDetailContainer, SubtenantRequestSubheading, SubtenantRequestText, SubtenantRequestTitle } from "./subtenantRequestStyle"
import { Modal, TextField, Select, MenuItem, InputLabel, FormControl, IconButton, TypeSelect, Checkbox, Button} from "@mui/material";


import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { width } from "@mui/system"
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

import Lottie from "lottie-react";
import WhiteLoading from '../../whiteLoading.json'



export default function SubtenantRequest(){
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [propData, setPropData] = useState(null)
    const [tenantData, setTenantData] = useState(null)

    const [requestStart, setRequestStart] = useState(null)
    const [requestEnd, setRequestEnd] = useState(null)


    useEffect(()=>{
        fetchProp()
    }, [])

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
                setTenantData(data.userInfo)
            }
        })
    }

    function getTotalRent(){
        let start = new Date(requestStart).getTime();
        let end = new Date(requestEnd).getTime();

        let months = (end - start) / (1000*60*60*24*31)
      
        let total = (months * propData.price)
        return total.toFixed(2)
    }

    function getServiceCharge(){
        let total = getTotalRent()
        let serviceCharge = total*0.05
        return serviceCharge.toFixed(2)
    }

    function submitSubleaseRequest(){
        setLoading(true)
    }



    return(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        {propData == null || tenantData == null ?
        null
        :  
        <>
        <div style={{width: '100vw', marginLeft:'auto', marginRight:'auto', paddingTop:'2.5vh', overflowY: 'scroll', height:'78vh', paddingLeft:'5vw', paddingRight:'5vw'}}>
            <div style={{flexDirection:'row', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <SubtenantRequestText style={{textAlign:'center', fontWeight:'700', color: PRIMARYCOLOR, marginBottom: 0}}>
                    Submit<br/>Request
                </SubtenantRequestText>
                <div style={{display:'flex', flex: 1, alignItems:'center', justifyContent:'center'}}>
                    <ArrowRightAltIcon style={{color: PRIMARYCOLOR}}/>
                </div>
                <SubtenantRequestText style={{textAlign:'center', fontWeight:'600',  marginBottom: 0}}>
                    Tenant<br/>Approval
                </SubtenantRequestText>
                <div style={{display:'flex', flex: 1, alignItems:'center', justifyContent:'center'}}>
                    <ArrowRightAltIcon style={{color: 'black'}}/>
                </div>
                <SubtenantRequestText style={{textAlign:'center', fontWeight:'600',  marginBottom: 0}}>
                    24 hours<br/>to payment
                </SubtenantRequestText>
            </div>
            <div style={{marginTop: 20,  paddingBottom: '3vh'}}>
                <SubtenantRequestTitle>Request availability</SubtenantRequestTitle>
                <SubtenantRequestText>Fill out the following details so we can let the tenant know about your interest. Be as detailed as possibl to ensure best results.</SubtenantRequestText>
            </div>
            <div style={{paddingBottom: '5vh'}}>
                <SubtenantRequestSubheading>
                    Request dates
                </SubtenantRequestSubheading>
                <SubleaseDetailContainer>
                    <div style={{width: '30vw', height: '10vh', }}>
                        <img src={propData.imgList[0]} style={{height:'100%', width: '100%', borderRadius: MEDIUMROUNDED}}/>
                    </div>
                    <div style={{paddingLeft: '2.5vw', justifyContent:'center', display:'flex', flexDirection:'column'}}>
                        <SubtenantRequestText style={{overflow:'hidden', fontWeight:'600', marginBottom: 5}}>{propData.type}</SubtenantRequestText>
                        <SubtenantRequestText style={{overflow:'hidden', fontWeight:'600', marginBottom: 5}}>{propData.loc.streetAddr}</SubtenantRequestText>
                        <SubtenantRequestText style={{overflow:'hidden', fontWeight:'500', marginBottom: 0}}>${propData.price} /month</SubtenantRequestText>
                    </div>
                    
                </SubleaseDetailContainer>
                <div style={{marginTop:20}}>
                    <DatePicker
                    label="Request start"
                    value={dayjs(requestStart)}
                    onChange={(event)=> setRequestStart(event)}
                    slotProps={{ textField: { fullWidth: true, error:false } }}
                    />
                </div>
                <div style={{marginTop:20}}>
                    <DatePicker
                    label="Request end"
                    value={dayjs(requestEnd)}
                    onChange={(event)=> setRequestEnd(event)}
                    slotProps={{ textField: { fullWidth: true, error:false } }}
                    />
                </div>
            </div>
            <div style={{paddingBottom: '5vh'}}>
                <SubtenantRequestSubheading>
                    Introduce yourself
                </SubtenantRequestSubheading>
                <SubtenantRequestText>Our tenants are actual tenants too. Tell them a bit about yourself and what's your purpose of staying. (200 characters minimum)</SubtenantRequestText>
                <TextField inputProps={{style:{height: '15vh'}}} multiline fullWidth label="My bio" />

            </div>
            <div>
                <SubtenantRequestSubheading>
                Sublease detailed prices
                </SubtenantRequestSubheading>
                <div style={{paddingTop: '1vh'}}>
                    <div style={{flexDirection: 'row', display: 'flex', justifyContent:'space-between'}}>
                        <SubtenantRequestText style={{fontWeight:'500'}}>Security deposit</SubtenantRequestText>
                        <SubtenantRequestText style={{fontWeight:'500'}}>${propData.securityDeposit == undefined ? "0" : propData.securityDeposit }</SubtenantRequestText>
                    </div>
                    
                    <div style={{flexDirection: 'row', display: 'flex', justifyContent:'space-between'}}>
                        <SubtenantRequestText style={{fontWeight:'500'}}>Total rent</SubtenantRequestText>
                        { requestStart == null && requestEnd == null ?
                        <SubtenantRequestText style={{fontWeight:'500'}}>TBD</SubtenantRequestText>
                        :
                        <SubtenantRequestText style={{fontWeight:'500'}}>${getTotalRent()}</SubtenantRequestText>
                        }
                    </div>
                    <div style={{flexDirection: 'row', display: 'flex', justifyContent:'space-between'}}>
                        <SubtenantRequestText style={{fontWeight:'500'}}>Service charge</SubtenantRequestText>
                        { requestStart == null && requestEnd == null ?
                        <SubtenantRequestText style={{fontWeight:'500'}}>TBD</SubtenantRequestText>
                        :
                        <SubtenantRequestText style={{fontWeight:'500'}}>${getServiceCharge()}</SubtenantRequestText>
                        }
                    </div>
                    
                </div>
                
            </div>
        </div>
        <div style={{position:'absolute', bottom: 0, borderTopWidth: 1, borderTopStyle:'solid', borderTopColor: LIGHTGREY, width:'100vw', paddingLeft:'auto', paddingRight:'auto', display:'flex', flexDirection:'column', alignItems:'center', height:'12vh', justifyContent:'center'}}>
            <Button onClick={submitSubleaseRequest} style={{backgroundColor:PRIMARYCOLOR, width: '90vw', }}>
                <Link to={`/subtenantRequestSuccess/${propData._id}`} style={{color: 'white', textDecorationLine:'none', display:'flex', flex: 1}}>
                    <SubtenantRequestText style={{fontWeight:'600', textTransform:'none', color:'white', margin: 'auto'}}>Request</SubtenantRequestText>
                </Link>
            </Button>
            <SubtenantRequestText style={{fontWeight:'500', fontSize: '0.8rem', marginTop: '1vh', textAlign:'center', marginBottom:0}}>You'll pay only after host accepts your request</SubtenantRequestText>
        </div>
        </>
        }   
        </LocalizationProvider>     

    )
}