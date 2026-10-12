import { API_URL } from '../config';

export function getUsers() {
  return fetch(`${API_URL}/users`)
    .then(data => data.json())
}

export function setUser(firstName, email, hashedPassword) {
  return fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ firstName, email, hashedPassword })
  })
    .then(data => data.json())
}