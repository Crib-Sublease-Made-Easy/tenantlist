import logo from './logo.svg';
import LandingPage from './Landing/landing';
import NavBar from './NavBar/navbar';
import './App.css';
import {UserContext} from './UserContext';
import { useEffect, useState } from 'react';


function App() {

  useEffect(()=> {
    getWebsite()
  }, [])

  //Location base
  const [manhattanDL, setManhattanDL] = useState(true)
  const [queensDL, setQueensDL] = useState(true)
  const [brooklynDL, setBrooklynDL] = useState(true)
  const [jerseyDL, setJerseyDL] = useState(true)

  //Price base
  const [price, setPrice] = useState(10000)




  async function getWebsite(){
    let url = window.location.href;
    console.log("THE WEBSITE IS" ,url)

  }
  


  return (
    <UserContext.Provider value={{manhattanDL, setManhattanDL, queensDL, setQueensDL, brooklynDL, setBrooklynDL, jerseyDL, setJerseyDL, price, setPrice  }}>
      <div>
        <NavBar></NavBar>
        <LandingPage/>
      </div>
    </UserContext.Provider>
  );
}

export default App;
