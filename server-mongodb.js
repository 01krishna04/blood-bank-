const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bloodbank';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB successfully!');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// --- Mongoose Schemas ---

// Donor Schema
const donorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bloodType: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    available: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Pending Donor Schema
const pendingDonorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bloodType: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Blood Request Schema
const requestSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    bloodType: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    units: { type: Number, required: true, min: 1 },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    isEmergency: { type: Boolean, default: false },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Fulfilled', 'Cancelled'] },
    date: { type: Date, default: Date.now }
});

// Inventory Schema
const inventorySchema = new mongoose.Schema({
    bloodType: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    quantity: { type: Number, required: true, min: 1 },
    expiryDate: { type: Date, required: true },
    addedAt: { type: Date, default: Date.now }
});

// Create Models
const Donor = mongoose.model('Donor', donorSchema);
const PendingDonor = mongoose.model('PendingDonor', pendingDonorSchema);
const Request = mongoose.model('Request', requestSchema);
const Inventory = mongoose.model('Inventory', inventorySchema);

// --- Donors API ---
app.get('/api/donors', async (req, res) => {
    try {
        const donors = await Donor.find();
        res.json(donors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/donors/:id', async (req, res) => {
    try {
        const donor = await Donor.findById(req.params.id);
        if (!donor) return res.status(404).json({ message: 'Donor not found' });
        res.json(donor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/donors', async (req, res) => {
    const donor = new Donor(req.body);
    try {
        const newDonor = await donor.save();
        res.status(201).json(newDonor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/donors/:id', async (req, res) => {
    try {
        const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!donor) return res.status(404).json({ message: 'Donor not found' });
        res.json(donor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/donors/:id', async (req, res) => {
    try {
        const donor = await Donor.findByIdAndDelete(req.params.id);
        if (!donor) return res.status(404).json({ message: 'Donor not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Pending Donors API (Registration) ---
app.get('/api/pending-donors', async (req, res) => {
    try {
        const pendingDonors = await PendingDonor.find();
        res.json(pendingDonors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/donors/register', async (req, res) => {
    const pendingDonor = new PendingDonor(req.body);
    try {
        const newPendingDonor = await pendingDonor.save();
        res.status(201).json(newPendingDonor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.post('/api/pending-donors/approve/:id', async (req, res) => {
    try {
        const pendingDonor = await PendingDonor.findById(req.params.id);
        if (!pendingDonor) return res.status(404).json({ message: 'Pending donor not found' });

        // Create new approved donor
        const newDonor = new Donor({
            name: pendingDonor.name,
            bloodType: pendingDonor.bloodType,
            email: pendingDonor.email,
            phone: pendingDonor.phone,
            location: pendingDonor.location,
            available: true
        });

        await newDonor.save();
        await PendingDonor.findByIdAndDelete(req.params.id);

        res.json(newDonor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.post('/api/pending-donors/reject/:id', async (req, res) => {
    try {
        const pendingDonor = await PendingDonor.findByIdAndDelete(req.params.id);
        if (!pendingDonor) return res.status(404).json({ message: 'Pending donor not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Blood Requests API ---
app.get('/api/requests', async (req, res) => {
    try {
        const requests = await Request.find();
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/requests', async (req, res) => {
    const request = new Request(req.body);
    try {
        const newRequest = await request.save();
        res.status(201).json(newRequest);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/requests/:id', async (req, res) => {
    try {
        const request = await Request.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!request) return res.status(404).json({ message: 'Request not found' });
        res.json(request);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/requests/:id', async (req, res) => {
    try {
        const request = await Request.findByIdAndDelete(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Inventory API ---
app.get('/api/inventory', async (req, res) => {
    try {
        const inventory = await Inventory.find();
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/inventory', async (req, res) => {
    const item = new Inventory(req.body);
    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/inventory/:id', async (req, res) => {
    try {
        const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) return res.status(404).json({ message: 'Inventory item not found' });
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/inventory/:id', async (req, res) => {
    try {
        const item = await Inventory.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: 'Inventory item not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/inventory/remove-expired', async (req, res) => {
    try {
        const today = new Date();
        const result = await Inventory.deleteMany({ expiryDate: { $lt: today } });
        res.json({ message: `${result.deletedCount} expired units removed.`, removed: result.deletedCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Reports API ---
app.get('/api/reports/summary', async (req, res) => {
    try {
        const totalDonors = await Donor.countDocuments();
        const totalRequests = await Request.countDocuments();
        const inventory = await Inventory.find();
        const availableStock = inventory.reduce((total, item) => total + item.quantity, 0);

        res.json({
            totalDonors,
            totalRequests,
            availableStock
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Health Check ---
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// --- Server ---
app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
    console.log(`MongoDB URI: ${MONGODB_URI}`);
});
