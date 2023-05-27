import { useEffect, useState } from "react";
import { Button } from "@mui/material";

export default function TennatCard(props) {

    const tenant = props.data.userInfo
    const prop = props.data.propertyInfo
    
    const [propData, setPropData] = useState([])
    const [phoneNum, setPhoneNum] = useState(props.data.userInfo.phoneNumber)
    const [showPhoneNum, setShowPhoneNum] = useState(false)
    




    function getAge(ms){
        return Math.floor(ms / (1000*60*60*24*365));
    }

    

    
    return(
        <div style={{padding: 15, borderColor: '#ABABAB', borderStyle:'solid', borderRadius: 10, overflow:'hidden'}}>
            <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom: 20}}>
                <img key={tenant._id + "profilepic"} src={tenant.profilePic} style={{height: 60, width: 60, borderRadius: 30}}/>
                <div style={{flexDirection:'row', display:'flex',}}>
                    <h6 style={{fontWeight: '600'}}>{tenant.firstName}</h6>
                    <h6 style={{fontWeight: '500', marginLeft: 20}}>{tenant.gender}</h6>
                    <h6 style={{fontWeight: '500', marginLeft: 20}}>{getAge(tenant.dob)}</h6>
                </div>
            </div>
           
            <div>
                <h6 style={{fontWeight:'600'}}>Sublease location:</h6>
                <p>{prop.loc.streetAddr}</p>
            </div>
            
            <div>
                <h6 style={{fontWeight:'600'}}>Availability:</h6>
                <p>{new Date(prop.availableFrom).toLocaleString().split(",")[0] + " - " + new Date(prop.availableTo).toLocaleString().split(",")[0]}</p>
            </div>

            <div>
                <h6 style={{fontWeight:'600'}}>Description:</h6>
                <p>{ prop.description}</p>
            </div>  

            <div style={{flexDirection:'row', display: 'flex', borderRadius:10, overflow:'scroll' }}>
                {
                    prop.imgList.map((item, index)=> {
                        return(
                            <img key={item + index + tenant._id} src={item} style={{marginLeft: index == 0 ? 0 : 20,  width:300, borderRadius: 10, objectFit:'cover'}}/>
                        )
                    })
                }  
            </div>
            <div style={{paddingTop: 20, opacity: showPhoneNum ? 1 : 0 }}>
                <p>Phone Number: <a onClick={()=>alert("messaged")}>{phoneNum}</a></p>
            </div>

           
            <div style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', display:'flex', marginTop: 20, marginBottom: 10}}>
                <Button onClick={()=> setShowPhoneNum(true)} style={{backgroundColor:'#2D6674'}} variant="contained">
                    Show Phone Number
                </Button>
                <h5 style={{fontWeight: '600'}}>${prop.price} <span style={{fontWeight:'500', fontSize:15, color: '#333333'}}> /month</span></h5>
            </div>
             


        </div>
    )
}