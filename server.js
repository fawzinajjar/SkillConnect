const express = require('express');
const connectDB = require('./config/db');
const { removeAllListeners } = require('nodemon');
const app = express();


// Connect Database //
connectDB();

// Init Middleware //
app.use(express.json({ extended: false }));

// Defining Route that node server will handle and accept req res on it //
app.get('/', (req, res) => res.send('API Running'));

// Defining Routes that node server will handle and accept req res on them //
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));


// Declaring Port Value To Variable //
const PORT = process.env.PORT || 5000;

// Set to return Node.js http Server To listeners Requests On Port 5000 //
app.listen(PORT, () => console.log(`The server started on ${PORT}`));
