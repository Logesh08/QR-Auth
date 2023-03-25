const jwt = require('jsonwebtoken');

const secretKey = 'mySecretKey';

const generateToken = (user) => {
  // Create a JWT token with a payload containing the user's ID
  return jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
};

// Example usage
const user = { id: 123 };
const token = generateToken(user);
console.log(token);
