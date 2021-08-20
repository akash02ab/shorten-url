const mongoose = require('mongoose');

const URLSchema = new mongoose.Schema({
    url: {
        type: String,
        unique: true,
    },
    shortenUrl : {
        type: String,
        unique: true,
    }
});

const URLModel = new mongoose.model('URL', URLSchema);

module.exports = URLModel;