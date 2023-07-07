require('dotenv').config()

const dbjs = require('./app/models/db');
const express = require('express');
const cors = require('cors');
// const mongoose =  require('mongoose');
const routesApi = require('./app/routes/routes');

const app = express();

app.use(cors({
    // port od angularja
    origin: ['http://localhost:4200'],
    credentials: true
}));

// uporabljamo json
app.use(express.json());

// vsi requesti ki imajo /api se routajo v routes.js fajlu
app.use('/api', routesApi);


app.listen(3000, () => {
    console.log('Server started.')});