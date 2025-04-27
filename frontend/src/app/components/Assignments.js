import { useEffect, useState } from 'react';
import Form from './Form';

export default function Assignments({ isAdmin }) {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [grades, setGrades] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState('');

  const [editAssignment, setEditAssignment] = useState(null);

  const [filter, setFilter] = useState('allAssignments');
  const [selectedStudent , setSelectedStudent] = useState(null);

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
    fetch('http://localhost:5000/assignments')
        .then(res => res.json())
        .then(setAssignments);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addOrUpdateAssignment = async (data) => {
    const method = editAssignment ? 'PUT' : 'POST';
    const url = editAssignment
      ? `http://localhost:5000/assignments/${editAssignment.AssignmentID}`
      : 'http://localhost:5000/assignments';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setEditAssignment(null);
    fetchData();
  };

  const createGrade = async (data) => {
    const method = 'POST';
    const url = `http://localhost:5000/grades`;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setEditAssignment(null);
    fetchData();
  }

  const setGradeForm = (assignment) => {
    // combine assignment and student into single object
    //list of items of studentID and studentCode
    const studentCodes = students.map(student => ({
        studentID: student.StudentID,
        }));
    const assignmentWithStudents = {
      ...assignment,
      sections: studentCodes
    };
    setEditAssignment(assignmentWithStudents);
  }

  const deleteAssignment = async (id) => {
    await fetch(`http://localhost:5000/assignments/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const getAssignmentName = (AssignmentID) => {
    const assignment = assignments.find(a => a.AssignmentID === AssignmentID);
    return assignment ? assignment.Name : 'Unknown';
  };

  /*const getFullSectionCode = (sectionID) => {
    const section = sections.find(s => s.SectionID === sectionID);
    const course = courses.find(c => c.CourseID === section.CourseID);
    return course ? course.CoursePrefix + "-" + course.CourseCode + "-" + section.SectionID : 'Unknown';
  }*/

  return (
      <div>
        <h2>Assignments</h2>
        {isAdmin && (action === "editAdd") ? ( editAssignment ? (
              <Form
              type="assignment"
              onSubmit={addOrUpdateAssignment}
              initialData={editAssignment || {}}
          />) : (
                <Form
                    type="assignment"
                    onSubmit={addOrUpdateAssignment}
                    initialData={{}}
                />)


        ) : isAdmin && editAssignment && (action === "addGrade") ? (
            <Form
                type="grade"
                onSubmit={createGrade}
                initialData={editAssignment || {}}
            />
        ) : null}
        <label htmlFor="cars">View Assignments by</label>

        <select defaultValue={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="allAssignments">All Assignments</option>
          <option value="byStudents">By Students</option>
        </select>
        {filter === 'byStudents' && (
        <select onChange={(e) => {

          setSelectedStudent(Number(e.target.value));
        }} style={{marginLeft: '1em'}}>
          {students.map(student => (
                <option key={student.StudentID} value={student.StudentID}>
                    {student.StudentID}
                </option>
            ))}
        </select>)}
        {filter === 'allAssignments' && isAdmin && (
            <button onClick={() => {
              setAction('editAdd');
              setEditAssignment(null);
            }}>Add Assignment</button>
        )
        }




        <table border="1" cellPadding="6" style={{marginBottom: '2em'}}>
          <thead>
          <tr>
            <th>Assignment ID</th>
            <th>Assignment Name</th>
            <th>Description</th>
            <th>MaterialURL</th>
            {isAdmin && <th>Actions</th>}
          </tr>
          </thead>
          <tbody>
          {filter === 'allAssignments' ? assignments.map(assignment => (
              <tr key={assignment.AssignmentID}>
                <td>{assignment.AssignmentID}</td>
                <td>{getAssignmentName(assignment.AssignmentID)}</td>
                <td>{assignment.Description}</td>
                <td>{assignment.MaterialURL}</td>
                {isAdmin && (
                    <td>
                      <button onClick={() => {
                        setAction('editAdd');
                        setEditAssignment(assignment);
                      }}>Edit</button>
                      <button onClick={() => deleteAssignment(assignment.AssignmentID)}>Delete</button>
                      <button onClick={() => {
                        setAction('addGrade');
                        setGradeForm(assignment);
                      } }>Add to Student</button>
                    </td>
                )}
              </tr>
          ))
              // filter only assignments that are associated with the selected student
          : assignments.map(
                assignment => grades.find(e => e.AssignmentID === assignment.AssignmentID && e.StudentID === selectedStudent) ? (
                // filter only students that are enrolled in the selected section
                <tr key={assignment.AssignmentID}>
                    <td>{assignment.AssignmentID}</td>
                    <td>{getAssignmentName(assignment.AssignmentID)}</td>
                    <td>{assignment.Description}</td>
                    <td>{assignment.MaterialURL}</td>
                    {isAdmin && (
                        <td>
                        <button onClick={() => {
                            setAction('editAdd');
                            setEditAssignment(assignment);
                        }}>Edit</button>
                        <button onClick={() => deleteAssignment(assignment.AssignmentID)}>Delete</button>
                        </td>
                    )}
                </tr>
            ) : null)}
          </tbody>
        </table>



      </div>
  );
}
