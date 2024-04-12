import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './output.css';
import {Route, Routes, Navigate} from 'react-router-dom';
import Home from "./Pages/home/Home";
import ApplicationLayout from "./layout/applicationLayout";
import Join from "./Pages/home/join";

function App() {

    const [subdomain, setSubDomain] = useState("null");
    const [communityFound, setCommunity] = useState("null");

    useEffect(() => {
        const host = window.location.host; // gets the full domain of the app

        const arr = host
            .split(".")
            .slice(0, host.includes("local") ? -1 : -2);
        if (arr.length > 0) {
            setSubDomain(arr[0]);
            console.log(arr[0])
        }
    }, []);


  return (
      <>

        <Routes>
            <Route path="/" element={<ApplicationLayout host={subdomain}>

                <Join/>
                <Home host={subdomain}/></ApplicationLayout>}/>

        </Routes>
      </>

    );
}

export default App;
