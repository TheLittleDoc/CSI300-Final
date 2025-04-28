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

  const [editCourse, setEditCourse] = useState(null);

  const [filter, setFilter] = useState('allCourses');

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

  const addOrUpdateCourse = async (data) => {
    const method = editCourse ? 'PUT' : 'POST';
    const url = editCourse
      ? `http://localhost:5000/courses/${editCourse.CourseID}`
      : 'http://localhost:5000/courses';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setEditCourse(null);
    fetchData();
  };

  const deleteCourse = async (id) => {
    await fetch(`http://localhost:5000/courses/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const getCourseName = (CourseID) => {
    const course = courses.find(s => s.CourseID === CourseID);
    return course ? course.CourseName : 'Unknown';
  };


  return (
      <div>
        <h2>Courses</h2>
        {isAdmin && (action === "editAdd") ? ( editCourse ? (
              <Form
              type="course"
              onSubmit={addOrUpdateCourse}
              initialData={editCourse || {}}
          />) : (
                <Form
                    type="course"
                    onSubmit={addOrUpdateCourse}
                    initialData={{}}
                />)


        ) : null}
        <button onClick={() => {
              setAction('editAdd');
              setEditCourse(null);
            }}>Add Course</button>


        <table border="1" cellPadding="6" style={{marginBottom: '2em'}}>
          <thead>
          <tr>
            <th>Course ID</th>
            <th>Course Prefix</th>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Course Description</th>
            {isAdmin && <th>Actions</th>}
          </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.CourseID}>
                <td>{course.CourseID}</td>
                <td>{course.CoursePrefix}</td>
                <td>{course.CourseCode}</td>
                <td>{getCourseName(course.CourseID)}</td>
                <td>{course.Description}</td>
                {isAdmin && (
                    <td>
                      <button onClick={() => {
                        setAction('editAdd');
                        setEditCourse(course);
                      }}>Edit</button>
                      <button onClick={() => deleteCourse(course.CourseID)}>Delete</button>
                    </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>



      </div>
  );
}
