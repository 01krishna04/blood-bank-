const mongoose = require('mongoose');

console.log('🔍 MongoDB Connection Test\n');
console.log('=' .repeat(50));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bloodbank';

console.log(`\n📍 Attempting to connect to: ${MONGODB_URI}\n`);

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ Connection Successful!\n');
    
    // Test database access
    const db = mongoose.connection.db;
    
    console.log('📊 Database Information:');
    console.log(`   Database Name: ${db.getName()}`);
    console.log(`   Connection Host: ${mongoose.connection.host}`);
    console.log(`   Connection Port: ${mongoose.connection.port}`);
    console.log(`   Connection State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}\n`);
    
    // List collections
    db.listCollections().toArray((err, collections) => {
        if (err) {
            console.log('❌ Error listing collections:', err.message);
            mongoose.connection.close();
            process.exit(1);
        }
        
        console.log('📚 Collections Found:');
        if (collections.length === 0) {
            console.log('   ⚠️  No collections found\n');
            console.log('   Run these commands to create collections:');
            console.log('   mongosh');
            console.log('   use bloodbank');
            console.log('   db.createCollection("donors")');
            console.log('   db.createCollection("pendingdonors")');
            console.log('   db.createCollection("requests")');
            console.log('   db.createCollection("inventories")');
        } else {
            collections.forEach((collection, index) => {
                console.log(`   ${index + 1}. ${collection.name}`);
            });
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('✅ MongoDB Connection Test Complete!\n');
        console.log('Your system is ready to use MongoDB with BloodBank.\n');
        
        mongoose.connection.close();
        process.exit(0);
    });
})
.catch(err => {
    console.log('❌ Connection Failed!\n');
    console.log('Error Details:');
    console.log(`   ${err.message}\n`);
    
    console.log('🔧 Troubleshooting Tips:\n');
    
    if (err.message.includes('ECONNREFUSED')) {
        console.log('   1. MongoDB service is not running');
        console.log('   2. Start MongoDB using one of these commands:\n');
        console.log('      Windows (Admin PowerShell):');
        console.log('      > net start MongoDB\n');
        console.log('      macOS:');
        console.log('      $ brew services start mongodb-community@7.0\n');
        console.log('      Linux:');
        console.log('      $ sudo systemctl start mongod\n');
    } else if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
        console.log('   1. MongoDB host is not accessible');
        console.log('   2. Verify your MONGODB_URI is correct');
        console.log('   3. Default URI: mongodb://localhost:27017/bloodbank\n');
    } else if (err.message.includes('authentication failed')) {
        console.log('   1. Username/Password is incorrect');
        console.log('   2. Check your MONGODB_URI credentials');
        console.log('   3. Format: mongodb://username:password@host:port/database\n');
    }
    
    console.log('='.repeat(50) + '\n');
    console.log('For more help, check MONGODB_SETUP.md\n');
    
    process.exit(1);
});

// Timeout after 10 seconds
setTimeout(() => {
    console.log('\n⏱️  Connection test timed out');
    mongoose.connection.close();
    process.exit(1);
}, 10000);
