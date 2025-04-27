import { useEffect, useState } from 'react';
import Form from './Form';

export default function Sections({ isAdmin }) {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [search, setSearch] = useState('');

  const [editStudent, setEditStudent] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const [filter, setFilter] = useState('allStudents');
  const [selectedSection , setSelectedSection] = useState(null);

  const [action, setAction] = useState('addEdit');

  const fetchData = () => {
    fetch('http://localhost:5000/sections')
        .then(res => res.json())
        .then(setSections);
    fetch('http://localhost:5000/courses')
        .then(res => res.json())
        .then(setCourses);
  };

  useEffect(() => {
    fetchData();
  }, []);


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

  const getFullSectionCode = (sectionID) => {
    const section = sections.find(s => s.SectionID === sectionID);
    const course = courses.find(c => c.CourseID === section.CourseID);
    return course ? course.CoursePrefix + "-" + course.CourseCode + "-" + section.SectionID : 'Unknown';
  }

  const getWeekday = (dayInt) => {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekdays[dayInt];
  }

  return (
      <div>
        <h2>Sections</h2>

        <table border="1" cellPadding="6" style={{marginBottom: '2em'}}>
          <thead>
          <tr>
            <th>Section</th>
            <th>Weekday</th>
            <th>Meeting Time</th>
            {/*isAdmin && <th>Actions</th>*/}
          </tr>
          </thead>
          <tbody>
          {sections.map(section => (
              <tr key={section.SectionID}>
                <td>{getFullSectionCode(section.SectionID)}</td>
                <td>{getWeekday(section.Weekday)}</td>
                <td>{section.MeetingTime}</td>
                {/*isAdmin && (
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
                )*/}
              </tr>
          ))}
          </tbody>
        </table>


      </div>
  );
}
