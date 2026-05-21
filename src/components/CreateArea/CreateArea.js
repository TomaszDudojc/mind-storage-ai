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
  const userId = props.userId;
  const userEmail = props.userEmail;

  const [isExpanded, setExpanded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
        // POPRAWKA: Sprawdzamy bezpośrednio, czy otwarty chat to nasz obszar tworzenia
        if (props.activeChatId === "create-area") {
          props.setActiveChatId(null); // Zamykamy czat
        }
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
            <input name="title" onChange={e => setTitle(e.target.value)} value={title} placeholder="Tytuł wpisu..." required />
          )}
          {/* Zmiana placeholderu na styl pamiętnika rozwoju osobistego */}
          <textarea
            name="content"
            onClick={expand}
            onChange={e => setContent(e.target.value)}
            value={content}
            placeholder="Zapisz swoje przemyślenia ..."
            rows={isExpanded ? 3 : 1}
            required
          />
          <Zoom in={isExpanded}>
            <Fab type="submit" className="buttonAdd">
              <AddIcon />
            </Fab>
          </Zoom>
        </form>

        {/* 
          NOWOŚĆ: Przekazujemy propsy sterujące globalnym stanem chatu 
          oraz na bieżąco przekazujemy wpisywany przez użytkownika tekst 
        */}
        <Chatbot
          id={props.id}
          activeChatId={props.activeChatId}
          setActiveChatId={props.setActiveChatId}
          noteContext={{
            title: title || "Brak tytułu",
            content: content || "Użytkownik jeszcze nic nie napisał, zapytaj go jak mija mu dzień.",
            time: time
          }}
        />
      </div>
      {alert && <h3 className="info"> Wpis dodany do pamiętnika 🖋 </h3>}
    </div>
  );
}

export default CreateArea;
