const express = require('express');
const { Pool } = require('pg');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Managed Database Connection Pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Object Storage Client
const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

// Healthcheck Route (for Cloud Monitoring)
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'HEALTHY', database: 'CONNECTED', timestamp: new Date() });
  } catch (err) {
    console.error('Healthcheck failed:', err.message);
    res.status(500).json({ status: 'UNHEALTHY', error: err.message });
  }
});

// API Endpoint to Store Data
app.post('/api/notes', async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO notes (title, content, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting note:', err.message);
    res.status(500).json({ error: 'Database operation failed' });
  }
});

// API Endpoint to Get Data
app.get('/api/notes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notes ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching notes:', err.message);
    res.status(500).json({ error: 'Database query failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});