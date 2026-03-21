const fetch = require('node-fetch');

async function testRoutes() {
    const routes = [
        '/api/patients',
        '/api/doctors',
        '/api/dashboard',
        '/api/medicines',
        '/api/labs'
    ];

    for (const route of routes) {
        try {
            console.log(`Testing ${route}...`);
            const res = await fetch(`http://localhost:5000${route}`);
            const text = await res.text();
            console.log(`Status: ${res.status}`);
            console.log(`Body: ${text.substring(0, 500)}`);
            console.log('-------------------');
        } catch (err) {
            console.error(`Failed to fetch ${route}: ${err.message}`);
        }
    }
}

testRoutes();
