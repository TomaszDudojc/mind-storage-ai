import React, { useState, useEffect } from "react";
import { setItem } from '../../services/notes';
import AddIcon from "@mui/icons-material/Add";
import { Fab, Zoom } from "@mui/material";
import Chatbot from "../Chatbot/Chatbot";
import toast from 'react-hot-toast';

function CreateArea(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [time, setTime] = useState(new Date().toLocaleString());
  const userId = props.userId;
  const userEmail = props.userEmail;
  const userFirstName = props.userFirstName;

  const [isExpanded, setExpanded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setItem(userId, time, title, content, userEmail, userFirstName)
      .then((createdNote) => {
        const noteToAdd = createdNote || {
          id: Date.now(),
          userId,
          time,
          title,
          content,
          userEmail,
          firstName: userFirstName
        };
        if (props.onAdd) {
          props.onAdd(noteToAdd);
        }
        setTitle('');
        setContent('');
        setExpanded(false);
        toast.success('Wpis dodany do pamiętnika 🖋', {
          className: 'custom-toast',
        });

        if (props.activeChatId === "create-area") {
          props.setActiveChatId(null);
        }
      })
      .catch(err => {
        console.error("Błąd podczas dodawania notatki:", err);
        toast.error("Nie udało się dodać wpisu ❌", {
          className: 'custom-toast custom-toast-error',
        });
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
        <Chatbot
          id={props.id}
          activeChatId={props.activeChatId}
          setActiveChatId={props.setActiveChatId}
          noteContext={{
            title: title || "Brak tytułu",
            content: content || "Użytkownik jeszcze nic nie napisał, zapytaj go jak mija mu dzień.",
            time: time,
            userName: props.userFirstName
          }}
        />
      </div>
    </div>
  );
}

export default CreateArea;
