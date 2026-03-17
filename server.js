const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/admin');
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
};

// Mongoose Model
const leaveSchema = new mongoose.Schema({
    name: { type: String, required: true },
    department: { type: String, required: true },
    leaveType: { type: String, required: true, enum: ['sick', 'casual', 'earned'] },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
    createdAt: { type: Date, default: Date.now }
});
const Leave = mongoose.model('Leave', leaveSchema, 'FLM');

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/leaves', async (req, res) => {
    try {
        const leaves = await Leave.find().sort({ createdAt: -1 });
        res.json(leaves);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/leaves', async (req, res) => {
    try {
        const newLeave = new Leave(req.body);
        const savedLeave = await newLeave.save();
        res.status(201).json(savedLeave);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
