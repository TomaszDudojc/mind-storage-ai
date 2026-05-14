export function getUsers() {
    return fetch('http://localhost:3333/users')
      .then(data => data.json())
  }

export function setUser(email, hashedPassword) {
    return fetch('http://localhost:3333/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, hashedPassword})
    })
      .then(data => data.json())
  }