import { Course } from 'src/app/interfaces/course.model';

export interface Speciality {
  id?: number;
  label: string;
  description: string;
  cycle?: string;
  courses?: Course[];
  selectedCourses?: any;
}
