const mongoose = require('mongoose');

const SankalpEventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    vanue: {
        type: String,
        required: true
    },
    rules: {
        type: String,
        required: true
    },
    bannerImg: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['upcoming', 'completed'],
        required: true
    },
    link: {
        type: String,
        required: false,
        default: ""
    },
    whatsappGroup: {
        type: String,
        required: false,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model('SankalpEvent', SankalpEventSchema);
