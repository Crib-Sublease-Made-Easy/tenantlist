import { useEffect, useState } from "react";
import { Modal, TextField, Select, MenuItem, InputLabel, FormControl} from "@mui/material";
import Button from '@mui/material/Button';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';



import dayjs, { Dayjs } from "dayjs";


export default function TennatCard(props) {

    // const tenant = props.data.userInfo
    const tenantData = props.data.userInfo
    const propData = props.data.propertyInfo
   
    // const [prop, setProp] = useState(null)
    const [showPhoneNum, setShowPhoneNum] = useState(false)
    const [userPN, setUserPN] = useState(null)
    const [userName, setUserName] = useState(null)


    //Phone Number Modal
    const [open, setOpen] = useState(false);
    const [requestAvailabilityModalVis, setRequestAvailabilityModalVis] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //The person who is looking at the website
    const [subtenantGender, setSubtenantGender] = useState(null)
    const [subtenantName, setSubtenantName] = useState("")
    const [subtenantAge, setSubtenantAge] = useState("")
    const [subtenantPhoneNumber, setSubtenantPhoneNumber] = useState("")
    const [subtenantStartDate, setSubtenantStartDate] = useState(null)
    const [subtenantEndDate, setSubtenantEndDate] = useState(null)
    const [subtenantBudget, setSubtenantBudget] = useState(0)
    
    useState(()=>{
        
    },[])

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
            setShowPhoneNum(true)
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
        setShowPhoneNum(true)
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
        
        <div style={{padding: 15, borderColor: '#ABABAB', borderStyle:'solid', borderRadius: 10, overflow:'hidden', borderWidth:1}}>
       
        <>
           
            <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom: 20}}>
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
            </div>  
            
            <div style={{paddingTop: 20, opacity: showPhoneNum ? 1 : 0 }}>
                <p>Send me a message: <a href={`tel:+1${tenantData.phoneNumber}`}>+1{tenantData.phoneNumber}</a></p>
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
            </div>

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
                <div style={{width: '90vw', height: '50vh', backgroundColor:'white', alignSelf:'center', maxWidth: 400, borderRadius:20, padding: 20, position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',}}>
                    <h4 style={{fontWeight:'700'}}>Enter your phone number</h4>
                    <p>We will keep you updated when new subleases around the area is posted.</p>
                    <div style={{marginTop: 20}}>
                        <TextField onChange={(val)=>setSubtenantName(val.target.value)} fullWidth label="Name" variant="outlined"/>
                        <TextField onChange={(val)=>setSubtenantPhoneNumber(val.target.value)} type="number" fullWidth label="Phone number" variant="outlined" style={{marginTop: 15}}/>
                        <small>* Enter a US phone number if possible<br/>* Only enter digits, no dashes(-) or spaces( )</small>
                    </div>
                    
                    <Button onClick={handlePhoneNumberSubmit} style={{position:'absolute', bottom: 20, backgroundColor: '#2D6674', }} variant="contained">Submit</Button>
                    
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
                <div style={{width: '90vw', height: '85vh', backgroundColor:'white', alignSelf:'center', maxWidth: 400, borderRadius:20, padding: 20, position: 'absolute',
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
            
        </>

        </div>
    </LocalizationProvider>
    )
}
