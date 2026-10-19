const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Ładowanie pliku .env na samym początku
const jwt = require('jsonwebtoken'); // Zastąpiono crypto przez jsonwebtoken//
const app = express();
const port = 8080;
const JWT_SECRET = process.env.JWT_SECRET; // Bezpieczne pobranie klucza z systemu

app.use(cors());
app.use(express.json());

// Middleware sprawdzający i dekodujący token JWT
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    // Weryfikacja podpisu tokenu i odczytanie danych (payload)
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId; // Wyciągamy userId zapisane w tokenie
    next();
  } catch (error) {
    return res.status(401).json({ error: 'unauthorized' });
  }
}

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await fetch(`http://localhost:3333/users?email=${email}`);
    const users = await response.json();
    const user = users[0];

    if (!user) {
      return res.json({ error: 'user_not_found' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid) {
      return res.json({ error: 'wrong_password' });
    }

    // Tworzenie tokenu JWT z zaszytym id użytkownika, ważnego przez 1 dzień
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });

    res.send({
      //token: generateSecureToken(),
      token: token,
      user: { id: user.id, firstName: user.firstName, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'server_error' });
  }
});

app.post('/register', async (req, res) => {
  const { firstName, email, password } = req.body;

  try {
    const checkResponse = await fetch(`http://localhost:3333/users?email=${email}`);
    const existingUsers = await checkResponse.json();

    if (existingUsers.length > 0) {
      return res.json({ error: 'email_taken' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const saveResponse = await fetch('http://localhost:3333/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, email, hashedPassword })
    });
    const newUser = await saveResponse.json();

    res.status(201).json({ message: 'Success', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'server_error' });
  }
});

// Bezpieczne pobieranie notatek powiązanych z userId z tokenu JWT
app.get('/notes', requireAuth, async (req, res) => {
  try {
    const response = await fetch(`http://localhost:3333/notes?userId=${req.userId}`);
    const notes = await response.json();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'server_error' });
  }
});

// Bezpieczne dodawanie notatki
app.post('/notes', requireAuth, async (req, res) => {
  try {
    const saveResponse = await fetch('http://localhost:3333/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...req.body, userId: req.userId })
    });
    const newNote = await saveResponse.json();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'server_error' });
  }
});

// Bezpieczne usuwanie (serwer sprawdza czy jesteś właścicielem)
app.delete('/notes/:id', requireAuth, async (req, res) => {
  try {
    const checkResponse = await fetch(`http://localhost:3333/notes/${req.params.id}`);
    if (!checkResponse.ok) return res.status(404).json({ error: 'not_found' });
    
    const note = await checkResponse.json();
    if (note.userId !== req.userId) {
      return res.status(403).json({ error: 'forbidden' });
    }

    await fetch(`http://localhost:3333/notes/${req.params.id}`, { method: 'DELETE' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'server_error' });
  }
});

// Bezpieczna edycja (serwer sprawdza czy jesteś właścicielem)
app.patch('/notes/:id', requireAuth, async (req, res) => {
  try {
    const checkResponse = await fetch(`http://localhost:3333/notes/${req.params.id}`);
    if (!checkResponse.ok) return res.status(404).json({ error: 'not_found' });
    
    const note = await checkResponse.json();
    if (note.userId !== req.userId) {
      return res.status(403).json({ error: 'forbidden' });
    }

    const updateResponse = await fetch(`http://localhost:3333/notes/${req.params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const updatedNote = await updateResponse.json();
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: 'server_error' });
  }
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
