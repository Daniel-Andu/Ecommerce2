require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function runMigrations() {
    console.log('🚀 Starting database migrations...\n');

    try {
        // Read the migrations SQL file
        const migrationsPath = path.join(__dirname, 'migrations.sql');
        const sql = fs.readFileSync(migrationsPath, 'utf8');

        // Split by semicolon and filter out empty statements
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];

            // Extract table name for logging
            const tableMatch = statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/i) ||
                statement.match(/ALTER TABLE (\w+)/i) ||
                statement.match(/INSERT INTO (\w+)/i);
            const tableName = tableMatch ? tableMatch[1] : `Statement ${i + 1}`;

            try {
                await pool.query(statement);
                console.log(`✅ ${tableName}`);
                successCount++;
            } catch (err) {
                // Check if it's a "duplicate" or "already exists" error (safe to ignore)
                if (err.message.includes('Duplicate') ||
                    err.message.includes('already exists') ||
                    err.message.includes('duplicate key')) {
                    console.log(`⏭️  ${tableName} (already exists)`);
                    skipCount++;
                } else {
                    console.error(`❌ ${tableName}:`, err.message);
                    errorCount++;
                }
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log('📊 Migration Summary:');
        console.log(`   ✅ Success: ${successCount}`);
        console.log(`   ⏭️  Skipped: ${skipCount}`);
        console.log(`   ❌ Errors: ${errorCount}`);
        console.log('='.repeat(50) + '\n');

        // Verify tables exist
        console.log('🔍 Verifying tables...\n');
        const [tables] = await pool.query('SHOW TABLES');

        const requiredTables = [
            'notifications',
            'returns',
            'return_images',
            'refunds',
            'withdrawals',
            'shipping_methods',
            'coupons',
            'coupon_usage',
            'pages',
            'product_attributes'
        ];

        const existingTables = tables.map(t => Object.values(t)[0]);

        requiredTables.forEach(table => {
            if (existingTables.includes(table)) {
                console.log(`✅ ${table} table exists`);
            } else {
                console.log(`❌ ${table} table missing`);
            }
        });

        console.log('\n✨ Migrations completed!\n');
        process.exit(0);

    } catch (err) {
        console.error('\n❌ Migration failed:', err);
        process.exit(1);
    }
}

// Run migrations
runMigrations();
