import { LIGHTGREY, MEDIUMROUNDED, OPENSANS, PRIMARYCOLOR } from '../sharedUtils'
import WelcomeImage from '../welcomeImage.png'
import SearchingSVG from './searchingImage.svg'
import PostingSVG from './postingImage.svg'
import { Button } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../UserContext'
import { useEffect } from 'react'
import BudgetSVG from './budgetSVG.svg'
import LocalSVG from './LocalsSVG.svg'
import HassleFreeSVG from './HasstleSVG.svg'
import MoneySVG from './MoneySVG.svg'

const CRIBPROS = [{name : "Budget friendly", content : "Most of our listings are on a discounted rent price. Request to book before they're gone.", img: BudgetSVG},
{name : "Sublease instantly", content: "Crib provides a seamless and efficient process from start to finish. Secure your ideal sublease in no time.", img: LocalSVG},
{name : "Hasstle free", content : "We provide tenants and subtenants with a formalizaed contract so you don't have to worry about it.", img: HassleFreeSVG},
{name : "Never get scammed", content: "We hold on to subtenant's security deposit until move-in day. It will be transferred to tenant on move-in day.", img: MoneySVG}]

export default function WelcomePage(){
    const navigate = useNavigate()
    const {mobile, loggedIn} = useContext(UserContext)


    function handleNav(route){
        navigate(route)
    }

    function postProperty(){
        let at = localStorage.getItem("accessToken")
        if(at = null){
            alert("Please login or sign up to post a property")
            navigate("/login")
            return
        }
        else{
            handleNav('/propertyPosting')
        }
        
    }

    return(
        <>
        <div style={{ height: mobile ? 'auto' : 'auto', width:'100vw', flexDirection: mobile ? 'column-reverse' : 'row', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', justifyContent:'space-between', paddingTop: mobile ? '5vh' : '10vh', paddingBottom: mobile ? 0 : '2vh', }}>
          
            <div style={{height:'auto', flexDirection:'column', marginTop: mobile ? '4vh' : 0, justifyContent:'center', display:'flex'}}>
                {mobile ?
                <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: mobile ? '2.1rem' : '2.6rem'}}>Sublease instantly.<br/>Welcome to <span style={{fontFamily:"Righteous", color: PRIMARYCOLOR}}>Crib</span></p>
                :
                <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: mobile ? '1.8rem' : '2.6rem'}}>Sublease instantly.<br/>Welcome to <span style={{fontFamily:"Righteous", color: PRIMARYCOLOR}}>Crib</span></p>
                }
                {/* <p style={{fontFamily: OPENSANS, fontWeight:'500'}}>Sublease easier than ever with Crib</p> */}
           
                <div style={{flexDirection: mobile ? 'column' : 'row', display:'flex', marginTop: mobile ? '3vh' : '5vh' }}>
                    <Button onClick={()=> handleNav('/discoverSubleases')} style={{backgroundColor: PRIMARYCOLOR, color: 'white', padding: 10, textTransform:'none', outline:'none'}}> 
                        <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'700'}}>Find a sublease</p>
                    </Button>
                    <Button onClick={postProperty} variant="outlined" style={{color: PRIMARYCOLOR, padding: 10, borderColor: PRIMARYCOLOR, marginLeft: mobile ? 0 : '2vh', textTransform:'none', marginTop: mobile ? '2vh' : 0, outline:'none'}}>
                        <p style={{marginBottom:0, fontFamily: OPENSANS, fontWeight:'700'}}>Post a sublease</p>
                    </Button>
                </div>
                
            </div>
            <div style={{flexDirection:'column', justifyContent:'flex-start', height:'auto'}}>
                <div style={{ alignItems:'center', display:'flex'}}>
                    <img src={WelcomeImage} style={{width: mobile ? '80vw' : '50vw', height:'auto', alignSelf:'center', marginLeft:'auto', marginRight:'auto'}} />
                </div>
            </div>
        </div>
        <svg style={{marginTop: mobile && '10vh'}} width="100vw" height="100%" id="svg" viewBox="0 0 1440 390" xmlns="http://www.w3.org/2000/svg" ><path d="M 0,400 C 0,400 0,100 0,100 C 69.56645802650957,113.74282032400589 139.13291605301913,127.48564064801178 202,116 C 264.86708394698087,104.51435935198822 321.03479381443293,67.80025773195877 371,70 C 420.96520618556707,72.19974226804123 464.7279086892488,113.31332842415318 526,126 C 587.2720913107512,138.68667157584682 666.0535714285713,122.94642857142857 724,106 C 781.9464285714287,89.05357142857143 819.0578055964656,70.90095729013254 876,73 C 932.9421944035344,75.09904270986746 1009.715206185567,97.44974226804123 1085,96 C 1160.284793814433,94.55025773195877 1234.0813696612668,69.3000736377025 1293,66 C 1351.9186303387332,62.6999263622975 1395.9593151693666,81.34996318114875 1440,100 C 1440,100 1440,400 1440,400 Z" stroke="none" strokeWidth="0" fill="#2d6674" fillOpacity="0.4"></path><path d="M 0,400 C 0,400 0,200 0,200 C 65.52503681885125,202.2291973490427 131.0500736377025,204.4583946980854 192,199 C 252.9499263622975,193.5416053019146 309.32474226804123,180.39561855670104 374,169 C 438.67525773195877,157.60438144329896 511.6509572901325,147.95913107511046 562,163 C 612.3490427098675,178.04086892488954 640.0714285714284,217.7678571428571 702,224 C 763.9285714285716,230.2321428571429 860.0633284241534,202.96944035346098 921,198 C 981.9366715758466,193.03055964653902 1007.6752577319587,210.35438144329896 1060,222 C 1112.3247422680413,233.64561855670104 1191.235640648012,239.61303387334317 1259,235 C 1326.764359351988,230.38696612665683 1383.382179675994,215.19348306332842 1440,200 C 1440,200 1440,400 1440,400 Z" stroke="none" strokeWidth="0" fill="#2d6674" fillOpacity="0.53" ></path><path d="M 0,400 C 0,400 0,300 0,300 C 58.249815905743745,304.1522459499264 116.49963181148749,308.30449189985274 169,311 C 221.5003681885125,313.69550810014726 268.25128865979383,314.93427835051546 329,320 C 389.74871134020617,325.06572164948454 464.4952135493372,333.95839469808544 528,331 C 591.5047864506628,328.04160530191456 643.7678571428572,313.2321428571429 699,312 C 754.2321428571428,310.7678571428571 812.4333578792341,323.1130338733431 880,330 C 947.5666421207659,336.8869661266569 1024.4987113402062,338.31572164948454 1084,333 C 1143.5012886597938,327.68427835051546 1185.571796759941,315.6240795287187 1242,309 C 1298.428203240059,302.3759204712813 1369.2141016200294,301.1879602356406 1440,300 C 1440,300 1440,400 1440,400 Z" stroke="none" strokeWidth="0" fill="#2d6674" fillOpacity="1" ></path></svg>        
        <div style={{ height: mobile ? 'auto' : 'auto', width:'100vw', flexDirection: 'column', display:'flex', paddingLeft: '5vw', paddingRight:'5vw', paddingTop: mobile ? '5vh' : '10vh', paddingBottom: mobile ? '5vh' : '10vh',}}>

            <div style={{position:'relative',}}>
                <div style={{width: mobile ? '90vw' : '37vw'}}>
                    <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: mobile ? '1.8rem' : '2.2rem', marginBottom:'1vh'}}><span style={{color:'black'}}>Why Crib?</span></p>
                    <p style={{fontFamily: OPENSANS, fontWeight:'400', }}>Crib makes sublease easier than ever. By providing an all-in-one platform from browsing, to signing sublease contract, to paying security deposit, we got you covered to ensure a smooth move-in.</p>
                </div>
                <div style={{flexDirection: mobile ? 'column' : 'row', display:'flex', marginTop: mobile? '5vh' : '10vh', alignItems: mobile &&'center'}}>
                    {CRIBPROS.map((item)=> {
                        return(
                        <div key={"CribPros" + item.name} style={{width: mobile ? '90vw' : '22.5vw', height:'auto',paddingRight:'2vw', flexDirection:'column', marginTop: mobile ? '5vh' : 0,  textAlign: 'center', }}>
                            <img src={item.img}  style={{height:'15vh', }}/> 
                            <p style={{fontFamily: OPENSANS, fontWeight:'700', fontSize:'1.4rem', marginTop:'2vh'}}>{item.name}</p>
                            <p style={{fontFamily: OPENSANS}}>{item.content}</p>
                        </div>
                        )
                    })}
                    
                </div>
            </div>
        </div>
        <svg width="100vw" height="100%" id="svg" viewBox="0 0 1440 390" xmlns="http://www.w3.org/2000/svg" ><path d="M 0,400 C 0,400 0,100 0,100 C 67.2590206185567,87.43888070692195 134.5180412371134,74.8777614138439 194,84 C 253.4819587628866,93.1222385861561 305.18685567010306,123.9278350515464 358,131 C 410.81314432989694,138.0721649484536 464.7345360824743,121.41089837997053 518,116 C 571.2654639175257,110.58910162002947 623.875,116.42857142857143 689,106 C 754.125,95.57142857142857 831.7654639175257,68.87481590574373 902,74 C 972.2345360824743,79.12518409425627 1035.063144329897,116.0721649484536 1093,124 C 1150.936855670103,131.9278350515464 1203.9819587628865,110.83652430044182 1261,102 C 1318.0180412371135,93.16347569955818 1379.0090206185569,96.58173784977909 1440,100 C 1440,100 1440,400 1440,400 Z" stroke="none" strokeWidth="0" fill="#2d6674" fillOpacity="0.4" transform="rotate(-180 720 200)"></path><path d="M 0,400 C 0,400 0,200 0,200 C 48.138070692194404,214.16899852724595 96.27614138438881,228.33799705449192 158,232 C 219.7238586156112,235.66200294550808 295.0335051546392,228.81701030927832 364,233 C 432.9664948453608,237.18298969072168 495.5898379970545,252.39396170839467 556,237 C 616.4101620029455,221.60603829160533 674.6071428571429,175.6071428571429 735,171 C 795.3928571428571,166.3928571428571 857.9815905743741,203.17746686303386 916,224 C 974.0184094256259,244.82253313696614 1027.4664948453608,249.68298969072166 1091,236 C 1154.5335051546392,222.31701030927834 1228.1524300441827,190.09057437407955 1288,181 C 1347.8475699558173,171.90942562592045 1393.9237849779088,185.95471281296022 1440,200 C 1440,200 1440,400 1440,400 Z" stroke="none" strokeWidth="0" fill="#2d6674" fillOpacity="0.53" transform="rotate(-180 720 200)"></path><path d="M 0,400 C 0,400 0,300 0,300 C 58.23140648011781,287.21262886597935 116.46281296023562,274.42525773195877 168,278 C 219.53718703976438,281.57474226804123 264.38015463917526,301.51159793814435 334,311 C 403.61984536082474,320.48840206185565 498.0165684830632,319.5283505154639 555,309 C 611.9834315169368,298.4716494845361 631.5535714285716,278.375 691,286 C 750.4464285714284,293.625 849.7691458026508,328.9716494845361 920,322 C 990.2308541973492,315.0283505154639 1031.369845360825,265.7384020618557 1076,263 C 1120.630154639175,260.2615979381443 1168.75147275405,304.07474226804123 1230,318 C 1291.24852724595,331.92525773195877 1365.624263622975,315.96262886597935 1440,300 C 1440,300 1440,400 1440,400 Z" stroke="none" strokeWidth="0" fill="#2d6674" fillOpacity="1" transform="rotate(-180 720 200)"></path></svg>
        <div style={{width:'100%', textAlign:'center', paddingBottom:'10vh', marginTop: mobile ? '10vh' : 0}}>
            <p style={{fontWeight:'700', fontFamily: OPENSANS, fontSize: mobile ? '1.8rem' : '2.2rem', marginBottom:0}}>Find your Crib today!</p>
            <Button onClick={()=> handleNav('/discoverSubleases')} variant='contained' style={{textTransform:'none', backgroundColor: PRIMARYCOLOR,  marginTop:'5vh', outline:'none'}}>
                <p style={{fontWeight:'500', fontFamily: OPENSANS, fontSize: '1rem', marginBottom:0,}}>Browse available subleases</p>
            </Button>
        </div>
        </>
    )
}