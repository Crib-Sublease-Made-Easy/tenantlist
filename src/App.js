//Pages
import LandingPage from './pages/Landing/landing';
import TenantRequestPage from './pages/Tenant/tenantRequests';


import NavBar from './NavBar/navbar';
import './App.css';
import {UserContext} from './UserContext';
import { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom"



function App() {



  //Location base
  const [manhattanDL, setManhattanDL] = useState(true)
  const [queensDL, setQueensDL] = useState(true)
  const [brooklynDL, setBrooklynDL] = useState(true)
  const [jerseyDL, setJerseyDL] = useState(true)

  //Price base
  const [price, setPrice] = useState(10000)



  return (
    <UserContext.Provider value={{manhattanDL, setManhattanDL, queensDL, setQueensDL, brooklynDL, setBrooklynDL, jerseyDL, setJerseyDL, price, setPrice  }}>
      <NavBar/>
      <Routes>
        <Route path="/" element={ <LandingPage/> } />
        <Route path="/subleasemyroomintro" element={ <TenantRequestPage/> } />
      </Routes>
      {/* <LandingPage/> */}
      
    </UserContext.Provider>
  );
}

export default App;
