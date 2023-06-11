import { Button } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EXTRALIGHT, LIGHTGREY, MEDIUMGREY, MEDIUMROUNDED, OPENSANS, PRIMARYCOLOR } from "../../sharedUtils";
import { UserContext } from "../../UserContext";

export default function RequestCards(props){
    let uid = localStorage.getItem("uid")
    const navigate = useNavigate()
    const {USERID, mobile} = useContext(UserContext)
    const propData = props.data

    const temp = props.data.subleaseRequests.filter((item) => {
        
        if(item.subtenantId == uid){
            return true;
        }
        return false
    })
    const subleaseData = temp[temp.length-1]
   

    function handleNav(){
        window.open(`/listingDetails/${propData._id}`,'_blank')
    }

  
    // console.log(props.data)
    return(
        <>
        {subleaseData != null && subleaseData != undefined ?
        <div onClick={handleNav} style={{ height:'auto', backgroundColor:'red', borderRadius:MEDIUMROUNDED, backgroundColor:'white', boxShadow:'0px 0px 20px 1px rgba(33, 33, 33, 0.1)', cursor:'pointer', borderWidth:'0.5px', borderStyle:'solid', borderColor: EXTRALIGHT,}}>
            <img src={propData.imgList[0]} style={{width:'100%', height: mobile ? '30vh' : '15vw', borderTopLeftRadius:MEDIUMROUNDED, borderTopRightRadius: MEDIUMROUNDED, objectFit:'cover'}} />
            <div style={{ padding: mobile ? '5vw' : '1.5vw',}}>
                <div style={{flexDirection:'row', display:'flex', alignItems:'center'}}>
                    {/* <img src={'https://crib-llc.herokuapp.com/users/profileImages/7235142e5d75102c63534f1d78cd448f58cf48800f87788f0d40fa432705e334'} style={{height:'5vh', width: '5vh', borderRadius:'2.5vh'}}/> */}
                    {/* <div style={{paddingLeft:'1vw'}}>
                        <p style={{fontSize:"1rem", fontWeight:'600', marginBottom:0, fontFamily: OPENSANS}}>{}</p>
                        <div style={{flexDirection:'row', display:'flex'}}>
                            <p style={{fontSize:"0.8rem", fontWeight:'500', marginBottom:0, fontFamily: OPENSANS}}>Male</p>
                            <p style={{fontSize:"0.8rem", fontWeight:'500', marginBottom:0, marginLeft:'2vw', fontFamily: OPENSANS}}>25</p>
                        </div>
                    </div> */}
                </div>
                <div>
                    <div>
                        <p style={{fontSize:'0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:5}}>Dates</p>
                        <p style={{fontSize:'0.8rem', fontFamily: OPENSANS, fontWeight:"400", marginBottom:5}} >{new Date(subleaseData.requestStart).toLocaleDateString().split(","[0])} - {new Date(subleaseData.requestStart).toLocaleDateString().split(","[1])}</p>
                    </div>
                    {/* <div style={{marginTop:'2vh'}}>
                        <p style={{fontSize:'1rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:5}}>Description</p>
                        <p style={{fontSize:'0.8rem', fontFamily: OPENSANS, fontWeight:"500", marginBottom:5}} >Hello my name is Isaac, I am looking for a sublease for my summer inernship. I want to be close to Manhattan if possible and I want to live in a studio.</p>
                    </div> */}
                    <div style={{marginTop:'2vh'}}>
                        <p style={{fontSize:'0.9rem', fontFamily: OPENSANS, fontWeight:"600", marginBottom:5}}>Message to tenant</p>
                        <p style={{fontSize:'0.8rem', fontFamily: OPENSANS, fontWeight:"400", marginBottom:0, height: '5vh', overflow:'scroll'}} >{subleaseData.requestMessage}</p>
                    </div>
                    {/* <div style={{flexDirection:'row', display:'flex', marginTop:'4vh', justifyContent:'space-between'}}>
                        <Button varaint='contained' style={{flexDirection:'row', display:'flex', backgroundColor: LIGHTGREY, color:'white', height:'5vh', textTransform:'none', width:'45%'}}>
                            <p style={{marginBottom:0, fontWeight:'500',}}>Reject</p>
                        </Button>
                        <Button varaint='contained' style={{flexDirection:'row', display:'flex', backgroundColor: PRIMARYCOLOR, color:'white', height:'5vh', textTransform:'none', width:'45%'}}>
                            <p style={{marginBottom:0, fontWeight:'500', }}>Accept</p>
                        </Button>
                    </div> */}
                     {/* <Button fullWidth varaint='contained' style={{flexDirection:'row', display:'flex', backgroundColor: PRIMARYCOLOR, color:'white', height:'5vh', textTransform:'none', marginTop : '2vh'}}>
                        <p style={{marginBottom:0, fontWeight:'500', }}>Waiting tenant response...</p>
                    </Button> */}

                </div>
            </div>
        </div>
        :
        null
        }
        </>
    )
}