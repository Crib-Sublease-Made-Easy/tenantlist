import { useEffect, useState } from "react";
import { Modal, TextField} from "@mui/material";
import Button from '@mui/material/Button';


export default function TennatCard(props) {
    const tenant = props.data
    const [prop, setProp] = useState(null)
    const [phoneNum, setPhoneNum] = useState(props.data.phoneNumber)
    const [showPhoneNum, setShowPhoneNum] = useState(false)
    const [userPN, setUserPN] = useState(null)
    const [userName, setUserName] = useState(null)


    //Phone Number Modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    useState(()=>{
        fetchPropData()
    },[])

    async function fetchPropData() {
       
        await fetch(`https://crib-llc.herokuapp.com/properties/${props.data.postedProperties[0]}`, {method: "POST"})
        .then( async (res) => {
            return await res.json()
        })
        .then ( data => { 
            setProp(data.propertyInfo)
        })
    }
    function getAge(ms){
        return Math.floor(ms / (1000*60*60*24*365));
    }

    async function handlePhoneNumberPress(){
        let pn = localStorage.getItem("phoneNumber")
        let name = localStorage.getItem("name")

        if(pn == null){
            setShowPhoneNum(true)
            setOpen(true)
        }
        else if(name == null){
            setShowPhoneNum(true)
            setOpen(true)
        }
        else{
            addToContactList(name, pn)
            setShowPhoneNum(true)
        }


        //Handle Press
    }

    async function addToContactList(name, phoneNum) {
     
        await fetch('https://crib-llc.herokuapp.com/users/addContactedBy', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
            body: JSON.stringify({
                "name": name,
                "phoneNumber": phoneNum,
                "postedById": tenant._id
            })
        }).catch(e => {
            alert(e)
        })
    }

    function handlePhoneNumberSubmit(){
        if(userName.trim() == ""){
            alert("Name cannot be empty")
            return;
        }
        if(userPN.trim() == ""){
            alert("Phone Number cannot be empty")
            return;
        }

        localStorage.setItem("phoneNumber", userPN)
        localStorage.setItem("name", userName)
        
        addToContactList(userName, userPN)
        //call api to document contacted by 
        setOpen(false)
        setShowPhoneNum(true)
    }
    

    
    return(
       
        <div style={{padding: 15, borderColor: '#ABABAB', borderStyle:'solid', borderRadius: 10, overflow:'hidden', borderWidth:1}}>
        {prop != null &&
        <>
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
                <p>Send me a message: <a href={`tel:+1${phoneNum}`}>+1{phoneNum}</a></p>
            </div>

           
            <div style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', display:'flex', marginTop: 20, marginBottom: 10}}>
                <Button onClick={handlePhoneNumberPress} style={{backgroundColor:'#2D6674'}} variant="contained">
                    Show Phone Number
                </Button>
                <h5 style={{fontWeight: '600'}}>${prop.price} <span style={{fontWeight:'500', fontSize:15, color: '#333333'}}> /month</span></h5>
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
                position: 'relative'
            }}
            >
                <div style={{width: '90vw', height: '50vh', backgroundColor:'white', alignSelf:'center', maxWidth: 400, borderRadius:20, padding: 20}}>
                    <h4 style={{fontWeight:'700'}}>Enter your phone number</h4>
                    <p>We will keep you updated when new subleases around the area is posted.</p>
                    <div style={{marginTop: 20}}>
                        <TextField onChange={(val)=>setUserName(val.target.value)} fullWidth label="Name" variant="outlined"/>
                        <TextField onChange={(val)=>setUserPN(val.target.value)} type="number" fullWidth label="Phone number" variant="outlined" style={{marginTop: 15}}/>
                        <small>* Enter a US phone number if possible<br/>* Only enter digits, no dashes(-) or spaces( )</small>
                    </div>
                    
                    <Button onClick={handlePhoneNumberSubmit} style={{position:'absolute', bottom: 20, backgroundColor: '#2D6674', }} variant="contained">Submit</Button>
                    
                </div>
            </Modal>
            
        </>
        }
        
        </div>
    )
}