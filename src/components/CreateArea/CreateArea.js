import React, { useState , useRef, useEffect} from "react";
import { setItem } from '../../services/notes';
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import { Zoom } from "@mui/material";

function CreateArea(props) {  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); 
  const [alert, setAlert] = useState(false);
  const now = new Date().toLocaleString();
  const [time, setTime] = useState(now); 
  const mounted = useRef(true);
  const userId = props.userId;
  const userEmail = props.userEmail;

  const [isExpanded, setExpanded] = useState(false);

  setInterval(updateTime, 1000);  
  
  function updateTime() {
    const newTime = new Date().toLocaleString();
    setTime(newTime);
  }  

  useEffect(() => {
    if(alert) {
      setTimeout(() => {
        if(mounted.current) {
          setAlert(false);
        }
      }, 1000)
    }
  }, [alert])
  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setItem(userId, time, title, content, userEmail)
      .then(() => {
        if(mounted.current) {       
          setTitle('');
          setContent('');
          setAlert(true);
        }
      })
  };

  function expand() {
    setExpanded(true);
  } 

  return (
    <div>
      <form className="create-note" onSubmit={handleSubmit}>              
          <input className="time" name="time" onChange={e => setTime(e.target.value)} value={time} disabled/>      
        {isExpanded && (
          <input name="title" onChange={e => setTitle(e.target.value)} value={title} placeholder="Title" required/>
        )}
          <textarea name="content" onClick={expand} onChange={e => setContent(e.target.value)} value={content} placeholder="Take a note..." rows={isExpanded ? 3 : 1} required/>
          <Zoom in={isExpanded}>
            <Fab type="submit" className="buttonAdd">
              <AddIcon />
            </Fab>
        </Zoom>
      </form>
      {alert && <h3 className="info"> Note added 🖋 </h3>}
    </div>        
  );
}

export default CreateArea;
