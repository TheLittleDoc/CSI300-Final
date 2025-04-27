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

  const [filter, setFilter] = useState('allStudents');
  const [selectedSection , setSelectedSection] = useState(null);

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

  return (
      <div>
        <h2>Students</h2>
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

        <select defaultValue={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="allStudents">All Students</option>
          <option value="bySection">By Section</option>
        </select>
        {filter === 'bySection' && (
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
            <button onClick={() => {
              setAction('editAdd');
              setEditStudent(null);
            }}>Add Student</button>
        )
        }




        <table border="1" cellPadding="6" style={{marginBottom: '2em'}}>
          <thead>
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Email</th>
            <th>Graduation Year</th>
            {isAdmin && <th>Actions</th>}
          </tr>
          </thead>
          <tbody>
          {filter === 'allStudents' ? students.map(student => (
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
                      <button onClick={() => {
                        setAction('enrollStudent');
                        setEnrollmentForm(student);
                      } }>Add to Section</button>
                    </td>
                )}
              </tr>
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
  );
}
