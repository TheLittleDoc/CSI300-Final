INSERT INTO Course (CoursePrefix, CourseCode, CourseName, Description)
VALUES 
('DAT', 210, 'Data Analytics', 'Students will analyze data using Python programming language to obtain insights from real-world data sets. '),
('DAT', 410, 'Machine Learning', 'This course will introduce students to practical machine learning and its applications.'),
('CSI', 300, 'Database Management Systems', 'This course will introduce students to database design, Structured Query Language (SQL), normalization, and relational database theory.');

INSERT INTO Section (CourseID, Weekday, MeetingTime)
VALUES 
(1, 1, '10:00'),  -- DAT-210 on Monday
(2, 3, '13:00'),  -- DAT-410 on Wednesday
(3, 2, '09:00'),  -- CSI-300-01 on Tuesday
(3, 4, '09:00');  -- CSI-300-02 on Thursday

INSERT INTO Student (FirstName, LastName, Email, GraduationYear)
VALUES 
('Joe', 'Smith', 'joe.smith@mymail.champlain.edu', 2027),
('Ely', 'Jones', 'ely.jones@mymail.champlain.edu', 2027);

INSERT INTO Enrollment (StudentID, SectionID)
VALUES 
(1, 1),  -- Joe in DAT-210
(1, 3),  -- Joe in CSI-300-01
(2, 2),  -- Ely in DAT-410
(2, 4);  -- Ely in CSI-300-02

INSERT INTO Assignment (Name, SectionID, Description, MaterialURL)
VALUES 
('Analyze data', 1, 'Look at this data and tell me what you think.', 'http://www.data.com'); -- DAT-210

INSERT INTO Assignment (Name, SectionID, Description, MaterialURL)
VALUES 
('SQL Queries', 3, 'Write basic SELECT queries using SQL', 'http://lms.local/materials/sql-101'); -- CSI-300-01

-- Joe's Grades
INSERT INTO Grade (StudentID, AssignmentID, GradePercent)
VALUES 
(1, 1, 95),
(1, 2, 90);