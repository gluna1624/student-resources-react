const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'student_resources'
});

db.connect((err) => {
    if (err) console.error('Database connection failed:', err);
    else console.log('Connected to MySQL database');
});

app.get('/resources', (req, res) => {
    const query = `
        SELECT r.*, u.username 
        FROM resources r 
        LEFT JOIN users u ON r.user_id = u.id
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error: ' + err.sqlMessage);
        }
	console.log('Resources query results:', results);  // Debug log
        res.json(results);
    });
});

app.post('/resources', upload.single('file'), (req, res) => {
    const { title, description, subject } = req.body;
    const userId = req.session.user ? req.session.user.id : null;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;
    console.log('POST /resources - User ID:', userId, 'Session:', req.session.user, 'File:', filePath);
    db.query('INSERT INTO resources (title, description, subject, user_id, file_path) VALUES (?, ?, ?, ?, ?)', 
        [title, description, subject, userId, filePath], 
        (err, result) => {
            if (err) {
                console.error('Error adding resource:', err);
                res.status(500).send('Error adding resource');
            } else {
                const newResource = { 
                    id: result.insertId, 
                    title, 
                    description, 
                    subject, 
                    file_path: filePath, 
                    user_id: userId, 
                    created_at: new Date().toISOString() 
                };
                res.status(201).json(newResource);
            }
        });
});

app.put('/resources/:id', (req, res) => {
    const { title, description, subject } = req.body;
    const id = req.params.id;
    db.query('UPDATE resources SET title = ?, description = ?, subject = ? WHERE id = ?', [title, description, subject, id], (err, result) => {
        if (err) {
            console.error('Error updating resource:', err);
            res.status(500).send('Error updating resource');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Resource not found');
        } else {
            db.query('SELECT created_at FROM resources WHERE id = ?', [id], (err, rows) => {
                if (err) res.status(500).send('Error fetching updated resource');
                else res.json({ id: parseInt(id), title, description, subject, created_at: rows[0].created_at });
            });
        }
    });
});

app.delete('/resources/:id', (req, res) => {
  const resourceId = req.params.id;
  const userId = req.session.user?.id;

  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  db.query('SELECT user_id FROM resources WHERE id = ?', [resourceId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Resource not found' });
    if (results[0].user_id !== userId) return res.status(403).json({ error: 'Not authorized' });

    db.query('DELETE FROM resources WHERE id = ?', [resourceId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Resource deleted' });
    });
  });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Username not found' });
        }
        const user = results[0];
        bcrypt.compare(password, user.password_hash, (err, match) => {
            if (err) {
                console.error('Bcrypt error:', err);
                return res.status(500).send('Server error');
            }
            if (match) {
                req.session.user = { id: user.id, username: user.username };
                console.log('Login successful - Session set:', req.session.user);
                res.json({ success: true, username: user.username });
            } else {
                res.status(401).json({ success: false, message: 'Incorrect password' });
            }
        });
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Logout failed');
        }
        res.json({ success: true });
    });
});

app.get('/check-session', (req, res) => {
    if (req.session.user) {
        res.json({ isLoggedIn: true, username: req.session.user.username });
    } else {
        res.json({ isLoggedIn: false });
    }
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'Username or email already exists' });
        }
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error('Bcrypt error:', err);
                return res.status(500).send('Server error');
            }
            db.query('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, hash], (err, result) => {
                if (err) {
                    console.error('Error registering user:', err);
                    return res.status(500).send('Error registering user');
                }
                console.log('User registered:', { id: result.insertId, username, email });
                res.status(201).json({ success: true });
            });
        });
    });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));