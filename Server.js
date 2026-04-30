const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🌟 IN-MEMORY DATABASE (No MongoDB Required!)
const doctors = [
    { _id: "doc_101", name: "Dr. Sharma", specialty: "Cardiologist", experience: "10 Years" },
    { _id: "doc_102", name: "Dr. Gupta", specialty: "Dermatologist", experience: "5 Years" },
    { _id: "doc_103", name: "Dr. Verma", specialty: "General Physician", experience: "15 Years" },
    { _id: "doc_104", name: "Dr. Pathak", specialty: "Neurologist", experience: "8 Years" }
];

const appointments = []; // Bookings yahan save hongi

// --- API ROUTES ---

// 1. Get all doctors
app.get('/api/doctors', (req, res) => {
    res.json(doctors);
});

// 2. Book an appointment
app.post('/api/appointments', (req, res) => {
    // Find the selected doctor to save their name properly
    const selectedDoctor = doctors.find(doc => doc._id === req.body.doctorId);
    
    const newAppointment = {
        _id: Math.random().toString(36).substr(2, 9), // Generate random ID
        patientName: req.body.patientName,
        patientEmail: req.body.patientEmail,
        date: req.body.date,
        time: req.body.time,
        doctorId: selectedDoctor // Save full doctor object (Mimics MongoDB Populate)
    };
    
    appointments.push(newAppointment);
    res.status(201).json({ message: "Appointment Booked Successfully!", appointment: newAppointment });
});

// 3. Get all appointments
app.get('/api/appointments', (req, res) => {
    res.json(appointments);
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 No-DB Backend running perfectly on port ${PORT}`));