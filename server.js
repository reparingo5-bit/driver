const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session configuration
app.use(session({
  secret: 'driver-dashboard-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Data file paths
const DATA_FILE = path.join(__dirname, 'data.json');
const USERS_FILE = path.join(__dirname, 'users.json');

// Helper function to read data
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { drivers: [] };
  }
}

// Helper function to write data
async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Helper function to read users
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [] };
  }
}

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Admin middleware
function requireAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
}

// Routes

// Login page
app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('login', { error: null });
});

// Login POST
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const usersData = await readUsers();
  const user = usersData.users.find(u => u.username === username);
  
  if (!user) {
    return res.render('login', { error: 'Ungültiger Benutzername oder Passwort' });
  }
  
  // For demo purposes, accept "admin123" for admin and "partner123" for partner
  // In production, use bcrypt.compare
  let validPassword = false;
  if (username === 'admin' && password === 'admin123') {
    validPassword = true;
  } else if (username === 'partner' && password === 'partner123') {
    validPassword = true;
  }
  
  if (!validPassword) {
    return res.render('login', { error: 'Ungültiger Benutzername oder Passwort' });
  }
  
  req.session.user = {
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name
  };
  
  res.redirect('/dashboard');
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Dashboard (Single Page)
app.get('/dashboard', requireAuth, async (req, res) => {
  const data = await readData();
  const drivers = data.drivers || [];
  
  const stats = {
    total: drivers.length,
    aktiv: drivers.filter(d => d.status === 'aktiv').length,
    inaktiv: drivers.filter(d => d.status === 'inaktiv').length,
    neu: drivers.filter(d => d.status === 'neu').length
  };
  
  res.render('dashboard', { 
    user: req.session.user,
    stats,
    drivers
  });
});

// Redirect root to dashboard
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

// API: Get all drivers (with filters)
app.get('/api/drivers', requireAuth, async (req, res) => {
  const data = await readData();
  let drivers = data.drivers || [];
  
  const { search, status, fahrzeugtyp } = req.query;
  
  if (search) {
    const searchLower = search.toLowerCase();
    drivers = drivers.filter(d => 
      d.vorname.toLowerCase().includes(searchLower) ||
      d.nachname.toLowerCase().includes(searchLower) ||
      d.email.toLowerCase().includes(searchLower) ||
      d.rufnummer.includes(search) ||
      d.kennzeichen.toLowerCase().includes(searchLower)
    );
  }
  
  if (status && status !== 'alle') {
    drivers = drivers.filter(d => d.status === status);
  }
  
  if (fahrzeugtyp && fahrzeugtyp !== 'alle') {
    drivers = drivers.filter(d => d.fahrzeugtyp === fahrzeugtyp);
  }
  
  res.json({ drivers });
});

// API: Create driver (admin only)
app.post('/api/drivers', requireAdmin, async (req, res) => {
  const data = await readData();
  const drivers = data.drivers || [];
  
  const newDriver = {
    id: drivers.length > 0 ? Math.max(...drivers.map(d => d.id)) + 1 : 1,
    vorname: req.body.vorname,
    nachname: req.body.nachname,
    email: req.body.email,
    rufnummer: req.body.rufnummer,
    status: req.body.status || 'neu',
    fahrzeugtyp: req.body.fahrzeugtyp,
    kennzeichen: req.body.kennzeichen,
    sticker: req.body.sticker === 'true' || req.body.sticker === true,
    app: req.body.app === 'true' || req.body.app === true,
    joined_date: new Date().toISOString().split('T')[0]
  };
  
  drivers.push(newDriver);
  await writeData({ drivers });
  
  res.json({ success: true, driver: newDriver });
});

// API: Update driver
app.put('/api/drivers/:id', requireAuth, async (req, res) => {
  const data = await readData();
  const drivers = data.drivers || [];
  const driverIndex = drivers.findIndex(d => d.id === parseInt(req.params.id));
  
  if (driverIndex === -1) {
    return res.status(404).json({ error: 'Driver not found' });
  }
  
  const user = req.session.user;
  
  // Partner can only change status
  if (user.role === 'partner') {
    if (req.body.status) {
      drivers[driverIndex].status = req.body.status;
    } else {
      return res.status(403).json({ error: 'Partners can only change status' });
    }
  } else {
    // Admin can change everything
    drivers[driverIndex] = {
      ...drivers[driverIndex],
      vorname: req.body.vorname || drivers[driverIndex].vorname,
      nachname: req.body.nachname || drivers[driverIndex].nachname,
      email: req.body.email || drivers[driverIndex].email,
      rufnummer: req.body.rufnummer || drivers[driverIndex].rufnummer,
      status: req.body.status || drivers[driverIndex].status,
      fahrzeugtyp: req.body.fahrzeugtyp || drivers[driverIndex].fahrzeugtyp,
      kennzeichen: req.body.kennzeichen || drivers[driverIndex].kennzeichen,
      sticker: req.body.sticker !== undefined ? (req.body.sticker === 'true' || req.body.sticker === true) : drivers[driverIndex].sticker,
      app: req.body.app !== undefined ? (req.body.app === 'true' || req.body.app === true) : drivers[driverIndex].app
    };
  }
  
  await writeData({ drivers });
  
  res.json({ success: true, driver: drivers[driverIndex] });
});

// API: Delete driver (admin only)
app.delete('/api/drivers/:id', requireAdmin, async (req, res) => {
  const data = await readData();
  const drivers = data.drivers || [];
  const filteredDrivers = drivers.filter(d => d.id !== parseInt(req.params.id));
  
  await writeData({ drivers: filteredDrivers });
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}`);
  console.log('');
  console.log('Login credentials:');
  console.log('Admin: username=admin, password=admin123');
  console.log('Partner: username=partner, password=partner123');
});
