import {useEffect, useRef, useState} from 'react';
import backArrow from '../assets/Curved-Arrow-PNG_1024.png';
import Image from 'next/image';

export default function List({ isAdmin }){

    const [headerExample, updateHeader] = useState(['Classes', 'CSI_320', 'CSI_320-01']);
    const [arrayExample, updateArrayExample] = useState(['Eddie Slobodow', 'John Smith', 'Timmie Longstick', 'Kyle Roundbottom', 'Kanye West']);
    const [activeIndex, setActiveIndex] = useState(null);

    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [sections, setSections] = useState([]);
    const [grades, setGrades] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [assignments, setAssignments] = useState([]);


    const fetchData = () => {
        fetch('http://localhost:5000/students')
            .then(res => res.json())
            .then(setStudents);
        fetch('http://localhost:5000/courses')
            .then(res => res.json())
            .then(setCourses);
        fetch('http://localhost:5000/sections')
            .then(res => res.json())
            .then(setSections);
        fetch('http://localhost:5000/grades')
            .then(res => res.json())
            .then(setGrades);
        fetch('http://localhost:5000/enrollments')
            .then(res => res.json())
            .then(setEnrollments);
        fetch('http://localhost:5000/assignments')
            .then(res => res.json())
            .then(setAssignments);
    };

    const [selectOption1, setOption1] = useState('Student Info');
    const [selectOption2, setOption2] = useState('Student Grades');

    const [generalOptions, setGeneralOptions] = useState([]);
    const [adminOptions, setAdminOptions] = useState([]);

    const _studentOptions = {unauthenticated: ['Student Info'], authenticated: ['Grades', 'Enrollments']}
    const _courseOptions = {unauthenticated: ['Course Info', 'Sections'], authenticated: []}
    const _sectionOptions = {unauthenticated: ['Section Info', 'Students', 'Assignments'], authenticated: []}

    const section = useRef('students');
    const itemCache = useRef('');

    useEffect(() => {
        fetchData();
    }, []);

    // Will be ran when the back button is clicked to move back up the heirarchy
    const upHierarchy = (item) => {
        if (headerExample.length > 1){
            console.log('Clicked:', item);
            setActiveIndex(null);
            runQuery(findPreviousSection())
            updateHeader(prev => prev.slice(0, -1));
        }
    }

    // Will be ran when a data entry is clicked to move further down the heirarchy
    const downHierarchy = (item, index) => {

        if (selectOption1 || selectOption2) {
            console.log('Clicked:', item);
            itemCache.current = item;
            (index === activeIndex) ? setActiveIndex(null) : setActiveIndex(index);
        }
    };

    const selectPath = (e, path) => {
        e.stopPropagation(); 
        setActiveIndex(null);
        runQuery(findNextSection(path))
        updateHeader(prev => [...prev, itemCache.current]);
    }

    function findNextSection(path) {
        switch (section.current) {
            case 'courses':
                return path ? 'courseMaterials' : 'courseSections';
            case 'courseSections':
                return path ? 'courseInfo' : 'students';
            case 'students':
                return path ? 'studentGrades' : 'studentInfo';
            default:
                return 'default'
        }
    }

    function findPreviousSection() {
        switch (section.current) {
            case 'courses':
                return 'default';
            case 'courseMaterials':
                return 'courses'
            case 'courseSections':
                return 'courses';
            case 'courseInfo':
                return 'courseSections';
            case 'students':
                return 'courseSections';
            case 'studentGrades':
                return 'students'
            case 'studentInfo':
                return 'students'
        }
    }

    function runQuery(desiredSection) {
        switch (desiredSection) {
            case 'courses':
                section.current = 'courses';

                // Query for all classes not including sections

                updateArrayExample(['DAT-210', 'DAT-410', 'CSI-300']);
                setOption1('Course Sections');
                setOption2('Course Materials');
                break;
            case 'courseMaterials':
                section.current = 'courseMaterials';

                // Query for the links to assignments/materials for a given class
                // You can get the given class and the parameter for every
                // other query from itemCache.current

                updateArrayExample(['link1', 'link2', 'link3', 'link4', 'link5']);
                setOption1('');
                setOption2('');
                break;
            case 'courseSections':
                section.current = 'courseSections';

                // Query for each section of a given class, get class from itemCache.current

                updateArrayExample(['CSI-300-01', 'CSI-300-02']);
                setOption1('Students');
                setOption2('Course Info');
                break;
            case 'courseInfo':

                // Query for the room number and start/end time of a given class from itemCache.current

                section.current = 'courseInfo';
                updateArrayExample(['Joyce-201', '11:30pm-12:45pm']);
                setOption1('');
                setOption2('');
                break;
            case 'students':

                // Get all students in a given class

                section.current = 'students';
                updateArrayExample(['Eddie Slobodow', 'John Smith', 'Timmie Longstick', 'Kyle Roundbottom', 'Kanye West']);
                setOption1('Student Info');
                setOption2('Student Grades');
                break;
            case 'studentGrades':

                // Get all of a students grades for a given student

                section.current = 'studentGrades';
                updateArrayExample(['Quiz1: 89%', 'Quiz2: 85%', 'Project1: 80%', 'Project2: 90%', 'Final: 95%']);
                setOption1('');
                setOption2('');
                break;
            case 'studentInfo':

                // Get the email, major, and graduation year, for a given student

                section.current = 'studentInfo';
                updateArrayExample(['kanyewest@gmail.com', 'German Studies', '2026']);
                setOption1('');
                setOption2('');
                break;
        }
    }

      
    return (
        <>
        <table className="verticalTable">
            <tr>
                <th>{headerExample[headerExample.length - 1]}
                    <div className="backButton" onClick={() => upHierarchy(headerExample[headerExample.length - 1])}>
                    <Image src={backArrow} alt="Back arrow" width={25} height={25} />
                    </div>
                </th>

                {arrayExample.map((item, index) => (
                <td key={index} className="dataEntry" onClick={() => downHierarchy(item, index)}>

                    {activeIndex === index  && (selectOption1 || selectOption2) ? (
                        <div className="optionContainer">
                            <div onClick={(e) => selectPath(e, 0)} className='selectOption'>
                            {selectOption1}
                            </div>
                            <div onClick={(e) => selectPath(e, 1)} className='selectOption'>
                            {selectOption2}
                            </div>
                        </div>
                    ) : (
                        item
                    )}
                </td>
                ))}

            </tr>
        </table>
        </>
    );
}