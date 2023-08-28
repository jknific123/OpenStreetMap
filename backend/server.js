require('dotenv').config()

const dbjs = require('./app/models/db');
const express = require('express');
const cors = require('cors');
const path = require('path');
// const mongoose =  require('mongoose');
const routesApi = require('./app/routes/routes');

const port = process.env.PORT || 3000;

const app = express();

const origin = process.env.NODE_ENV === 'production' ? 'https://quality-of-life-app-production.up.railway.app/' : 'http://localhost:4200';
app.use(cors({
    // port od angularja
    // origin: ['http://quality-of-life-app.fly.dev'], // fly.io
    origin: [origin], // railway.app
    credentials: true
}));

// uporabljamo json
app.use(express.json({ limit: '50mb' }));

// da se uporabljajo angular staticni fajli
app.use(express.static(path.join(__dirname, 'public')));

// vsi requesti ki imajo /api se routajo v routes.js fajlu
app.use('/api', routesApi);

// Make sure all routes fallback to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server started on port: ${port}`)});