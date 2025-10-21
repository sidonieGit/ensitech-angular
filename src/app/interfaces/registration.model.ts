import { Student } from './students.model';

export interface Registration {
  id?: number;
  registrationNumber?: string;
  level: string;
  matricule: string;
  specialityLabel: string;
  academicYearLabel: string;
  student?: Student;
  studentFullName?: string;
}
