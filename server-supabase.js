require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'your-anon-key';

// Initialize Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('🔌 Connecting to Supabase...');
console.log(`📍 URL: ${SUPABASE_URL}`);

// Test Supabase Connection
supabase.auth.getSession().then(() => {
    console.log('✅ Supabase Connected Successfully!\n');
}).catch(err => {
    console.error('❌ Supabase Connection Error:', err.message);
});

// --- Donors API ---
app.get('/api/donors', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('donors')
            .select('*');
        
        if (error) throw error;
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/donors/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('donors')
            .select('*')
            .eq('id', req.params.id)
            .single();
        
        if (error) throw error;
        if (!data) return res.status(404).json({ message: 'Donor not found' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/donors', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('donors')
            .insert([req.body])
            .select();
        
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/donors/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('donors')
            .update(req.body)
            .eq('id', req.params.id)
            .select();
        
        if (error) throw error;
        if (!data || data.length === 0) return res.status(404).json({ message: 'Donor not found' });
        res.json(data[0]);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/donors/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('donors')
            .delete()
            .eq('id', req.params.id);
        
        if (error) throw error;
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Pending Donors API (Registration) ---
app.get('/api/pending-donors', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('pending_donors')
            .select('*');
        
        if (error) throw error;
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/donors/register', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('pending_donors')
            .insert([req.body])
            .select();
        
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.post('/api/pending-donors/approve/:id', async (req, res) => {
    try {
        // Get pending donor
        const { data: pendingDonor, error: fetchError } = await supabase
            .from('pending_donors')
            .select('*')
            .eq('id', req.params.id)
            .single();
        
        if (fetchError) throw fetchError;
        if (!pendingDonor) return res.status(404).json({ message: 'Pending donor not found' });

        // Create approved donor with snake_case field names
        const { name, blood_type, email, phone, location } = pendingDonor;
        const { data: newDonor, error: insertError } = await supabase
            .from('donors')
            .insert([{
                name,
                blood_type,
                email,
                phone,
                location,
                available: true
            }])
            .select();
        
        if (insertError) throw insertError;

        // Delete pending donor
        const { error: deleteError } = await supabase
            .from('pending_donors')
            .delete()
            .eq('id', req.params.id);
        
        if (deleteError) throw deleteError;

        res.json(newDonor[0]);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.post('/api/pending-donors/reject/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('pending_donors')
            .delete()
            .eq('id', req.params.id);
        
        if (error) throw error;
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Blood Requests API ---
app.get('/api/requests', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('requests')
            .select('*');
        
        if (error) throw error;
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/requests', async (req, res) => {
    try {
        // Transform camelCase from frontend to snake_case for database
        const requestData = {
            patient_name: req.body.patientName || req.body.patient_name,
            blood_type: req.body.bloodType || req.body.blood_type,
            units: req.body.units,
            location: req.body.location || req.body.hospital,
            contact: req.body.contact,
            is_emergency: req.body.isEmergency || req.body.is_emergency || false,
            status: 'pending'
        };
        
        const { data, error } = await supabase
            .from('requests')
            .insert([requestData])
            .select();
        
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/requests/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('requests')
            .update(req.body)
            .eq('id', req.params.id)
            .select();
        
        if (error) throw error;
        if (!data || data.length === 0) return res.status(404).json({ message: 'Request not found' });
        res.json(data[0]);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/requests/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('requests')
            .delete()
            .eq('id', req.params.id);
        
        if (error) throw error;
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Inventory API ---
app.get('/api/inventory', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('inventory')
            .select('*');
        
        if (error) throw error;
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/inventory', async (req, res) => {
    try {
        const inventoryData = {
            blood_type: req.body.blood_type || req.body.bloodtype,
            quantity: req.body.quantity,
            expiry_date: req.body.expiry_date || req.body.expiryDate
        };
        
        const { data, error } = await supabase
            .from('inventory')
            .insert([inventoryData])
            .select();
        
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/inventory/:id', async (req, res) => {
    try {
        const inventoryData = {};
        if (req.body.quantity) inventoryData.quantity = req.body.quantity;
        
        const { data, error } = await supabase
            .from('inventory')
            .update(inventoryData)
            .eq('id', req.params.id)
            .select();
        
        if (error) throw error;
        if (!data || data.length === 0) return res.status(404).json({ message: 'Inventory item not found' });
        res.json(data[0]);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/inventory/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('inventory')
            .delete()
            .eq('id', req.params.id);
        
        if (error) throw error;
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/inventory/remove-expired', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data: expiredItems, error: fetchError } = await supabase
            .from('inventory')
            .select('id')
            .lt('expiry_date', today);
        
        if (fetchError) throw fetchError;

        if (expiredItems.length > 0) {
            const { error: deleteError } = await supabase
                .from('inventory')
                .delete()
                .lt('expiry_date', today);
            
            if (deleteError) throw deleteError;
        }

        res.json({ 
            message: `${expiredItems.length} expired units removed.`, 
            removed: expiredItems.length 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Reports API ---
app.get('/api/reports/summary', async (req, res) => {
    try {
        // Get total donors
        const { count: totalDonors, error: donorsError } = await supabase
            .from('donors')
            .select('*', { count: 'exact', head: true });
        
        // Get total requests
        const { count: totalRequests, error: requestsError } = await supabase
            .from('requests')
            .select('*', { count: 'exact', head: true });
        
        // Get inventory stock
        const { data: inventory, error: inventoryError } = await supabase
            .from('inventory')
            .select('quantity');
        
        if (donorsError || requestsError || inventoryError) {
            throw new Error('Error fetching data');
        }

        const availableStock = inventory.reduce((total, item) => total + (item.quantity || 0), 0);

        res.json({
            totalDonors: totalDonors || 0,
            totalRequests: totalRequests || 0,
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
    console.log(`\n🚀 Backend server running at http://localhost:${port}`);
    console.log(`📊 Database: Supabase PostgreSQL`);
    console.log(`🔐 Ready to accept requests!\n`);
});
