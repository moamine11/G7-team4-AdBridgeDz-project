const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Agency = require('../models/agency');
const Post = require('../models/post');
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.agencyId = decoded.agencyId; 
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};


module.exports = router;
