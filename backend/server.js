const express = require('express');
const cors = require('cors');
const db = require('./db');
const env = require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

var envPath = './.env';
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
app.post('/categories', (req, res) => {
    const { category_name } = req.body;
    db.run(
        'INSERT INTO Category (category_name) VALUES (?)',
        [category_name],
        function (err) {
            res.json({ id: this.lastID });
        }
    );
});

// Add update/delete if needed...

// Update Category
app.put('/categories/:id', (req, res) => {
    const { category_name } = req.body;
    db.run(
        'UPDATE Category SET category_name = ? WHERE category_id = ?',
        [category_name, req.params.id],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ updated: this.changes });
        }
    );
});

// Delete Category
app.delete('/categories/:id', (req, res) => {
    db.run(
        'DELETE FROM Category WHERE category_id = ?',
        [req.params.id],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ deleted: this.changes });
        }
    );
});

/*
 *
 * INSERT INTO "main"."Student"
 * ("FirstName", "LastName", "Email", "GraduationYear")
 * VALUES ('Eddie', 'Mustermann', 'eddie.mustermann@mymail.champlain.edu', 2027);
 *
 */

// Student routes
app.get('/students', (req, res) => {
    db.all('SELECT * FROM Student', [], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.post('/students', (req, res) => {
    const { FirstName, LastName, Email, GraduationYear } = req.body;
    db.run(
        'INSERT INTO Student (FirstName, LastName, Email, GraduationYear) VALUES (?, ?, ?, ?)',
        [FirstName, LastName, Email, GraduationYear],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ id: this.lastID });
        }
    );
});

app.put('/students/:id', (req, res) => {
    const { FirstName, LastName, Email, GraduationYear } = req.body;
    db.run(
        'UPDATE Student SET FirstName = ?, LastName = ?, Email = ?, GraduationYear = ? WHERE StudentID = ?',
        [FirstName, LastName, Email, GraduationYear, req.params.id],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ updated: this.changes });
        }
    );
});

app.delete('/students/:id', (req, res) => {
    db.run(
        'DELETE FROM Student WHERE StudentID = ?',
        [req.params.id],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ deleted: this.changes });
        }
    );
});

// Course routes
app.get('/courses', (req, res) => {
    db.all('SELECT * FROM Course', [], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.get('/courses/:id', (req, res) => {
    db.get(
        'SELECT * FROM Course WHERE CourseID = ?',
        [req.params.id],
        (err, row) => {
            if (err) return res.status(500).json(err);
            res.json(row);
        }
    );
});

app.get;

app.post('/courses', (req, res) => {
    const { CoursePrefix, CourseCode, CourseName, Description } = req.body;
    db.run(
        'INSERT INTO Course (CoursePrefix, CourseCode, CourseName, Description) VALUES (?, ?, ?, ?)',
        [CoursePrefix, CourseCode, CourseName, Description],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ id: this.lastID });
        }
    );
});

app.put('/courses/:id', (req, res) => {
    const { CoursePrefix, CourseCode, CourseName, Description } = req.body;
    db.run(
        'UPDATE Course SET CoursePrefix = ?, CourseCode = ?, CourseName = ?, Description = ? WHERE CourseID = ?',
        [CoursePrefix, CourseCode, CourseName, Description, req.params.id],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ updated: this.changes });
        }
    );
});

app.delete('/courses/:id', (req, res) => {
    db.run(
        'DELETE FROM Course WHERE CourseID = ?',
        [req.params.id],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ deleted: this.changes });
        }
    );
});

// Section routes
app.get('/sections/:courseid', (req, res) => {
    db.all(
        'SELECT * FROM Section WHERE CourseID = ?',
        [req.params.courseid],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows);
        }
    );
});

app.get('/sections', (req, res) => {
    db.all('SELECT * FROM Section', [], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.post('/sections', (req, res) => {
    const { CourseID, Weekday, MeetingTime } = req.body;
    db.run(
        'INSERT INTO Section (CourseID, Weekday, MeetingTime) VALUES (?, ?, ?)',
        [CourseID, Weekday, MeetingTime],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ id: this.lastID });
        }
    );
});

