-- ============================================
-- URGENT: RUN THIS SQL NOW IN TIDB CLOUD
-- This will fix ALL remaining issues
-- ============================================

USE test;

-- 1. CREATE WISHLIST TABLE (Fixes delete product error)
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

-- 2. CREATE NOTIFICATIONS TABLE (Fixes notifications error)
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

-- 3. VERIFY TABLES EXIST
SELECT 'Checking tables...' as status;
SHOW TABLES LIKE 'wishlist';
SHOW TABLES LIKE 'notifications';

-- 4. CHECK PRODUCT_IMAGES TABLE
SELECT 'Checking product_images table...' as status;
DESCRIBE product_images;

-- 5. CHECK IF PRODUCT_IMAGES TABLE EXISTS
SELECT COUNT(*) as total_product_images FROM product_images;

-- 6. CHECK RECENT PRODUCTS WITH IMAGES
SELECT 
  p.id,
  p.name,
  p.created_at,
  COUNT(pi.id) as image_count
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id
GROUP BY p.id
ORDER BY p.created_at DESC
LIMIT 10;

-- ============================================
-- DONE! Now test:
-- 1. Delete product should work
-- 2. Check if images show in the query above
-- ============================================
