const axios = require('axios');

async function test() {
    try {
        console.log('Testing Patient Registration...');
        const resPatient = await axios.post('http://localhost:5000/api/patients', {
            full_name: 'Test Patient',
            age: 30,
            gender: 'Male',
            phone: '1234567890',
            address: 'Test Address',
            blood_group: 'A+',
            status: 'Active'
        });
        console.log('Patient Success:', resPatient.data);
    } catch (err) {
        console.error('Patient Error:', err.response ? err.response.data : err.message);
    }

    try {
        console.log('\nTesting Medicine Addition...');
        const resMed = await axios.post('http://localhost:5000/api/medicines', {
            name: 'Paracetamol',
            category: 'Painkiller',
            price: 5.5,
            quantity: 100,
            expiry_date: '2026-12-31',
            supplier: 'Test Supplier'
        });
        console.log('Medicine Success:', resMed.data);
    } catch (err) {
        console.error('Medicine Error:', err.response ? err.response.data : err.message);
    }
}

test();
