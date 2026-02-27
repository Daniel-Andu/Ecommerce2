-- ============================================
-- CREATE MISSING TABLES FOR E-COMMERCE DATABASE
-- Run this in TiDB Cloud Console
-- Database: test
-- ============================================

USE test;

-- 1. CREATE WISHLIST TABLE
CREATE TABLE IF NOT EXISTS wishlist (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (user_id, product_id),
  INDEX idx_user (user_id),
  INDEX idx_product (product_id)
);

-- 2. CREATE NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  data JSON,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_read (user_id, is_read),
  INDEX idx_created (created_at)
);

-- 3. VERIFY TABLES WERE CREATED
SHOW TABLES LIKE 'wishlist';
SHOW TABLES LIKE 'notifications';

-- 4. CHECK TABLE STRUCTURES
DESCRIBE wishlist;
DESCRIBE notifications;

-- 5. CHECK IF TABLES HAVE DATA
SELECT COUNT(*) as wishlist_count FROM wishlist;
SELECT COUNT(*) as notifications_count FROM notifications;

-- ============================================
-- DONE! Tables created successfully
-- ============================================
