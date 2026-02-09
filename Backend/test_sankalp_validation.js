const mongoose = require('mongoose');
const SankalpEvent = require('./models/SankalpEvent');
require('dotenv').config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const testEvent = new SankalpEvent({
            name: "Test Sankalp",
            date: "2026-02-09",
            time: "10:00",
            vanue: "Test Venue",
            status: "upcoming"
        });
        
        await testEvent.save();
        console.log('SankalpEvent saved successfully without rules!');
        await SankalpEvent.deleteOne({ _id: testEvent._id });
        console.log('Test event deleted');
        
        process.exit(0);
    } catch (error) {
        console.error('Validation Error:', error.message);
        process.exit(1);
    }
}

test();
