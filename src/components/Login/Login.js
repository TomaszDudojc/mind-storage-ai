import React, { useEffect, useRef, useState } from 'react';
import { setUser } from '../../services/users';
import { getUsers } from '../../services/users';
import bcrypt from 'bcryptjs';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import MailLockIcon from '@mui/icons-material/MailLock';
import NoEncryptionGmailerrorredIcon from '@mui/icons-material/NoEncryptionGmailerrorred';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import HowToRegIcon from '@mui/icons-material/HowToReg';

async function loginUser(credentials) {
 return fetch('http://localhost:8080/login', {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(credentials)
 })
   .then(data => data.json())
}

export default function Login({ setToken }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [alertPassword, setAlertPassword] = useState(false);
  const [alertEmail, setAlertEmail] = useState(false);
  const [alertEmailTaken, setAlertEmailTaken] = useState(false);
  const [alertRegistred, setAlertRegistred] = useState(false);
  const [users, setUsers] = useState([]);
  const mounted = useRef(true);
  const salt = bcrypt.genSaltSync(10);  

  useEffect(() => {
    if(alertPassword) {
      setTimeout(() => {
        if(mounted.current) {
          setAlertPassword(false);
        }
      }, 3000)
    }
  }, [alertPassword])
  
  useEffect(() => {
    if(alertEmail) {
      setTimeout(() => {
        if(mounted.current) {
          setAlertEmail(false);
        }
      }, 3000)
    }
  }, [alertEmail])
  
  useEffect(() => {
    if(alertEmailTaken) {
      setTimeout(() => {
        if(mounted.current) {
          setAlertEmailTaken(false);
        }
      }, 3000)
    }
  }, [alertEmailTaken])

  useEffect(() => {
    if(alertRegistred) {
      setTimeout(() => {
        if(mounted.current) {
          setAlertRegistred(false);
        }
      }, 3000)
    }
  }, [alertRegistred])

  useEffect(() => {
    mounted.current = true;    
    if(users.length && !alertRegistred) {
      return;
    }
    getUsers()
      .then(users => {
        if(mounted.current) {
          setUsers(users)
        }
      })
      return () => mounted.current = false;
  }, [alertRegistred, users])
 
  function findUser(email) { 
    const findedUser = users.find((user) => user.email == email);
    return (findedUser);      
  }

  const handleLogin = async e => {
    e.preventDefault();
    const token = await loginUser({
      email,
      password
    });

    const findedUser = findUser(email);
    if(findedUser) {
      if (bcrypt.compareSync(password, findedUser.hashedPassword)) {
        localStorage.setItem('loggedUserEmail', JSON.stringify(email));        
        localStorage.setItem('loggedUserId', JSON.stringify(findedUser.id));
        setToken(token);        
      }
      else{
        setAlertPassword(true);
      }
    }
    else {
      setAlertEmail(true);
    }    
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    if(findUser(email)){
      setAlertEmailTaken(true);
    }
    else {
      const hashedPassword = bcrypt.hashSync(password, salt);      
      setUser(email, hashedPassword)
      .then(() => {
        if(mounted.current) {       
          //setEmail('');
          //setPassword('');
          setRegisterForm(false);
          setLoginForm(true);                  
          setAlertRegistred(true);         
        }
      })         
    }
  }

  const [showedRegisterForm, setRegisterForm] = useState(false); 
  function showRegisterForm(){
    setRegisterForm(!showedRegisterForm);
    setLoginForm(false);
  }
  
  const [showedLoginForm, setLoginForm] = useState(false); 
  function showLoginForm(){
    setLoginForm(!showedLoginForm);
    setRegisterForm(false);
  }

  return(
    <div>
      <div className="fromContainer">      
      <button className="loginButton" onClick={showLoginForm}><HowToRegIcon /> Please Login</button>
      {showedLoginForm && <form className="form" onSubmit={handleLogin}>                        
        <input type="email" name="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required/> 
        <input type="password" name="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required/>       
        <button type="submit">Login</button>
      </form>}
      </div>
      {alertRegistred && <h3 className="info"> Account registered, you can login < TaskAltIcon/></h3>}
      {alertPassword && <h3 className="info"> Uncorrect password <NoEncryptionGmailerrorredIcon /></h3>}
      {alertEmail && <h3 className="info"> This email is not registered <MailLockIcon /></h3>}

      <div className="fromContainer">
      <button className="loginButton" onClick={showRegisterForm} ><AppRegistrationIcon /> Please Register</button>      
      {showedRegisterForm && <form className="form" onSubmit={handleRegister}>                        
        <input type="email" name="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required/> 
        <input type="password" name="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required/>       
        <button type="submit">Register</button>
      </form>}
      </div>
      {alertEmailTaken && <h3 className="info"> Email already taken < MailLockIcon/></h3>}      
    </div>
  ); 
}