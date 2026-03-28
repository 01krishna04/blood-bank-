require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('🔍 Supabase Connection Test\n');
console.log('='.repeat(60));

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project-id.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'your-anon-key';

console.log(`\n📍 Attempting to connect to Supabase...\n`);
console.log(`URL: ${SUPABASE_URL}`);
console.log(`Key: ${SUPABASE_KEY.substring(0, 20)}...\n`);

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Test connection
(async () => {
    try {
        // Test basic connectivity
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
            throw error;
        }

        console.log('✅ Connection Successful!\n');
        console.log('📊 Testing Table Access...\n');

        // Check if tables exist
        const tables = ['donors', 'pending_donors', 'requests', 'inventory'];
        let tablesFound = 0;

        for (const table of tables) {
            const { count, error: tableError } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });
            
            if (!tableError) {
                console.log(`   ✅ ${table} - OK (${count} records)`);
                tablesFound++;
            } else {
                console.log(`   ❌ ${table} - NOT FOUND`);
            }
        }

        console.log(`\n📈 Tables Found: ${tablesFound}/${tables.length}`);

        if (tablesFound === 4) {
            console.log('\n✅ All tables are set up correctly!');
            console.log('\n🚀 Your Supabase setup is ready to use.\n');
        } else {
            console.log('\n⚠️  Some tables are missing.');
            console.log('\n📝 Run the SQL scripts from SUPABASE_SETUP.md to create them.\n');
        }

        console.log('='.repeat(60) + '\n');
        process.exit(0);

    } catch (err) {
        console.log('❌ Connection Failed!\n');
        console.log('Error Details:');
        console.log(`   ${err.message}\n`);

        console.log('🔧 Troubleshooting Tips:\n');

        if (err.message.includes('fetch')) {
            console.log('   1. Check your internet connection');
            console.log('   2. Verify Supabase URL is correct');
            console.log('   3. Ensure project is running in Supabase console\n');
        } else if (err.message.includes('auth')) {
            console.log('   1. Check your Supabase API key');
            console.log('   2. Verify you\'re using the ANON key, not SECRET key');
            console.log('   3. Regenerate key in Supabase dashboard if needed\n');
        }

        console.log('📖 For setup instructions, see: SUPABASE_SETUP.md\n');
        console.log('='.repeat(60) + '\n');
        process.exit(1);
    }
})();

// Timeout after 10 seconds
setTimeout(() => {
    console.log('\n⏱️  Connection test timed out');
    console.log('Check your internet connection and Supabase status.\n');
    process.exit(1);
}, 10000);
