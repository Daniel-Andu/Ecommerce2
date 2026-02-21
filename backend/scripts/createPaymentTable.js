

const db = require('../config/db');

async function createPaymentTable() {
  try {
    console.log('Creating payment_transactions table...');
    
    await db.query(`
      CREATE TABLE IF NOT EXISTS payment_transactions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        transaction_ref VARCHAR(255) UNIQUE NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
        payment_method VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        INDEX idx_transaction_ref (transaction_ref),
        INDEX idx_order_id (order_id)
      )
    `);
    
    console.log('✅ Payment transactions table created successfully');
  } catch (error) {
    console.error('Error creating payment table:', error);
  } finally {
    process.exit();
  }
}

createPaymentTable();