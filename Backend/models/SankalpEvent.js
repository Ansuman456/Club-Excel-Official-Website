const mongoose = require('mongoose');

const SankalpEventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: false,
        default: ""
    },
    time: {
        type: String,
        required: false,
        default: ""
    },
    vanue: {
        type: String,
        required: false,
        default: ""
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
        default: 'upcoming'
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
