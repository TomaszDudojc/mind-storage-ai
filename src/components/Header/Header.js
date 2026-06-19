import React from "react";
import { LuBrainCircuit } from "react-icons/lu";
import LogoutIcon from '@mui/icons-material/Logout';

function Header(props) {
  function handleLogout() {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <header>
      <h1><LuBrainCircuit className="ai-glow-icon" /> Mind Storage AI{props.isLogged && <button className="logoutButton" onClick={handleLogout}><LogoutIcon style={{ fontWeight: 700, fontSize: "46px" }} /></button>}</h1>
    </header>
  );
}

export default Header;
