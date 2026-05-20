import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import Chatbot from "../Chatbot/Chatbot";

function Note(props) {
  function handleClick() {
    props.onDelete(props.id);
  }

  return (
    <div className="note-wrapper">
      <div className="note">
        <p className="time">{props.time}</p>
        <h1>{props.title}</h1>
        <p>{props.content}</p>
        <div className="author">🖋 {props.userEmail}</div>
        <button className="note button" onClick={handleClick}><DeleteIcon /></button>        
        <Chatbot />
      </div>
    </div>
  );
}

export default Note;
