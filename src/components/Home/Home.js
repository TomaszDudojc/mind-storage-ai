import React, { useEffect, useRef, useState } from 'react';
import CreateArea from "../CreateArea/CreateArea";
import Note from "../Note/Note";
import { getNotes } from '../../services/notes';
import { deleteItem } from '../../services/notes';

function Home(props) {  
  const [notes, setNotes] = useState([]);
  const mounted = useRef(true);

  const userNotes = notes.filter(function(item) {
    return item.userId==props.currentUserId;
  });
  

  useEffect(() => {
    mounted.current = true;    
    if(notes.length && !alert) {
      return;
    }
    getNotes()
      .then(items => {
        if(mounted.current) {
          setNotes(items)
        }
      })
      return () => mounted.current = false;      
  }, [alert, notes])  

  function deleteNote(id) { 
    deleteItem(id);   
  }

  return (
    <div>        
    <CreateArea userId={props.currentUserId} userEmail={props.currentUserEmail}/>
    {userNotes.map(item => <Note key={item.id} id={item.id} time={item.time} title={item.title} content={item.content} userEmail={item.userEmail} onDelete={deleteNote} />)}
    </div>
  );
}

export default Home;