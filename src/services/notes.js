export function getNotes(token) {
  return fetch('http://localhost:8080/notes', {
    headers: { 'Authorization': `Bearer ${token}` }    
  })
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        // Jeśli serwer zwrócił błąd (np. 401), dorzucamy informację o statusie do obiektu
        return { error: data.error || 'unauthorized', status: response.status };
      }
      return data;
    });
}

export function setItem(token, time, title, content, userEmail, firstName) {
  return fetch('http://localhost:8080/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ time, title, content, userEmail, firstName }) // userId zostanie nadane przez serwer z JWT
  }).then(data => data.json())
}

export function deleteItem(id, token) {
  return fetch('http://localhost:8080/notes/' + id, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(data => data.json())
}

export function updateItem(id, updatedData, token) {
  return fetch('http://localhost:8080/notes/' + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updatedData)
  }).then(data => data.json());
}
