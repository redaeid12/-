
import React, { useState } from 'react';
import { Student, Teacher, SchoolClass, Grade, AdminTabs, Subject } from '../types';
import AdminStats from './admin/AdminStats';
import ClassesTab from './admin/ClassesTab';
import StudentsTab from './admin/StudentsTab';
import TeachersTab from './admin/TeachersTab';
import GradesTab from './admin/GradesTab';
import SubjectsTab from './admin/SubjectsTab';
import ConfirmationModal from './common/ConfirmationModal';

interface AdminDashboardProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  classes: SchoolClass[];
  setClasses: React.Dispatch<React.SetStateAction<SchoolClass[]>>;
  grades: Grade[];
  setGrades: React.Dispatch<React.SetStateAction<Grade[]>>;
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  onLogout: () => void;
}

interface DeletionInfo {
    type: 'class' | 'teacher' | 'student' | 'subject';
    id: string;
    message: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students, setStudents, teachers, setTeachers, classes, setClasses, grades, setGrades, subjects, setSubjects, onLogout
}) => {
  const [activeTab, setActiveTab] = useState<AdminTabs>(AdminTabs.Dashboard);
  const [modalInfo, setModalInfo] = useState<DeletionInfo | null>(null);

  const openConfirmationModal = (type: DeletionInfo['type'], id: string, message: string) => {
    setModalInfo({ type, id, message });
  };

  const closeConfirmationModal = () => {
    setModalInfo(null);
  };

  const handleConfirmDelete = () => {
    if (!modalInfo) return;
    
    const { type, id } = modalInfo;

    switch (type) {
        case 'teacher':
            setTeachers(prev => prev.filter(t => t.id !== id));
            break;
        case 'subject':
            setSubjects(prev => prev.filter(s => s.id !== id));
            setTeachers(prev => prev.map(teacher => ({
                ...teacher,
                assignments: teacher.assignments.filter(a => a.subjectId !== id)
            })));
            break;
        case 'class':
            const studentIdsInClass = students.filter(s => s.classId === id).map(s => s.id);
            setGrades(prev => prev.filter(g => !studentIdsInClass.includes(g.studentId)));
            setStudents(prev => prev.filter(s => s.classId !== id));
            setTeachers(prev => prev.map(teacher => ({
                ...teacher,
                assignments: teacher.assignments.filter(a => a.classId !== id)
            })));
            setClasses(prev => prev.filter(c => c.id !== id));
            break;
        case 'student':
            setGrades(prev => prev.filter(g => g.studentId !== id));
            setStudents(prev => prev.filter(s => s.id !== id));
            break;
    }

    closeConfirmationModal();
  };

  const handleDeleteTeacher = (id: string) => {
    openConfirmationModal('teacher', id, 'هل أنت متأكد من حذف هذا المعلم؟');
  };

  const handleDeleteSubject = (id: string) => {
    openConfirmationModal('subject', id, 'هل أنت متأكد من حذف هذه المادة؟ سيؤثر هذا على إسناد المعلمين.');
  };
  
  const handleDeleteClass = (id: string) => {
    openConfirmationModal('class', id, 'هل أنت متأكد من حذف هذا الفصل؟ سيتم حذف جميع الطلاب والواجبات المرتبطة به.');
  };

  const handleDeleteStudent = (id: string) => {
    openConfirmationModal('student', id, 'هل أنت متأكد من حذف هذا الطالب؟ سيتم حذف جميع درجاته.');
  };

  const renderContent = () => {
    switch (activeTab) {
      case AdminTabs.Dashboard:
        return <AdminStats 
            classCount={classes.length} 
            studentCount={students.length} 
            teacherCount={teachers.length} />;
      case AdminTabs.Classes:
        return <ClassesTab classes={classes} setClasses={setClasses} onDelete={handleDeleteClass} />;
      case AdminTabs.Teachers:
        return <TeachersTab teachers={teachers} setTeachers={setTeachers} classes={classes} subjects={subjects} onDelete={handleDeleteTeacher}/>;
      case AdminTabs.Students:
        return <StudentsTab students={students} setStudents={setStudents} classes={classes} onDelete={handleDeleteStudent} />;
      case AdminTabs.Subjects:
        return <SubjectsTab subjects={subjects} setSubjects={setSubjects} onDelete={handleDeleteSubject} />;
      case AdminTabs.Grades:
        return <GradesTab grades={grades} students={students} classes={classes} teachers={teachers} />;
      default:
        return null;
    }
  };
  
  const TabButton = ({ tab, label }: { tab: AdminTabs, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        activeTab === tab 
        ? 'bg-indigo-600 text-white' 
        : 'text-gray-600 hover:bg-indigo-100'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold text-gray-800">لوحة تحكم المدير</h1>
        <button onClick={onLogout} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
          تسجيل الخروج
        </button>
      </header>
      
      <nav className="mb-6 flex flex-wrap gap-2 p-2 bg-white rounded-lg shadow-sm">
        <TabButton tab={AdminTabs.Dashboard} label="الإحصائيات" />
        <TabButton tab={AdminTabs.Classes} label="الفصول" />
        <TabButton tab={AdminTabs.Teachers} label="المعلمين" />
        <TabButton tab={AdminTabs.Students} label="الطلاب" />
        <TabButton tab={AdminTabs.Subjects} label="المواد" />
        <TabButton tab={AdminTabs.Grades} label="الدرجات" />
      </nav>

      <main>
        {renderContent()}
      </main>

      <ConfirmationModal
        isOpen={!!modalInfo}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmDelete}
        title="تأكيد الحذف"
        message={modalInfo?.message || ''}
      />
    </div>
  );
};

export default AdminDashboard;
