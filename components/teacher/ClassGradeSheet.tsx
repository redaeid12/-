import React, { useState, useEffect } from 'react';
import { Student, Grade } from '../../types';

interface ClassGradeSheetProps {
  classId: string;
  subject: string;
  students: Student[];
  initialGrades: Grade[];
  onSave: (newGrades: Grade[]) => void;
}

const ClassGradeSheet: React.FC<ClassGradeSheetProps> = ({ classId, subject, students, initialGrades, onSave }) => {
  const [grades, setGrades] = useState<Map<string, Grade>>(new Map());

  useEffect(() => {
    const gradeMap = new Map<string, Grade>();
    students.forEach(student => {
      const existingGrade = initialGrades.find(g => g.studentId === student.id && g.subject === subject);
      gradeMap.set(student.id, existingGrade || {
        studentId: student.id,
        subject: subject,
        test1: null,
        test2: null,
        yearlyWork: null,
      });
    });
    setGrades(gradeMap);
  }, [students, subject, initialGrades]);

  const handleGradeChange = (studentId: string, field: keyof Omit<Grade, 'studentId' | 'subject'>, value: string) => {
    const numValue = value === '' ? null : parseInt(value, 10);
    if (value !== '' && (isNaN(numValue as number) || (numValue as number) < 0)) return;

    setGrades(prev => {
      const newGrades = new Map(prev);
      const currentGrade = newGrades.get(studentId);
      // FIX: Replaced combined spread and computed property with Object.assign to resolve type issue.
      if (currentGrade) {
        newGrades.set(studentId, Object.assign({}, currentGrade, {[field]: numValue}));
      }
      return newGrades;
    });
  };

  const handleSaveChanges = () => {
    onSave(Array.from(grades.values()));
    alert('تم حفظ الدرجات بنجاح!');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        كشف درجات مادة: <span className="text-indigo-600">{subject}</span>
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">اسم الطالب</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">الاختبار 1</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">الاختبار 2</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">أعمال السنة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map(student => {
                const studentGrade = grades.get(student.id);
                return (
                    <tr key={student.id}>
                        <td className="py-4 px-4 text-sm font-medium text-gray-900">{student.name}</td>
                        <td>
                            <input type="number" 
                                   className="w-24 p-1 border rounded-md"
                                   value={studentGrade?.test1 ?? ''}
                                   onChange={e => handleGradeChange(student.id, 'test1', e.target.value)}
                            />
                        </td>
                        <td>
                            <input type="number" 
                                   className="w-24 p-1 border rounded-md"
                                   value={studentGrade?.test2 ?? ''}
                                   onChange={e => handleGradeChange(student.id, 'test2', e.target.value)}
                            />
                        </td>
                        <td>
                             <input type="number" 
                                   className="w-24 p-1 border rounded-md"
                                   value={studentGrade?.yearlyWork ?? ''}
                                   onChange={e => handleGradeChange(student.id, 'yearlyWork', e.target.value)}
                            />
                        </td>
                    </tr>
                )
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveChanges}
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
        >
          حفظ التغييرات
        </button>
      </div>
    </div>
  );
};

export default ClassGradeSheet;