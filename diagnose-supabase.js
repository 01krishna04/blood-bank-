require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('🔍 Supabase Diagnostic Test\n');
console.log('='.repeat(70));

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log('❌ ERROR: SUPABASE_URL or SUPABASE_KEY not found in .env file');
    process.exit(1);
}

console.log(`📍 Project URL: ${SUPABASE_URL}\n`);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

(async () => {
    try {
        console.log('1️⃣  Testing basic connection...');
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        console.log('   ✅ Connection successful\n');

        console.log('2️⃣  Checking database schema...');
        const { data: schema, error: schemaError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .in('table_name', ['donors', 'pending_donors', 'requests', 'inventory']);
        
        if (!schemaError && schema && schema.length > 0) {
            console.log(`   ✅ Found ${schema.length} tables:`);
            schema.forEach(t => console.log(`      • ${t.table_name}`));
            console.log();
        } else {
            console.log('   ⚠️  Could not query schema\n');
        }

        console.log('3️⃣  Testing table access (select query)...\n');
        
        const tables = ['donors', 'pending_donors', 'requests', 'inventory'];
        let accessibleCount = 0;

        for (const table of tables) {
            try {
                const { data, error, status } = await supabase
                    .from(table)
                    .select('*')
                    .limit(1);
                
                if (error) {
                    console.log(`   📋 ${table}:`);
                    console.log(`      Status: ${status}`);
                    console.log(`      Error: ${error.message}`);
                    if (error.message.includes('permission')) {
                        console.log(`      ⚠️  LIKELY CAUSE: Row Level Security (RLS) is enabled`);
                        console.log(`      💡 FIX: Disable RLS or create appropriate policies`);
                    }
                    console.log();
                } else {
                    console.log(`   ✅ ${table} - Accessible (${data.length} rows)`);
                    accessibleCount++;
                }
            } catch (err) {
                console.log(`   ❌ ${table} - Error: ${err.message}`);
            }
        }

        console.log('\n' + '='.repeat(70));
        console.log(`\n📊 Summary: ${accessibleCount}/4 tables accessible\n`);

        if (accessibleCount === 0) {
            console.log('⚠️  ISSUE: Tables exist but are not accessible');
            console.log('\n🔧 SOLUTIONS:\n');
            console.log('   1. Check if Row Level Security (RLS) is enabled:');
            console.log('      • Go to Supabase dashboard → Authentication → Policies');
            console.log('      • Check if RLS is enabled for tables');
            console.log('      • If enabled, create a policy for anon users');
            console.log('\n   2. Or disable RLS for testing:');
            console.log('      • In SQL Editor, run:');
            console.log('        ALTER TABLE donors DISABLE ROW LEVEL SECURITY;');
            console.log('        ALTER TABLE pending_donors DISABLE ROW LEVEL SECURITY;');
            console.log('        ALTER TABLE requests DISABLE ROW LEVEL SECURITY;');
            console.log('        ALTER TABLE inventory DISABLE ROW LEVEL SECURITY;\n');
        } else if (accessibleCount === 4) {
            console.log('✅ SUCCESS! All tables are accessible and ready to use!\n');
            console.log('You can now run: npm start\n');
        }

        process.exit(0);

    } catch (err) {
        console.log(`\n❌ Error: ${err.message}\n`);
        process.exit(1);
    }
})();

// Timeout
setTimeout(() => {
    console.log('\n⏱️  Test timed out');
    process.exit(1);
}, 10000);
