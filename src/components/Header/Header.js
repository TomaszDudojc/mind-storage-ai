import React from "react";
//import EditNoteIcon from '@mui/icons-material/EditNote';
import { LuBrainCircuit } from "react-icons/lu"; // Mózg z liniami obwodów drukowanych (bardzo technologiczny/AI)
import SettingsPowerIcon from '@mui/icons-material/SettingsPower';

function Header(props) {
  function handleLogout() {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <header>
      <h1><LuBrainCircuit className="ai-glow-icon" /> Mind Storage AI{props.isLogged && <button className="logoutButton" onClick={handleLogout}><SettingsPowerIcon style={{ fontWeight: 700, fontSize: "46px" }} /></button>}</h1>
    </header>
  );
}

export default Header;
