import React, { useEffect, useRef, useState } from 'react';
import CreateArea from "../CreateArea/CreateArea";
import Note from "../Note/Note";
import { getNotes } from '../../services/notes';
import { deleteItem } from '../../services/notes';

function Home(props) {
  const [notes, setNotes] = useState([]);
  const mounted = useRef(true);

  // NOWOŚĆ: Globalny stan kontrolujący, który chatbot jest obecnie otwarty
  // Może przyjąć wartość: id_notatki (string/number), "create-area" lub null
  const [activeChatId, setActiveChatId] = useState(null);

  const userNotes = notes.filter(function (item) {
    return item.userId == props.currentUserId;
  });

  useEffect(() => {
    mounted.current = true;
    if (notes.length && !alert) {
      return;
    }
    getNotes()
      .then(items => {
        if (mounted.current) {
          setNotes(items)
        }
      })
    return () => mounted.current = false;
  }, [alert, notes])

  function deleteNote(id) {
    deleteItem(id);
    if (activeChatId === id) {
      setActiveChatId(null);
    }
  }

  return (
    <div>
      <CreateArea
        userId={props.currentUserId}
        userEmail={props.currentUserEmail}
        userFirstName={props.currentUserFirstName}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
      />

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
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
        />
      ))}
    </div>
  );
}

export default Home;
