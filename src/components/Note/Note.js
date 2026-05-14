import React from "react";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

function Note(props) {
  function handleClick() {
    props.onDelete(props.id);
  }  

  return (
    <div className="note">
      <p className="time">{props.time}</p>      
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <div className="author">🖋 {props.userEmail}</div>
      <button className="note button" onClick={handleClick}><DeleteOutlineOutlinedIcon /></button>
    </div>
  );
}

export default Note;
