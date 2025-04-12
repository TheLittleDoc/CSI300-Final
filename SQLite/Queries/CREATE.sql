BEGIN TRANSACTION;

CREATE TABLE Course (
    CourseID        INTEGER     PRIMARY KEY ASC AUTOINCREMENT
                                UNIQUE
                                NOT NULL,
    CoursePrefix    TEXT (4)    NOT NULL,
    CourseCode      INTEGER (3) NOT NULL,
    CourseName      TEXT        NOT NULL,
    Description     TEXT
);

CREATE TABLE Section (
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
);

CREATE TABLE Assignment (
    AssignmentID    INTEGER     PRIMARY KEY AUTOINCREMENT
                                UNIQUE
                                NOT NULL,
    Name            TEXT        NOT NULL,
    SectionID       INTEGER     REFERENCES Section (SectionID) ON DELETE CASCADE
                                NOT NULL,
    Description     TEXT        NOT NULL,
    MaterialURL     TEXT        NOT NULL
);

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

ROLLBACK;