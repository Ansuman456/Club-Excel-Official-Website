require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/event', require('./routes/eventRoutes'));
app.use('/api/sankalpevent', require('./routes/sankalpEventRoutes'));
app.use('/api/recruitment', require('./routes/recruitmentRoutes'));
app.use('/api/sankalpregisters', require('./routes/sankalpRegisterRoutes'));
app.use('/api/eventregisters', require('./routes/eventRegisterRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Club Excel Backend! Server is running correctly." });
});

const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please close the other process or use a different port.`);
        process.exit(1);
    } else {
        console.error('Server error:', error);
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
