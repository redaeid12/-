import React, { useState } from 'react';
import { Student, SchoolClass } from '../../types';

interface StudentsTabProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  classes: SchoolClass[];
  onDelete: (id: string) => void;
}

const StudentsTab: React.FC<StudentsTabProps> = ({ students, setStudents, classes, onDelete }) => {
  const [name, setName] = useState('');
  const [classId, setClassId] = useState('');
  const [bulkData, setBulkData] = useState('');

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && classId) {
      const newStudent: Student = {
        id: Date.now().toString(),
        name: name.trim(),
        classId: classId,
      };
      setStudents(prev => [...prev, newStudent]);
      setName('');
      setClassId('');
    } else {
        alert('يرجى إدخال اسم الطالب واختيار فصل.');
    }
  };

  const handleBulkAdd = () => {
    if (!bulkData.trim()) {
      alert('يرجى لصق بيانات الطلاب.');
      return;
    }

    const rows = bulkData.trim().split('\n');
    const newStudents: Student[] = [];
    const failedRows: string[] = [];
    const classesByName = new Map(classes.map(c => [c.name.trim().toLowerCase(), c.id]));

    // FIX: Removed explicit type on 'row' to allow for correct type inference.
    rows.forEach((row, index) => {
      const columns = row.split('\t'); // Assuming tab-separated from Excel
      if (columns.length >= 2) {
        const studentName = columns[0].trim();
        const className = columns[1].trim().toLowerCase();
        const foundClassId = classesByName.get(className);

        if (studentName && foundClassId) {
          newStudents.push({
            id: `bulk-${Date.now()}-${index}`,
            name: studentName,
            classId: foundClassId,
          });
        } else {
          failedRows.push(row);
        }
      } else {
        failedRows.push(row);
      }
    });

    if (newStudents.length > 0) {
      setStudents(prev => [...prev, ...newStudents]);
    }

    if (failedRows.length > 0) {
      alert(`تمت إضافة ${newStudents.length} طالب بنجاح.\nفشلت إضافة ${failedRows.length} صفوف:\n${failedRows.join('\n')}`);
    } else {
      alert(`تمت إضافة ${newStudents.length} طالب بنجاح.`);
    }
    setBulkData('');
  };


  return (
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">إضافة طالب جديد</h2>
            <form onSubmit={handleAddStudent} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">اسم الطالب</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">الفصل</label>
                <select value={classId} onChange={e => setClassId(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white" required>
                <option value="">اختر فصل...</option>
                {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
                </select>
            </div>
            <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">إضافة الطالب</button>
            </form>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">إضافة طلاب دفعة واحدة</h2>
            <p className="text-sm text-gray-600 mb-2">
                انسخ عمودين من ملف إكسل (اسم الطالب، اسم الفصل) والصقهما هنا.
            </p>
            <textarea
                value={bulkData}
                onChange={e => setBulkData(e.target.value)}
                placeholder={'علي محمد\tالفصل 1\nفاطمة أحمد\tالفصل 2'}
                className="w-full h-40 p-2 border border-gray-300 rounded-md shadow-sm"
                aria-label="لصق بيانات الطلاب"
            />
            <button
                onClick={handleBulkAdd}
                className="w-full mt-4 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700">
                إضافة دفعة واحدة
            </button>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">قائمة الطلاب</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">الاسم</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">الفصل</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map(s => (
                <tr key={s.id}>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{s.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{classes.find(c => c.id === s.classId)?.name || 'غير محدد'}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-left">
                     <button onClick={() => onDelete(s.id)} className="text-red-600 hover:text-red-900">
                        حذف
                    </button>
                </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 px-4 text-center text-gray-500">
                    لا يوجد طلاب مضافون بعد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsTab;