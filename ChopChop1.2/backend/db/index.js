const mongoose = require('mongoose')

mongoose
    .connect('mongodb+srv://Whlee:bankaisa@chopchop-lbknb.gcp.mongodb.net/UserData?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db