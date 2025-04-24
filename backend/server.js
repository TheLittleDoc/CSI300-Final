const express = require('express');
const cors = require('cors');
const db = require('./db');
const env = require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

var envPath = "./.env";
var envData = env.parsed;
console.log('Environment Variables:', envData);
console.log('Database connection:', db);


// Auth
app.post('/login', (req, res) => {
    console.log('🛠️ LOGIN ATTEMPT RECEIVED');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
  
    const { user, password } = req.body;
    if (user === envData.USER && password === envData.PASSWORD) {
      console.log('✅ Login success');
      res.json({ success: true });
    } else {
      console.log('❌ Invalid credentials');
      res.status(401).json({ success: false });
    }
  });
  
  
  
  
// CRUD endpoints for Category
app.get('/students', (req, res) => {
  db.all('SELECT * FROM Student', [], (err, rows) => res.json(rows));
});

app.post('/categories', (req, res) => {
  const { category_name } = req.body;
  db.run('INSERT INTO Category (category_name) VALUES (?)', [category_name], function(err) {
    res.json({ id: this.lastID });
  });
});

// Add update/delete if needed...

// Repeat for Product table...

// UPDATE Category
app.put('/categories/:id', (req, res) => {
    const { category_name } = req.body;
    db.run('UPDATE Category SET category_name = ? WHERE category_id = ?', 
      [category_name, req.params.id], 
      function(err) {
        if (err) return res.status(500).json(err);
        res.json({ updated: this.changes });
      }
    );
  });
  
  // DELETE Category
  app.delete('/categories/:id', (req, res) => {
    db.run('DELETE FROM Category WHERE category_id = ?', [req.params.id], function(err) {
      if (err) return res.status(500).json(err);
      res.json({ deleted: this.changes });
    });
  });
  
  // GET all Products
app.get('/students', (req, res) => {
    db.all('SELECT * FROM Student', [], (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    });
  });

/*
 *
 * INSERT INTO "main"."Student"
 * ("FirstName", "LastName", "Email", "GraduationYear")
 * VALUES ('Eddie', 'Mustermann', 'eddie.mustermann@mymail.champlain.edu', 2027);
 *
 */

  // ADD Product
  app.post('/students', (req, res) => {
    const { FirstName, LastName, Email, GraduationYear } = req.body;
    db.run('INSERT INTO Student (FirstName, LastName, Email, GraduationYear) VALUES (?, ?, ?, ?)',
      [FirstName, LastName, Email, GraduationYear],
      function(err) {
        if (err) return res.status(500).json(err);
        res.json({ id: this.lastID });
      }
    );
  });
  
  // UPDATE Product
  app.put('/students/:id', (req, res) => {
    const { StudentID, FirstName, LastName, Email, GraduationYear } = req.body;
    db.run('UPDATE Student SET FirstName = ?, LastName = ?, Email = ?, GraduationYear = ? WHERE StudentID = ?',
      [FirstName, LastName, Email, GraduationYear, req.params.id],
      function(err) {
        if (err) return res.status(500).json(err);
        res.json({ updated: this.changes });
      }
    );
  });
  
  // DELETE Student
  app.delete('/students/:id', (req, res) => {
    db.run('DELETE FROM Student WHERE StudentID = ?', [req.params.id], function(err) {
      if (err) return res.status(500).json(err);
      res.json({ deleted: this.changes });
    });
  });
  

app.listen(5000, () => console.log('Backend running on port 5000'));
