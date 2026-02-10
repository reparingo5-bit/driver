import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new Database(join(__dirname, 'database.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Active', 'Onboarding')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed admin user (email: admin@example.com, password: admin123)
const hashedPassword = bcrypt.hashSync('admin123', 10);
const insertAdmin = db.prepare('INSERT OR IGNORE INTO admins (email, password) VALUES (?, ?)');
insertAdmin.run('admin@example.com', hashedPassword);

// Seed some drivers
const insertDriver = db.prepare('INSERT OR IGNORE INTO drivers (id, name, phone, email, status) VALUES (?, ?, ?, ?, ?)');
const drivers = [
  [1, 'John Doe', '+1234567890', 'john@example.com', 'Active'],
  [2, 'Jane Smith', '+1234567891', 'jane@example.com', 'Active'],
  [3, 'Mike Johnson', '+1234567892', 'mike@example.com', 'Onboarding'],
  [4, 'Sarah Williams', '+1234567893', 'sarah@example.com', 'Active'],
  [5, 'Tom Brown', '+1234567894', 'tom@example.com', 'Onboarding']
];

drivers.forEach(driver => {
  try {
    insertDriver.run(...driver);
  } catch (err) {
    // Ignore if already exists
  }
});

// API Routes

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email);
  
  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({ success: true, admin: { id: admin.id, email: admin.email } });
});

// Get all drivers with optional status filter
app.get('/api/drivers', (req, res) => {
  const { status } = req.query;
  
  let drivers;
  if (status && status !== 'Alle') {
    drivers = db.prepare('SELECT * FROM drivers WHERE status = ? ORDER BY created_at DESC').all(status);
  } else {
    drivers = db.prepare('SELECT * FROM drivers ORDER BY created_at DESC').all();
  }
  
  res.json(drivers);
});

// Get single driver
app.get('/api/drivers/:id', (req, res) => {
  const driver = db.prepare('SELECT * FROM drivers WHERE id = ?').get(req.params.id);
  
  if (!driver) {
    return res.status(404).json({ error: 'Driver not found' });
  }
  
  res.json(driver);
});

// Create driver
app.post('/api/drivers', (req, res) => {
  const { name, phone, email, status } = req.body;
  
  if (!name || !phone || !email || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (!['Active', 'Onboarding'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  try {
    const insert = db.prepare('INSERT INTO drivers (name, phone, email, status) VALUES (?, ?, ?, ?)');
    const result = insert.run(name, phone, email, status);
    
    const newDriver = db.prepare('SELECT * FROM drivers WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newDriver);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create driver' });
  }
});

// Update driver
app.put('/api/drivers/:id', (req, res) => {
  const { name, phone, email, status } = req.body;
  
  if (!name || !phone || !email || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (!['Active', 'Onboarding'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  try {
    const update = db.prepare('UPDATE drivers SET name = ?, phone = ?, email = ?, status = ? WHERE id = ?');
    const result = update.run(name, phone, email, status, req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    const updatedDriver = db.prepare('SELECT * FROM drivers WHERE id = ?').get(req.params.id);
    res.json(updatedDriver);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update driver' });
  }
});

// Delete driver
app.delete('/api/drivers/:id', (req, res) => {
  try {
    const deleteStmt = db.prepare('DELETE FROM drivers WHERE id = ?');
    const result = deleteStmt.run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete driver' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
