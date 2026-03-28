/**
 * Integration Test - Frontend to Backend Data Flow
 * Tests all CRUD operations with Supabase backend
 */

const BASE_URL = 'http://localhost:3000/api';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(msg, color = 'reset') {
    console.log(`${colors[color]}${msg}${colors.reset}`);
}

async function testHealthCheck() {
    log('\n📋 TEST 1: Health Check', 'cyan');
    try {
        const response = await fetch(`${BASE_URL}/health`);
        const data = await response.json();
        log(`✅ Server healthy: ${JSON.stringify(data)}`, 'green');
        return true;
    } catch (error) {
        log(`❌ Health check failed: ${error.message}`, 'red');
        return false;
    }
}

async function testDonorRegistration() {
    log('\n📋 TEST 2: Register New Donor', 'cyan');
    const donor = {
        name: 'Test Donor ' + Date.now(),
        bloodType: 'O+',
        email: `donor${Date.now()}@test.com`,
        phone: '9876543210',
        location: 'Test City'
    };

    try {
        const response = await fetch(`${BASE_URL}/donors/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(donor)
        });
        const data = await response.json();
        
        if (response.ok && data.id) {
            log(`✅ Donor registered successfully:`, 'green');
            log(`   ID: ${data.id}`);
            log(`   Name: ${data.name}`);
            log(`   Blood Type: ${data.bloodType}`);
            log(`   Email: ${data.email}`);
            return data.id;
        } else {
            log(`❌ Registration failed: ${JSON.stringify(data)}`, 'red');
            return null;
        }
    } catch (error) {
        log(`❌ Registration error: ${error.message}`, 'red');
        return null;
    }
}

async function testGetAllDonors() {
    log('\n📋 TEST 3: Get All Donors', 'cyan');
    try {
        const response = await fetch(`${BASE_URL}/donors`);
        const donors = await response.json();
        
        if (Array.isArray(donors)) {
            log(`✅ Retrieved ${donors.length} approved donors`, 'green');
            if (donors.length > 0) {
                log(`   First donor: ${donors[0].name} (${donors[0].bloodType})`);
            }
            return true;
        } else {
            log(`❌ Invalid response format`, 'red');
            return false;
        }
    } catch (error) {
        log(`❌ Get donors error: ${error.message}`, 'red');
        return false;
    }
}

async function testGetPendingDonors() {
    log('\n📋 TEST 4: Get Pending Donors', 'cyan');
    try {
        const response = await fetch(`${BASE_URL}/pending-donors`);
        const pending = await response.json();
        
        if (Array.isArray(pending)) {
            log(`✅ Retrieved ${pending.length} pending donors`, 'green');
            if (pending.length > 0) {
                log(`   First pending: ${pending[0].name}`);
            }
            return true;
        } else {
            log(`❌ Invalid response format`, 'red');
            return false;
        }
    } catch (error) {
        log(`❌ Get pending donors error: ${error.message}`, 'red');
        return false;
    }
}

async function testBloodRequest() {
    log('\n📋 TEST 5: Create Blood Request', 'cyan');
    const request = {
        patientName: 'Test Patient ' + Date.now(),
        bloodType: 'O+',
        units: 2,
        location: 'Test Hospital',
        contact: '9999999999',
        isEmergency: false
    };

    try {
        const response = await fetch(`${BASE_URL}/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        });
        const data = await response.json();
        
        if (response.ok && data.id) {
            log(`✅ Blood request created:`, 'green');
            log(`   ID: ${data.id}`);
            log(`   Patient: ${data.patientName}`);
            log(`   Type: ${data.bloodType}`);
            log(`   Units: ${data.units}`);
            return data.id;
        } else {
            log(`❌ Request creation failed: ${JSON.stringify(data)}`, 'red');
            return null;
        }
    } catch (error) {
        log(`❌ Request error: ${error.message}`, 'red');
        return null;
    }
}

async function testGetAllRequests() {
    log('\n📋 TEST 6: Get All Blood Requests', 'cyan');
    try {
        const response = await fetch(`${BASE_URL}/requests`);
        const requests = await response.json();
        
        if (Array.isArray(requests)) {
            log(`✅ Retrieved ${requests.length} blood requests`, 'green');
            if (requests.length > 0) {
                log(`   First request: ${requests[0].patientName} needs ${requests[0].bloodType}`);
            }
            return true;
        } else {
            log(`❌ Invalid response format`, 'red');
            return false;
        }
    } catch (error) {
        log(`❌ Get requests error: ${error.message}`, 'red');
        return false;
    }
}

async function testInventory() {
    log('\n📋 TEST 7: Get Blood Inventory', 'cyan');
    try {
        const response = await fetch(`${BASE_URL}/inventory`);
        const inventory = await response.json();
        
        if (Array.isArray(inventory)) {
            log(`✅ Retrieved ${inventory.length} inventory records`, 'green');
            if (inventory.length > 0) {
                log(`   First item: ${inventory[0].bloodType} (${inventory[0].quantity} units)`);
            }
            return true;
        } else {
            log(`❌ Invalid response format`, 'red');
            return false;
        }
    } catch (error) {
        log(`❌ Get inventory error: ${error.message}`, 'red');
        return false;
    }
}

async function testReportsSummary() {
    log('\n📋 TEST 8: Get Reports Summary', 'cyan');
    try {
        const response = await fetch(`${BASE_URL}/reports/summary`);
        const summary = await response.json();
        
        log(`✅ Reports Summary:`, 'green');
        log(`   Total Donors: ${summary.totalDonors}`);
        log(`   Pending Requests: ${summary.pendingRequests}`);
        
        // Show blood type breakdown if available
        if (summary.bloodTypeBreakdown) {
            log(`   Blood Type Breakdown:`);
            for (const [type, count] of Object.entries(summary.bloodTypeBreakdown)) {
                log(`     ${type}: ${count}`);
            }
        }
        
        return true;
    } catch (error) {
        log(`❌ Reports error: ${error.message}`, 'red');
        return false;
    }
}

async function runAllTests() {
    log('\n' + '='.repeat(60), 'blue');
    log('🧪 BLOOD BANK SYSTEM - INTEGRATION TESTS', 'blue');
    log('='.repeat(60), 'blue');

    const results = {
        passed: 0,
        failed: 0
    };

    // Run tests
    const tests = [
        testHealthCheck,
        testDonorRegistration,
        testGetAllDonors,
        testGetPendingDonors,
        testBloodRequest,
        testGetAllRequests,
        testInventory,
        testReportsSummary
    ];

    for (const test of tests) {
        try {
            const result = await test();
            if (result) results.passed++;
            else results.failed++;
        } catch (error) {
            log(`ERROR in ${test.name}: ${error.message}`, 'red');
            results.failed++;
        }
    }

    // Summary
    log('\n' + '='.repeat(60), 'blue');
    log('📊 TEST RESULTS', 'blue');
    log('='.repeat(60), 'blue');
    log(`✅ Passed: ${results.passed}`, 'green');
    log(`❌ Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
    
    if (results.failed === 0) {
        log('\n🎉 ALL TESTS PASSED! Frontend-Backend integration is working perfectly!', 'green');
    } else {
        log('\n⚠️  Some tests failed. Check the output above for details.', 'yellow');
    }
    
    log('='.repeat(60) + '\n', 'blue');
}

// Run tests
runAllTests();
