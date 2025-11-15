import React, { useState } from 'react';
import { Teacher, SchoolClass, Subject, TeacherAssignment } from '../../types';

interface TeachersTabProps {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  classes: SchoolClass[];
  subjects: Subject[];
  onDelete: (id: string) => void;
}

const TeachersTab: React.FC<TeachersTabProps> = ({ teachers, setTeachers, classes, subjects, onDelete }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});

  const handleAssignmentChange = (classId: string, subjectId: string) => {
    setAssignments(prev => {
      const newAssignments = { ...prev };
      const classSubjects = newAssignments[classId] || [];
      
      if (classSubjects.includes(subjectId)) {
        newAssignments[classId] = classSubjects.filter(id => id !== subjectId);
        if (newAssignments[classId].length === 0) {
          delete newAssignments[classId];
        }
      } else {
        newAssignments[classId] = [...classSubjects, subjectId];
      }
      return newAssignments;
    });
  };

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();

    const finalAssignments: TeacherAssignment[] = Object.entries(assignments).flatMap(
      ([classId, subjectIds]) => subjectIds.map(subjectId => ({ classId, subjectId }))
    );

    if (name.trim() && password.trim() && finalAssignments.length > 0) {
      const newTeacher: Teacher = {
        id: Date.now().toString(),
        name: name.trim(),
        password: password.trim(),
        assignments: finalAssignments,
      };
      setTeachers(prev => [...prev, newTeacher]);
      setName('');
      setPassword('');
      setAssignments({});
    } else {
      alert('يرجى ملء اسم وكلمة مرور المعلم، وتعيين مادة واحدة على الأقل لفصل.');
    }
  };
  
  const formatAssignments = (teacherAssignments: TeacherAssignment[]) => {
    const grouped: Record<string, string[]> = {};
    const classMap = new Map(classes.map(c => [c.id, c.name]));
    const subjectMap = new Map(subjects.map(s => [s.id, s.name]));

    // FIX: Refactored to a more stable forEach pattern to ensure correct type inference.
    teacherAssignments.forEach((assignment: TeacherAssignment) => {
      const { classId, subjectId } = assignment;
      if (!grouped[classId]) {
        grouped[classId] = [];
      }
      const subjectName = subjectMap.get(subjectId);
      if (subjectName) {
        grouped[classId].push(subjectName);
      }
    });

    return Object.entries(grouped).map(([classId, subjectNames]) => {
      const className = classMap.get(classId) || 'فصل غير معروف';
      return `${className}: ${subjectNames.join(', ')}`;
    }).join('؛ ');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">إضافة معلم جديد</h2>
        <form onSubmit={handleAddTeacher} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">اسم المعلم</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">كلمة المرور</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">إسناد الفصول والمواد</label>
            <div className="mt-2 space-y-3 max-h-60 overflow-y-auto border p-3 rounded-md bg-gray-50">
              {classes.map(c => (
                <div key={c.id}>
                  <h4 className="font-semibold text-gray-800">{c.name}</h4>
                  <div className="pl-2 mt-1 space-y-1">
                    {/* FIX: Let TypeScript infer the type of 's' from the 'subjects' array. */}
                    {subjects.map(s => (
                      <div key={s.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`assign-${c.id}-${s.id}`}
                          checked={assignments[c.id]?.includes(s.id) || false}
                          onChange={() => handleAssignmentChange(c.id, s.id)}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <label htmlFor={`assign-${c.id}-${s.id}`} className="mr-2 block text-sm text-gray-700">{s.name}</label>
                      </div>
                    ))}
                    {subjects.length === 0 && <p className="text-xs text-gray-500">لا توجد مواد لإضافتها. أضف المواد من تبويب "المواد".</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">إضافة المعلم</button>
        </form>
      </div>

      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">قائمة المعلمين</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">الاسم</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">الفصول والمواد المسندة</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teachers.map(t => (
                <tr key={t.id}>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{t.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{formatAssignments(t.assignments)}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-left">
                    <button onClick={() => onDelete(t.id)} className="text-red-600 hover:text-red-900">حذف</button>
                  </td>
                </tr>
              ))}
              {teachers.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 px-4 text-center text-gray-500">لا يوجد معلمون مضافون بعد.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeachersTab;