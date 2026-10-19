import { AUTH_API_URL } from '../config';

export async function getNotes(token) {
  const response = await fetch(`${AUTH_API_URL}/notes`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();

  if (!response.ok) {
    // Zachowujemy obiekt dla autowylogowania przy wygaśnięciu sesji (401)
    if (response.status === 401) {
      return { error: data.error || 'unauthorized', status: response.status };
    }
    throw new Error(`Błąd pobierania notatek: ${response.status}`);
  }
  return data;
}

export async function setItem(token, time, title, content, userEmail, firstName) {
  const response = await fetch(`${AUTH_API_URL}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ time, title, content, userEmail, firstName })
  });

  if (!response.ok) {
    throw new Error(`Błąd dodawania notatki: ${response.status}`);
  }
  return response.json();
}

export async function deleteItem(id, token) {
  const response = await fetch(`${AUTH_API_URL}/notes/` + id, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error(`Błąd usuwania notatki: ${response.status}`);
  }
  return response.json();
}

export async function updateItem(id, updatedData, token) {
  const response = await fetch(`${AUTH_API_URL}/notes/` + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updatedData)
  });

  if (!response.ok) {
    throw new Error(`Błąd aktualizacji notatki: ${response.status}`);
  }
  return response.json();
}
