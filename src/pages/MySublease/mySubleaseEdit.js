import { useContext, useEffect, useRef } from "react"
import { useState } from "react"
import { AMENITIESLIST, EXTRALIGHT, GetIcon, LIGHTGREY, MEDIUMGREY, MEDIUMROUNDED, OPENSANS, PRIMARYCOLOR } from "../../sharedUtils"


//Icon
import BedIcon from '@mui/icons-material/Bed';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import WifiIcon from '@mui/icons-material/Wifi';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { UserContext } from "../../UserContext";
import { Button, Checkbox, Fade, FormControl, InputAdornment, InputLabel, MenuItem, Modal, Select, TextField, Tooltip } from "@mui/material";

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers"
import { useNavigate } from "react-router-dom";
import { ArrowBackIos } from "@mui/icons-material";


import Lottie from "lottie-react";
import WhiteLoadingAnimation from '../../whiteLoading.json'

export default function MySubleaseEditScreen(){
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const {mobile} = useContext(UserContext)
    const [userData, setUserData] = useState(null)
    const [propData, setPropData] = useState(null)
    const [editModalVis, setEditModalVis] = useState(false)
    const [editItem, setEditItem] = useState("")

    const [subleaseType, setSubleaseType] = useState(null)
    const [subleasePrice, setSubleasePrice] = useState(null)
    const [subleaseSecurityDeposit, setSubleaseSecurityDeposit] = useState(null)
    const [subleaseStart, setSubleaseStart] = useState(null)
    const [subleaseEnd, setSubleaseEnd] = useState(null)
    const [subleaseDescription, setSubleaseDescription] = useState(null)
    const [subleaseAmenities, setSubleaseAmenities] = useState([])

    const [subleaseBedroomURL, setSubleaseBedroomURL] = useState(null)
    const [subleaseBathroomURL, setSubleaseBathroomURL] = useState(null)
    const [subleaseKitchenURL, setSubleaseKitchenURL] = useState(null)
    const [subleaseLivingroomURL, setSubleaseLivingroomURL] = useState(null)
    const [subleaseFloorplanURL, setSubleaseFloorplanURL] = useState(null)

    const subleaseBedroomRef = useRef()
    const subleaseBathroomRef = useRef()
    const subleaseKitchenRef = useRef()
    const subleaseLivingroomRef = useRef()
    const subleaseFloorplanRef = useRef()

    const imageListRef = useRef()



    //Delete property modal
    const [deletePropertyModalVis, setDeletePropertyModalVis] = useState(false)
    const [deleteModalPage, setDeleteModalPage] = useState(0)
    const [feedback, setFeedback] = useState("")



    useEffect(()=>{
        getUserData()
    }, [])

    
    async function getUserData(){
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
                console.log(data)
                setPropData(data.propertyInfo)
                setSubleaseType(data.propertyInfo.type)
                setSubleasePrice(data.propertyInfo.price)
                setSubleaseSecurityDeposit(data.propertyInfo.securityDeposit)
                setSubleaseDescription(data.propertyInfo.description)
                setSubleaseStart(data.propertyInfo.availableFrom)
                setSubleaseEnd(data.propertyInfo.availableTo)
                setSubleaseAmenities(data.propertyInfo.amenities)
                setSubleaseBedroomURL(data.propertyInfo.imgList[0])
                setSubleaseBathroomURL(data.propertyInfo.imgList[1])
                setSubleaseKitchenURL(data.propertyInfo.imgList[2])
                setSubleaseLivingroomURL(data.propertyInfo.imgList[3])
                if(data.propertyInfo.imgList.length == 5){
                    setSubleaseFloorplanURL(data.propertyInfo.imgList[4])
                }
               
            }
        })
    }

    function handleModalCloseWithoutSaving(){
        if(editItem == "Type"){
            setSubleaseType(propData.type)
        }
        else if(editItem == "Price"){
            setSubleasePrice(propData.price)
        }
        else if(editItem == "Description"){
            setSubleaseDescription(propData.description)
        }
        else if(editItem == "Availability"){
            setSubleaseStart(propData.availableFrom)
            setSubleaseEnd(propData.availableTo)
        }
        else if(editItem == "Amenities"){
            setSubleaseAmenities(propData.amenities)
        }
        setEditModalVis(false)
    }

    async function update(item){
       
        const accessToken = localStorage.getItem("accessToken");
        if(accessToken == null){
            alert("Please sign in to edit property")
            navigate("/login")
            return
        }
        let toChange = {}
        if(item == "Type"){
            toChange = {"type": subleaseType}
        }
        else if(item == "Price"){
            toChange = {"price" : subleasePrice, "securityDeposit": subleaseSecurityDeposit}
        }
        else if(item == "Availability"){
            toChange ={"availableFrom": new Date(subleaseStart), "availableTo": new Date(subleaseEnd)}
        }
        else if(item == "Description"){
            toChange ={"description": subleaseDescription}
        }
        else if(item == "Amenities"){
            toChange ={"amenities": subleaseAmenities}
        }
        
        fetch('https://crib-llc.herokuapp.com/properties/' + propData._id, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            },
            body: JSON.stringify(toChange)
        })
            .then((res) => {
                if(res.status == 200){
                    setEditModalVis(false)
                    navigate("/mySubleaseEdit")

                }
                else{
                    alert("Error occured. Please try again later!")
                }
            })
            .catch(e => {
                console.log(e)
            })
    }

    function handleEditClick(item){
        setEditModalVis(true)
        setEditItem(item)
    }

    async function handleImageChange(event, pic){



        const fileUploaded = event.target.files[0];
        
        const url = URL.createObjectURL(fileUploaded)
        // setProfImg(url)
        // setProfileImage(fileUploaded)
        if(pic == "Bedroom"){
           SelectPropPic(url, fileUploaded, 0)
           
        }
        else if(pic == "Bathroom"){
            SelectPropPic(URL.createObjectURL(fileUploaded), fileUploaded, 1)
           
        }
        else if(pic == "Kitchen"){
            SelectPropPic(url, fileUploaded, 2)
           
        }
        else if(pic == "Livingroom"){
            SelectPropPic(url, fileUploaded, 3)
       
        }
        else if(pic == "Floorplan"){
            SelectPropPic(url, fileUploaded, 4)
        }

    }

    async function SelectPropPic(url, file, index){
       
        const accessToken = localStorage.getItem("accessToken");
      
      
            const formData = new FormData();

           
            formData.append("propertyImage" , file); 
            formData.append("changeIdx", index);
           
           
            fetch('https://crib-llc.herokuapp.com/properties/propertyImages/' + propData._id, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                   
                    'Authorization': 'Bearer ' + accessToken,
                },
                body: formData
            })
            .then(res => {
                if(res.status == 200){
                    if(index == 0){

                        setSubleaseBedroomURL(url)
                    }
                    else if(index == 1 ){
                        setSubleaseBathroomURL(url)
                    }
                    else if(index == 2 ){
                        setSubleaseKitchenURL(url)
                    }
                    else if(index == 3){
                        setSubleaseLivingroomURL(url)
                    }
                    else if(index == 4 ){
                        setSubleaseFloorplanURL(url)
                    }
                }
                else{
                    alert("Error occured. Please try again later.")
                    navigate("/")
                }
            })
            .catch((error) => {
                console.log(error)
            });
       
        
        
    }   

    async function deleteProperty(success){
        setLoading(true)
        let at = localStorage.getItem("accessToken")
        await fetch('https://crib-llc.herokuapp.com/properties/internal/subleasedwithcomments', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' +at,
            },
            body:JSON.stringify({
                propId: propData._id,
                success: success,
                comments: feedback,
            })
        })
        .catch((error) => {
            alert("errpr")
            console.log("ERROR in registered sublease")
        });

        let UID = localStorage.getItem("uid")

        if(UID != null){
            await fetch('https://crib-llc.herokuapp.com/users/' + UID, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + at,
                },
                body: JSON.stringify({
                    cribConnectSubtenants: []
                })
            }).then((res) => {
            })
            .catch((error) => {
    
            });
        }
        
        await fetch('https://crib-llc.herokuapp.com/properties/' + propData._id, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' +at,
            }
        }).then(async res => {
           
            if(res.status == 200){
                setTimeout(()=>{
                    setLoading(false)
                    navigate("/mySublease")
                },2000)
            }
            else{
                alert('Unable to delete this property. Please try again later.')
            }
            
        })
        .catch((error) => {

        });
    }

    function updateAmenities(name) {
        if (subleaseAmenities.indexOf(name) != -1) {
            let tempindex = subleaseAmenities.indexOf(name);
            setSubleaseAmenities([...subleaseAmenities.slice(0, tempindex), ...subleaseAmenities.slice(tempindex + 1, subleaseAmenities.length)])
        }
        else {
            setSubleaseAmenities(prev => [...prev, name]);
        }
    }

    function handleNav(route){
        navigate(route)
    }

    return(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div style={{height:'90vh', width: mobile ? '100vw' : '90vw', display:'flex', flexDirection: mobile ? 'column' : 'row', marginLeft:"auto", marginRight:'auto', overflow:'scroll', paddingLeft: mobile && '5vw', }}>
            { propData != null && userData != null &&
            <>
                <div style={{flexDirection: mobile ? 'row' : 'column', display:'flex', width: mobile ? "90vw" : "20vw", paddingTop: mobile ? '2vh' : '5vh', justifyContent:'space-between', paddingBottom:  '5vh', alignItems: mobile && 'center  '}}>
                    <div onClick={()=>handleNav("/mySublease")} style={{flexDirection:'row', display:'flex', alignItems:'center', cursor:'pointer'}}>
                        <ArrowBackIcon style={{color:'black', fontSize:'1.2rem'}} />   
                        <p style={{marginBottom:0, color:'black', fontFamily: OPENSANS, fontWeight:'600', marginLeft:'1vw', fontSize:'0.9rem'}}>Back to listing</p>
                    </div>  
                    <Button onClick={()=> setDeletePropertyModalVis(true)} style={{outline:'none', backgroundColor:'black', marginTop: mobile ? 0 : '5vh', textTransform:"none"}}>
                        <p style={{marginBottom:0, color:'white', fontFamily: OPENSANS, fontWeight:'500'}}>Delete listing</p>
                    </Button>
                    
                </div>
                <div style={{flexDirection:'column', display:'flex', width: mobile ? '90vw' :  "70vw", paddingTop: mobile ? 0 : '5vh', paddingLeft: mobile ? 0 : '5vw'}}>
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                        <ul ref={imageListRef} style={{paddingLeft:0, flexDirection:'row', display:'flex', width: mobile ? '90vw' : '62vw',  overflow:'scroll'}}>
                        
                        <div key={subleaseBedroomURL} style={{position:'relative', height: mobile ? '90vw' : '20vw', width: mobile ? '90vw' : '20vw', borderRadius: MEDIUMROUNDED, borderWidth:'0.5px', position:'relative',}}>        
                            <img src={subleaseBedroomURL} style={{height: mobile ? '90vw' : '20vw', width: mobile ? '90vw' : '20vw', borderRadius: MEDIUMROUNDED, objectFit:'cover' }} />
                            <div onClick={()=> subleaseBedroomRef.current.click()} style={{position:'absolute', bottom: '2vh', right: '2vh', backgroundColor:'white', borderRadius:100, padding: '0.5vh', cursor:'pointer'}}>
                                <EditNoteIcon style={{color: MEDIUMGREY, fontSize:'1.5rem'}} />
                            </div>
                        </div>
                        <div key={subleaseBathroomURL} style={{position:'relative', height: mobile ? '90vw' : '20vw', width: mobile ? '90vw' : '20vw',borderRadius: MEDIUMROUNDED, borderWidth:'0.5px', position:'relative', marginLeft:'2vw'}}>        
                            <img src={subleaseBathroomURL} style={{height: mobile ? '90vw' : '20vw', width: mobile ? '90vw' : '20vw', borderRadius: MEDIUMROUNDED, objectFit:'cover' }} />
                            <div onClick={()=> subleaseBathroomRef.current.click()} style={{position:'absolute', bottom: '2vh', right: '2vh', backgroundColor:'white', borderRadius:100, padding: '0.5vh', cursor:'pointer'}}>
                                <EditNoteIcon style={{color: MEDIUMGREY, fontSize:'1.5rem'}} />
                            </div>
                        </div>
                        <div key={subleaseKitchenURL} style={{position:'relative', height: mobile ? '90vw' : '20vw', width: mobile ? '90vw' : '20vw',borderRadius: MEDIUMROUNDED, borderWidth:'0.5px', position:'relative', marginLeft:'2vw'}}>        
                            <img src={subleaseKitchenURL} style={{height: mobile ? '90vw' : '20vw', width: mobile ? '90vw' : '20vw',borderRadius: MEDIUMROUNDED, objectFit:'cover' }} />
                            <div onClick={()=> subleaseKitchenRef.current.click()} style={{position:'absolute', bottom: '2vh', right: '2vh', backgroundColor:'white', borderRadius:100, padding: '0.5vh', cursor:'pointer'}}>
                                <EditNoteIcon style={{color: MEDIUMGREY, fontSize:'1.5rem'}} />
                            </div>
                        </div>
                        <div key={subleaseLivingroomURL} style={{position:'relative', height: mobile ? '90vw' : '20vw', width: mobile ? '90vw' : '20vw', borderRadius: MEDIUMROUNDED, borderWidth:'0.5px', position:'relative', marginLeft:'2vw'}}>        
                            <img src={subleaseLivingroomURL} style={{height: mobile ? '90vw' : '20vw', width: mobile ? '90vw' : '20vw',borderRadius: MEDIUMROUNDED, objectFit:'cover' }} />
                            <div onClick={()=> subleaseLivingroomRef.current.click()} style={{position:'absolute', bottom: '2vh', right: '2vh', backgroundColor:'white', borderRadius:100, padding: '0.5vh', cursor:'pointer'}}>
                                <EditNoteIcon style={{color: MEDIUMGREY, fontSize:'1.5rem'}} />
                            </div>
                        </div>
                        <div key={subleaseFloorplanURL == null ? 'livingroomImage' :subleaseFloorplanURL } style={{position:'relative', height: mobile ? '90vw' : '20vw', width: mobile ? '90vw' : '20vw',borderRadius: MEDIUMROUNDED, borderWidth:'0.5px', position:'relative', marginLeft:'2vw'}}>        
                            <img src={subleaseLivingroomURL == null ? null : subleaseFloorplanURL} style={{height: mobile ? '90vw' : '20vw', width: mobile ? '90vw' : '20vw', borderRadius: MEDIUMROUNDED, backgroundColor: EXTRALIGHT  }} />
                            <div onClick={()=> subleaseFloorplanRef.current.click()} style={{position:'absolute', bottom: '2vh', right: '2vh', backgroundColor:'white', borderRadius:100, padding: '0.5vh', cursor:'pointer'}}>
                                <EditNoteIcon style={{color: MEDIUMGREY, fontSize:'1.5rem'}} />
                            </div>
                        </div>
                        </ul>
                        <input onChange={(event)=>handleImageChange(event, "Bedroom")}  ref={subleaseBedroomRef} type="file" accept="image/*" style={{display: 'none'}} />
                        <input onChange={(event)=>handleImageChange(event, "Bathroom")}  ref={subleaseBathroomRef} type="file" accept="image/*" style={{display: 'none'}} />
                        <input onChange={(event)=>handleImageChange(event, "Kitchen")}  ref={subleaseKitchenRef} type="file" accept="image/*" style={{display: 'none'}} />
                        <input onChange={(event)=>handleImageChange(event, "Livingroom")}  ref={subleaseLivingroomRef} type="file" accept="image/*" style={{display: 'none'}} />
                        <input onChange={(event)=>handleImageChange(event, "Floorplan")}  ref={subleaseFloorplanRef} type="file" accept="image/*" style={{display: 'none'}} />
                    </div>
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                        <div style={{width: mobile ? '90vw' : '40vw', paddingBottom: '5vh'}}>
                            <div>
                                <div style={{display:'flex', flexDirection:'row', marginBottom:5, alignItems:'center', justifyContent:'space-between' }}>
                                    <p style={{fontFamily: OPENSANS, fontWeight:'600', fontSize:'1rem', marginBottom:0}}>Type</p>
                                    {/* <EditNoteIcon onClick={()=>handleEditClick("Type")} style={{fontSize:'1.5rem', color: MEDIUMGREY, marginLeft:"2vw", cursor:'pointer'}} /> */}
                                    <p onClick={()=>handleEditClick("Type")}  style={{marginBottom:0, fontWeight:'600', fontFamily:OPENSANS, fontSize:'0.8rem', textDecorationLine:"underline", color:MEDIUMGREY, cursor:'pointer'}}>Edit</p>
                               </div>
                                <p style={{fontFamily: OPENSANS, fontWeight:'400', fontSize:'0.9rem', marginBottom:0, color:'#737373'}}>{subleaseType}</p>
                            </div>
                            <div style={{marginTop:'3vh',}}>
                                <div style={{display:'flex', flexDirection:'row', marginBottom:5, alignItems:'center', justifyContent:'space-between' }}>
                                    <p style={{fontFamily: OPENSANS, fontWeight:'600', fontSize:'1rem', marginBottom:0}}>Price</p>
                                    <p onClick={()=>handleEditClick("Price")}  style={{marginBottom:0, fontWeight:'600', fontFamily:OPENSANS, fontSize:'0.8rem', textDecorationLine:"underline", color:MEDIUMGREY, cursor:'pointer'}}>Edit</p>
                                </div>
                                    <p style={{fontFamily: OPENSANS, fontWeight:'400', fontSize:'0.9rem', marginBottom:0, color:'#737373'}}>${subleasePrice}</p>
                                
                            </div>
                            <div style={{marginTop:'3vh',}}>
                                <div style={{display:'flex', flexDirection:'row', marginBottom:5, alignItems:'center', justifyContent:'space-between' }}>
                                    <p style={{fontFamily: OPENSANS, fontWeight:'600', fontSize:'1rem', marginBottom:0}}>Availability</p>
                                    <p onClick={()=>handleEditClick("Availability")}  style={{marginBottom:0, fontWeight:'600', fontFamily:OPENSANS, fontSize:'0.8rem', textDecorationLine:"underline", color:MEDIUMGREY, cursor:'pointer'}}>Edit</p>
                                </div>
                                <p style={{fontFamily: OPENSANS, fontWeight:'400', fontSize:'0.9rem', marginBottom:0, color:'#737373'}}>{new Date(subleaseStart).getTime() < new Date().getTime() ? "Now" : new Date(subleaseStart).toLocaleString().split(",")[0]} - {new Date(subleaseEnd).toLocaleString().split(",")[0]}</p>
                            </div>
                            <div style={{marginTop:'3vh',}}>
                                <div style={{display:'flex', flexDirection:'row', marginBottom:5, alignItems:'center', justifyContent:'space-between' }}>
                                    <p style={{fontFamily: OPENSANS, fontWeight:'600', fontSize:'1rem', marginBottom:0}}>Description</p>
                                    <p onClick={()=>handleEditClick("Description")}  style={{marginBottom:0, fontWeight:'600', fontFamily:OPENSANS, fontSize:'0.8rem', textDecorationLine:"underline", color:MEDIUMGREY, cursor:'pointer'}}>Edit</p>
                                </div>
                                <p style={{fontFamily: OPENSANS, fontWeight:'400', fontSize:'0.9rem', marginBottom:0, overflow:'hidden', color:'#737373'}}>{subleaseDescription.trim() == "" ? "Add a description" : "Edit description"}</p>
                            </div>
                            <div style={{marginTop:'3vh',}}>
                                <div style={{display:'flex', flexDirection:'row', marginBottom:5, alignItems:'center', justifyContent:'space-between' }}>
                                    <p style={{fontFamily: OPENSANS, fontWeight:'600', fontSize:'1rem', marginBottom:0}}>Amenities</p>
                                    <p onClick={()=>handleEditClick("Amenities")}  style={{marginBottom:0, fontWeight:'600', fontFamily:OPENSANS, fontSize:'0.8rem', textDecorationLine:"underline", color:MEDIUMGREY, cursor:'pointer'}}>Edit</p>
                                </div>
                                <p style={{fontFamily: OPENSANS, fontWeight:'400', fontSize:'0.9rem', marginBottom:0, color:'#737373'}}>{subleaseAmenities.length == 0 ? "Select amenities" : subleaseAmenities[0].replaceAll("_"," ") + " ..."}</p>
                            </div>
                        </div>
                       
                    </div>
                </div>
                <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={editModalVis}
                onClose={handleModalCloseWithoutSaving}
                closeAfterTransition
                slotProps={{
                backdrop: {
                    timeout: 500,
                },
                }}
                    >
                    <Fade in={editModalVis}>
                        <div 
                            style={{
                            position: 'absolute',
                            top: '30%',
                            left: '50%',
                            transform: 'translate(-50%, -30%)',
                            height:'auto',
                            backgroundColor:'white',
                            padding: mobile ? '4vw' : '2vw',
                            borderRadius: MEDIUMROUNDED,
                            display:'flex',
                           
                            flexDirection:'column',
                            width: 'auto',
                            minWidth: mobile ? '90vw' :  '35vw'
                            
                            }}>
                            <div style={{width:'100%'}}>
                                <CloseIcon onClick={handleModalCloseWithoutSaving} style={{fontSize: mobile ? '5vw' : '1.5vw', marginBottom:'1vw', cursor:'pointer'}}/>
                            </div>
                            { editItem == "Type" ?
                                <>
                                    <p style={{fontSize:'1.2rem', fontWeight:'600', textAlign:'left', fontFamily: OPENSANS, display:'flex',}}>Edit sublease {editItem.toLowerCase()}</p>
                                    <p style={{fontSize:'0.9rem', fontFamily: OPENSANS, color: MEDIUMGREY}}>What type of sublease the sublease will be living in?</p>
                                    <div style={{marginTop:"2vh", display:'flex', flexDirection: 'column' , justifyContent:'space-between', alignItems:'center'}} >
                                        
                                        <FormControl  style={{width: '100%'}}>
                                            <InputLabel id="sublease-types">Sublease type</InputLabel>
                                            <Select
                                                labelId="sublease-types"
                                                value={subleaseType}
                                                label="Sublease type"
                                                onChange={(val)=> setSubleaseType(val.target.value)}
                                            >
                                                <MenuItem value={"Studio"}>Studio</MenuItem>
                                                <MenuItem value={"Room"}>Room</MenuItem>
                                                <MenuItem value={"Apartment"}>Apartment</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Button onClick={()=> update("Type")} variant="contained" style={{backgroundColor:'black', outline:'none', textTransform:'none', height: '6vh', width: '100%', marginTop: '2vh'}}>
                                            <p style={{marginBottom:0}}>Update</p>
                                        </Button>
                                        
                                    </div>
                                </>
                                :
                                editItem == "Price" ?
                                <>
                                    <p style={{fontSize:'1.2rem', fontWeight:'600', textAlign:'left', fontFamily: OPENSANS, display:'flex',}}>Edit sublease {editItem.toLowerCase()}</p>
                                    <p style={{fontSize:'0.9rem', fontFamily: OPENSANS, color: MEDIUMGREY}}>What is the sublease's monthly rent?</p>
                                    <div style={{marginTop:"2vh", display:'flex', flexDirection: 'column' , justifyContent:'space-between', alignItems:'center'}} >
                                        
                                        <TextField 
                                        style={{width: '100%' }}
                                        type="tel"
                                        label="Monthly rent"
                                        value={subleasePrice}
                                        onChange={(val) => setSubleasePrice(val.target.value)}
                                        InputProps={{
                                            placeholder: 'Monthly rent',
                                            startAdornment: <InputAdornment style={{paddingRight:'1vw'}}>$</InputAdornment>,
                                            endAdornment: <InputAdornment> /month</InputAdornment>,
                                        }}
                                    
                                        />          
                                        <TextField 
                                        style={{width: '100%', marginTop:'4vh' }}
                                        type="tel"
                                        label="Security deposit"
                                        value={subleaseSecurityDeposit}
                                        onChange={(val) => setSubleaseSecurityDeposit(val.target.value)}
                                        InputProps={{
                                            placeholder: 'Security deposit',
                                            startAdornment: <InputAdornment style={{paddingRight:'1vw'}}>$</InputAdornment>,
                                            
                                        }}
                                        
                                        />                                        
                                        <Button onClick={()=> update("Price")} variant="contained" style={{backgroundColor:'black', outline:'none', textTransform:'none', height: '6vh', width: '100%', marginTop: '4vh'}}>
                                            <p style={{marginBottom:0}}>Update</p>
                                        </Button>
                                        
                                    </div>
                                </>
                                :
                                editItem == "Availability" ?
                                <>
                                    <p style={{fontSize:'1.2rem', fontWeight:'600', textAlign:'left', fontFamily: OPENSANS, display:'flex',}}>Edit sublease {editItem.toLowerCase()}</p>
                                    <p style={{fontSize:'0.9rem', fontFamily: OPENSANS, color: MEDIUMGREY}}>When is the sublease available?</p>
                                    <div style={{marginTop:"2vh", display:'flex', flexDirection: 'column', justifyContent:'space-between', alignItems:'center'}} >
                                        
                                        <div style={{width: '100%'}}>
                                            <DatePicker
                    
                                            label="Start date"
                                            value={dayjs(subleaseStart)}
                                            onChange={(event)=>                                
                                                setSubleaseStart(event)
                                            }
                                            slotProps={{ textField: {error:false, style:{width: '100%'} } }}
                                            />
                                        </div>   
                                        <div style={{width:'100%', marginTop: '2vh' }}>
                                            <DatePicker
                                            label="End date"
                                            value={dayjs(subleaseEnd)}
                                            onChange={(event)=>                                
                                                setSubleaseEnd(event)
                                            }
                                            slotProps={{ textField: {error:false, style:{width: '100%'} } }}
                                            />
                                        </div>                             
                                        <Button onClick={()=> update("Availability")} variant="contained" style={{backgroundColor:'black', outline:'none', textTransform:'none', height: '6vh', width: '100%' ,  marginTop: '2vh'}}>
                                            <p style={{marginBottom:0}}>Update</p>
                                        </Button>
                                        
                                    </div>
                                </>
                                :
                                editItem == "Description" ?
                                <>
                                    <p style={{fontSize:'1.2rem', fontWeight:'600', textAlign:'left', fontFamily: OPENSANS, display:'flex',}}>Edit sublease {editItem.toLowerCase()}</p>
                                    <p style={{fontSize:'0.9rem', fontFamily: OPENSANS, color: MEDIUMGREY}}>Tell others more about your sublease.</p>
                                    <div style={{marginTop:"2vh", display:'flex', flexDirection:'column', justifyContent:'space-between', alignItems:'center'}} >
                                        
                                    <TextField 
                                   
                                    fullWidth
                                    value={subleaseDescription}
                                    onChange={(val) => setSubleaseDescription(val.target.value)}
                                    multiline
                                   
                                    rows={7}
                                    />
                                                           
                                    <Button fullWidth onClick={()=> update("Description")} variant="contained" style={{backgroundColor:'black', outline:'none', textTransform:'none', height: '5vh', marginTop:'6vh'}}>
                                        <p style={{marginBottom:0}}>Update</p>
                                    </Button>
                                        
                                    </div>
                                </>
                                :
                                <>
                                    <p style={{fontSize:'1.2rem', fontWeight:'600', textAlign:'left', fontFamily: OPENSANS, display:'flex',}}>Edit sublease {editItem.toLowerCase()}</p>
                                    <p style={{fontSize:'0.9rem', fontFamily: OPENSANS, color: MEDIUMGREY}}>What amenities are included with the sublease?</p>
                                    <div style={{marginTop:"2vh", display:'flex', flexDirection:'column', justifyContent:'space-between', alignItems:'center'}} >
                                        <div style={{flexDirection:'column', display:'flex', height:'40vh', overflow:'scroll', width: mobile ? '100%' : 'auto'}}>
                                            {AMENITIESLIST.map((item)=>{
                                                return(
                                                    <div key={item.name + "editamenities"} style={{flexDirection:'row', display:'flex', width: mobile ? '100%' : '35vw', justifyContent:'space-between', alignItems:'center'}}>
                                                        <div style={{flexDirection:'row', display:'flex', alignItems:'center'}}>
                                                            {GetIcon(MEDIUMGREY, mobile ? '5vw' : '1.5vw',item.name)}
                                                            <p style={{marginLeft: mobile ? '2vw' : '1vw', fontFamily: OPENSANS, fontSize:"0.9rem", fontWeight:'500', marginBottom:0}}>{item.name.replaceAll("_", " ")}</p>
                                                        </div>
                                                        <Checkbox onClick={()=> updateAmenities(item.name)} checked={subleaseAmenities.includes(item.name) ? true : false} style={{color: PRIMARYCOLOR}}/>
                                                    </div>
                                                    
                                                )
                                            })}
                                        </div>
                                                            
                                        <Button fullWidth onClick={()=> update("Description")} variant="contained" style={{backgroundColor:'black', outline:'none', textTransform:'none', height: '5vh', marginTop:'6vh'}}>
                                            <p style={{marginBottom:0}}>Update</p>
                                        </Button>
                                        
                                    </div>
                                </>
                            }
                        </div>
                    </Fade>
                </Modal>
                <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={deletePropertyModalVis}
                
                closeAfterTransition
                slotProps={{
                backdrop: {
                    timeout: 500,
                },
                }}
            >
                <Fade in={deletePropertyModalVis}>
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
                            <div onClick={()=>setDeletePropertyModalVis(false)} style={{display:'flex', flexDirection:'row', alignItems:'center', cursor:'pointer'}}>
                                <CloseIcon style={{color:'black', fontSize:'1.5rem'}}/>
                            </div>
                            <div style={{marginTop:'2vh'}}>
                            {deleteModalPage == 0 ?
                            <>
                                <p style={{fontSize:'1.2rem', fontFamily: OPENSANS, color: 'black', fontWeight:'600', marginBottom:5}}>Are you sure?</p>
                                <p style={{fontSize:'0.9rem', fontFamily: OPENSANS, color: MEDIUMGREY}}>This process is permanant and cannot be reverted</p>
                                <div style={{flexDirection:'row', display:'flex'}}>
                                    <Button onClick={()=>setDeletePropertyModalVis(false)} variant='outlined' style={{borderColor:'black', outline:'none', textTransform:'none', height:'5vh', marginTop:'2vh'}}>
                                        <p style={{marginBottom:0, fontWeight:'500', fontSize:'0.9rem', fontFamily: OPENSANS, color:'black'}}>Cancel</p>
                                    </Button>
                                    <Button onClick={()=>setDeleteModalPage(1)} variant='contained' style={{backgroundColor:'black', outline:'none', textTransform:'none', height:'5vh', marginTop:'2vh', marginLeft:'1vw'}}>
                                        <p style={{marginBottom:0, fontWeight:'500', fontSize:'0.9rem', fontFamily: OPENSANS, color:'white'}}>Delete</p>
                                    </Button>
                                </div>
                            </>
                            :
                            <>
                                <p style={{fontSize:'1.2rem', fontFamily: OPENSANS, color: 'black', fontWeight:'600', marginBottom:5}}>Were you able to successfully sublease on Crib?</p>
                                <p style={{fontSize:'0.9rem', fontFamily: OPENSANS, color: MEDIUMGREY}}>We always strive to be better. Your feedback is much appreciated.</p>
                                <div style={{marginTop:'6vh'}}>
                                    <TextField fullWidth multiline rows={4} value={feedback} onChange={(val)=> setFeedback(val.target.value)} label="Feedback" />
                                    <div style={{flexDirection:'row', display:'flex'}}>
                                    
                                        <Button disabled={loading} onClick={()=>deleteProperty(false)} variant='outlined' style={{borderColor:'black', outline:'none', textTransform:'none', height:'5vh', marginTop:'2vh'}}>
                                            <p style={{marginBottom:0, fontWeight:'500', fontSize:'0.9rem', fontFamily: OPENSANS, color:'black'}}>No</p>
                                        </Button>
                                        <Button disabled={loading} onClick={()=>deleteProperty(true)} variant='contained' style={{backgroundColor:'black', outline:'none', textTransform:'none', height:'5vh', marginTop:'2vh', marginLeft:'1vw'}}>
                                            {loading ?
                                            <Lottie animationData={WhiteLoadingAnimation} style={{display:'flex', flex:1, color:'white', height:'5vh', preserveAspectRatio: 'xMidYMid slice'}}/>
                                            :
                                            <p style={{marginBottom:0, fontWeight:'500', fontSize:'0.9rem', fontFamily: OPENSANS, color:'white'}}>Yes, I subleased on Crib</p>
                                            }
                                        </Button>
                                    </div>
                                </div>
                            </>
                            }
                            </div>
                    </div>
                </Fade>
            </Modal>
            </>
            }
        </div>
        </LocalizationProvider>
    )
}