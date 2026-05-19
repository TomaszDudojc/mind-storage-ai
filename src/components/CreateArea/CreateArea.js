import React, { useState, useRef, useEffect } from "react";
import { setItem } from '../../services/notes';
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import { Zoom } from "@mui/material";
import Chatbot from "../Chatbot/Chatbot";

function CreateArea(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [alert, setAlert] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleString());
  const mounted = useRef(true);
  const userId = props.userId;
  const userEmail = props.userEmail;

  const [isExpanded, setExpanded] = useState(false);

  // POPRAWKA ZEGARA: Zamknięty w useEffect z funkcją czyszczącą (cleanup)
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval); // Czyszczenie zegara przy opuszczeniu komponentu
  }, []);

  // POPRAWKA ALERTU: Prostszy zapis bez użycia mounted.current
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setItem(userId, time, title, content, userEmail)
      .then(() => {
        setTitle('');
        setContent('');
        setAlert(true);
      });
  };

  function expand() {
    setExpanded(true);
  }

  return (
    <div>
      <div className="form-wrapper">
        <form className="create-note" onSubmit={handleSubmit}>
          <input className="time" name="time" value={time} disabled />
          {isExpanded && (
            <input name="title" onChange={e => setTitle(e.target.value)} value={title} placeholder="Title" required />
          )}
          <textarea name="content" onClick={expand} onChange={e => setContent(e.target.value)} value={content} placeholder="Take a note..." rows={isExpanded ? 3 : 1} required />
          <Zoom in={isExpanded}>
            <Fab type="submit" className="buttonAdd">
              <AddIcon />
            </Fab>
          </Zoom>
        </form>
        <Chatbot />
      </div>
      {alert && <h3 className="info"> Note added 🖋 </h3>}
    </div>
  );
}

export default CreateArea;
