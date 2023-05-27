
export default function NavBar(){
    return(
        <div style={{display:'flex', height: "10vh", width: "100vw", flexDirection: 'row', alignItems:'center', paddingLeft: '2.5vw', paddingRight: '2.5vw', borderBottomStyle:'solid', borderColor:'#E0E0E0', flexDirection:'row', justifyContent:'space-between'}}>
            <h3 style={{fontWeight:'700', fontFamily: 'DM Serif Display', color: '#2D6674'}}>Crib</h3>
            <h6 style={{fontWeight:'700', fontFamily: 'DM Serif Display', color: '#ABABAB'}}>Matched Tenants</h6>
        </div>
    )
}
