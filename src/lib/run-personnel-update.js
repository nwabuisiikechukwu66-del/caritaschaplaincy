const { createClient } = require('@supabase/supabase-client');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runSQL() {
    const sql = fs.readFileSync(path.join(__dirname, 'update-personnel.sql'), 'utf8');
    console.log('Running SQL...');

    // Note: Supabase JS client doesn't have a direct 'run sql' method like the dashboard.
    // We have to use rpc or just perform the insertions manually if we can't use rpc.
    // Actually, I'll just do the insertions for the authorities manually to be safe.

    const authorities = [
        { name: 'Sister Administrator', role: 'Sister Administrator', order_rank: 1 },
        { name: 'Vice Chancellor', role: 'Vice Chancellor', order_rank: 2 },
        { name: 'Registrar', role: 'Registrar', order_rank: 3 },
        { name: 'Bursar', role: 'Bursar', order_rank: 4 }
    ];

    for (const auth of authorities) {
        const { error } = await supabase
            .from('university_authorities')
            .upsert(auth, { onConflict: 'name' });

        if (error) console.error(`Error upserting ${auth.name}:`, error.message);
        else console.log(`Successfully upserted ${auth.name}`);
    }

    console.log('Personnel update complete.');
}

runSQL();
