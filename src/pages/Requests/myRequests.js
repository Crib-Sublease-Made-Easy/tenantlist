// import { Button } from "@mui/material";
// import { useContext, useEffect, useState } from "react";
// import { Col, Row } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { EXTRALIGHT, LIGHTGREY, MEDIUMGREY, OPENSANS, PRIMARYCOLOR } from "../../sharedUtils";
// import { UserContext } from "../../UserContext";
// import RequestCards from "./requestCards";
// import RequestReceivedCards from "./requestReceivedCard";



// const HOWITWORKS =
// [{"Accept or deny sublease requests":"Once tenant receive a request, they have 48 hours to accept or reject a sublease based on their preference and criteria. "},
//  {"Sign sublease contract": "Once tenant accepts a sublease request, we will send both parties a sublease contract which has to be signed within 24 hours."},
//  {"Rent payment and move in procedure": "Once sublease contract is signed and security deposit is received by Crib. We will provide you subtenant’s contact info to discuss move-in procedure."},
//  {"Transfer security deposit to tenant": "Security deposit will be transferred to tenant after both parties have confirmed successful move-in on sublease start date"}]

// const TEST = [1,1,1,1]
// export default function MyRequestsScreen(){
//     const navigate = useNavigate()
//     const {USERID, loggedIn, mobile} = useContext(UserContext)
//     const [index, setIndex] = useState(0)
//     const [requestsSent, setRequestsSent] = useState([])
//     const [requestsReceived, setRequestsReceived] = useState([])


//     useEffect(()=> {
//         getToken()
//     }, [])

//     async function getToken(){
//         let at = localStorage.getItem("refreshToken")
//         let uid = localStorage.getItem("uid")
//         if(at == null || at == undefined){
//             navigate("/")
//             return
//         }

//         await fetch('https://crib-llc.herokuapp.com/users/' + uid, {
//             method: 'GET',
//             headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + at,
//             }
//         }) 
//         .then(async  res => {
//             if(res.status == 200){
//                 let data = await res.json()
//                 if(data.postedProperties.length != 0){
//                     getRequestsReceived(data.postedProperties[0])
//                 }
//                 if(data.requestsSent.legnth != 0){
//                     getRequestsSent()
//                 }
                
//             }
//         })
//         .catch( e => console.log("In the get token"))
//     }

//     async function getRequestsReceived(propId){
//         console.log("The prop id", propId)
//         await fetch('https://crib-llc.herokuapp.com/properties/automate/getSubtenantRequests', {
//             method: 'POST',
//             headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//             },
//             body:JSON.stringify({
//                 "propId": propId
//             })
//         })
//         .then(async (res)=>{
//             if(res.status == 200){
//                 let data = await res.json()
//                 setRequestsReceived(data)
//                 console.log(data)
//             }
//             else{
//                 console.log(res.status)
//             }
//         })
//         .catch( e => console.log("Error"))
//     }

//     async function getRequestsSent(){
//         let at = localStorage.getItem("accessToken")
//         console.log(at)
//         if(at == null){
//             return
//         }
//         let uid = localStorage.getItem("uid")
      
//         await fetch('https://crib-llc.herokuapp.com/users/getRequestsSent', {
//             method: 'POST',
//             headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//             },
//             body:JSON.stringify({
//                 "userId": uid
//             })
//         })
//         .then(async (res)=>{
//             if(res.status == 200){
//                 let data = await res.json()
              
//                 setRequestsSent(data)
//             }
//             else{
//                 console.log(res.status)
//             }
//         })
//     }

//     return(
//         <div style={{width: '90vw', height:'90vh', marginLeft:'auto', marginRight:'auto', flexDirection:'row', display:'flex', }}>
//             <div style={{flex: 1, width:'45vw'}}>
//                 <div style={{height: '10vh', width:'100%',  alignItems:'center', display:'flex'}}>
//                     <p style={{marginBottom:0, fontSize:'1.2rem', fontWeight:'500'}}>My requests</p>
//                 </div>
               
//                 <Row style={{width: '100%',  rowGap:"5vh", columnGap:'auto', marginLeft: 'auto', marginRight:'auto' }}>
//                 {
//                     requestsReceived.map((item, index) => {
//                         if(item.subtenantInfo != null && item.subleaseInfo != null){
//                             return(
                           
