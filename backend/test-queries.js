

const pool = require('./config/db');

async function testQueries() {
  console.log('🔍 Testing Database Queries');
  console.log('==========================');
  
  try {
    // 1. Check if orders table has any data
    const [orders] = await pool.query('SELECT COUNT(*) as count FROM orders');
    console.log('📊 Total orders in database:', orders[0].count);
    
    if (orders[0].count > 0) {
      // 2. Show sample orders
      const [sampleOrders] = await pool.query('SELECT id, order_number, total, status, created_at FROM orders LIMIT 5');
      console.log('\n📋 Sample orders:');
      sampleOrders.forEach(order => {
        console.log(`   ID: ${order.id}, Number: ${order.order_number}, Total: ${order.total}, Status: ${order.status}, Date: ${order.created_at}`);
      });
      
      // 3. Check orders in last 7 days
      const [last7Days] = await pool.query(`
        SELECT COUNT(*) as count 
        FROM orders 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      `);
      console.log('\n📊 Orders in last 7 days:', last7Days[0].count);
      
      // 4. Check orders in last 30 days
      const [last30Days] = await pool.query(`
        SELECT COUNT(*) as count 
        FROM orders 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      `);
      console.log('📊 Orders in last 30 days:', last30Days[0].count);
      
      // 5. Check order status distribution
      const [statusCounts] = await pool.query(`
        SELECT status, COUNT(*) as count 
        FROM orders 
        GROUP BY status
      `);
      console.log('\n📊 Order status distribution:');
      statusCounts.forEach(row => {
        console.log(`   ${row.status}: ${row.count}`);
      });
    } else {
      console.log('❌ No orders found in database!');
    }
    
    // 6. Check categories
    const [categories] = await pool.query('SELECT COUNT(*) as count FROM categories');
    console.log('\n📊 Total categories:', categories[0].count);
    
    if (categories[0].count > 0) {
      const [categoryList] = await pool.query('SELECT name FROM categories LIMIT 5');
      console.log('📋 Categories:', categoryList.map(c => c.name).join(', '));
    }
    
    // 7. Check products
    const [products] = await pool.query('SELECT COUNT(*) as count FROM products');
    console.log('\n📊 Total products:', products[0].count);
    
    // 8. Check order_items for top products
    const [orderItems] = await pool.query('SELECT COUNT(*) as count FROM order_items');
    console.log('📊 Total order items:', orderItems[0].count);
    
  } catch (error) {
    console.error('❌ Error running queries:', error);
  } finally {
    process.exit();
  }
}

testQueries();