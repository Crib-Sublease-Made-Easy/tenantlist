import { useEffect, useState } from "react";
import { Modal, TextField, Select, MenuItem, InputLabel, FormControl} from "@mui/material";
import Button from '@mui/material/Button';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';



import dayjs, { Dayjs } from "dayjs";
import { PRIMARYCOLOR } from "../sharedUtils";


export default function TennatCard(props) {
    const [mobile, setMobile] = useState(null)

    function getDeviceWidth(){
        let width = window.innerWidth
        setMobile(width < 400)
    }

    useEffect(()=> {
        getDeviceWidth()
        getSubleaseArea()
    }, [])

    // const tenant = props.data.userInfo
    const tenantData = props.data.userInfo
    const propData = props.data.propertyInfo

    const [subleaseArea, setSubleaseArea] = useState('')
   
    // const [prop, setProp] = useState(null)
    const [showPhoneNum, setShowPhoneNum] = useState(false)

    //Phone Number Modal
    const [open, setOpen] = useState(false);
    const [requestAvailabilityModalVis, setRequestAvailabilityModalVis] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //The person who is looking at the website
    const [subtenantGender, setSubtenantGender] = useState(null)
    const [subtenantName, setSubtenantName] = useState("")
    const [subtenantDescription, setSubtenantDescription] = useState("")
    const [subtenantAge, setSubtenantAge] = useState("")
    const [subtenantPhoneNumber, setSubtenantPhoneNumber] = useState("")
    const [subtenantStartDate, setSubtenantStartDate] = useState(null)
    const [subtenantEndDate, setSubtenantEndDate] = useState(null)
    const [subtenantBudget, setSubtenantBudget] = useState(0)

    //Crib Connect User Modal
    const [cribConnectUserModal, setCribConnectUserModal] = useState(false)
    
    function loadSubtenantInfo(){
        let sn = localStorage.getItem("subtenantName")
        let sp = localStorage.getItem("subtenantPhoneNumber")
        let sg = localStorage.getItem("subtenantGender")
        let ss = localStorage.getItem("subtenantStartDate")
        let se = localStorage.getItem("subtenantEndDate")
        let sb = localStorage.getItem("subtenantBudget")

        console.log(sn)
        if(sn != null){
          
            setSubtenantName(sn)
        }
        if(sp != null){
            setSubtenantPhoneNumber(sp)
        }
        if(sg != null){
            setSubtenantGender(sg)
        }
        if(ss != null){
            setSubtenantStartDate(ss)
        }
        if(se != null){
            setSubtenantEndDate(se)
        }
        if(sb != null){
            setSubtenantBudget(sb)
        }
    }

    // async function fetchPropData() {
    
    //     await fetch(`https://crib-llc.herokuapp.com/properties/${props.data._id}`, {method: "POST"})
    //     .then( async (res) => {
    //         return res.json()
    //     })
    //     .then ( data => { 
    //         setTenant(data.userInfo)
    //     })
    //     .catch( e => {
    //         console.log(props.data._id)
    //         console.log("Error")
    //     })
    // }

    function handleAvailModalVisOpen(){
        setRequestAvailabilityModalVis(true)
    }
    function handleAvailModalVisClose(){
        setRequestAvailabilityModalVis(false)
    }

    function getSubleaseArea(){
        let addr = propData.loc.secondaryTxt.toLowerCase().replaceAll(" ","")

        if(addr.indexOf("nj") != -1 || addr.indexOf("newjersey") != -1 || addr.indexOf("jerseycity") != -1){
            setSubleaseArea("New Jersey")
        }
        else if(addr.indexOf("queens") != -1){
            setSubleaseArea("Queens")
        }
        else if(addr.indexOf("brooklyn") != -1){
            setSubleaseArea("Brooklyn")
        }
        else{
            setSubleaseArea("Manhattan")
        }
    }

    function getAge(ms){
        return Math.floor(ms / (1000*60*60*24*365));
    }

    async function handlePhoneNumberPress(){
        if(tenantData.cribConnectUser == false){
            loadSubtenantInfo()
            handleAvailModalVisOpen()
            return
        }
        let pn = localStorage.getItem("subtenantPhoneNumber")
        let name = localStorage.getItem("subtenantName")

        if(pn == null){
            setOpen(true)
        }
        else if(name == null){
            setOpen(true)
        }
        else{

            addToContactList(name, pn)
            setCribConnectUserModal(true)
        }


    //     //Handle Press
    }

    async function addToContactList(name, phoneNumber) {
     
        await fetch('https://crib-llc.herokuapp.com/users/addContactedBy', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
            body: JSON.stringify({
                "name": name,
                "phoneNumber": phoneNumber,
                "postedById": tenantData._id
            })
        }).catch(e => {
            alert(e)
        })
    }

    function handlePhoneNumberSubmit(){       
        if(subtenantName.trim() == ""){
            alert("Name cannot be empty")
            return;
        }
        if(subtenantPhoneNumber.trim() == ""){
            alert("Phone Number cannot be empty")
            return;
        }

        

        localStorage.setItem("subtenantPhoneNumber", subtenantPhoneNumber)
        localStorage.setItem("subtenantName", subtenantName)
        
        addToContactList(subtenantName, subtenantPhoneNumber)
        //call api to document contacted by 
        setOpen(false)
        setCribConnectUserModal(true)
    }
    
    async function handleRequestAvailFormSubmit(){
        // Check name, phone number, gender and sublease dates
        // Input Validation
        let spacelessName = subtenantName.replaceAll(" ","")
        if(subtenantName.trim() == "" || !/^[A-Za-z]*$/.test(spacelessName)){
            alert("Invalid name.")
            return
        }
        if(subtenantGender == null){
            alert("Invalid gender.")
            return
        }
        let startDate = new Date(dayjs(subtenantStartDate)).getTime()
        let endDate = new Date(dayjs(subtenantEndDate)).getTime()
        if(subtenantStartDate == null || subtenantEndDate == null){
            alert("Invalid date.")
            return
        }
        if(endDate < startDate){
            alert("Sublease end date has to be later than start date.")
            return
        }
        if(startDate < new Date().getTime()){
            alert("Sublease start has to be later than today.")
            return
        }
        if(subtenantBudget == 0){
            alert("Please enter a valid budget.")
            return
        }
        
        //Add to contacts
        addToContactList()

        //Send message to the tenant
        sendMessageToTenant()

        //Close request modal
       
    }


    async function sendMessageToTenant(){
        localStorage.setItem("subtenantName", subtenantName)
        localStorage.setItem("subtenantPhoneNumber", subtenantPhoneNumber)
        localStorage.setItem("subtenantGender", subtenantGender)
        localStorage.setItem("subtenantStartDate", subtenantStartDate)
        localStorage.setItem("subtenantEndDate", subtenantEndDate)
        localStorage.setItem("subtenantBudget", subtenantBudget)
        // console.log(subtenantPhoneNumber)
        // console.log( subtenantGender)
        // console.log( new Date(dayjs(subtenantStartDate)).getTime())
        // console.log(subtenantBudget)
        // console.log( new Date(dayjs(subtenantEndDate)).getTime())
        // console.log(tenantData._id)
        await fetch('https://crib-llc.herokuapp.com/web/sendSubtenantInterest', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
            body: JSON.stringify({
                "subtenantName": subtenantName,
                "subtenantPhoneNumber": subtenantPhoneNumber,
                "subtenantGender": subtenantGender,
                "subtenantSubleaseStart": dayjs(subtenantStartDate),
                "subtenantSubleaseEnd": dayjs(subtenantEndDate),
                "subtenantBudget": subtenantBudget,
                "tenantID": tenantData._id
            })
        })
        .then(res => {
            if(res.status == 200){
                alert("Message successfully sent!")
            }
        })
        .catch(e => {
            alert(e)
        })

        setRequestAvailabilityModalVis(false)
    }

    
    return(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        
        <div   style={{ borderColor: '#ABABAB',  borderRadius: 10, height: mobile ? 'auto' : '40vh', width: mobile ? '100vw' : '48vw', marginTop: props.index == 0 ? 0 :  '5vh', flexDirection:  mobile ? 'column' : 'row', display:'flex', backgroundColor:'white',}}>
        
            <>
            <div style={{flexDirection:'row', display: 'flex', overflow:'scroll', height:'40vh', width: mobile ? '98vw' : '42vh', borderRadius:10, position:'relative', marginLeft:'auto', marginRight:'auto'}}>
                <Button onClick={()=>props.mapScrollToPin()} size="small" variant="contained" style={{position:'absolute', bottom: 10, left: 10, backgroundColor:'white', color: PRIMARYCOLOR, display: mobile ? 'none' : 'block'}}>
                    Show in map
                </Button>
                <Button size="small" variant="contained" style={{position:'absolute', bottom: 10, right: 10, backgroundColor:PRIMARYCOLOR, color: 'white', textTransform:'none', fontWeight:'500'}}>
                    {propData.type}
                </Button>
                {
                    propData.imgList.map((item, index)=> {
                        return(
                            <img key={item + index + item._id} src={item} style={{width: mobile ? '95vw' : '40vh',  }}/>
                        )
                    })
                }  
                
            </div>
            <div style={{display:'flex',paddingLeft: 15, paddingRight: 15, flexDirection:'column', position:'relative', justifyContent:'space-between', paddingTop: mobile ? '2vh' : 0, flex: 1 }}>
                <div>
                    <p style={{fontSize: '1rem', fontWeight:'600',}}>{propData.loc.streetAddr}, {subleaseArea}</p>

                    <div style={{flexDirection: 'row', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap'}}>
                        <p style={{fontSize: '1rem', fontWeight:'500', color:'#333333'}}>{new Date(propData.availableFrom).getTime() < new Date().getTime() ? "Now" : new Date(propData.availableFrom).toLocaleString().split(",")[0]} - {new Date(propData.availableTo).toLocaleString().split(",")[0]}</p>
                        {/* <p style={{fontSize: '1rem', fontWeight:'600'}}>{propData.type}</p> */}
                    </div>
                    {/* <p style={{fontSize: '1rem', fontWeight:'600'}}>{propData.loc.streetAddr}</p> */}
                </div>
                {/* <div style={{opacity: showPhoneNum ? 1 : 0 }}>
                    <p>Send {tenantData.firstName.split(" ")[0]} a message: <a href={`tel:+1${tenantData.phoneNumber}`}>+1{tenantData.phoneNumber}</a></p>
                </div> */}
                <div style={{ flexDirection:'row', display:'flex', justifyContent:'space-between', width:'100%' }}>
                        <h5 style={{fontWeight: '600'}}>${propData.price} <span style={{fontWeight:'500', fontSize:15, color: '#333333'}}> /month</span></h5>
                    
                        <Button onClick={handlePhoneNumberPress} style={{backgroundColor:'#2D6674', }} variant="contained">
                        {tenantData.cribConnectUser ?
                        "Message"
                        :
                        "Request"
                            }
                        </Button>
                    
                </div>
            </div>
                
                {/* <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom: 20}}>
                    <img  key={tenantData._id + "profilepic"} src={tenantData.profilePic} style={{height: 60, width: 60, borderRadius: 30}}/>
                    <div style={{flexDirection:'row', display:'flex',}}>
                        <h6 style={{fontWeight: '600'}}>{tenantData.firstName}</h6>
                        <h6 style={{fontWeight: '500', marginLeft: 20}}>{tenantData.gender}</h6>
                        <h6 style={{fontWeight: '500', marginLeft: 20}}>{getAge(tenantData.dob)}</h6>
                    </div>
                </div>
                
                    
                
                <div>
                    <h6 style={{fontWeight:'600'}}>Sublease location:</h6>
                    <p>{propData.loc.streetAddr}<br/>{propData.loc.secondaryTxt}</p>
                
                </div> 
                
                
                <div>
                    <h6 style={{fontWeight:'600'}}>Availability:</h6>
                    <p>{new Date(propData.availableFrom).toLocaleString().split(",")[0] + " - " + new Date(propData.availableTo).toLocaleString().split(",")[0]}</p>
                </div>
                
                <div>
                    <h6 style={{fontWeight:'600'}}>Description:</h6>
                    <p style={{height: 150, overflow:'scroll'}}>{propData.description}</p>
                </div>  
            
                <div style={{flexDirection:'row', display: 'flex', borderRadius:10, overflow:'scroll' }}>
                    {
                        propData.imgList.map((item, index)=> {
                            return(
                                <img key={item + index + item._id} src={item} style={{marginLeft: index == 0 ? 0 : 20,  width:300, borderRadius: 10, objectFit:'cover'}}/>
                            )
                        })
                    }  
                    
                    <img key={propData.imgList[0] + "propimage"} src={propData.imgList[0]} style={{marginLeft: 0,  width:'100%', borderRadius: 10, objectFit:'cover'}}/>
                        
                </div>  
                
                

            
                <div style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', display:'flex', marginTop: 20, marginBottom: 10}}>
                    <Button onClick={handlePhoneNumberPress} style={{backgroundColor:'#2D6674'}} variant="contained">
                    {tenantData.cribConnectUser ?
                    "Show contact info"
                    :
                    "Request availability"
                        }
                    </Button>
                    <h5 style={{fontWeight: '600'}}>${propData.price} <span style={{fontWeight:'500', fontSize:15, color: '#333333'}}> /month</span></h5>
                </div> */}

                <Modal 
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    display: 'flex',
                }}
                >
                    <div style={{width: '90vw', height: 'auto', backgroundColor:'white', alignSelf:'center', maxWidth: 400, borderRadius:20, padding: 20, position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',}}>
                        <h4 style={{fontWeight:'700'}}>Enter your phone number</h4>
                        <p>We will keep you updated when new subleases around the area is posted.</p>
                        <div style={{marginTop: 20}}>
                            <TextField onChange={(val)=>setSubtenantName(val.target.value)} fullWidth label="Name" variant="outlined"/>
                            <TextField onChange={(val)=>setSubtenantPhoneNumber(val.target.value)} type="number" fullWidth label="Phone number" variant="outlined" style={{marginTop: 15}}/>
                            <small>* Enter a US phone number if possible<br/>* Only enter digits, no dashes(-) or spaces( )</small>
                            {/* <div style={{marginTop:40}}>
                                <p style={{fontWeight:'500'}}>{tenantData.firstName.split(" ")[0]} might be out of the country.</p>
                                <small>Let {tenantData.firstName.split(" ")[0]} know how to reach you! Such as email, instagram and whatsapp...</small>
                                <TextField multiline onChange={(val)=>setSubtenantDescription(val.target.value)} inputProps={{maxLength:50}} label={`Enter description`} fullWidth variant="outlined" style={{marginTop:10}}/>
                            </div> */}

                        </div>
                        
                        <Button onClick={handlePhoneNumberSubmit} style={{backgroundColor: '#2D6674', marginTop:20 }} variant="contained">Submit</Button>
                        
                    </div>
                </Modal>
                <Modal 
                open={requestAvailabilityModalVis}
                onClose={handleAvailModalVisClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    display: 'flex',
                }}
                >
                    <div style={{width: '90vw', height: '90vh', backgroundColor:'white', alignSelf:'center', maxWidth: 400, borderRadius:20, padding: 20, position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',}}>
                        <h4 style={{fontWeight:'700'}}>🔊 We will let tenant know</h4>
                        <p>Please answer the questions below so tenant can contact you if there is a fit.</p>
                        <div style={{marginTop: 20}}>
                            <TextField value={subtenantName} onChange={(val)=>setSubtenantName(val.target.value)} fullWidth label="Name" variant="outlined"/>
                            <TextField value={subtenantPhoneNumber} onChange={(val)=>setSubtenantPhoneNumber(val.target.value)} type="number" fullWidth label="Phone number" variant="outlined" style={{marginTop: 15}}/>
                            <small>* Enter a US phone number if possible<br/>* Only enter digits, no dashes(-) or spaces( )</small>
                        </div>

                        <div  style={{marginTop: 20}}>
                            <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={subtenantGender}
                                label="Gender"
                                onChange={(val)=> setSubtenantGender(val.target.value)}
                            >
                                <MenuItem value={"Male"}>Male</MenuItem>
                                <MenuItem value={"Female"}>Female</MenuItem>
                                <MenuItem value={"Others"}>Others</MenuItem>
                            </Select>
                            </FormControl>
                        </div>
                        {/* <div  style={{marginTop: 20}}>
                            <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Age</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={subtenantAge}
                                label="Gender"
                                onChange={(val)=> setSubtenantGender(val.target.value)}
                            >
                                {returnAgeItems()}
                            </Select>
                            </FormControl>
                        </div> */}
                        <div style={{flexDirection:'row', display:'flex', marginTop:20, justifyContent:'space-between'}}>
                            <div style={{width: '45%'}}>
                                <DatePicker 
                                label="Request start"
                                value={ dayjs(subtenantStartDate)}
                                onChange={(event)=> setSubtenantStartDate(event)}
                                />
                            </div>
                            <div style={{width: '45%'}}>
                                <DatePicker 
                                label="Request end" 
                                onChange={(event)=> setSubtenantEndDate(event)}
                                value={dayjs(subtenantEndDate)}/>
                            </div>
                        </div>
                        <div style={{marginTop: 20}}>
                            <TextField 
                            value={subtenantBudget}
                            onChange={(val)=>setSubtenantBudget(val.target.value)} type='number' fullWidth label="Budget per month (USD)" variant="outlined"/>
                        </div>
                        <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                            <Button onClick={handleRequestAvailFormSubmit} style={{position:'absolute', bottom: 20, backgroundColor: '#2D6674', }} variant="contained">Submit</Button>
                            <small>* Please enter your monthly budget (only digits)<br/>* Bare in mind if budget is too low, tenants might not respond.</small>
                        </div>


                    </div>
                </Modal> 
                <Modal 
                open={cribConnectUserModal}
                onClose={() => setCribConnectUserModal(false)}
                aria-labelledby="CC-User-Info"
                aria-describedby="modal-modal-description"
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    display: 'flex',
                }}
                >
                    <div style={{width: mobile ? '90vw' : '25vw',  backgroundColor:'white', alignSelf:'center', borderRadius:20, padding: 20, position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',}}>
                        <h4 style={{fontWeight:'700'}}>Ask {tenantData.firstName.split(" ")[0]} more about the sublease!</h4>
                        <p style={{marginTop:40, fontWeight:'500'}}>Phone Number: <a href={`tel:+1${tenantData.phoneNumber}`}>+1{tenantData.phoneNumber}</a></p>
                        <p style={{fontWeight:'500'}}>Email: <a href={`mailto:${tenantData.email}}`}>{tenantData.email}</a></p>
                        {/* <div style={{marginTop: 20}}>
                            <TextField onChange={(val)=>setSubtenantName(val.target.value)} fullWidth label="Name" variant="outlined"/>
                            <TextField onChange={(val)=>setSubtenantPhoneNumber(val.target.value)} type="number" fullWidth label="Phone number" variant="outlined" style={{marginTop: 15}}/>
                            <small>* Enter a US phone number if possible<br/>* Only enter digits, no dashes(-) or spaces( )</small>
                        </div> */}
                        <div style={{display:'flex', flexDirection: mobile ? 'column' : 'row', justifyContent:'space-between', alignItems:'center', marginTop:40}}>
                            <Button style={{backgroundColor: PRIMARYCOLOR, color:'white' }} variant="contained"><a style={{color:'white', textDecorationLine:'none'}} href="https://subtenant-form.herokuapp.com">Get notified for new subleases?</a></Button>
                        </div>


                    </div>
                </Modal>
                
            </>

        </div>
    </LocalizationProvider>
    )
}
