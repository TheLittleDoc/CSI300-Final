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

    const [editGrade, setEditGrade] = useState(null);
    const filters = ['byStudent', 'byAssignment', 'bySection', 'byGrade'];
    const [filter, setFilter] = useState('byStudent');
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [selectedGrade, setSelectedGrade] = useState(null);

    const [action, setAction] = useState('addEdit');

    const fetchData = () => {
        fetch('http://localhost:5000/students')
            .then((res) => res.json())
            .then(setStudents);
        fetch('http://localhost:5000/sections')
            .then((res) => res.json())
            .then(setSections);
        fetch('http://localhost:5000/enrollments')
            .then((res) => res.json())
            .then(setEnrollments);
        fetch('http://localhost:5000/grades')
            .then((res) => res.json())
            .then(setGrades);
        fetch('http://localhost:5000/courses')
            .then((res) => res.json())
            .then(setCourses);
        fetch('http://localhost:5000/assignments')
            .then((res) => res.json())
            .then(setAssignments);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addOrUpdateGrade = async (data) => {
        const method = 'POST';
        console.log(data);
        const StudentID = data.Student;
        const AssignmentID = data.Assignment.AssignmentID;
        const GradePercent = data.Grade;

        const url = 'http://localhost:5000/grade';
        const body = {
            StudentID: data.StudentID,
            AssignmentID: data.AssignmentID,
            GradePercent: data.GradePercent
        };
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        fetchData();
        setEditGrade(null);
        setAction(null);
    };

    const setEditPayload = (student, assignment, grade) => {
        // list of students in the same section as assignment
        if (!student && assignment) {
            console.log(assignment.AssignmentID);
            const section = sections.find(
                (s) => s.SectionID === assignment.SectionID
            );
            console.log(section);
            const formStudents = enrollments
                .filter((e) => e.SectionID === section.SectionID)
                .map((e) => students.find((s) => s.StudentID === e.StudentID));

            setEditGrade({
                Student: student,
                Assignment: assignment,
                Grade: null,
                Students: formStudents
            });
        } else if (student && assignment && grade) {
            setEditGrade({
                Student: student,
                Assignment: assignment,
                Grade: grade
            });
        } else {
            setEditGrade(null);
        }
    };

    const getStudentName = (StudentID) => {
        const student = students.find((s) => s.StudentID === StudentID);
        return student
            ? student.LastName + ', ' + student.FirstName
            : 'Unknown';
    };

    const getFullSectionCode = (sectionID) => {
        const section = sections.find((s) => s.SectionID === sectionID);
        const course = courses.find((c) => c.CourseID === section.CourseID);
        return course
            ? course.CoursePrefix +
                  '-' +
                  course.CourseCode +
                  '-' +
                  section.SectionID
            : 'Unknown';
    };

    const getSectionFromAssignmentID = (assignmentID) => {
        const assignment = assignments.find(
            (a) => a.AssignmentID === assignmentID
        );
        const section = sections.find(
            (s) => s.SectionID === assignment.SectionID
        );
        return section ? section.SectionID : 'Unknown';
    };

    const getFinalGrade = (studentID, sectionID) => {
        const assignmentsForSection = assignments.filter((a) => {
            const section = sections.find((s) => s.SectionID === sectionID);
            return a.SectionID === sectionID;
        });
        const studentGrades = grades.filter(
            (g) =>
                g.StudentID === studentID &&
                assignmentsForSection.some(
                    (a) => a.AssignmentID === g.AssignmentID
                )
        );
        if (studentGrades.length === 0) return 'N/A';
        //sum grades in studentGrades
        const totalGrade = studentGrades.reduce(
            (acc, grade) => Number(acc + grade.GradePercent),
            0
        );
        console.log(totalGrade);
        // Return letter grade based on total grade
        const averageGrade = totalGrade / studentGrades.length;
        console.log(averageGrade);
        if (averageGrade >= 90) return 'A';
        else if (averageGrade >= 80) return 'B';
        else if (averageGrade >= 70) return 'C';
        else if (averageGrade >= 60) return 'D';
        else return 'F';
    };
    // only return if admin
    return (
        isAdmin && (
            <div>
                <h2>Grades</h2>
                {isAdmin &&
                    filter === 'byAssignment' &&
                    action === 'editAdd' &&
                    (editGrade ? (
                        <Form
                            type="grade"
                            onSubmit={addOrUpdateGrade}
                            initialData={editGrade || {}}
                        />
                    ) : (
                        <Form
                            type="grade"
                            onSubmit={addOrUpdateGrade}
                            initialData={{ editGrade }}
                        />
                    ))}
                <label htmlFor="cars">View Students by</label>

                <select
                    defaultValue={filter}
                    onChange={(e) => {
                        setFilter(e.target.value);
                        {
                            filter === 'bySection' &&
                                setSelectedSection(sections[0].SectionID);
                        }
                        {
                            filter === 'byStudent' &&
                                setSelectedStudent(students[0].StudentID);
                        }
                        {
                            filter === 'byAssignment' &&
                                setSelectedAssignment(
                                    assignments[0].AssignmentID
                                );
                        }
                    }}
                >
                    <option value="bySection">By Section</option>
                    <option value="byStudent">By Student</option>
                    <option value="byAssignment">By Assignment</option>
                </select>
                {filter === 'bySection' && isAdmin && (
                    <select
                        onChange={(e) => {
                            setSelectedSection(Number(e.target.value));
                        }}
                        defaultValue={sections[0].SectionID}
                        style={{ marginLeft: '1em' }}
                    >
                        {sections.map((section) => (
                            <option
                                key={section.SectionID}
                                value={section.SectionID}
                            >
                                {getFullSectionCode(section.SectionID)}
                            </option>
                        ))}
                    </select>
                )}
                {filter === 'byStudent' && (
                    <select
                        onChange={(e) => {
                            setSelectedStudent(Number(e.target.value));
                        }}
                        defaultValue={students[0].StudentID}
                        style={{ marginLeft: '1em' }}
                    >
                        {students.map((student) => (
                            <option
                                key={student.StudentID}
                                value={student.StudentID}
                            >
                                {getStudentName(student.StudentID)}
                            </option>
                        ))}
                    </select>
                )}
                {filter === 'byAssignment' && (
                    <>
                        <select
                            onChange={(e) => {
                                setSelectedAssignment(
                                    assignments.find(
                                        (a) =>
                                            a.AssignmentID ===
                                            Number(e.target.value)
                                    )
                                );
                            }}
                            defaultValue={assignments[0].AssignmentID}
                            style={{ marginLeft: '1em' }}
                        >
                            {assignments.map((assignment) => (
                                <option
                                    key={assignment.AssignmentID}
                                    value={assignment.AssignmentID}
                                >
                                    {assignment.Name}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => {
                                setAction('editAdd');
                                console.log(selectedAssignment);
                                setEditPayload(null, selectedAssignment, null);
                            }}
                        >
                            Add Grade
                        </button>
                    </>
                )}
                {filter === 'allStudents' && isAdmin && (
                    <select
                        onChange={(e) => {
                            setSelectedStudent(Number(e.target.value));
                        }}
                        style={{ marginLeft: '1em' }}
                    >
                        {students.map((student) => (
                            <option
                                key={student.StudentID}
                                value={student.StudentID}
                            >
                                {getStudentName(student.StudentID)}
                            </option>
                        ))}
                    </select>
                )}

                <table
                    border="1"
                    cellPadding="6"
                    style={{ marginBottom: '2em' }}
                >
                    <thead>
                        <tr>
                            {filter === 'byAssignment' && (
                                <>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                    <th>Section</th>
                                    <th>Grade</th>

                                    {isAdmin && <th>Actions</th>}
                                </>
                            )}
                            {filter === 'byStudent' && (
                                <>
                                    <th>Assignment Name</th>
                                    <th>Section</th>
                                    <th>Grade</th>
                                </>
                            )}
                            {(filter === 'bySection' ||
                                filter === 'byGrade') && (
                                <>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                    <th>Final Grade</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filter === 'bySection'
                            ? students.map((student) =>
                                  // filter only students that are enrolled in the selected section
                                  enrollments.find(
                                      (e) =>
                                          e.StudentID === student.StudentID &&
                                          e.SectionID === selectedSection
                                  ) ? (
                                      <tr key={student.StudentID}>
                                          <td>{student.StudentID}</td>
                                          <td>
                                              {getStudentName(
                                                  student.StudentID
                                              )}
                                          </td>
                                          <td>
                                              {getFinalGrade(
                                                  student.StudentID,
                                                  selectedSection
                                              )}
                                          </td>
                                      </tr>
                                  ) : null
                              )
                            : // filter for all grades attached to a student
                              filter === 'byStudent'
                              ? grades
                                    .filter(
                                        (e) => e.StudentID === selectedStudent
                                    )
                                    .map((grade) => (
                                        <tr key={grade.AssignmentID}>
                                            <td>
                                                {getStudentName(
                                                    grade.StudentID
                                                )}
                                            </td>
                                            <td>
                                                {getFullSectionCode(
                                                    getSectionFromAssignmentID(
                                                        grade.AssignmentID
                                                    )
                                                )}
                                            </td>
                                            <td>{grade.GradePercent}</td>
                                            {isAdmin && (
                                                <td>
                                                    <button
                                                        onClick={() => {
                                                            setAction(
                                                                'editAdd'
                                                            );
                                                            setEditPayload(
                                                                students.find(
                                                                    (s) =>
                                                                        s.StudentID ===
                                                                        grade.StudentID
                                                                ),
                                                                assignments.find(
                                                                    (a) =>
                                                                        a.AssignmentID ===
                                                                        grade.AssignmentID
                                                                ),
                                                                grade
                                                            );
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button onClick={() => {}}>
                                                        Delete
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                              : filter === 'byAssignment'
                                ? grades
                                      .filter(
                                          (e) =>
                                              e.AssignmentID ===
                                              selectedAssignment?.AssignmentID
                                      )
                                      .map((grade) => (
                                          <tr key={grade.StudentID}>
                                              <td>{grade.StudentID}</td>
                                              <td>
                                                  {getStudentName(
                                                      grade.StudentID
                                                  )}
                                              </td>
                                              <td>
                                                  {getFullSectionCode(
                                                      getSectionFromAssignmentID(
                                                          grade.AssignmentID
                                                      )
                                                  )}
                                              </td>
                                              <td>{grade.GradePercent}</td>
                                              {isAdmin && (
                                                  <td>
                                                      <button
                                                          onClick={() => {
                                                              setAction(
                                                                  'editAdd'
                                                              );
                                                              setEditPayload(
                                                                  students.find(
                                                                      (s) =>
                                                                          s.StudentID ===
                                                                          grade.StudentID
                                                                  ),
                                                                  assignments.find(
                                                                      (a) =>
                                                                          a.AssignmentID ===
                                                                          grade.AssignmentID
                                                                  ),
                                                                  grade
                                                              );
                                                          }}
                                                      >
                                                          Edit
                                                      </button>
                                                      <button
                                                          onClick={() => {}}
                                                      >
                                                          Delete
                                                      </button>
                                                  </td>
                                              )}
                                          </tr>
                                      ))
                                : null}
                    </tbody>
                </table>
            </div>
        )
    );
}
