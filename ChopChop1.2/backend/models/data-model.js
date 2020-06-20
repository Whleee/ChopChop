const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Data = new Schema(
    {
        userID: { type: String, required: false },
        maxDistance: { type: String, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('database', Data)