
export interface Student {
  id: string;
  name: string;
  classId: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface TeacherAssignment {
  classId: string;
  subjectId: string;
}

export interface Teacher {
  id: string;
  name: string;
  password: string;
  assignments: TeacherAssignment[];
}

export interface SchoolClass {
  id: string;
  name: string;
}

export interface Grade {
  studentId: string;
  subject: string;
  test1: number | null;
  test2: number | null;
  yearlyWork: number | null;
}

export type User = {
  type: 'admin' | 'teacher';
  data: Teacher | { name: 'Admin' };
} | null;

export enum AdminTabs {
  Dashboard = 'Dashboard',
  Classes = 'Classes',
  Teachers = 'Teachers',
  Students = 'Students',
  Subjects = 'Subjects',
  Grades = 'Grades'
}
