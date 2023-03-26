const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Define a secret key for signing and verifying JWT tokens4
const secretKey = 'mySecretKey';
app.use(cors());

// Define a middleware function to verify the JWT token
const verifyToken = (req, res, next) => {
  // Get the authorization header from the request
  const authHeader = req.headers['authorization'];

  // Check if the authorization header is present
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  // Split the authorization header into the scheme and token
  const [scheme, token] = authHeader.split(' ');

  // Check if the token is present and has the correct scheme
  if (!token || scheme !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Verify the token using the secret key
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // If the token is valid, save the decoded payload in the request object
    req.user = decoded;
    next();
  });
};

// Define an API route that requires authorization
app.get('/verify', verifyToken, (req, res) => {
  // The user is authorized, send the requested data
  // firebase write {token:xxxxx, auth: true}
  res.json({ data: `This is some secret data ${req.user.id}` });
});


app.get('/genrate', (req, res) => {
  const generateToken = (timeStamp) => {
    return jwt.sign({ id: timeStamp }, secretKey, { expiresIn: '1h' });
  };
  const currentTime = Date.now(); // crome tab
  const token = generateToken(currentTime);
  // firebase write {token:xxxxx, auth: false}
  console.log(token);
  res.json({ jwtToken: token });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
