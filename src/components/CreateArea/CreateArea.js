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

  // NAPRAWA BŁĘDU: Zegar musi być w useEffect, inaczej tworzy tysiące interwałów i wiesza Reacta
  useEffect(() => {
    mounted.current = true;
    const timer = setInterval(() => {
      if (mounted.current) {
        setTime(new Date().toLocaleString());
      }
    }, 1000);

    return () => {
      mounted.current = false;
      clearInterval(timer); // Czyszczenie pamięci przy demontażu
    };
  }, []);

  // Alert znikający po 1 sekundzie
  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => {
        if (mounted.current) {
          setAlert(false);
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Tworzymy obiekt nowej notatki do przekazania na ekran
    const newNote = { time, title, content };

    setItem(userId, time, title, content, userEmail)
      .then(() => {
        if (mounted.current) {
          // KLUCZOWA NAPRAWA: Jeśli rodzic przekazał funkcję odświeżającą listę, wywołujemy ją
          if (props.onAdd) {
            props.onAdd(newNote);
          }
          setTitle('');
          setContent('');
          setAlert(true);
        }
      })
      .catch((err) => {
        console.error("Error saving note:", err);
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
