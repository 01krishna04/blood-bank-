// script.js - BloodBank Management System
document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');
    const navLinks = document.querySelectorAll('.nav-link');
    const API_URL = 'http://localhost:3000/api';
    let pendingDonors = [];
    let donors = [];
    let requests = [];
    let inventory = [];
    let chart = null; // For chart.js instance
    
    // Utility function to show loading indicator
    function showLoading() {
        const loading = document.createElement('div');
        loading.id = 'loading-indicator';
        loading.className = 'spinner-overlay';
        loading.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(loading);
    }
    
    function hideLoading() {
        const loading = document.getElementById('loading-indicator');
        if (loading) loading.remove();
    }
    
    // Utility function for error handling
    function showError(message) {
        hideLoading();
        alert('❌ Error: ' + message);
        console.error('Application Error:', message);
    }
    
    function showSuccess(message) {
        hideLoading();
        alert('✅ ' + message);
    }

    const pages = {
        home: `
            <div class="text-center">
                <h1>Welcome to BloodBank</h1>
                <p class="lead">Donate blood, save lives.</p>
                <div class="d-flex justify-content-center gap-3 mt-4">
                    <button class="btn btn-danger btn-lg" data-page="register">Become a Donor</button>
                    <button class="btn btn-primary btn-lg" data-page="find">Find a Donor</button>
                </div>
            </div>
        `,
        register: `
            <h2>Register as a Donor</h2>
            <form id="donor-form">
                <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" class="form-control" id="name" required>
                </div>
                <div class="mb-3">
                    <label for="blood-type" class="form-label">Blood Type</label>
                    <select class="form-select" id="blood-type" required>
                        <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" required>
                </div>
                <div class="mb-3">
                    <label for="phone" class="form-label">Phone</label>
                    <input type="tel" class="form-control" id="phone" required>
                </div>
                <div class="mb-3">
                    <label for="location" class="form-label">Location</label>
                    <input type="text" class="form-control" id="location" required>
                </div>
                <button type="submit" class="btn btn-danger">Register</button>
            </form>
        `,
        find: () => `
            <h2>Find a Donor</h2>
            <div class="card p-3 mb-4 bg-light">
                <div class="row g-3">
                    <div class="col-md-3">
                        <select id="search-blood-type" class="form-select">
                            <option value="">Select Blood Group</option>
                            <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <input type="text" id="search-location" class="form-control" placeholder="City / Area">
                    </div>
                    <div class="col-md-3 d-flex align-items-center">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="search-available">
                            <label class="form-check-label" for="search-available">Available Donors Only</label>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-primary w-100" type="button" id="search-btn-donor">Search</button>
                    </div>
                </div>
                <div class="mt-3">
                    <button class="btn btn-danger w-100 fw-bold" type="button" id="emergency-search-btn">🚨 Quick Emergency Search (All Available)</button>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-light"><tr><th>Name</th><th>Blood</th><th>Location</th><th>Status</th><th>Contact</th><th>Actions</th></tr></thead>
                    <tbody id="donor-list">
                    </tbody>
                </table>
            </div>
        `,
        about: `
            <h2>About Us</h2>
            <p>We are a non-profit organization dedicated to connecting blood donors with those in need.</p>
        `,
        notifications: `
            <h2>Notifications</h2>
            <p>Stay updated with important alerts and messages.</p>
        `,
        edit: (donorId) => {
            const donor = donors.find(d => d.id === donorId);
            if (!donor) return '<h2>Donor not found</h2>';
            return `
                <h2>Edit Donor Details</h2>
                <form id="edit-donor-form">
                    <input type="hidden" id="edit-donor-id" value="${donorId}">
                    <div class="mb-3">
                        <label for="name" class="form-label">Name</label>
                        <input type="text" class="form-control" id="name" value="${donor.name}" required>
                    </div>
                    <div class="mb-3">
                        <label for="blood-type" class="form-label">Blood Type</label>
                        <select class="form-select" id="blood-type" required>
                            ${['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bt => `<option ${donor.bloodtype === bt ? 'selected' : ''}>${bt}</option>`).join('')}
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" value="${donor.email}" required>
                    </div>
                    <div class="mb-3">
                        <label for="phone" class="form-label">Phone</label>
                        <input type="tel" class="form-control" id="phone" value="${donor.phone}" required>
                    </div>
                    <div class="mb-3">
                        <label for="location" class="form-label">Location</label>
                        <input type="text" class="form-control" id="location" value="${donor.location}" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Update Donor</button>
                </form>
            `;
        },
        eligibility: `
            <h2>Donor Eligibility Check</h2>
            <form id="eligibility-form">
                <div class="mb-3">
                    <label for="age" class="form-label">Age (must be 18-65)</label>
                    <input type="number" class="form-control" id="age" required>
                </div>
                <div class="mb-3">
                    <label for="weight" class="form-label">Weight in kg (must be over 50kg)</label>
                    <input type="number" class="form-control" id="weight" required>
                </div>
                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="good-health">
                    <label class="form-check-label" for="good-health">Are you in good health and feeling well?</label>
                </div>
                <button type="submit" class="btn btn-primary">Check Eligibility</button>
            </form>
            <div id="eligibility-result" class="mt-4"></div>
        `,
        request: `
            <h2>Request Blood</h2>
            <form id="request-form">
                <div class="mb-3">
                    <label for="patient-name" class="form-label">Patient Name</label>
                    <input type="text" class="form-control" id="patient-name" required>
                </div>
                <div class="mb-3">
                    <label for="req-blood-type" class="form-label">Blood Type Needed</label>
                    <select class="form-select" id="req-blood-type" required>
                        <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="units" class="form-label">Units Required</label>
                    <input type="number" class="form-control" id="units" min="1" required>
                </div>
                <div class="mb-3">
                    <label for="hospital" class="form-label">Hospital / Location</label>
                    <input type="text" class="form-control" id="hospital" required>
                </div>
                <div class="mb-3">
                    <label for="contact" class="form-label">Contact Number</label>
                    <input type="tel" class="form-control" id="contact" required>
                </div>
                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="is-emergency">
                    <label class="form-check-label text-danger fw-bold" for="is-emergency">Emergency Request</label>
                </div>
                <button type="submit" class="btn btn-danger">Submit Request</button>
            </form>
        `,
        history: `
            <h2>My Request History</h2>
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-light"><tr><th>Patient</th><th>Blood</th><th>Units</th><th>Location</th><th>🚨</th><th>Status</th><th>Date</th></tr></thead>
                    <tbody id="request-list"></tbody>
                </table>
            </div>
        `,
        inventory: `
            <h2>Blood Inventory Management</h2>
            <div class="row mb-4" id="inventory-dashboard"></div>
            
            <div class="card mb-4">
                <div class="card-header bg-danger text-white">Add Blood Stock</div>
                <div class="card-body">
                    <form id="inventory-form" class="row g-3">
                        <div class="col-md-3">
                            <select class="form-select" id="inv-blood-type" required>
                                <option value="">Select Blood Type</option>
                                <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <input type="number" class="form-control" id="inv-quantity" placeholder="Units" required min="1">
                        </div>
                        <div class="col-md-3">
                            <input type="date" class="form-control" id="inv-expiry" required>
                        </div>
                        <div class="col-md-3">
                            <button type="submit" class="btn btn-success w-100">Add Stock</button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                <h3 class="mb-0">Stock Details</h3>
                <button class="btn btn-warning btn-sm" id="remove-expired-btn">🗑️ Remove Expired</button>
            </div>
            <div class="table-responsive">
                <table class="table table-bordered table-hover">
                    <thead class="table-light"><tr><th>Blood Type</th><th>Units</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody id="inventory-list"></tbody>
                </table>
            </div>
        `,
        reports: `
            <h2>Reports & Dashboard</h2>
            <div class="row">
                <div class="col-md-4">
                    <div class="card text-center mb-3">
                        <div class="card-body">
                            <h5 class="card-title">Total Donors</h5>
                            <p class="card-text fs-4 fw-bold" id="total-donors">0</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card text-center mb-3">
                        <div class="card-body">
                            <h5 class="card-title">Total Requests</h5>
                            <p class="card-text fs-4 fw-bold" id="total-requests">0</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card text-center mb-3">
                        <div class="card-body">
                            <h5 class="card-title">Available Blood Stock</h5>
                            <p class="card-text fs-4 fw-bold" id="available-stock">0</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    Monthly Donation Report
                </div>
                <div class="card-body">
                    <canvas id="donation-chart"></canvas>
                </div>
            </div>
        `,
    };

    function renderDonors(donorList = donors) {
        const listElement = document.getElementById('donor-list');
        if (!listElement) return;
        if (donorList.length === 0) {
            listElement.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No donors found</td></tr>';
            return;
        }
        listElement.innerHTML = donorList.map((d) => `
            <tr>
                <td>${d.name}</td>
                <td><span class="badge bg-danger">${d.blood_type || d.bloodtype}</span></td>
                <td>${d.location}</td>
                <td>
                    <button class="btn btn-sm ${d.available ? 'btn-success' : 'btn-secondary'} availability-toggle" data-id="${d.id}">
                        ${d.available ? 'Available' : 'Unavailable'}
                    </button>
                </td>
                <td>${d.email} / ${d.phone}</td>
                <td>
                    <button class="btn btn-sm btn-warning edit-btn" data-id="${d.id}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${d.id}">Delete</button>
                </td>
            </tr>`).join('');
    }

    function renderRequests() {
        const listElement = document.getElementById('request-list');
        if (!listElement) return;
        if (requests.length === 0) {
            listElement.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No requests yet</td></tr>';
            return;
        }
        listElement.innerHTML = requests.map(r => {
            const isEmergency = r.isemergency || r.isEmergency || r.is_emergency;
            const status = (r.status || 'pending').toLowerCase();
            const date = r.date ? new Date(r.date).toLocaleDateString() : 'N/A';
            const statusColor = status === 'pending' ? 'warning' : status === 'fulfilled' ? 'success' : 'danger';
            const location = r.location || r.hospital || '-';
            return `
            <tr class="${isEmergency ? 'table-danger' : ''}">
                <td>${r.patientname || r.patientName || r.patient_name}</td>
                <td><span class="badge bg-danger">${r.bloodtype || r.bloodType || r.blood_type}</span></td>
                <td>${r.units}</td>
                <td>${location}</td>
                <td>${isEmergency ? '🚨 YES' : 'No'}</td>
                <td><span class="badge bg-${statusColor}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
                <td>${date}</td>
            </tr>`
        }).join('')
    }

    function renderRequestsForAdmin() {
        const listElement = document.getElementById('requests-admin-table');
        if (!listElement) return;
        if (requests.length === 0) {
            listElement.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No requests yet</td></tr>';
            return;
        }
        listElement.innerHTML = requests.map(r => {
            const isEmergency = r.isemergency || r.isEmergency || r.is_emergency;
            const status = (r.status || 'pending').toLowerCase();
            const date = r.date ? new Date(r.date).toLocaleDateString() : 'N/A';
            const statusColor = status === 'pending' ? 'warning' : status === 'fulfilled' ? 'success' : 'danger';
            const notes = r.notes || r.note || '-';
            const location = r.location || r.hospital || '-';
            return `
            <tr class="${isEmergency ? 'table-danger' : ''}">
                <td>${r.patientname || r.patientName || r.patient_name}</td>
                <td><span class="badge bg-danger">${r.bloodtype || r.bloodType || r.blood_type}</span></td>
                <td>${r.units}</td>
                <td>${location}</td>
                <td>${isEmergency ? '🚨 YES' : 'No'}</td>
                <td><span class="badge bg-${statusColor}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
                <td>${date}</td>
                <td><small>${notes === '-' ? '-' : notes.substring(0, 20) + '...'}</small></td>
                <td>
                    <button class="btn btn-sm btn-info edit-request-btn me-1" data-id="${r.id}">✏️ Edit</button>
                    <button class="btn btn-sm btn-primary update-status-btn" data-id="${r.id}" data-status="${status}">Update</button>
                </td>
            </tr>`
        }).join('')
    }

    function renderInventory() {
        const dashboard = document.getElementById('inventory-dashboard');
        const list = document.getElementById('inventory-list');
        if (!dashboard || !list) return;

        // Calculate totals
        const totals = { 'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0 };
        inventory.forEach(item => {
            const bloodType = item.blood_type || item.bloodtype;
            if (totals[bloodType] !== undefined) {
                totals[bloodType] += parseInt(item.quantity);
            }
        });

        // Render Dashboard
        dashboard.innerHTML = Object.keys(totals).map(type => `
            <div class="col-6 col-md-3 mb-3">
                <div class="card text-center border-${totals[type] > 0 ? 'success' : 'danger'}">
                    <div class="card-body">
                        <h5 class="card-title text-danger">${type}</h5>
                        <p class="card-text fs-4 fw-bold">${totals[type]} Units</p>
                    </div>
                </div>
            </div>
        `).join('');

        // Render List
        if (inventory.length === 0) {
            list.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No inventory items</td></tr>';
            return;
        }
        const today = new Date().toISOString().split('T')[0];
        list.innerHTML = inventory.map((item, index) => {
            const isExpired = (item.expiry_date || item.expiryDate) < today;
            const bloodType = item.blood_type || item.bloodtype;
            return `
                <tr class="${isExpired ? 'table-danger' : ''}">
                    <td><span class="badge bg-danger">${bloodType}</span></td>
                    <td>${item.quantity}</td>
                    <td>${item.expiry_date || item.expiryDate}</td>
                    <td>${isExpired ? '<span class="badge bg-danger">Expired</span>' : '<span class="badge bg-success">Valid</span>'}</td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-stock-btn" data-id="${item.id}">Update</button>
                        <button class="btn btn-sm btn-danger delete-stock-btn" data-id="${item.id}">Remove</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    async function fetchReports() {
        try {
            const res = await fetch(`${API_URL}/reports/summary`);
            const summary = await res.json();

        document.getElementById('total-donors').textContent = summary.totalDonors;
        document.getElementById('total-requests').textContent = summary.totalRequests;
        document.getElementById('available-stock').textContent = summary.availableStock;

        const ctx = document.getElementById('donation-chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Donations',
                    data: [12, 19, 3, 5, 2, 3, 9, 10, 5, 6, 8, 15], //dummy data
                    backgroundColor: 'rgba(220, 53, 69, 0.2)',
                    borderColor: 'rgba(220, 53, 69, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        } catch (e) { console.error('Error fetching reports:', e); }
    }

    function renderPendingDonors(donorList = pendingDonors) {
        const listElement = document.querySelector('#approve-donors-page tbody');
        if (!listElement) return;
        if (donorList.length === 0) {
            listElement.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No pending donors</td></tr>';
            return;
        }
        listElement.innerHTML = donorList.map((d) => {
            return `<tr>
                <td>${d.name}</td>
                <td><span class="badge bg-danger">${d.blood_type || d.bloodtype}</span></td>
                <td>${d.email}</td>
                <td>
                    <button class="btn btn-success btn-sm approve-donor-btn" data-id="${d.id}">Approve</button>
                    <button class="btn btn-danger btn-sm reject-donor-btn" data-id="${d.id}">Reject</button>
                </td>
            </tr>`;
        }).join('');
    }

    // --- API Fetch Functions ---
    async function fetchDonors() {
        try {
            const res = await fetch(`${API_URL}/donors`);
            donors = await res.json();
            renderDonors();
        } catch (e) { console.error('Error fetching donors:', e); }
    }

    async function fetchPendingDonors() {
        try {
            const res = await fetch(`${API_URL}/pending-donors`);
            pendingDonors = await res.json();
            renderPendingDonors();
        } catch (e) { console.error('Error fetching pending donors:', e); }
    }

    async function fetchRequests() {
        try {
            const res = await fetch(`${API_URL}/requests`);
            if (!res.ok) throw new Error('Failed to fetch requests');
            requests = await res.json();
            renderRequests();
        } catch (e) { 
            console.error('Error fetching requests:', e);
            showError('Failed to load requests');
        }
    }

    async function fetchInventory() {
        try {
            const res = await fetch(`${API_URL}/inventory`);
            inventory = await res.json();
            renderInventory();
        } catch (e) { console.error('Error fetching inventory:', e); }
    }

    function navigateTo(page, payload) {
        // Check admin password if trying to access admin page
        if (page === 'admin') {
            const isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn');
            if (!isAdminLoggedIn) {
                const password = prompt('🔐 Enter Admin Password:');
                if (password === '0102') {
                    sessionStorage.setItem('adminLoggedIn', 'true');
                    showSuccess('Admin access granted!');
                } else if (password !== null) {
                    showError('Invalid password!');
                    return;
                } else {
                    // User cancelled
                    return;
                }
            }
        }

        // Hide all main containers first
        appContainer.style.display = 'none';
        document.getElementById('admin-page').style.display = 'none';
        document.getElementById('notifications-page').style.display = 'none';

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });

        if (pages[page]) {
            appContainer.style.display = 'block';
            appContainer.innerHTML = typeof pages[page] === 'function' ? pages[page](payload) : pages[page];
            if (page === 'find') fetchDonors();
            if (page === 'history') fetchRequests();
            if (page === 'inventory') fetchInventory();
            if (page === 'reports') fetchReports();
        } else if (page === 'admin') {
            document.getElementById('admin-page').style.display = 'block';
            fetchPendingDonors();
        } else if (page === 'notifications') {
            document.getElementById('notifications-page').style.display = 'block';
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            if (page) navigateTo(page);
        });
    });

    appContainer.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formId = e.target.id;

        if (formId === 'donor-form') {
            try {
                const newDonor = {
                    name: document.getElementById('name').value, blood_type: document.getElementById('blood-type').value,
                    email: document.getElementById('email').value, phone: document.getElementById('phone').value,
                    location: document.getElementById('location').value
                };
                await fetch(`${API_URL}/donors/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newDonor)
                });
                alert('Donor registration submitted for approval!');
                navigateTo('home');
            } catch (e) { console.error('Error submitting donor form:', e); alert('Error submitting form'); }
        } else if (formId === 'edit-donor-form') {
            try {
                const donorId = document.getElementById('edit-donor-id').value;
                const updatedDonor = {
                    name: document.getElementById('name').value, blood_type: document.getElementById('blood-type').value,
                    email: document.getElementById('email').value, phone: document.getElementById('phone').value,
                    location: document.getElementById('location').value
                };
                await fetch(`${API_URL}/donors/${donorId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedDonor)
                });
                alert('Donor details updated successfully!');
                navigateTo('find');
            } catch (e) { console.error('Error updating donor:', e); alert('Error updating donor'); }
        } else if (formId === 'eligibility-form') {
            const age = parseInt(document.getElementById('age').value);
            const weight = parseInt(document.getElementById('weight').value);
            const isGoodHealth = document.getElementById('good-health').checked;
            const resultEl = document.getElementById('eligibility-result');

            if (age >= 18 && age <= 65 && weight >= 50 && isGoodHealth) {
                resultEl.innerHTML = '<div class="alert alert-success">You are likely eligible to donate blood!</div>';
            } else {
                let message = 'You are likely not eligible to donate blood due to the following:<ul>';
                if (age < 18 || age > 65) message += '<li>Age must be between 18 and 65.</li>';
                if (weight < 50) message += '<li>Weight must be at least 50kg.</li>';
                if (!isGoodHealth) message += '<li>You must be in good health.</li>';
                message += '</ul>';
                resultEl.innerHTML = `<div class="alert alert-danger">${message}</div>`;
            }
        } else if (formId === 'request-form') {
            try {
                const newRequest = {
                    patientName: document.getElementById('patient-name').value,
                    bloodType: document.getElementById('req-blood-type').value,
                    units: parseInt(document.getElementById('units').value),
                    location: document.getElementById('hospital').value,
                    contact: document.getElementById('contact').value,
                    isEmergency: document.getElementById('is-emergency').checked,
                    notes: ''
                };
                console.log('Submitting request:', newRequest); // Debug log
                const res = await fetch(`${API_URL}/requests`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newRequest)
                });
                const responseData = await res.json();
                console.log('Response:', responseData); // Debug log
                if (!res.ok) throw new Error(responseData.message || 'Failed to submit request');
                showSuccess('Blood request submitted successfully!');
                document.getElementById('request-form').reset();
                await new Promise(r => setTimeout(r, 500)); // Small delay
                await fetchRequests();
                navigateTo('history');
            } catch (e) { 
                console.error('Error submitting request:', e); 
                showError(e.message || 'Failed to submit request'); 
            }
        } else if (formId === 'inventory-form') {
            try {
                const bloodType = document.getElementById('inv-blood-type').value;
                const quantity = document.getElementById('inv-quantity').value;
                const expiryDate = document.getElementById('inv-expiry').value;
                
                // Validation
                if (!bloodType || !quantity || !expiryDate) {
                    showError('Please fill in all fields');
                    return;
                }
                
                const newItem = {
                    blood_type: bloodType,
                    quantity: parseInt(quantity),
                    expiry_date: expiryDate
                };
                
                console.log('Adding inventory:', newItem);
                const res = await fetch(`${API_URL}/inventory`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newItem)
                });
                
                const responseData = await res.json();
                console.log('Inventory response:', responseData);
                
                if (!res.ok) {
                    throw new Error(responseData.message || 'Failed to add stock');
                }
                
                showSuccess('Stock added successfully!');
                document.getElementById('inventory-form').reset();
                await fetchInventory();
                navigateTo('inventory');
            } catch (e) { 
                console.error('Error adding inventory:', e); 
                showError(e.message || 'Failed to add stock'); 
            }
        }
    });

     appContainer.addEventListener('click', async (e) => {
        if (e.target.matches('[data-page]')) {
            e.preventDefault();
            navigateTo(e.target.dataset.page);
        }

        if (e.target.id === 'search-btn-donor') {
            const bloodType = document.getElementById('search-blood-type').value;
            const location = document.getElementById('search-location').value.toLowerCase();
            const availableOnly = document.getElementById('search-available').checked;

            const filtered = donors.filter(d => {
                const donorBloodType = d.blood_type || d.bloodtype;
                const matchBlood = bloodType ? donorBloodType === bloodType : true;
                const matchLocation = location ? d.location.toLowerCase().includes(location) : true;
                const matchAvailable = availableOnly ? d.available : true;
                return matchBlood && matchLocation && matchAvailable;
            });
            renderDonors(filtered);
        }

        if (e.target.id === 'emergency-search-btn') {
            document.getElementById('search-blood-type').value = "";
            document.getElementById('search-location').value = "";
            document.getElementById('search-available').checked = true;
            const filtered = donors.filter(d => d.available);
            renderDonors(filtered);
        }

        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            if (confirm('Are you sure you want to delete this donor?')) {
                try {
                    await fetch(`${API_URL}/donors/${id}`, { method: 'DELETE' });
                    navigateTo('find');
                } catch (e) { console.error('Error deleting donor:', e); alert('Error deleting donor'); }
            }
        }

        if (e.target.classList.contains('edit-btn')) {
            const id = e.target.dataset.id;
            navigateTo('edit', id);
        }

        if (e.target.classList.contains('availability-toggle')) {
            const id = e.target.dataset.id;
            const donor = donors.find(d => d.id === id);
            if (donor) {
                try {
                    await fetch(`${API_URL}/donors/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ available: !donor.available })
                    });
                    await fetchDonors();
                } catch (e) { console.error('Error toggling availability:', e); }
            }
        }

        if (e.target.classList.contains('delete-stock-btn')) {
            const id = e.target.dataset.id;
            if (confirm('Remove this batch from inventory?')) {
                try {
                    const res = await fetch(`${API_URL}/inventory/${id}`, { method: 'DELETE' });
                    if (!res.ok) throw new Error('Failed to delete stock');
                    showSuccess('Stock removed successfully!');
                    await fetchInventory();
                } catch (e) { 
                    console.error('Error deleting stock:', e); 
                    showError(e.message || 'Failed to delete stock'); 
                }
            }
        }

        if (e.target.classList.contains('edit-stock-btn')) {
            const id = e.target.dataset.id;
            const item = inventory.find(i => i.id === id);
            if (!item) return;
            
            const newQuantity = prompt("Enter new quantity:", item.quantity);
            if (newQuantity !== null && !isNaN(newQuantity) && newQuantity > 0) {
                try {
                    const res = await fetch(`${API_URL}/inventory/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ quantity: parseInt(newQuantity) })
                    });
                    if (!res.ok) throw new Error('Failed to update stock');
                    showSuccess('Stock quantity updated!');
                    await fetchInventory();
                } catch (e) { 
                    console.error('Error updating stock:', e); 
                    showError(e.message || 'Failed to update stock'); 
                }
            }
        }

        if (e.target.id === 'remove-expired-btn') {
            try {
                const res = await fetch(`${API_URL}/inventory/remove-expired`, { method: 'POST' });
                if (!res.ok) throw new Error('Failed to remove expired items');
                showSuccess('Expired units removed successfully!');
                await fetchInventory();
            } catch (e) { 
                console.error('Error removing expired units:', e); 
                showError(e.message || 'Failed to remove expired units'); 
            }
        }
    });

    // Initial page load
    navigateTo('home');

    function navigateAdminTo(page) {
        document.querySelectorAll('.admin-page-content').forEach(p => p.style.display = 'none');
        document.getElementById(`${page}-page`).style.display = 'block';
        
        // Load requests when navigating to monitor-requests page
        if (page === 'monitor-requests') {
            fetchRequests().then(() => {
                renderRequestsForAdmin();
            });
        }
    }

    function navigateNotificationTo(page) {
        document.querySelectorAll('.notification-page-content').forEach(p => p.style.display = 'none');
        document.getElementById(`${page}-page`).style.display = 'block';
    }

    document.addEventListener('click', async (e) => {
        if (e.target.matches('[data-admin-page]')) {
            e.preventDefault();
            navigateAdminTo(e.target.dataset.adminPage);
        }
        if (e.target.matches('[data-notification-page]')) {
            e.preventDefault();
            navigateNotificationTo(e.target.dataset.notificationPage);
        }

        if (e.target.classList.contains('approve-donor-btn')) {
            const id = e.target.dataset.id;
            const donorToApprove = pendingDonors.find(d => d.id === id);
            
            try {
                await fetch(`${API_URL}/pending-donors/approve/${id}`, { method: 'POST' });
                alert('Donor approved!');

                if (donorToApprove) {
                    const subject = "Your Blood Donor Registration is Approved!";
                    const body = `Dear ${donorToApprove.name},\n\nCongratulations! Your registration as a blood donor has been approved. You are now part of our community of heroes.\n\nThank you for your willingness to save lives.\n\nBest regards,\nBloodBank Team`;
                    window.location.href = `mailto:${donorToApprove.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                }
                fetchPendingDonors();
            } catch (e) { console.error('Error approving donor:', e); alert('Error approving donor'); }
        }

        if (e.target.classList.contains('reject-donor-btn')) {
            const id = e.target.dataset.id;
            if (confirm('Are you sure you want to reject this registration?')) {
                try {
                    await fetch(`${API_URL}/pending-donors/reject/${id}`, { method: 'POST' });
                    alert('Donor registration rejected.');
                    fetchPendingDonors();
                } catch (e) { console.error('Error rejecting donor:', e); alert('Error rejecting donor'); }
            }
        }

        if (e.target.classList.contains('edit-request-btn')) {
            const id = e.target.dataset.id;
            const request = requests.find(r => r.id === id);
            if (!request) {
                showError(`Request not found in local data. ID: ${id}`);
                return;
            }
            
            const newNotes = prompt('Add/Edit Notes for this request:', request.notes || '');
            
            if (newNotes !== null) {
                try {
                    const res = await fetch(`${API_URL}/requests/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ notes: newNotes })
                    });
                    
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}));
                        throw new Error(errorData.message || `Failed to update notes (Status: ${res.status})`);
                    }
                    showSuccess('Notes updated successfully!');
                    await fetchRequests();
                } catch (e) { 
                    console.error('Error updating notes:', e); 
                    showError(e.message || 'Failed to update notes');
                }
            }
        }

        if (e.target.classList.contains('update-status-btn')) {
            const id = e.target.dataset.id;
            const currentStatus = e.target.dataset.status;
            
            const newStatus = prompt(
                'Select new status:\n1 = Pending\n2 = Fulfilled\n3 = Cancelled\n\nEnter number or status name:',
                currentStatus
            );
            
            if (newStatus) {
                let statusValue = newStatus.toLowerCase();
                if (newStatus === '1') statusValue = 'pending';
                if (newStatus === '2') statusValue = 'fulfilled';
                if (newStatus === '3') statusValue = 'cancelled';
                
                if (!['pending', 'fulfilled', 'cancelled'].includes(statusValue)) {
                    showError('Invalid status. Use: Pending, Fulfilled, or Cancelled');
                    return;
                }
                
                try {
                    const res = await fetch(`${API_URL}/requests/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: statusValue })
                    });
                    
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}));
                        throw new Error(errorData.message || `Failed to update status (Status: ${res.status})`);
                    }
                    showSuccess(`Request status updated to: ${statusValue}`);
                    await fetchRequests();
                } catch (e) { 
                    console.error('Error updating status:', e); 
                    showError(e.message || 'Failed to update status');
                }
            }
        }
    });

    document.addEventListener('input', (e) => {
        if (e.target.id === 'search-pending-donors') {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = pendingDonors.filter(d => 
                d.name.toLowerCase().includes(searchTerm) || 
                d.email.toLowerCase().includes(searchTerm)
            );
            renderPendingDonors(filtered);
        }
        if (e.target.id === 'search-requests') {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = requests.filter(r => 
                (r.patientname || r.patientName || '').toLowerCase().includes(searchTerm) || 
                (r.bloodtype || r.bloodType || '').toLowerCase().includes(searchTerm) ||
                (r.location || '').toLowerCase().includes(searchTerm)
            );
            const listElement = document.getElementById('requests-admin-table');
            if (listElement) {
                listElement.innerHTML = filtered.map(r => {
                    const isEmergency = r.isemergency || r.isEmergency || r.is_emergency;
                    const status = r.status || 'Pending';
                    const date = r.date ? new Date(r.date).toLocaleDateString() : 'N/A';
                    const statusColor = status === 'Pending' || status === 'pending' ? 'warning' : status === 'Fulfilled' ? 'success' : 'danger';
                    const notes = r.notes || r.note || '-';
                    return `
                    <tr class="${isEmergency ? 'table-danger' : ''}">
                        <td>${r.patientname || r.patientName || r.patient_name}</td>
                        <td><span class="badge bg-danger">${r.bloodtype || r.bloodType || r.blood_type}</span></td>
                        <td>${r.units}</td>
                        <td>${r.location}</td>
                        <td>${isEmergency ? '🚨 YES' : 'No'}</td>
                        <td><span class="badge bg-${statusColor}">${status}</span></td>
                        <td>${date}</td>
                        <td><small>${notes === '-' ? '-' : notes.substring(0, 20) + '...'}</small></td>
                        <td>
                            <button class="btn btn-sm btn-info edit-request-btn me-1" data-id="${r.id}">✏️ Edit</button>
                            <button class="btn btn-sm btn-primary update-status-btn" data-id="${r.id}" data-status="${status}">Update</button>
                        </td>
                    </tr>`
                }).join('');
            }
        }
    });
});