//                                 <Col xs={12} sm={12} md={4} key={index + "requestCards"} style={{paddingLeft: 0 }}>
//                                     <RequestReceivedCards data={item} />
//                                 </Col>
//                             )
//                         }
//                         else{
//                             return null
//                         }
//                     })
//                 }
//                 </Row>
                
//             </div>
//             <div style={{flex: 1, width:'35vw', display:'flex', justifyContent:'space-between', flexDirection:'column'}}>
//                 <div style={{height: '10vh', width:'100%',  alignItems:'center', display:'flex'}}>
//                     <p style={{marginBottom:0, fontSize:'1.2rem', fontWeight:'500'}}>How does it work?</p>
//                 </div>
//                 <div>
//                 {HOWITWORKS.map((item, index) => {
//                     return(
//                         <div style={{flexDirection:'row', display:'flex', marginTop:'3vh'}}>
//                             <div style={{}}>
//                                 <p style={{marginBottom:0, fontWeight:'500', fontSize:'1.8rem'}}>{index+1}</p>
//                             </div>
//                             <div style={{marginLeft:'4vw'}}>
//                                 <p style={{marginBottom:0, fontWeight:'500', fontSize:'1.8rem'}}>{Object.keys(item)}</p>
//                                 <p style={{marginBottom:0, fontWeight:'400', fontSize:'1rem', color: MEDIUMGREY}}>{Object.values(item)}</p>
//                             </div>
//                         </div>
//                     )
//                 })}
//                 </div>
//                 <div style={{height: '20vh', width:'100%',  alignItems:'center', display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
//                     <p style={{marginBottom:0, fontSize:'1.2rem', fontWeight:'500'}}>Still have a question?</p>
//                     <Button variant="contained" style={{backgroundColor: 'black', textTransform:'none', height:'5vh', outline:'none'}}>
//                         <p style={{marginBottom:0, fontWeight:'500' }}>Contact us</p>
//                     </Button>
//                 </div>

//             </div>
//         </div>
//     )
// }

import { Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { EXTRALIGHT, LIGHTGREY, OPENSANS, PRIMARYCOLOR } from "../../sharedUtils";
import { UserContext } from "../../UserContext";
import RequestCards from "./requestCards";
import RequestReceivedCards from "./requestReceivedCard";

const TEST = [1,1,1,1]
export default function MyRequestsScreen(){
    const navigate = useNavigate()
    const {USERID, loggedIn, mobile} = useContext(UserContext)
    const [index, setIndex] = useState(0)
    const [requestsSent, setRequestsSent] = useState([])
    const [requestsReceived, setRequestsReceived] = useState([])


    useEffect(()=> {
        getToken()
    }, [])

    async function getToken(){
        let at = localStorage.getItem("refreshToken")
        let uid = localStorage.getItem("uid")
        if(at == null || at == undefined){
            navigate("/")
            return
        }

        await fetch('https://crib-llc.herokuapp.com/users/' + uid, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + at,
            }
        }) 
        .then(async  res => {
            if(res.status == 200){
                let data = await res.json()
                if(data.postedProperties.length != 0){
                    getRequestsReceived(data.postedProperties[0])
                }
                if(data.requestsSent.legnth != 0){
                    getRequestsSent()
                }
                
            }
        })
        .catch( e => console.log("In the get token"))
    }

    async function getRequestsReceived(propId){
        console.log("The prop id", propId)
        await fetch('https://crib-llc.herokuapp.com/properties/automate/getSubtenantRequests', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                "propId": propId
            })
        })
        .then(async (res)=>{
            if(res.status == 200){
                let data = await res.json()
                setRequestsReceived(data)
                console.log(data)
            }
            else{
                console.log(res.status)
            }
        })
        .catch( e => console.log("Error"))
    }

    async function getRequestsSent(){
        let at = localStorage.getItem("accessToken")
        console.log(at)
        if(at == null){
            return
        }
        let uid = localStorage.getItem("uid")
      
        await fetch('https://crib-llc.herokuapp.com/users/getRequestsSent', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                "userId": uid
            })
        })
        .then(async (res)=>{
            if(res.status == 200){
                let data = await res.json()
              
                setRequestsSent(data)
            }
            else{
                console.log(res.status)
            }
        })
    }

    return(
        <div style={{width: '90vw', height:'90vh', marginLeft:'auto', marginRight:'auto', flexDirection:'column', display:'flex', }}>
            {/* <div style={{width: '15%', flexDirection:'column', display:'flex', borderLeftWidth:'0.5px', borderLeftColor: EXTRALIGHT, borderLeftStyle:'solid'}}>
                <div style={{backgroundColor: index == 0 ? 'rgba(45, 102, 116, 0.2)' : 'white', borderBottomWidth: '0.5px', display:'flex', justifyContent:'center', alignItems:'center', paddingTop: '2vh', paddingBottom:'2vh', borderBottomColor: EXTRALIGHT, borderBottomStyle:'solid'}}>
                    <p style={{fontFamily:OPENSANS, marginBottom:0, fontWeight:'600', color: PRIMARYCOLOR, fontSize:'0.9rem'}}>Requests Received</p>
                </div>
                <div style={{backgroundColor: index == 1 ? 'rgba(45, 102, 116, 0.2)' : 'white', borderBottomWidth: '0.5px', display:'flex', justifyContent:'center', alignItems:'center', paddingTop: '2vh', paddingBottom:'2vh', borderBottomColor: EXTRALIGHT, borderBottomStyle:'solid'}}>
                    <p style={{fontFamily:OPENSANS, marginBottom:0, fontWeight:'600', color: PRIMARYCOLOR, fontSize:'0.9rem'}}>Requests Sent</p>
                </div>

            </div>
            <div style={{width: '85%', borderLeftWidth: '0.5px', borderLeftStyle:'solid', borderLeftColor: EXTRALIGHT, display:'flex', flex: 1, height:'100%'}}>

            </div> */}
        
            <div style={{height:'10vh', width:mobile ? '95vw' : '100%', flexDirection:'row', display:'flex', marginLeft:'auto', marginRight:'auto'}}>
                <Button onClick={()=> setIndex(0)} variant="contained" style={{textTransform:'none', backgroundColor: index == 0 ? PRIMARYCOLOR : 'white', color: 'white', display:'block', height:'5vh', fontFamily:OPENSANS, marginTop:'auto', marginBottom:'auto', color: index == 0 ?'white' : 'black', outline: 'none'}}>Requests received</Button>
                <Button onClick={()=> setIndex(1)} variant="contained" style={{textTransform:'none', backgroundColor: index == 1 ? PRIMARYCOLOR : 'white', color: 'white', display:'block', height:'5vh', fontFamily:OPENSANS, marginTop:'auto', marginBottom:'auto', color: index == 1 ? 'white' : 'black', outline:"none", marginLeft: '2vw'}}>Requests sent</Button>
            </div>
            {index == 0 ?
          
            <div style={{height:'80vh', width: mobile ? '95vw' :  '90vw', paddingTop:'2vh', marginLeft:'auto', marginRight:'auto' }}>
                <Row style={{width: mobile ? '95vw' : '90vw',  rowGap:"5vh", columnGap:'auto', marginLeft: 'auto', marginRight:'auto' }}>
                {
                    requestsReceived.map((item, index) => {
                        if(item.subtenantInfo != null && item.subleaseInfo != null){
                            return(
                           
                                <Col xs={12} sm={12} md={4} key={index + "requestCards"} style={{paddingLeft: 0 }}>
                                    <RequestReceivedCards data={item} />
                                </Col>
                            )
                        }
                        else{
                            return null
                        }
                       
                    })
                }
                </Row>

            </div>
         
            :
            <div style={{height:'80vh', width: mobile ? '95vw' :  '90vw', paddingTop:'2vh', marginLeft:'auto', marginRight:'auto' }}>
                <Row style={{width: mobile ? '95vw' : '90vw',  rowGap:"5vh", columnGap:'auto', marginLeft: 'auto', marginRight:'auto' }}>
                {
                    requestsSent.map((item, index) => {
                        console.log('fewfewfw', item)
                        if(item == undefined || item == null){
                            return null       
                        }
                        else{
                            return(
                           
                                <Col sm={12} md={3} key={index + "requestCards"}  style={{paddingLeft: 0 }}>
                                    <RequestCards data={item} />
                                </Col>
                            )
                        }
                        
                    })
                }
                </Row>

            </div>
            }


        </div>
    )
}