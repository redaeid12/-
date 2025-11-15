
import React, { useState, useMemo } from 'react';
import { Grade, Student, SchoolClass, Teacher } from '../../types';

interface GradesTabProps {
  grades: Grade[];
  students: Student[];
  classes: SchoolClass[];
  teachers: Teacher[];
}

const GradesTab: React.FC<GradesTabProps> = ({ grades, students, classes, teachers }) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  
  const studentsMap = useMemo(() => new Map(students.map(s => [s.id, s])), [students]);
  const classesMap = useMemo(() => new Map(classes.map(c => [c.id, c])), [classes]);

  const filteredGrades = useMemo(() => {
    if (!selectedClassId) return grades;
    const studentIdsInClass = students.filter(s => s.classId === selectedClassId).map(s => s.id);
    return grades.filter(g => studentIdsInClass.includes(g.studentId));
  }, [selectedClassId, grades, students]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">عرض الدرجات</h2>

      <div className="mb-4">
        <label htmlFor="class-filter" className="block text-sm font-medium text-gray-700 mb-1">تصفية حسب الفصل:</label>
        <select
          id="class-filter"
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">كل الفصول</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">الطالب</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">الفصل</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">المادة</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">اختبار 1</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">اختبار 2</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">أعمال السنة</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">المجموع</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredGrades.map(grade => {
              const student = studentsMap.get(grade.studentId);
              const studentClass = student ? classesMap.get(student.classId) : undefined;
              const total = (grade.test1 || 0) + (grade.test2 || 0) + (grade.yearlyWork || 0);

              if (!student) return null;

              return (
                <tr key={`${grade.studentId}-${grade.subject}`}>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{student.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{studentClass?.name || 'N/A'}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{grade.subject}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{grade.test1 ?? 'لم ترصد'}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{grade.test2 ?? 'لم ترصد'}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{grade.yearlyWork ?? 'لم ترصد'}</td>
                  <td className="py-4 px-4 text-sm font-semibold text-indigo-600">{total}</td>
                </tr>
              )
            })}
             {filteredGrades.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                    لا توجد درجات لعرضها.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradesTab;
