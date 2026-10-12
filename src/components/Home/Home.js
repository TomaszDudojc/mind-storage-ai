import React, { useEffect, useRef, useState } from 'react';
import CreateArea from "../CreateArea/CreateArea";
import Note from "../Note/Note";
import { getNotes, deleteItem, updateItem } from '../../services/notes';

function Home(props) {
  const [notes, setNotes] = useState([]);
  const mounted = useRef(true);
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    mounted.current = true;
    getNotes(props.token)
      .then(items => {
        if (mounted.current) {
          // DIAGNOSTYKA: Sprawdzamy w konsoli przeglądarki, co dokładnie przyszło z backendu
          console.log("Dane odebrane z serwera przez getNotes:", items);

          if (Array.isArray(items)) {
            setNotes(items);
          } else {
            console.error("Serwer zamiast tablicy notatek zwrócił obiekt błędu:", items);
            // Jeśli serwer zwrócił błąd autoryzacji (np. wygasły token), czyścimy sesję
            if (items && (items.error === 'unauthorized' || items.status === 401)) {
              localStorage.clear();
              window.location.reload(); // Odświeżenie przeniesie użytkownika do ekranu logowania
            } else {
              setNotes([]); // Bezpieczna pusta tablica chroniąca przed awarią .map
            }
          }
        }
      })

      .catch(error => {
        console.error("Błąd pobierania notatek:", error);
      });

    return () => {
      mounted.current = false;
    };
  }, [props.token]);

  function addNote(newNote) {
    setNotes(prevNotes => [...prevNotes, newNote]);
  }

  function deleteNote(id) {
    deleteItem(id, props.token).catch(err => console.error("Błąd usuwania wpisu:", err)); // Dodano props.token
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

    updateItem(id, updatedData, props.token).catch(error => { // Dodano props.token
      console.error("Błąd podczas aktualizacji notatki na serwerze:", error);
    });
  }

  return (
    <div>
      <CreateArea
        token={props.token} // Dodano przekazywanie tokenu do komponentu CreateArea
        userId={props.currentUserId}
        userEmail={props.currentUserEmail}
        userFirstName={props.currentUserFirstName}
        id="create-area"
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        onAdd={addNote}
      />
      <div className="notes-container">
        {notes.map(item => (
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
