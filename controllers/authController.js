const userDb = require('../db/userDb');

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const existingUser = await userDb.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const user = await userDb.createUser(name, email, password);
    return res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register
};
