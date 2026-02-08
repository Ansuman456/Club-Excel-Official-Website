const mongoose = require('mongoose');

const RecruitmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollno: {
        type: String,
        required: true
    },
    registrationno: {
        type: String,
        required: true
    },
    nistemail: {
        type: String,
        required: true
    },
    personalemail: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    hackerRankId: {
        type: String,
        required: true
    },
    techstack: {
        type: String,
        required: true
    },
    phoneno: {
        type: String,
        required: true
    },
    locality: {
        type: String,
        enum: ['localite', 'hostelite'],
        required: true
    },
    whatsappGroup: {
        type: String,
        required: false,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model('Recruitment', RecruitmentSchema);
