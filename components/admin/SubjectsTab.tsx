
import React, { useState } from 'react';
import { Subject } from '../../types';

interface SubjectsTabProps {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  onDelete: (id: string) => void;
}

const SubjectsTab: React.FC<SubjectsTabProps> = ({ subjects, setSubjects, onDelete }) => {
  const [newSubjectName, setNewSubjectName] = useState('');

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      const newSubject: Subject = {
        id: Date.now().toString(),
        name: newSubjectName.trim(),
      };
      setSubjects(prev => [...prev, newSubject]);
      setNewSubjectName('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">إدارة المواد الدراسية</h2>
      
      <form onSubmit={handleAddSubject} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
          placeholder="اسم المادة الجديدة"
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          إضافة مادة
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم المادة</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subjects.map(s => (
              <tr key={s.id}>
                <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.name}</td>
                <td className="py-4 px-4 whitespace-nowrap text-sm text-left">
                     <button onClick={() => onDelete(s.id)} className="text-red-600 hover:text-red-900">
                        حذف
                    </button>
                </td>
              </tr>
            ))}
             {subjects.length === 0 && (
              <tr>
                <td colSpan={2} className="py-4 px-4 text-center text-gray-500">
                  لا توجد مواد مضافة بعد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectsTab;
