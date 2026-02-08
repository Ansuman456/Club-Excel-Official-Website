const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testEventRegistration() {
    console.log('--- Testing Event Registration ---');
    const registrationData = {
        eventname: 'Test Event 2026',
        fullname: 'Test User',
        email: 'testuser@example.com',
        phoneno: '1234567890',
        rollno: '21BCS9999',
        locality: 'hostelite'
    };

    try {
        const response = await axios.post(`${API_URL}/eventregisters`, registrationData);
        console.log('Event Registration Success:', response.data);
    } catch (error) {
        console.error('Event Registration Error:', error.response ? error.response.data : error.message);
    }
}

async function testSankalpRegistration() {
    console.log('\n--- Testing Sankalp Registration ---');
    const registrationData = {
        eventname: 'Sankalp Competition 2026',
        fullname: 'Sankalp User',
        email: 'sankalpuser@example.com',
        phoneno: '0987654321',
        rollno: '22BCS1111',
        locality: 'localite'
    };

    try {
        const response = await axios.post(`${API_URL}/sankalpregisters`, registrationData);
        console.log('Sankalp Registration Success:', response.data);
    } catch (error) {
        console.error('Sankalp Registration Error:', error.response ? error.response.data : error.message);
    }
}

async function runTests() {
    await testEventRegistration();
    await testSankalpRegistration();
}

runTests();
