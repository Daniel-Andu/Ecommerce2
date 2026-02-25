const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

async function setupNewFeatures() {
    console.log('🚀 Setting up new features...\n');

    try {
        // Read and execute migrations
        console.log('📊 Running database migrations...');
        const migrationsPath = path.join(__dirname, 'migrations.sql');
        const migrations = fs.readFileSync(migrationsPath, 'utf8');

        // Split by semicolon and execute each statement
        const statements = migrations
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            try {
                await pool.query(statement);
            } catch (err) {
                // Ignore errors for already existing tables
                if (!err.message.includes('already exists')) {
                    console.error('Error executing statement:', err.message);
                }
            }
        }

        console.log('✅ Database migrations completed\n');

        // Verify tables
        console.log('🔍 Verifying new tables...');
        const tables = [
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

        for (const table of tables) {
            const [rows] = await pool.query(`SHOW TABLES LIKE '${table}'`);
            if (rows.length > 0) {
                console.log(`  ✅ ${table}`);
            } else {
                console.log(`  ❌ ${table} - NOT FOUND`);
            }
        }

        console.log('\n✅ Setup completed successfully!');
        console.log('\n📝 Next steps:');
        console.log('1. Configure SMTP settings in .env file');
        console.log('2. Restart your server: npm start');
        console.log('3. Test new endpoints using the API documentation');

    } catch (err) {
        console.error('❌ Setup failed:', err.message);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

setupNewFeatures();
