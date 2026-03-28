const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (for demonstration purposes)
// In a real application, you would use a database like MongoDB, PostgreSQL, etc.
let db = {
    donors: [
        { id: '_001', name: 'John Doe', bloodType: 'A+', email: 'john@example.com', phone: '1234567890', location: 'New York', available: true },
        { id: '_002', name: 'Jane Smith', bloodType: 'B-', email: 'jane@example.com', phone: '0987654321', location: 'Los Angeles', available: true },
        { id: '_003', name: 'Bob Johnson', bloodType: 'O+', email: 'bob@example.com', phone: '5555555555', location: 'Chicago', available: false }
    ],
    pendingDonors: [],
    requests: [
        { id: '_req001', patientName: 'Alice Wonder', bloodType: 'A+', units: 2, location: 'City Hospital', contact: '9999999999', isEmergency: false, status: 'Pending', date: new Date().toLocaleDateString() }
    ],
    inventory: [
        { id: '_inv001', bloodType: 'A+', quantity: 10, expiryDate: '2026-06-09' },
        { id: '_inv002', bloodType: 'B-', quantity: 5, expiryDate: '2026-05-09' },
        { id: '_inv003', bloodType: 'O+', quantity: 15, expiryDate: '2026-07-09' }
    ]
};

// --- Helper Functions ---
const generateId = () => `_${Math.random().toString(36).slice(2, 11)}`;

// --- Donors API ---
app.get('/api/donors', (req, res) => {
    res.json(db.donors);
});

app.get('/api/donors/:id', (req, res) => {
    const { id } = req.params;
    const donor = db.donors.find(d => d.id === id);
    if (donor) {
        res.json(donor);
    } else {
        res.status(404).json({ message: 'Donor not found' });
    }
});

app.put('/api/donors/:id', (req, res) => {
    const { id } = req.params;
    const updatedDonorData = req.body;
    const donorIndex = db.donors.findIndex(d => d.id === id);
    if (donorIndex !== -1) {
        db.donors[donorIndex] = { ...db.donors[donorIndex], ...updatedDonorData };
        res.json(db.donors[donorIndex]);
    } else {
        res.status(404).json({ message: 'Donor not found' });
    }
});

app.delete('/api/donors/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = db.donors.length;
    db.donors = db.donors.filter(d => d.id !== id);
    if (db.donors.length < initialLength) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Donor not found' });
    }
});


// --- Pending Donors API (Registration) ---
app.get('/api/pending-donors', (req, res) => {
    res.json(db.pendingDonors);
});

app.post('/api/donors/register', (req, res) => {
    const newPendingDonor = { ...req.body, id: generateId() };
    db.pendingDonors.push(newPendingDonor);
    res.status(201).json(newPendingDonor);
});

app.post('/api/pending-donors/approve/:id', (req, res) => {
    const { id } = req.params;
    const donorIndex = db.pendingDonors.findIndex(d => d.id === id);
    if (donorIndex !== -1) {
        const [approvedDonor] = db.pendingDonors.splice(donorIndex, 1);
        approvedDonor.available = true; // Set default availability
        db.donors.push(approvedDonor);
        res.json(approvedDonor);
    } else {
        res.status(404).json({ message: 'Pending donor not found' });
    }
});

app.post('/api/pending-donors/reject/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = db.pendingDonors.length;
    db.pendingDonors = db.pendingDonors.filter(d => d.id !== id);
    if (db.pendingDonors.length < initialLength) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Pending donor not found' });
    }
});


// --- Blood Requests API ---
app.get('/api/requests', (req, res) => {
    res.json(db.requests);
});

app.post('/api/requests', (req, res) => {
    const newRequest = { ...req.body, id: generateId(), date: new Date().toLocaleDateString(), status: 'Pending' };
    db.requests.push(newRequest);
    res.status(201).json(newRequest);
});

app.put('/api/requests/:id', (req, res) => {
    const { id } = req.params;
    const requestIndex = db.requests.findIndex(r => r.id === id);
    if (requestIndex !== -1) {
        db.requests[requestIndex] = { ...db.requests[requestIndex], ...req.body };
        res.json(db.requests[requestIndex]);
    } else {
        console.error('Request not found:', id, 'Available IDs:', db.requests.map(r => r.id));
        res.status(404).json({ message: 'Request not found', id: id });
    }
});

app.delete('/api/requests/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = db.requests.length;
    db.requests = db.requests.filter(r => r.id !== id);
    if (db.requests.length < initialLength) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Request not found' });
    }
});

// --- Inventory API ---
app.get('/api/inventory', (req, res) => {
    res.json(db.inventory);
});

app.post('/api/inventory', (req, res) => {
    const newItem = { ...req.body, id: generateId() };
    db.inventory.push(newItem);
    res.status(201).json(newItem);
});

app.put('/api/inventory/:id', (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const itemIndex = db.inventory.findIndex(i => i.id === id);
    if (itemIndex !== -1) {
        db.inventory[itemIndex].quantity = quantity;
        res.json(db.inventory[itemIndex]);
    } else {
        res.status(404).json({ message: 'Inventory item not found' });
    }
});

app.delete('/api/inventory/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = db.inventory.length;
    db.inventory = db.inventory.filter(i => i.id !== id);
    if (db.inventory.length < initialLength) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Inventory item not found' });
    }
});

app.post('/api/inventory/remove-expired', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const initialLength = db.inventory.length;
    db.inventory = db.inventory.filter(item => item.expiryDate >= today);
    const removed = initialLength - db.inventory.length;
    res.json({ message: `${removed} expired units removed.`, removed });
});


// --- Reports API ---
app.get('/api/reports/summary', (req, res) => {
    const totalStock = db.inventory.reduce((total, item) => total + parseInt(item.quantity), 0);
    const summary = {
        totalDonors: db.donors.length,
        totalRequests: db.requests.length,
        availableStock: totalStock
    };
    res.json(summary);
});


// --- Server ---
app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});