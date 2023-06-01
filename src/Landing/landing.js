import { useContext, useEffect, useState } from "react"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TennatCard from "../TenantCard/tenantCard";
import {Box, Checkbox, Menu, MenuItem, Paper } from "@mui/material";
import { UserContext } from "../UserContext";
import { Button } from "@mui/material";
import Slider from '@mui/material/Slider';
import Modal from '@mui/material/Modal';



const PRIMARYCOLOR = '#2D6674';



export default function LandingPage(props){
   
    const {manhattanDL, setManhattanDL, queensDL, setQueensDL, brooklynDL, setBrooklynDL, jerseyDL, setJerseyDL, price, setPrice} = useContext(UserContext)
    const [tenants, setTenants] = useState([])
    const [filterModal, setfilterModal] = useState(false)
    const [sortMenu, setSortMenu] = useState(false)
    const [NYProps, setNYProps] = useState([])
    // const [manhattanDL, setManhattanDL] = useState(true)

    const [loading, setLoading] = useState(true)


    const [anchorEl, setAnchorEl] = useState(null);
    const open = anchorEl;
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        fetchCribConnectTenants()
    }, [])

    async function fetchCribConnectTenants(){
        // const resp = await fetch("https://crib-llc.herokuapp.com/users/cribconnect/getall");
        // const datas = await resp.json();
        
        // //Filter which tenant is suitable
        // console.log(datas)
        setfilterModal(false)   
        setLoading(true)
        await fetch("https://crib-llc.herokuapp.com/properties/getAllNewYorkPosting?&latitude=40.730610&longitude=-73.935242")
        .then((res) => {return res.json()})
        .then( async data => {
            console.log(data)

            data.sort( (a,b) => b.userInfo.cribConnectUser - a.userInfo.cribConnectUser)
            if(!brooklynDL){
                data.filter((prop) => {
                    let sa = prop.propertyInfo.loc.secondaryTxt;
                    let spaceless_sa = sa.replaceAll(" ", "");

                    return spaceless_sa.indexOf("brooklyn") == -1
                })
            }
            if(!queensDL){
                await data.filter((prop) => {
                    let sa = prop.propertyInfo.loc.secondaryTxt;
                    let spaceless_sa = sa.toLowerCase().replace(" ", "");
                    console.log(spaceless_sa)
                    return spaceless_sa.indexOf("queens") == -1
                })
            }
            setNYProps(data.filter((prop) => {
                if(!queensDL){
                    let sa = prop.propertyInfo.loc.secondaryTxt;
                    let spaceless_sa = sa.toLowerCase().replace(" ", "");
                    console.log(spaceless_sa)
                    if(spaceless_sa.indexOf("queens") != -1){
                        return false
                    }
                   
                }
                if(!brooklynDL){
                    let sa = prop.propertyInfo.loc.secondaryTxt;
                    let spaceless_sa = sa.toLowerCase().replace(" ", "");
                    console.log(spaceless_sa)
                    if(spaceless_sa.indexOf("brooklyn") != -1){
                        return false
                    }
                  
                }
                if(!jerseyDL){
                    let sa = prop.propertyInfo.loc.secondaryTxt;
                    let spaceless_sa = sa.toLowerCase().replace(" ", "");
                    console.log(spaceless_sa)
                    if(spaceless_sa.indexOf("nj") != -1 || spaceless_sa.indexOf("jersey") != -1){
                        return false
                    }

                }
                if(prop.propertyInfo.price > price){
                  return false
                }
                return true
            }))
            setLoading(false)

        } )
        // const datas = await resp.json();
      
        // //Filter which tenant is suitable
        // setNYProps(datas)
      
        // setTenants()
        // await datas.forEach( async (user) => {
        //     if(user.postedProperties.length != 0){
        //         await fetch(`https://crib-llc.herokuapp.com/properties/${user.postedProperties[0]}`, {method: "POST"})
        //         .then( async (res) => {
        //             return await res.json()
        //         })
        //         .then ( data => {
        //             if(data.propertyInfo.price < price && data.propertyInfo.deleted == false){

        //                 let sa = data.propertyInfo.loc.secondaryTxt
        //                 let lower_spaceless_sa = sa.toLowerCase().replaceAll(" ","")
        //                 //Check if it is in NY
        //                 if(lower_spaceless_sa.indexOf("ny") != -1 || lower_spaceless_sa.indexOf("newyork") != -1){
    
        //                     if(!brooklynDL){
        //                         if(lower_spaceless_sa.indexOf("brooklyn") != - 1){
        //                             return
        //                         }
        //                     }
        //                     if(!jerseyDL){
        //                         if(lower_spaceless_sa.indexOf("jersey") != - 1 || lower_spaceless_sa.indexOf("nj") != -1){
        //                             return 
        //                         }
        //                     }
        //                     if(!queensDL){
        //                         if(lower_spaceless_sa.indexOf("queens") != - 1){
        //                             return 
        //                         }
        //                     }
                           
        //                     setTenants(tenants => [...tenants, user])
                            
        //                 }
        //             }
        //         })

        //     }
        // })
       
        

       
    }


    async function filterTenants(){
        setTenants([])
        setfilterModal(true)
    }

    async function SortByPrice() {
        let tempProps = NYProps;
        handleClose()
        setLoading(true)
        setNYProps(tempProps.sort((a,b) => a.propertyInfo.price - b.propertyInfo.price))
        setLoading(false)
    }

    async function SortByStartDate() {
        let tempProps = NYProps;
        handleClose()
        setLoading(true)
        setNYProps(tempProps.sort((a,b) => new Date(a.propertyInfo.availableFrom).getTime() - new Date(b.propertyInfo.availableFrom).getTime()))
        setLoading(false)
    }


    return(
        <div  style={{ height: '90vh', width: '100vw', paddingLeft:'2.5vw', paddingRight:'2.5vw', paddingTop: '2.5vh'}}>
            
            <h2 style={{fontWeight:'700'}}>Hello there 👋🏻</h2>
            <p style={{maxWidth: 400}}>We are Crib, a student startup for subleasing! We are students too so we understand how difficult subleasing can be. Check out the selected tenants below, be sure to check regularly since we update the list everyday!</p>
            <div style={{maxWidth: 400, flexDirection:'row', justifyContent:'space-between', alignItems:'center', display:'flex', flex: 1, alignContent:'center'}}>
                <Button onClick={filterTenants} style={{backgroundColor:'#2D6674'}} variant="contained">
                    Filters
                </Button>
                { !loading &&
                
                <p style={{alignSelf:'center', textAlign:'center', marginLeft:20, marginTop:10}}><span style={{fontWeight:'600', }}>{NYProps.length} </span>subleases found</p>
                }
                <Button
                    id="sort-menu"
                    aria-controls={open ? 'demo-positioned-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    style={{backgroundColor: '#E0E0E0', borderStyle:'solid', color: 'black', borderWidth:1 }}
                >
            
                    Sort
                    
                </Button>
                <Menu
                    id="sort-menu"
                    aria-labelledby="demo-positioned-button"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                    }}
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                    }}
                >
                    <MenuItem disabled={loading} onClick={SortByPrice}>Price (low to hight)</MenuItem>
                    <MenuItem disabled={loading} onClick={SortByStartDate}>Start Date</MenuItem>
                    
                </Menu>
            </div>
            {loading ?
            <>
                <h3 style={{marginTop: 200, color: '#2D6674', fontWeight:'700'}}>Loading subleases ...</h3>
                <h6>Finding the best subleases for you!</h6>
            </>
            :
            <Row>
                {
                    NYProps.map((item, index) => {
                            if(item.userInfo._id == undefined){
                                return null
                            }
                            else{
                                return (
                                    <Col key={index} xs={12} sm={6} md={4} lg={4} style={{marginTop: 20}}>
                                        <TennatCard data={item}/>
                                    </Col> 
                                )
                            }

                    })
                }
            </Row>
            }
            
            <Modal
                
                open={filterModal}
                onClose={()=>setfilterModal(false)}
                aria-labelledby="modal-modal-filter"
                aria-describedby="modal-modal-filtersubleases"
                style={{display: 'flex', flex: 1, justifyContent:'center', alignItems:'center'}}
            >
              <div style={{width: "80vw", height:"80vh", backgroundColor: 'white', borderRadius: 20, padding: 20, maxWidth: 400, position:'relative'}}>
                <h5 style={{fontWeight:'500', fontFamily:'DM Serif Display'}}>Select sublease area</h5>
                <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:400, marginTop:20}}>
                    <p>Manhattan</p>
                    <Checkbox onClick={()=> setManhattanDL(!manhattanDL)} defaultChecked style={{color: PRIMARYCOLOR }}/>

                </div>
                <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:400}}>
                    <p>Queens</p>
                    <Checkbox onClick={()=>setQueensDL(!queensDL)} defaultChecked style={{color: PRIMARYCOLOR }}/>

                </div>
                <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:400}}>
                    <p>Brooklyn</p>
                    <Checkbox onClick={()=>setBrooklynDL(!brooklynDL)} defaultChecked style={{color: PRIMARYCOLOR }}/>

                </div>
                <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:400}}>
                    <p>Jercity City / Jersey</p>
                    <Checkbox onClick={()=>setJerseyDL(!jerseyDL)} defaultChecked style={{color: PRIMARYCOLOR }}/>
                </div>
                <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', marginTop: 20}}>
                    <h5 style={{fontWeight:'500', fontFamily:'DM Serif Display'}}>Max Price</h5>
                    <h6 style={{fontWeight:'500', }}>${price}</h6>
                </div>
                <Box style={{maxWidth: 360,}}>
                    <Slider

                        min={0}
                        max={10000}
                        step={100}
                        getAriaLabel={() => 'Price range'}
                        value={price}
                        style={{color: PRIMARYCOLOR}}
                        onChange={(val) => {
                           
                            let max = val.target.value
                            setPrice(max)

                        }}
                        valueLabelDisplay="auto"
                    />
                </Box>
                <Button  onClick={fetchCribConnectTenants} fullWidth style={{backgroundColor:'#2D6674', maxWidth: 400, alignSelf:'center', marginTop:50}} variant="contained">
                    {loading ? "Finding subleases for you ..." : "Find subleases"}
                </Button>
              </div>
            </Modal>
               
           
    
        </div>
    )
}