app.put('/sections/:id', (req, res) => {
    const { CourseID, Weekday, MeetingTime } = req.body;
    db.run(
        'UPDATE Section SET CourseID = ?, Weekday = ?, MeetingTime = ? WHERE SectionID = ?',
        [CourseID, Weekday, MeetingTime, req.params.id],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ updated: this.changes });
        }
    );
});

app.delete('/sections/:id', (req, res) => {
    db.run(
        'DELETE FROM Section WHERE SectionID = ?',
        [req.params.id],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ deleted: this.changes });
        }
    );
});

// Assignment routes
app.get('/assignments', (req, res) => {
    db.all('SELECT * FROM Assignment', [], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.post('/assignments', (req, res) => {
    const { Name, SectionID, Description, MaterialURL } = req.body;
    db.run(
        'INSERT INTO Assignment (Name, SectionID, Description, MaterialURL) VALUES (?, ?, ?, ?)',
        [Name, SectionID, Description, MaterialURL],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ id: this.lastID });
        }
    );
});

app.put('/assignments/:id', (req, res) => {
    const { Name, SectionID, Description, MaterialURL } = req.body;
    db.run(
        'UPDATE Assignment SET Name = ?, SectionID = ?, Description = ?, MaterialURL = ? WHERE AssignmentID = ?',
        [Name, SectionID, Description, MaterialURL, req.params.id],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ updated: this.changes });
        }
    );
});

app.delete('/assignments/:id', (req, res) => {
    db.run(
        'DELETE FROM Assignment WHERE AssignmentID = ?',
        [req.params.id],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ deleted: this.changes });
        }
    );
});

app.get('/enrollments', (req, res) => {
    db.all('SELECT * FROM Enrollment', [], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.get('/enrollments/:sectionId', (req, res) => {
    db.all(
        'SELECT * FROM Enrollment WHERE SectionID = ?',
        [req.params.sectionId],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows);
        }
    );
});
app.get('/enrollments/:sectionId/students', (req, res) => {
    db.all(
        'SELECT * FROM Student JOIN Enrollment ON Student.StudentID = Enrollment.StudentID WHERE SectionID = ?',
        [req.params.sectionId],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows);
        }
    );
});

// Enrollment routes
app.post('/enrollments', (req, res) => {
    const { StudentID, SectionID } = req.body;
    db.run(
        'INSERT INTO Enrollment (StudentID, SectionID) VALUES (?, ?)',
        [StudentID, SectionID],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ success: true });
        }
    );
});

app.delete('/enrollments', (req, res) => {
    const { StudentID, SectionID } = req.body;
    db.run(
        'DELETE FROM Enrollment WHERE StudentID = ? AND SectionID = ?',
        [StudentID, SectionID],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ deleted: this.changes });
        }
    );
});

// Grade routes
app.post('/grades', (req, res) => {
    const { StudentID, AssignmentID, GradePercent } = req.body;
    db.run(
        'INSERT INTO Grade (StudentID, AssignmentID, GradePercent) VALUES (?, ?, ?)',
        [StudentID, AssignmentID, GradePercent],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ success: true });
        }
    );
});

app.post('/grades/:studentId/assignment/:assignmentId', (req, res) => {
    const { GradePercent } = req.body;
    db.run(
        'UPDATE Grade SET GradePercent = ? WHERE StudentID = ? AND AssignmentID = ?',
        [GradePercent, req.params.studentId, req.params.assignmentId],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ updated: this.changes });
        }
    );
});

app.get('/grades', (req, res) => {
    db.all('SELECT * FROM Grade', [], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.get('/grades/:studentId', (req, res) => {
    db.all(
        'SELECT * FROM Grade WHERE StudentID = ?',
        [req.params.studentId],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows);
        }
    );
});

app.get('/grades/assignment/:assignmentId', (req, res) => {
    db.all(
        'SELECT * FROM Grade WHERE AssignmentID = ?',
        [req.params.assignmentId],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows);
        }
    );
});

app.get('/assignments/course/:courseId', (req, res) => {
    db.all(
        'SELECT * FROM Assignment WHERE SectionID IN (SELECT SectionID FROM Section WHERE CourseID = ?)',
        [req.params.courseId],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows);
        }
    );
});

app.listen(5000, () => console.log('Backend running on port 5000'));
