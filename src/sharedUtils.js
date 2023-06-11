//Icons
import PetsIcon from '@mui/icons-material/Pets';
import GarageIcon from '@mui/icons-material/Garage';
import PoolIcon from '@mui/icons-material/Pool';
import WifiIcon from '@mui/icons-material/Wifi';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import DoorSlidingIcon from '@mui/icons-material/DoorSliding';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import HvacIcon from '@mui/icons-material/Hvac';
import MicrowaveIcon from '@mui/icons-material/Microwave';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import TvIcon from '@mui/icons-material/Tv';
import KitchenIcon from '@mui/icons-material/Kitchen';
import ChairIcon from '@mui/icons-material/Chair';
import CookieIcon from '@mui/icons-material/Cookie';
import KingBedIcon from '@mui/icons-material/KingBed';
import CoffeeMakerIcon from '@mui/icons-material/CoffeeMaker';
import BreakfastDiningIcon from '@mui/icons-material/BreakfastDining';
import RiceBowlIcon from '@mui/icons-material/RiceBowl';
import CountertopsIcon from '@mui/icons-material/Countertops';
import BoltIcon from '@mui/icons-material/Bolt';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import IronIcon from '@mui/icons-material/Iron';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import BalconyIcon from '@mui/icons-material/Balcony';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import GiteIcon from '@mui/icons-material/Gite';
import AcUnitIcon from '@mui/icons-material/AcUnit';


export const PRIMARYCOLOR = '#2D6674'
export const MEDIUMGREY = '#333333'
export const LIGHTGREY = '#E0E0E0'
export const EXTRALIGHT = '#f2f2f2'

//Font family
export const OPENSANS = 'Open Sans'


//Border radius
export const MEDIUMROUNDED = 10


export const GetIcon = (color, size, name) => {
    if(name == "Pet_Friendly"){
        return <PetsIcon style={{fontSize:size, color: color}} />
    }
    if(name == "Garages"){
        return <GarageIcon style={{fontSize:size, color: color}} />
    }
    if(name == "Swimming_Pool"){
        return <PoolIcon style={{fontSize:size, color: color}} />
    }
    if(name == "Wifi"){
        return <WifiIcon style={{fontSize:size, color: color}} />
    }
    if(name == 'Gym'){
        return <FitnessCenterIcon style={{fontSize:size, color: color}} />
    }
    if(name == "Washer_Dryer"){
        return <LocalLaundryServiceIcon style={{fontSize:size, color: color}} />
    }
    if(name == "Gated_Access"){
        return <DoorSlidingIcon  style={{fontSize:size, color: color}} />
    }
    if(name =="Public_Transportation"){
        return <DirectionsBusIcon style={{fontSize:size, color: color}} />
    }
    if(name =="Heating"){
        return <HvacIcon style={{fontSize:size, color: color}} />
    }
    if(name =="Cooling"){
        return <AcUnitIcon style={{fontSize:size, color: color}} />
    }
    if(name == "Microwave"){
        return <MicrowaveIcon style={{fontSize:size, color: color}} />
    }
    if(name == "Grill"){
        return <OutdoorGrillIcon style={{fontSize:size, color: color}} />
    }
    if(name == "TV"){
        return <TvIcon style={{fontSize:size, color: color}} />
    }
    if(name == "Fridge"){
        return <KitchenIcon style={{fontSize:size, color: color}} />
    }
    if(name == "Couch"){
        return <ChairIcon style={{fontSize:size, color: color}} />
    }
    if(name == "Oven"){
        return  <CookieIcon style={{fontSize:size, color: color}} />
    }
    if(name == "Mattress"){
        return <KingBedIcon style={{fontSize:size, color: color}} />
    }
    if(name == "Coffee_Maker"){
        return <CoffeeMakerIcon style={{fontSize:size, color: color}} />
    }
    if(name == "Toaster"){
        return <BreakfastDiningIcon style={{fontSize:size, color: color}} />
    }
    if(name == "Dishes"){
        return  <RiceBowlIcon style={{fontSize:size, color: color}} />
    }
    if(name == "Pots_Pans"){
        return <CountertopsIcon style={{fontSize:size, color: color}} />
    }
    if(name == "Utilities_Included"){
        return <BoltIcon style={{fontSize:size, color: color}} />
    }
    if( name == "Walkin_Closet"){
        return <CheckroomIcon style={{fontSize:size, color: color}} />
    }
    if(name == "Iron"){
        return <IronIcon  style={{fontSize:size, color: color}} />
    }
    if(name == "Freezer"){
        return <DeviceThermostatIcon style={{fontSize:size, color: color}} />
    }
    if( name == "Balcony"){
        return <BalconyIcon style={{fontSize:size, color: color}} />
    }
    if( name == "Street_Parking"){
        return <LocalParkingIcon style={{fontSize:size, color: color}} />
    }
    if(name == "Parking_on_Premises"){
        return <GiteIcon style={{fontSize:size, color: color}} />
    }
}