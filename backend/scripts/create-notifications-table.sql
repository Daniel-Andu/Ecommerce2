-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read),
    INDEX idx_created (created_at)
);

-- Insert some sample notifications for testing
INSERT INTO notifications (user_id, type, title, message, link) 
SELECT 
    id,
    'welcome',
    'Welcome to Marketplace!',
    'Thank you for joining our marketplace. Start exploring amazing products!',
    '/products'
FROM users 
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE user_id = users.id)
LIMIT 5;
