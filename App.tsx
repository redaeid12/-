
import React, { useState, useEffect, useCallback } from 'react';
import { Student, Teacher, SchoolClass, Grade, User, Subject } from './types';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User>(null);
  
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : [];
  });
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('teachers');
    return saved ? JSON.parse(saved) : [];
  });
  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    const saved = localStorage.getItem('classes');
    if (saved && JSON.parse(saved).length > 0) {
        return JSON.parse(saved);
    }
    // Default 26 classes
    return Array.from({ length: 26 }, (_, i) => ({
      id: `default-class-${i + 1}`,
      name: `الفصل ${i + 1}`
    }));
  });
  const [grades, setGrades] = useState<Grade[]>(() => {
    const saved = localStorage.getItem('grades');
    return saved ? JSON.parse(saved) : [];
  });
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('subjects');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }, [teachers]);
  
  useEffect(() => {
    localStorage.setItem('classes', JSON.stringify(classes));
  }, [classes]);
  
  useEffect(() => {
    localStorage.setItem('grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  const handleLogin = (username: string, password: string): boolean => {
    if (username.toLowerCase() === 'admin' && password === '3012') {
      setUser({ type: 'admin', data: { name: 'Admin' } });
      return true;
    }
    const teacher = teachers.find(t => t.name === username && t.password === password);
    if (teacher) {
      setUser({ type: 'teacher', data: teacher });
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setUser(null);
  };
  
  const updateGrades = useCallback((newGrades: Grade[]) => {
    setGrades(prevGrades => {
      const updatedGrades = [...prevGrades];
      newGrades.forEach(newGrade => {
        const index = updatedGrades.findIndex(g => g.studentId === newGrade.studentId && g.subject === newGrade.subject);
        if (index !== -1) {
          updatedGrades[index] = newGrade;
        } else {
          updatedGrades.push(newGrade);
        }
      });
      return updatedGrades;
    });
  }, []);

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {user.type === 'admin' ? (
        <AdminDashboard
          students={students}
          setStudents={setStudents}
          teachers={teachers}
          setTeachers={setTeachers}
          classes={classes}
          setClasses={setClasses}
          grades={grades}
          setGrades={setGrades}
          subjects={subjects}
          setSubjects={setSubjects}
          onLogout={handleLogout}
        />
      ) : (
        <TeacherDashboard
          teacher={user.data as Teacher}
          students={students}
          classes={classes}
          subjects={subjects}
          grades={grades}
          onLogout={handleLogout}
          updateGrades={updateGrades}
        />
      )}
    </div>
  );
};

export default App;
