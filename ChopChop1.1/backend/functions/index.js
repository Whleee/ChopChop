const functions = require('firebase-functions');
const app = require('express')();

const {
    getAllDistances
} = require('./APIs/distance')

app.get('/distance', getAllDistances);
exports.api = functions.https.onRequest(app);