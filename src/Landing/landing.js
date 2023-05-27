import { useContext, useEffect, useState } from "react"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TennatCard from "../TenantCard/tenantCard";
import { Alert, Box, Checkbox, Paper } from "@mui/material";
import { UserContext } from "../UserContext";
import { Button } from "@mui/material";
import Slider from '@mui/material/Slider';
import Modal from '@mui/material/Modal';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SortIcon from '@mui/icons-material/Sort';



const PRIMARYCOLOR = '#2D6674';



export default function LandingPage(props){
   
    const {manhattanDL, setManhattanDL, queensDL, setQueensDL, brooklynDL, setBrooklynDL, jerseyDL, setJerseyDL, price, setPrice} = useContext(UserContext)
    const [tenants, setTenants] = useState([])
    const [filterModal, setfilterModal] = useState(false)
    const [sortMenu, setSortMenu] = useState(false)
    // const [manhattanDL, setManhattanDL] = useState(true)


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
        const resp = await fetch("https://crib-llc.herokuapp.com/users/cribconnect/getall");
        const datas = await resp.json();
        
        //Filter which tenant is suitable
        console.log(datas.length)
        await datas.forEach( async (user) => {
            if(user.postedProperties.length != 0){
                const res = await fetch(`https://crib-llc.herokuapp.com/properties/${user.postedProperties[0]}`, {method: "POST"})
                const data = await res.json();
                // console.log(data)
                let sa = data.propertyInfo.loc.secondaryTxt
                let lower_spaceless_sa = sa.toLowerCase().replaceAll(" ","")
                
                if(data.propertyInfo.price < price){
                    //Check if it is in NY
                    if(lower_spaceless_sa.indexOf("ny") != -1 || lower_spaceless_sa.indexOf("newyork") != -1){

                        if(!brooklynDL){
                            if(lower_spaceless_sa.indexOf("brooklyn") != - 1){
                                return
                            }
                        }
                        if(!jerseyDL){
                            if(lower_spaceless_sa.indexOf("jersey") != - 1 || lower_spaceless_sa.indexOf("nj") != -1){
                                return
                            }
                        }
                        if(!queensDL){
                            if(lower_spaceless_sa.indexOf("queens") != - 1){
                                return
                            }
                        }
                        console.log(data)
                        setTenants(tenants => [...tenants, data])
                        
                    }
                }
            }
        })
       
        

        setfilterModal(false)
    }


    async function filterTenants(){
        setTenants([])
        setfilterModal(true)
    }

    async function SortByPrice() {
        let arr = tenants;


        arr.sort((a,b) => a.propertyInfo.price - b.propertyInfo.price)
       
        
    }

    return(
        <div  style={{ height: '90vh', width: '100vw', paddingLeft:'2.5vw', paddingRight:'2.5vw', paddingTop: '2.5vh'}}>
            
            <h2 style={{fontWeight:'700'}}>Hello there 👋🏻</h2>
            <p style={{maxWidth: 400}}>We are Crib, a student startup for subleasing! We are students too so we understand how difficult subleasing can be. Check out the selected tenants below, be sure to check regularly since we update the list everyday!</p>
            <div style={{maxWidth: 400, flexDirection:'row', justifyContent:'space-between', alignItems:'center', display:'flex', flex: 1}}>
                <Button onClick={filterTenants} style={{backgroundColor:'#2D6674'}} variant="contained">
                    Filters
                </Button>
                {/* <Button
                    id="sort-menu"
                    aria-controls={open ? 'demo-positioned-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    style={{backgroundColor: '#E0E0E0', color: 'white', borderStyle:'solid', color: '#ABABAB', borderWidth:1 }}
                >
            
                    <SortIcon color='#525252'  /> 
                    
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
                    <MenuItem onClick={() => SortByPrice()}>Price (low to hight)</MenuItem>
                    <MenuItem onClick={handleClose}>Start Date</MenuItem>
                    
                </Menu> */}
            </div>
            <Row>
                {
                    tenants.map((item, index) => {
                      
                        return (
                           
                            <Col key={item.propertyInfo._id + index + item.userInfo._id} xs={12} sm={6} md={4} lg={4} style={{marginTop: 20}}>
                                <TennatCard key={item.propertyInfo._id + index + item.userInfo._id + "card"}data={item}/>
                            </Col> 
                        )
                    })
                }
            </Row>
            <Modal
                
                open={filterModal}
                // onClose={fetchCribConnectTenants}
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
                <Button onClick={()=> fetchCribConnectTenants()}fullWidth style={{backgroundColor:'#2D6674', maxWidth: 400, alignSelf:'center', marginTop:50}} variant="contained">
                    Find subleases
                </Button>
              </div>
            </Modal>
               
           
    
        </div>
    )
}