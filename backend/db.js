const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, 'LMS.db');
const db = new sqlite3.Database(dbPath);

// Create tables if not exists
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Course (
    CourseID        INTEGER     PRIMARY KEY ASC AUTOINCREMENT
                                UNIQUE
                                NOT NULL,
    CoursePrefix    TEXT (4)    NOT NULL,
    CourseCode      INTEGER (3) NOT NULL,
    CourseName      TEXT        NOT NULL,
    Description     TEXT
)`);
  db.run(`CREATE TABLE IF NOT EXISTS Section (
    SectionID       INTEGER     PRIMARY KEY AUTOINCREMENT
                                UNIQUE
                                NOT NULL,
    CourseID        INTEGER     REFERENCES Course (CourseID) ON DELETE CASCADE
                                NOT NULL,
    Weekday         INTEGER (1) NOT NULL
                                CONSTRAINT CheckWeekday CHECK ( (Weekday >= 0) AND
                                                                (Weekday < 7) ),
    MeetingTime TEXT CHECK (
        substr(MeetingTime, 1, 2) BETWEEN '00' AND '23' AND
        substr(MeetingTime, 4, 2) BETWEEN '00' AND '59'
    )
)`);
  db.run(`CREATE TABLE IF NOT EXISTS Assignment (
    AssignmentID    INTEGER     PRIMARY KEY AUTOINCREMENT
                                UNIQUE
                                NOT NULL,
    Name            TEXT        NOT NULL,
    SectionID       INTEGER     REFERENCES Section (SectionID) ON DELETE CASCADE
                                NOT NULL,
    Description     TEXT        NOT NULL,
    MaterialURL     TEXT        NOT NULL
)`);
  db.run(
      `CREATE TABLE IF NOT EXISTS Student (
    StudentID       INTEGER     PRIMARY KEY AUTOINCREMENT
                                UNIQUE
                                NOT NULL,
    FirstName       TEXT        NOT NULL,
    LastName        TEXT        NOT NULL,
    Email           TEXT        NOT NULL
                                UNIQUE
                                CONSTRAINT CheckEmail CHECK ( Email LIKE ('%_@__%.__%')),
    GraduationYear  INTEGER     NOT NULL
)`);
    db.run(`CREATE TABLE IF NOT EXISTS Enrollment (
    StudentID       INTEGER     NOT NULL
                                REFERENCES Student (StudentID) ON DELETE CASCADE,
    SectionID       INTEGER     NOT NULL
                                REFERENCES Section (SectionID) ON DELETE CASCADE,
    PRIMARY KEY (StudentID, SectionID)
)`);
    db.run(`CREATE TABLE IF NOT EXISTS Grade (
    StudentID       INTEGER     REFERENCES Student (StudentID)
                                NOT NULL,
    AssignmentID    INTEGER     REFERENCES Assignment (AssignmentID)
                                NOT NULL,
    GradePercent    INTEGER     NOT NULL,
    PRIMARY KEY (StudentID, AssignmentID)
)`);

    // print out the names of the tables
    db.all(`SELECT name FROM sqlite_master WHERE type='table'`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(row.name);
        });
    });
  /*
  CREATE TABLE Student (
    StudentID       INTEGER     PRIMARY KEY AUTOINCREMENT
                                UNIQUE
                                NOT NULL,
    FirstName       TEXT        NOT NULL,
    LastName        TEXT        NOT NULL,
    Email           TEXT        NOT NULL
                                UNIQUE
                                CONSTRAINT CheckEmail CHECK ( Email LIKE ('%_@__%.__%')),
    GraduationYear  INTEGER     NOT NULL
);

CREATE TABLE Enrollment (
    StudentID       INTEGER     NOT NULL
                                REFERENCES Student (StudentID) ON DELETE CASCADE,
    SectionID       INTEGER     NOT NULL
                                REFERENCES Section (SectionID) ON DELETE CASCADE,
    PRIMARY KEY (StudentID, SectionID)
);

CREATE TABLE Grade (
    StudentID       INTEGER     REFERENCES Student (StudentID)
                                NOT NULL,
    AssignmentID    INTEGER     REFERENCES Assignment (AssignmentID)
                                NOT NULL,
    GradePercent    INTEGER     NOT NULL,
    PRIMARY KEY (StudentID, AssignmentID)
);
   */
});


module.exports = db;
