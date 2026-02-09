const mongoose = require('mongoose');
const Event = require('./models/Event');
require('dotenv').config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const testEvent = new Event({
            name: "Test Event",
            description: "Test Description",
            date: "2026-02-09",
            time: "10:00",
            vanue: "Test Venue",
            status: "upcoming"
        });
        
        await testEvent.save();
        console.log('Event saved successfully without rules!');
        await Event.deleteOne({ _id: testEvent._id });
        console.log('Test event deleted');
        
        process.exit(0);
    } catch (error) {
        console.error('Validation Error:', error.message);
        process.exit(1);
    }
}

test();
