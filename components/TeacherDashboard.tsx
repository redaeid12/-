import React, { useState, useMemo } from 'react';
import { Teacher, Student, SchoolClass, Grade, Subject, TeacherAssignment } from '../types';
import ClassGradeSheet from './teacher/ClassGradeSheet';

interface TeacherDashboardProps {
  teacher: Teacher;
  students: Student[];
  classes: SchoolClass[];
  subjects: Subject[];
  grades: Grade[];
  onLogout: () => void;
  updateGrades: (newGrades: Grade[]) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ teacher, students, classes, subjects, grades, onLogout, updateGrades }) => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const teacherClassesAndSubjects = useMemo(() => {
    const classMap = new Map<string, { name: string; subjects: { id: string, name: string }[] }>();
    const allSubjectsMap = new Map(subjects.map(s => [s.id, s.name]));
    const allClassesMap = new Map(classes.map(c => [c.id, c.name]));

    // FIX: Refactored to a more stable forEach pattern to ensure correct type inference.
    teacher.assignments.forEach((assignment: TeacherAssignment) => {
      const { classId, subjectId } = assignment;
      if (!classMap.has(classId)) {
        const className = allClassesMap.get(classId);
        if (className) {
            classMap.set(classId, { name: className, subjects: [] });
        }
      }
      
      const classData = classMap.get(classId);
      if (classData) {
        const subjectName = allSubjectsMap.get(subjectId);
        if (subjectName && !classData.subjects.some(s => s.id === subjectId)) {
            classData.subjects.push({ id: subjectId, name: subjectName });
        }
      }
    });
    return Array.from(classMap.entries()).map(([id, data]) => ({ id, ...data }));
  }, [teacher.assignments, classes, subjects]);


  const handleSelection = (classId: string, subject: string) => {
    setSelectedClassId(classId);
    setSelectedSubject(subject);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-6 pb-4 border-b">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">أهلاً بك، {teacher.name}</h1>
            <p className="text-gray-600 mt-1">هذه هي لوحة التحكم الخاصة بك.</p>
        </div>
        <button onClick={onLogout} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
          تسجيل الخروج
        </button>
      </header>

      {!selectedClassId || !selectedSubject ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">اختر فصل ومادة لعرض الطلاب وإدخال الدرجات</h2>
            <div className="space-y-4">
                {teacherClassesAndSubjects.map(c => (
                    <div key={c.id} className="p-4 border rounded-lg">
                        <h3 className="font-bold text-lg text-indigo-700">{c.name}</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {c.subjects.map(subject => (
                                <button
                                    key={`${c.id}-${subject.id}`}
                                    onClick={() => handleSelection(c.id, subject.name)}
                                    className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    {subject.name}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      ) : (
        <div>
          <button 
            onClick={() => { setSelectedClassId(null); setSelectedSubject(null); }}
            className="mb-4 px-4 py-2 text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
          >
            &rarr; العودة لاختيار الفصل
          </button>
          <ClassGradeSheet 
            classId={selectedClassId}
            subject={selectedSubject}
            students={students.filter(s => s.classId === selectedClassId)}
            initialGrades={grades}
            onSave={updateGrades}
          />
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;