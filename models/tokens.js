const mongoose = require('mongoose')

let blockList = new mongoose.Schema({
    header: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('blocklist', blockList)