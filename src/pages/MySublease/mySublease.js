import { useContext, useEffect, useState } from "react"
import { MEDIUMGREY, MEDIUMROUNDED, OPENSANS } from "../../sharedUtils"


//Icon
import BedIcon from '@mui/icons-material/Bed';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import WifiIcon from '@mui/icons-material/Wifi';
import { UserContext } from "../../UserContext";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


export default function MySubleaseScreen(){
    const {mobile} = useContext(UserContext)
    const navigate = useNavigate()
    const [userData, setUserData] = useState(null)
    const [propData, setPropData] = useState(null)

    useEffect(()=> {
        getUserData()
    },[])

    async function getUserData(){
        let at = localStorage.getItem("accessToken")
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
                if(userData.postedProperties.length != 0){
                    getPropData(userData.postedProperties[0])
                }
            })
            .catch(e=>{
              console.log("Error")
            })
        } 
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

    async function handleNav(route){
        navigate(route)
    }   

    async function postSublease(){
        if(userData.postedProperties.length > 0){
            alert("Each user can only post 1 property.")
            return
        }
        else{
            navigate("/propertyPosting")
        }
    }

    return(
        <div style={{width: '90vw', height: mobile ? 'auto' : '90vh', marginLeft:'auto', marginRight:'auto', flexDirection:'column', display:'flex', paddingBottom: mobile ? '5vh' : 0 }}>
                
            <div style={{height: '10vh', width:'100%',  alignItems:'center', display:'flex', justifyContent:'space-between', marginTop: mobile ? '2vh' : 0}}>
                <p style={{marginBottom:0, fontSize:'1.2rem', fontWeight:'600', fontFamily: OPENSANS}}>My sublease</p>
                <Button onClick={postSublease} variant="contained" style={{backgroundColor:'black', outline:'none', textTransform:'none'}}>
                    <p style={{marginBottom:0, fontFamily:OPENSANS, fontWeight:'500'}}>Post a sublease</p>
                </Button>
            </div>
            { propData != null && userData != null &&
           
                <div style={{flexDirection:'column', display:'flex', width: mobile ? '90vw' : "20vw", marginTop: mobile ? '2vh' : 0 }}>
                    <img src={propData.imgList[0]} style={{width: mobile ? '90vw' : '20vw', height: mobile ? '90vw' : '20vw',  borderRadius: MEDIUMROUNDED, objectFit:'cover'}}/>
                    <div style={{marginTop:'2vh'}}>
                   
                        <p style={{fontSize: '0.9rem', fontWeight:'700', marginBottom:0,fontFamily: OPENSANS,marginBottom: 5}}>{propData.loc.streetAddr}</p>
                        <p style={{fontSize: '0.9rem', fontWeight:'600', color:'#333333', marginBottom:5, fontFamily: OPENSANS}}>{new Date(propData.availableFrom).getTime() < new Date().getTime() ? "Now" : new Date(propData.availableFrom).toLocaleString().split(",")[0]} - {new Date(propData.availableTo).toLocaleString().split(",")[0]}</p>
                        {propData.amenities.includes("Mattress") &&
                        <div style={{flexDirection:'row', display:'flex', alignItems:'center', paddingTop:'0.5vh', paddingBottom:'0.5vh'}}>
                            <BedIcon style={{color:MEDIUMGREY, fontSize: mobile ? '5vw' : '1vw'}}/>
                            <p style={{fontSize: '0.8rem', fontWeight:'600', color:'#333333', marginBottom:0, marginLeft:mobile ? '2vw' :'0.5vw', fontFamily: OPENSANS}}>Furnished</p>
                        </div>
                        }
                        {propData.amenities.includes("Utilities_Included") &&
                        <div style={{flexDirection:'row', display:'flex', alignItems:'center', paddingTop:'0.5vh', paddingBottom:'0.5vh'}}>
                            <ElectricBoltIcon style={{color:MEDIUMGREY, fontSize: mobile ? '5vw' : '1vw'}}/>
                            <p style={{fontSize: '0.8rem', fontWeight:'600', color:'#333333', marginBottom:0, marginLeft:mobile ? '2vw' :'0.5vw', fontFamily: OPENSANS}}>Utilities included</p>
                        </div>
                        }
                        {propData.amenities.includes("Wifi") &&
                        <div style={{flexDirection:'row', display:'flex', alignItems:'center', paddingTop:'0.5vh', paddingBottom:'0.5vh'}}>
                            <WifiIcon style={{color:MEDIUMGREY, fontSize: mobile ? '5vw' : '1vw'}}/>
                            <p style={{fontSize: '0.8rem', fontWeight:'600', color:'#333333', marginBottom:0, marginLeft: mobile ? '2vw' :'0.5vw', fontFamily: OPENSANS}}>Wifi included</p>
                        </div>
                        }
                        <div style={{flexDirection: 'row', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: mobile ? '2vh' : 0 , width:'20vw'}}>
                            <p style={{fontWeight:'500', color:'#333333', fontFamily: OPENSANS, fontSize:"0.9rem", marginBottom:0}}><span style={{fontWeight:'700'}}>{propData.type}</span></p>
                            <p style={{fontFamily:OPENSANS, fontWeight:'600', fontSize:'0.9rem', marginBottom:0}}>${propData.price}/month</p>
                        </div>
                    </div>
                  
                    <Button onClick={()=>handleNav("/mySubleaseEdit")} variant="contained" style={{backgroundColor:'black', outline:'none', textTransform:'none', marginTop: '5vh', height: mobile ? '6vh' : 'auto'}}>
                        <p style={{marginBottom:0, fontFamily:OPENSANS, fontWeight:'500'}}>Edit listing</p>
                    </Button>
                    
                </div>
}

        </div>
    )
}