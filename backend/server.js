require('dotenv').config()

const dbjs = require('./app/models/db');
const express = require('express');
const cors = require('cors');
// const mongoose =  require('mongoose');
const routesApi = require('./app/routes/routes');

const port = process.env.PORT || 3000;

const app = express();

app.use(cors({
    // port od angularja
    origin: ['http://localhost:4200'],
    credentials: true
}));

// uporabljamo json
app.use(express.json({ limit: '50mb' }));

// vsi requesti ki imajo /api se routajo v routes.js fajlu
app.use('/api', routesApi);


app.listen(port, '0.0.0.0', () => {
    console.log(`Server started on port: ${port}`)});