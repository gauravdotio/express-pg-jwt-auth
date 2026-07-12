const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function seedData() {
  const client = await pool.connect();
  try {
    console.log('Seeding mock data for preview...');
    await client.query('BEGIN');
    
    // Clear old records
    await client.query('TRUNCATE users, projects, tasks RESTART IDENTITY CASCADE');

    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Insert mock user
    const userRes = await client.query(`
      INSERT INTO users (name, email, password)
      VALUES ('Consistent Developer', 'user@example.com', $1)
      RETURNING id
    `, [hashedPassword]);
    
    const userId = userRes.rows[0].id;
    console.log('Created user consistent developer: user@example.com / password123');

    // Insert mock project
    const projectRes = await client.query(`
      INSERT INTO projects (name, description, owner_id)
      VALUES ('GitHub Green Streak Tracker', 'A tracker to keep contributions high', $1)
      RETURNING id
    `, [userId]);
    
    const projectId = projectRes.rows[0].id;
    console.log('Created project: GitHub Green Streak Tracker');

    // Insert mock tasks
    await client.query(`
      INSERT INTO tasks (title, description, status, priority, project_id)
      VALUES 
      ('Setup server skeletons', 'Setup basic node files and express app instance', 'done', 'high', $1),
      ('Implement auth routes', 'Implement jwt signup and signin APIs', 'in_progress', 'medium', $1),
      ('Write frontend interface', 'Write interactive sandbox dashboard', 'todo', 'low', $1)
    `, [projectId]);
    
    await client.query('COMMIT');
    console.log('Database seeded successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seeding database failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seedData();
