

// generate-hash.js
const bcrypt = require('bcrypt');

async function generateHash() {
  try {
    const password = 'admin123'; // You can change this password
    const saltRounds = 10;
    
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('=================================');
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('=================================');
    console.log('\nCopy this hash for your SQL update:');
    console.log(hash);
    console.log('\nSQL command to update:');
    console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'admin@example.com';`);
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash();