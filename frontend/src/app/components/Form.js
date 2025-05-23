import { useState } from 'react';

export default function Form({
    type,
    onSubmit,
    initialData = {},
    students = []
}) {
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        {
            type === 'student'
                ? onSubmit(formData)
                : type === 'enrollment'
                  ? onSubmit({
                        StudentID: formData.StudentID,
                        SectionID: formData.section
                    })
                  : onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {type === 'category' ? (
                <>
                    <input
                        name="category_name"
                        placeholder="Category Name"
                        value={formData.category_name || ''}
                        onChange={handleChange}
                        required
                    />
                </>
            ) : type === 'student' ? (
                <>
                    <input
                        name="FirstName"
                        placeholder="First Name"
                        value={formData.FirstName || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="LastName"
                        placeholder="Last Name"
                        value={formData.LastName || ''}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="Email"
                        placeholder="me@example.com"
                        value={formData.Email || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="GraduationYear"
                        type="number"
                        step="1"
                        placeholder="20XX"
                        value={formData.GraduationYear || ''}
                        onChange={handleChange}
                        required
                    />
                </>
            ) : type === 'enrollment' ? (
                <>
                    <input
                        name="Name"
                        placeholder="First Name"
                        value={
                            formData.FirstName +
                                ' ' +
                                formData.LastName +
                                ' (' +
                                formData.StudentID +
                                ')' || ''
                        }
                        onChange={handleChange}
                        disabled={true}
                        required
                    />
                    <label htmlFor="section">Select Section</label>
                    <select
                        id={'section'}
                        name="section"
                        onChange={handleChange}
                        required
                    >
                        {formData.sections.map((section) => (
                            <option
                                key={section.sectionID}
                                value={section.sectionID}
                            >
                                {section.sectionCode}
                            </option>
                        ))}
                    </select>
                </>
            ) : type === 'assignment' ? (
                <>
                    <input
                        name="Name"
                        placeholder="Assignment Name"
                        value={formData.Name || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="Description"
                        placeholder="Description"
                        value={formData.Description || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="MaterialURL"
                        placeholder="Material URL"
                        value={formData.MaterialURL || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="SectionID"
                        placeholder="Section ID"
                        value={formData.SectionID || ''}
                        onChange={handleChange}
                        required
                    />
                </>
            ) : type === 'course' ? (
                <>
                    <input
                        name="CoursePrefix"
                        placeholder="Course Prefix"
                        value={formData.CoursePrefix || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="CourseCode"
                        placeholder="Course Code"
                        value={formData.CourseCode || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="CourseName"
                        placeholder="Course Name"
                        value={formData.CourseName || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="Description"
                        placeholder="Description"
                        value={formData.Description || ''}
                        onChange={handleChange}
                        required
                    />
                </>
            ) : type === 'grade' ? (
                <>
                    <label htmlFor="students">Select Student</label>
                    <select
                        id="students"
                        name="Student"
                        onChange={handleChange}
                        required
                        disabled={formData.Student !== null}
                    >
                        {formData.Students.map((student) => (
                            <option
                                key={student.StudentID}
                                value={student.StudentID}
                            >
                                {student.FirstName +
                                    ' ' +
                                    student.LastName +
                                    ' (' +
                                    student.StudentID +
                                    ')'}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="assignment">Assignment</label>
                    <input
                        name="AssignmentName"
                        placeholder="Assignment Name"
                        value={formData.Assignment.Name || ''}
                        onChange={handleChange}
                        disabled={true}
                        required
                    />

                    <label htmlFor="grade">Grade</label>
                    <input
                        name="Grade"
                        type="number"
                        placeholder="Grade"
                        value={
                            formData.Grade
                                ? formData.Grade.GradePercent || null
                                : null
                        }
                        onChange={handleChange}
                        required
                    />
                </>
            ) : (
                <></>
            )}
            <button type="submit" className="btn">
                {type === 'student'
                    ? 'Add Student'
                    : type === 'enrollment'
                      ? 'Enroll Student'
                      : type === 'assignment'
                        ? 'Add Assignment'
                        : type === 'course'
                          ? 'Add Course'
                          : type === 'grade'
                            ? 'Submit Grade'
                            : 'Submit'}
            </button>
        </form>
    );
}
