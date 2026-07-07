const { verifyToken } = require('../utils/jwt');
const userDb = require('../db/userDb');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required. Access denied.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Token invalid or expired' });
    }

    const user = await userDb.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User linked to token does not exist' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Authentication internal server error' });
  }
}

module.exports = authenticate;
