const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

module.exports = async function adminAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
