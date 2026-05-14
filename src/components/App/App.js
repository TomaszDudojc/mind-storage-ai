import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import Login from '../Login/Login';
import Preferences from '../Preferences/Preferences';
import useToken from './useToken';
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Home from "../Home/Home";

function App() {
  const { token, setToken } = useToken();
  const loggedUserEmailString = localStorage.getItem('loggedUserEmail');
  const loggedUserEmail = JSON.parse(loggedUserEmailString);
  const loggedUserIdString = localStorage.getItem('loggedUserId');  
  const loggedUserId = JSON.parse(loggedUserIdString);  
  
  if(!token) {
    return (
    <div>
      <Header />
      <Login setToken={setToken}/>
      <Footer />    
    </div>);
  }

  return (
    <div className="wrapper">
      <Header isLogged="true"/>          
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home currentUserId = {loggedUserId} currentUserEmail={loggedUserEmail}/>} /> 
          <Route path="/dashboard" element={<Dashboard />} />           
          <Route path="/preferences" element={<Preferences />} /> 
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );    
}

export default App;
