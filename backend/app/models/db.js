const mongoose = require('mongoose');

let dbURI = process.env.DATABASE_URL;
if (process.env.NODE_ENV === 'production') {
    dbURI = process.env.MONGODB_CLOUD_URI;
}

// da se znebimo deprecation warninga
mongoose.set('strictQuery', false);

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
    console.log(`Mongoose je povezan na ${dbURI}.`);
});

mongoose.connection.on('error', error => {
    console.log('Mongoose napaka pri povezavi: ', error);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose ni povezan.');
});

const correctShutDown = (message, callback) => {
    mongoose.connection.close(() => {
        console.log(`Mongoose je zaprl povezavo preko '${message}'.`);
        callback();
    });
};// Ponovni zagon nodemon
process.once('SIGUSR2', () => {
    correctShutDown('nodemon ponovni zagon', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// Izhod iz aplikacije
process.on('SIGINT', () => {
    correctShutDown('izhod iz aplikacije', () => {
        process.exit(0);
    });
});

// Izhod iz aplikacije na Heroku
process.on('SIGTERM', () => {
    pravilnaUstavitev('izhod iz aplikacije na Heroku', () => {
        process.exit(0);
    });
});

// TODO tukaj je treba dodat modele
require('./modelUser.js')
