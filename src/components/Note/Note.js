import React, { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Chatbot from "../Chatbot/Chatbot";

function Note(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(props.title);
  const [editContent, setEditContent] = useState(props.content);
  const [wasSaved, setWasSaved] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleDeleteClick() {
    setIsDeleting(true);
    setTimeout(() => {
      props.onDelete(props.id);
    }, 500);
  }

  function handleSaveClick() {
    if (props.onEdit) {
      props.onEdit(props.id, { title: editTitle, content: editContent });
    }
    setIsEditing(false);
    setWasSaved(true);
    setTimeout(() => {
      setWasSaved(false);
    }, 1000);
  }

  function handleCancelClick() {
    setEditTitle(props.title);
    setEditContent(props.content);
    setIsEditing(false);
  }

  let noteClass = "note";
  if (wasSaved) noteClass += " just-saved";
  if (isDeleting) noteClass += " deleting";

  return (
    <div className="note-wrapper">
      <div className={noteClass}>
        {isEditing ? (
          <>
            <p className="time">{props.time}</p>
            <textarea
              type="text"
              className="edit-title-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <textarea
              className="edit-content-textarea"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="author">🖋 {props.userEmail}</div>

            <div className="note-buttons-container">
              <button className="note-action-btn save-btn" onClick={handleSaveClick}>
                <CheckIcon />
              </button>
              <button className="note-action-btn cancel-btn" onClick={handleCancelClick}>
                <CloseIcon />
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="time">{props.time}</p>
            <h1>{props.title}</h1>
            <textarea
              className="preview-content-textarea"
              value={props.content}
              readOnly
            />
            <div className="author">🖋 {props.userEmail}</div>

            <div className="note-buttons-container">
              <button className="note-action-btn edit-btn" onClick={() => setIsEditing(true)}>
                <EditIcon />
              </button>
              <button className="note-action-btn delete-btn" onClick={handleDeleteClick}>
                <DeleteIcon />
              </button>
            </div>
          </>
        )}
      </div>
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
  );
}

export default Note;
