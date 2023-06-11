import { useEffect, useState } from "react"
import { OPENSANS } from "../../sharedUtils"

export default function TermsOfServicesScreen(){

    const [tos, setTos] = useState([])
    useEffect(()=>{
        fetchTOS()
    },[])

    async function fetchTOS(){
        let res = await fetch('https://crib-llc.herokuapp.com/web/termsofservicesdetails')
        let resjson = await res.json()
        console.log(resjson)
        setTos(resjson)
    }

    return(
        <div style={{display:'flex', flex: 1, flexDirection:'column', paddingTop:'3vh', paddingLeft:'5vw', paddingRight:'5vw'}}>
            <p style={{fontSize:'1.2rem', fontWeight:'700', fontFamily:OPENSANS}}>Terms of sercies</p>
            {
            tos.map((item, index) => {
                return(
                    <div  key={"TermsOfServices" + index}>
                        <p style={{fontSize:'1rem', fontFamily: OPENSANS, fontWeight:'600', textDecorationLine:'underline'}}>{Object.keys(item)}</p>
                        <p style={{fontFamily:OPENSANS,}}>{Object.values(item)}</p>
                    </div>
                )
            })
            }
        </div>
    )
}