import React, { useEffect, useRef, useState } from 'react';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import MailLockIcon from '@mui/icons-material/MailLock';
import NoEncryptionGmailerrorredIcon from '@mui/icons-material/NoEncryptionGmailerrorred';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import HowToRegIcon from '@mui/icons-material/HowToReg';

async function loginUser(credentials) {
  return fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  }).then(data => data.json());
}

async function registerUser(credentials) {
  return fetch('http://localhost:8080/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  }).then(data => data.json());
}

export default function Login({ setToken }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [alertPassword, setAlertPassword] = useState(false);
  const [alertEmail, setAlertEmail] = useState(false);
  const [alertEmailTaken, setAlertEmailTaken] = useState(false);
  const [alertRegistred, setAlertRegistred] = useState(false);

  const [showedRegisterForm, setRegisterForm] = useState(false);
  const [showedLoginForm, setLoginForm] = useState(false);

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const triggerAlert = (setAlertState) => {
    setAlertState(true);
    setTimeout(() => {
      if (mounted.current) setAlertState(false);
    }, 3000);
  };

  const handleLogin = async e => {
    e.preventDefault();
    const data = await loginUser({ email, password });

    if (data.error === 'user_not_found') {
      triggerAlert(setAlertEmail);
    } else if (data.error === 'wrong_password') {
      triggerAlert(setAlertPassword);
    } else if (data.token && data.user) {
      localStorage.setItem('loggedUserEmail', JSON.stringify(data.user.email));
      localStorage.setItem('loggedUserId', JSON.stringify(data.user.id));
      localStorage.setItem('loggedUserFirstName', JSON.stringify(data.user.firstName));
      setToken({ token: data.token });
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    const data = await registerUser({ firstName, email, password });

    if (data.error === 'email_taken') {
      triggerAlert(setAlertEmailTaken);
    } else {
      setFirstName("");
      setEmail("");
      setPassword("");
      setRegisterForm(false);
      setLoginForm(true);
      triggerAlert(setAlertRegistred);
    }
  };

  function showRegisterForm() {
    setRegisterForm(!showedRegisterForm);
    setLoginForm(false);
  }

  function showLoginForm() {
    setLoginForm(!showedLoginForm);
    setRegisterForm(false);
  }

  return (
    <div className="auth-container">
      <div className="fromContainer">
        <button className="loginButton" onClick={showLoginForm}><HowToRegIcon /> Please Login</button>
        {showedLoginForm && <form className="form" onSubmit={handleLogin}>
          <input type="email" name="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
          <input type="password" name="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>}
      </div>

      {alertRegistred && <h3 className="info"> Account registered, you can login <TaskAltIcon /></h3>}
      {alertPassword && <h3 className="info"> Uncorrect password <NoEncryptionGmailerrorredIcon /></h3>}
      {alertEmail && <h3 className="info"> This email is not registered <MailLockIcon /></h3>}

      <div className="fromContainer">
        <button className="loginButton" onClick={showRegisterForm} ><AppRegistrationIcon /> Please Register</button>
        {showedRegisterForm && <form className="form" onSubmit={handleRegister}>
          <input type="text"
            name="firstName" value={firstName}
            onChange={(e) => {
              const text = e.target.value;
              if (text.length > 0) {
                setFirstName(text.charAt(0).toUpperCase() + text.slice(1));
              } else {
                setFirstName("");
              }
            }} placeholder="Twoje imię"
            required />
          <input type="email" name="email" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} required />
          <input type="password" name="password" value={password} placeholder="Hasło" onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Register</button>
        </form>}
      </div>
      {alertEmailTaken && <h3 className="info"> Email already taken <MailLockIcon /></h3>}
    </div>
  );
}
