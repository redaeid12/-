
import React, { useState } from 'react';
import { SchoolClass } from '../../types';

interface ClassesTabProps {
  classes: SchoolClass[];
  setClasses: React.Dispatch<React.SetStateAction<SchoolClass[]>>;
  onDelete: (id: string) => void;
}

const ClassesTab: React.FC<ClassesTabProps> = ({ classes, setClasses, onDelete }) => {
  const [newClassName, setNewClassName] = useState('');

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClassName.trim()) {
      const newClass: SchoolClass = {
        id: Date.now().toString(),
        name: newClassName.trim(),
      };
      setClasses(prev => [...prev, newClass]);
      setNewClassName('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">إدارة الفصول</h2>
      
      <form onSubmit={handleAddClass} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          placeholder="اسم الفصل الجديد"
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          إضافة فصل
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم الفصل</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {classes.map(c => (
              <tr key={c.id}>
                <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.name}</td>
                <td className="py-4 px-4 whitespace-nowrap text-sm text-left">
                     <button onClick={() => onDelete(c.id)} className="text-red-600 hover:text-red-900">
                        حذف
                    </button>
                </td>
              </tr>
            ))}
             {classes.length === 0 && (
              <tr>
                <td colSpan={2} className="py-4 px-4 text-center text-gray-500">
                  لا توجد فصول مضافة بعد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassesTab;
