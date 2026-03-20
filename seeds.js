const db = require('./db/connection');
const fs = require('fs');

const seedSQL = fs.readFileSync('./db/seed.sql', 'utf8');

db.query(seedSQL, (err, results) => {
  if (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
  console.log('Database seeded successfully!');
  process.exit(0);
});