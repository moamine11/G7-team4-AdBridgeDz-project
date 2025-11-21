require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const companyRoutes = require('./routes/companies');
const postRoutes = require('./routes/posts');
const agencyRoutes = require('./routes/agencies');
const serviceRoutes = require('./routes/services');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/companies', companyRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/agencies', agencyRoutes);
app.use('/api/services', serviceRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
