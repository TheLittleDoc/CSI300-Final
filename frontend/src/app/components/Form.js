import { useState } from 'react';

export default function Form({ type, onSubmit, initialData = {}, students = [] }) {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    {
      type === 'student' ? (
          onSubmit(formData)
          ) : type === 'enrollment' ? (
                onSubmit({
                    StudentID: formData.StudentID,
                    SectionID: formData.section
                })
            ) : onSubmit(formData);
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
                value={formData.FirstName + ' ' + formData.LastName + " (" + formData.StudentID || ''}
                onChange={handleChange}
                disabled={true}
                required
            />
            <label htmlFor="section">Select Section</label>
            <select id={"section"} name="section" onChange={handleChange} required>
              {formData.sections.map(section => (
                    <option key={section.sectionID} value={section.sectionID}>
                        {section.sectionCode}
                    </option>
                ))
              }
            </select>
          </>
      ) : (
        <>
          <p>Unknown Type</p>
        </>

      )}
      <button type="submit">{initialData?.category_id || initialData?.StudentID ? 'Update' : 'Add'}</button>
    </form>
  );
}
