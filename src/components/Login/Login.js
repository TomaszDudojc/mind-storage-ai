import React, { useState } from 'react';
import toast from 'react-hot-toast';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';

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
  const [showedRegisterForm, setRegisterForm] = useState(false);
  const [showedLoginForm, setLoginForm] = useState(false);

  const handleLogin = async e => {
    e.preventDefault();
    const data = await loginUser({ email, password });

    if (data.error === 'user_not_found') {
      toast.error('Ten adres e-mail nie jest zarejestrowany! 📧❓', { className: 'custom-toast custom-toast-delete' });
    } else if (data.error === 'wrong_password') {
      toast.error('Niepoprawne hasło! 🔒', { className: 'custom-toast custom-toast-delete' });
    }
    else if (data.token && data.user) {
      localStorage.setItem('loggedUserEmail', JSON.stringify(data.user.email));
      localStorage.setItem('loggedUserId', JSON.stringify(data.user.id));
      localStorage.setItem('loggedUserFirstName', JSON.stringify(data.user.firstName));

      setToken({ token: data.token });

      toast.success(`Witaj ponownie, ${data.user.firstName}! 👋`, { className: 'custom-toast' });
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    const data = await registerUser({ firstName, email, password });

    if (data.error === 'email_taken') {
      toast.error('Ten adres e-mail jest już zajęty! ⚠️', { className: 'custom-toast custom-toast-delete' });
    }
    else {
      setFirstName("");
      setEmail("");
      setPassword("");
      setRegisterForm(false);
      setLoginForm(true);
      toast.success('Konto zarejestrowane, możesz się zalogować! 🎉', { className: 'custom-toast' });
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
        <button className="loginButton" onClick={showLoginForm}>
          <LoginIcon /> Zaloguj się
        </button>
        {showedLoginForm && (
          <form className="form" onSubmit={handleLogin}>
            <input type="email" name="email" placeholder="E-mail" onChange={e => setEmail(e.target.value)} required />
            <input type="password" name="password" placeholder="Hasło" onChange={e => setPassword(e.target.value)} required />
            <button type="submit" className="authActionButton" aria-label="Zaloguj">
              <CheckIcon />
            </button>
          </form>
        )}
      </div>

      <div className="fromContainer">
        <button className="loginButton" onClick={showRegisterForm}>
          <PersonAddIcon /> Zarejestruj się
        </button>
        {showedRegisterForm && (
          <form className="form" onSubmit={handleRegister}>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => {
                const text = e.target.value;
                if (text.length > 0) {
                  setFirstName(text.charAt(0).toUpperCase() + text.slice(1));
                } else {
                  setFirstName("");
                }
              }}
              placeholder="Twoje imię"
              required
            />
            <input type="email" name="email" value={email} placeholder="E-mail" onChange={e => setEmail(e.target.value)} required />
            <input type="password" name="password" value={password} placeholder="Hasło" onChange={e => setPassword(e.target.value)} required />
            <button type="submit" className="authActionButton" aria-label="Zarejestruj">
              <AddIcon />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
