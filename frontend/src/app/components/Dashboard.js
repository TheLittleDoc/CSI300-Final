import { useEffect, useState } from 'react';
import Form from './Form';

export default function Dashboard({ isAdmin }) {
  const [students, setStudents] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  const [editStudent, setEditStudent] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const fetchData = () => {
    fetch('http://localhost:5000/students')
      .then(res => res.json())
      .then(setStudents);
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


  const deleteStudent = async (id) => {
    await fetch(`http://localhost:5000/students/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const getStudentName = (StudentID) => {
    const student = students.find(s => s.StudentID === StudentID);
    return student ? student.LastName + ", " + student.FirstName : 'Unknown';
  };

  const filteredProducts = products.filter(p =>
    p.product_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Students</h2>
      {isAdmin && (
        <Form
          type="student"
          onSubmit={addOrUpdateStudent}
          initialData={editStudent || {}}
        />
      )}
      <table border="1" cellPadding="6" style={{ marginBottom: '2em' }}>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.StudentID}>
              <td>{student.StudentID}</td>
              <td>{getStudentName(student.StudentID)}</td>
              {isAdmin && (
                <td>
                  <button onClick={() => setEditStudent(student)}>Edit</button>
                  <button onClick={() => deleteStudent(student.StudentID)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>All Products</h2>
      <input
        placeholder="Search product name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: '1em', padding: '4px', width: '300px' }}
      />


      <table border="1" cellPadding="6" style={{ width: '50%' }}>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category ID</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(prod => (
            <tr key={prod.product_id}>
              <td>{prod.product_id}</td>
              <td>{prod.product_name}</td>
              <td>${prod.price}</td>
              <td>{prod.category_id}</td>
              {isAdmin && (
                <td>
                  <button onClick={() => setEditProduct(prod)}>Edit</button>
                  <button onClick={() => deleteProduct(prod.product_id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
