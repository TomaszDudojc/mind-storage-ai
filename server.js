const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

function generateToken() {
  const generatedToken = Math.floor(Math.random() * 1000000000000000);
  return (generatedToken);
}

app.use(cors());

app.use('/login', (req, res) => {
  res.send({
    token: ';sE%&c?'+generateToken()+'r*E]~t'+generateToken()+'t,.#O'+generateToken()+'!K(}e/N'+generateToken()   
  });
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}/login`);
});