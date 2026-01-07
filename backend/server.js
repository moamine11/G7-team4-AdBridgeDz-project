const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');


const envPath = path.join(__dirname, '.env');
const envLocalPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
}
if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath, override: true });
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const companyRoutes = require('./routes/companies');
const postRoutes = require('./routes/posts');
const agencyRoutes = require('./routes/agencies');
const serviceRoutes = require('./routes/services');
const adminRoutes = require('./routes/admins');
const authRoutes = require('./routes/auth');
const geocodeRoutes = require('./routes/geocode');

const app = express();
app.use(cors());
app.use(express.json());



app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Body:', req.body);
  }
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/companies', companyRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/agencies', agencyRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/geocode', geocodeRoutes);

app.use('/admin', adminRoutes);
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000, 
    socketTimeoutMS: 45000, 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
