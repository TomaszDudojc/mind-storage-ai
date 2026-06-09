import React, { useEffect, useRef, useState } from 'react';
import CreateArea from "../CreateArea/CreateArea";
import Note from "../Note/Note";
import { getNotes, deleteItem, updateItem } from '../../services/notes';

function Home(props) {
  const [notes, setNotes] = useState([]);
  const mounted = useRef(true);
  const [activeChatId, setActiveChatId] = useState(null);

  const userNotes = notes.filter(function (item) {
    return String(item.userId) === String(props.currentUserId);
  });

  useEffect(() => {
    mounted.current = true;
    getNotes()
      .then(items => {
        if (mounted.current) {
          setNotes(items);
        }
      })
      .catch(error => {
        console.error("Błąd pobierania notatek:", error);
      });

    return () => {
      mounted.current = false;
    };
  }, []);

  function addNote(newNote) {
    setNotes(prevNotes => [...prevNotes, newNote]);
  }

  function deleteNote(id) {
    deleteItem(id).catch(err => console.error("Błąd usuwania wpisu:", err));
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    if (activeChatId === id) {
      setActiveChatId(null);
    }
  }

  function editNote(id, updatedData) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if (note.id === id) {
          return { ...note, ...updatedData };
        }
        return note;
      });
    });
    updateItem(id, updatedData).catch(error => {
      console.error("Błąd podczas aktualizacji notatki na serwerze:", error);
    });
  }

  return (
    <div>
      <CreateArea
        userId={props.currentUserId}
        userEmail={props.currentUserEmail}
        userFirstName={props.currentUserFirstName}
        id="create-area"
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        onAdd={addNote}
      />
      <div className="notes-container">
        {userNotes.map(item => (
          <Note
            key={item.id}
            id={item.id}
            time={item.time}
            title={item.title}
            content={item.content}
            userEmail={item.userEmail}
            userFirstName={item.firstName}
            onDelete={deleteNote}
            onEdit={editNote}
            activeChatId={activeChatId}
            setActiveChatId={setActiveChatId}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
