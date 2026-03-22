const mongoose = require('mongoose');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const LabTest = require('./models/LabTest');
require('dotenv').config();

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hospital_system');
        console.log('Connected to DB');
        
        const patientCount = await Patient.countDocuments();
        const doctorCount = await Doctor.countDocuments();
        const labCount = await LabTest.countDocuments();
        
        console.log('Patients:', patientCount);
        console.log('Doctors:', doctorCount);
        console.log('Labs:', labCount);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDB();
