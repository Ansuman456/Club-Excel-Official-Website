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
        default: ""
    },
    photos: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['upcoming', 'completed'],
        default: 'upcoming'
    },
    whatsappGroup: {
        type: String,
        required: false,
        default: ""
    },
    noOfAttendies: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('SankalpEvent', SankalpEventSchema);
