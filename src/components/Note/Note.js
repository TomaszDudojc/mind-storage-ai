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
        <Chatbot
          id={props.id}
          activeChatId={props.activeChatId}
          setActiveChatId={props.setActiveChatId}
          noteContext={{
            title: props.title,
            content: props.content,
            time: props.time,
            userName: props.userFirstName
          }}
        />
      </div>
    </div>
  );
}

export default Note;

