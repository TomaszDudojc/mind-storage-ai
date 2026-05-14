export function getNotes() {
    return fetch('http://localhost:3333/notes')
      .then(data => data.json())
  }

export function setItem(userId, time, title, content, userEmail) {
    return fetch('http://localhost:3333/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({userId, time, title, content, userEmail})
    })
      .then(data => data.json())
  }

  export function deleteItem(id) {       
    return fetch('http://localhost:3333/notes/'+id, {
      method: 'DELETE'
    })
      .then(data => data.json())
  }
