import { useEffect, useState } from 'react';
import Form from './Form';

export default function Students({ isAdmin }) {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [grades, setGrades] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState('');

  const [editStudent, setEditStudent] = useState(null);
  const filters = ['byStudent', 'byAssignment', 'bySection', 'byGrade']
  const [filter, setFilter] = useState('byStudent');
  const [selectedSection , setSelectedSection] = useState(null);
  const [selectedStudent , setSelectedStudent] = useState(null);
  const [selectedAssignment , setSelectedAssignment] = useState(null);
  const [selectedGrade , setSelectedGrade] = useState(null);

  const [action, setAction] = useState('addEdit');

  const fetchData = () => {
    fetch('http://localhost:5000/students')
        .then(res => res.json())
        .then(setStudents);
    fetch('http://localhost:5000/sections')
        .then(res => res.json())
        .then(setSections);
    fetch('http://localhost:5000/enrollments')
        .then(res => res.json())
        .then(setEnrollments);
    fetch('http://localhost:5000/grades')
        .then(res => res.json())
        .then(setGrades);
    fetch('http://localhost:5000/courses')
        .then(res => res.json())
        .then(setCourses);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addOrUpdateStudent = async (data) => {
    const method = editStudent ? 'PUT' : 'POST';
    const url = editStudent
        ? `http://localhost:5000/students/${editStudent.StudentID}`
        : 'http://localhost:5000/students';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setEditStudent(null);
    fetchData();
  };

  const createEnrollment = async (data) => {
    const method = 'POST';
    const url = `http://localhost:5000/enrollments`;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setEditStudent(null);
    fetchData();
  }

  const setEnrollmentForm = (student) => {
    // combine student and sections into single object
    //list of items of sectionID and sectionCode
    const sectionCodes = sections.map(section => ({
      sectionID: section.SectionID,
      sectionCode: getFullSectionCode(section.SectionID)
    }));
    const studentWithSections = {
      ...student,
      sections: sectionCodes
    };
    setEditStudent(studentWithSections);
  }

  const deleteStudent = async (id) => {
    await fetch(`http://localhost:5000/students/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const getStudentName = (StudentID) => {
    const student = students.find(s => s.StudentID === StudentID);
    return student ? student.LastName + ", " + student.FirstName : 'Unknown';
  };

  const getFullSectionCode = (sectionID) => {
    const section = sections.find(s => s.SectionID === sectionID);
    const course = courses.find(c => c.CourseID === section.CourseID);
    return course ? course.CoursePrefix + "-" + course.CourseCode + "-" + section.SectionID : 'Unknown';
  }

  const getFinalGrade = (studentID, sectionID) => {
    // get all grades for assignments in the selected section
    const assignmentsForSection = assignments.filter(a => Number(a.SectionID) === Number(sectionID));
    console.log(assignmentsForSection);
    const studentGrades = grades.filter(g => g.StudentID === studentID && assignmentsForSection.some(a => a.AssignmentID === g.AssignmentID));
    if (studentGrades.length === 0) return 'N/A';
    const totalGrade = studentGrades.reduce((acc, grade) => acc + grade.Grade, 0);
    // Return letter grade based on total grade
    const averageGrade = totalGrade / studentGrades.length;

    if (averageGrade >= 90) return 'A';
    else if (averageGrade >= 80) return 'B';
    else if (averageGrade >= 70) return 'C';
    else if (averageGrade >= 60) return 'D';
    else return 'F';
  }
  // only return if admin
  return ( isAdmin && (
      <div>
        <h2>Grades</h2>
        {isAdmin && (action === "editAdd") ? ( editStudent ? (
                <Form
                    type="student"
                    onSubmit={addOrUpdateStudent}
                    initialData={editStudent || {}}
                />) : (
                <Form
                    type="student"
                    onSubmit={addOrUpdateStudent}
                    initialData={{}}
                />)


        ) : isAdmin && editStudent && (action === "enrollStudent") ? (
            <Form
                type="enrollment"
                onSubmit={createEnrollment}
                initialData={editStudent || {}}
            />
        ) : null}
        <label htmlFor="cars">View Students by</label>



        <select defaultValue={filter} onChange={(e) => {
          setFilter(e.target.value);
          {filter === 'bySection' && setSelectedSection(sections[0].SectionID)}
            {filter === 'byStudent' && setSelectedStudent(students[0].StudentID)}
            {filter === 'byAssignment' && setSelectedAssignment(assignments[0].AssignmentID)}
            {filter === 'byGrade' && setSelectedGrade('A')}
        }}>
            <option value="bySection">By Section</option>
            <option value="byStudent">By Student</option>
            <option value="byAssignment">By Assignment</option>
            <option value="byGrade">By Grade</option>
        </select>
        {filter === 'bySection' && isAdmin && (
            <select onChange={(e) => {

              setSelectedSection(Number(e.target.value));
            }} style={{marginLeft: '1em'}}>
              {sections.map(section => (
                  <option key={section.SectionID} value={section.SectionID}>
                    {getFullSectionCode(section.SectionID)}
                  </option>
              ))}
            </select>)}
        {filter === 'allStudents' && isAdmin && (
            <select onChange={(e) => {
                setSelectedStudent(Number(e.target.value));
            }} style={{marginLeft: '1em'}}>
                {students.map(student => (
                    <option key={student.StudentID} value={student.StudentID}>
                      {getStudentName(student.StudentID)}
                    </option>
                ))}
            </select>
        )}





        <table border="1" cellPadding="6" style={{marginBottom: '2em'}}>
          <thead>
          <tr>

            {(filter === 'byAssignment' || filter === 'byStudent') && (
                <>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Section</th>
                  <th>Grade</th>
                </>
            )}
            {(filter === 'bySection' || filter === 'byGrade') && (
                <>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Final Grade</th>
                </>
            )}

            {isAdmin && <th>Actions</th>}
          </tr>
          </thead>
          <tbody>

            {filter === 'bySection' ? students.map(student => (
                    // filter only students that are enrolled in the selected section
                    enrollments.find(e => e.StudentID === student.StudentID && e.SectionID === selectedSection) ? (
                        <tr key={student.StudentID}>
                            <td>{student.StudentID}</td>
                            <td>{getStudentName(student.StudentID)}</td>
                            <td>{getFinalGrade(student.StudentID, selectedSection)}</td>
                            {isAdmin && (
                                <td>
                                <button onClick={() => {
                                    setAction('editAdd');
                                    setEditStudent(student);
                                }}>Edit</button>
                                <button onClick={() => deleteStudent(student.StudentID)}>Delete</button>
                                </td>
                            )}
                        </tr>
                    ) : null
              ))
              // filter only students that are enrolled in the selected section
              : students.map(
                  student => enrollments.find(e => e.StudentID === student.StudentID && e.SectionID === selectedSection) ? (
                      // filter only students that are enrolled in the selected section
                      <tr key={student.StudentID}>
                        <td>{student.StudentID}</td>
                        <td>{getStudentName(student.StudentID)}</td>
                        <td>{student.Email}</td>
                        <td>{student.GraduationYear}</td>
                        {isAdmin && (
                            <td>
                              <button onClick={() => {
                                setAction('editAdd');
                                setEditStudent(student);
                              }}>Edit</button>
                              <button onClick={() => deleteStudent(student.StudentID)}>Delete</button>
                            </td>
                        )}
                      </tr>
                  ) : null)}
          </tbody>
        </table>



      </div>
      )
  )
}
