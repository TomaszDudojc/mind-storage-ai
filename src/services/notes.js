export function getNotes() {
  return fetch('http://localhost:3333/notes')
    .then(data => data.json())
}

export function setItem(userId, time, title, content, userEmail, firstName) {
  return fetch('http://localhost:3333/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, time, title, content, userEmail, firstName })
  })
    .then(data => data.json())
}

export function deleteItem(id) {
  return fetch('http://localhost:3333/notes/' + id, {
    method: 'DELETE'
  })
    .then(data => data.json())
}

export function updateItem(id, updatedData) {
  return fetch('http://localhost:3333/notes/' + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedData) // object { title, content }
  })
    .then(data => data.json());
}

