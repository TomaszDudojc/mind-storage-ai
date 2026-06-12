const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

function generateSecureToken() {
  return crypto.randomBytes(32).toString('hex');
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

    const isPasswordValid = bcrypt.compareSync(password, user.hashedPassword);
    if (!isPasswordValid) {
      return res.json({ error: 'wrong_password' });
    }

    res.send({
      token: generateSecureToken(),
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

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

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

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
