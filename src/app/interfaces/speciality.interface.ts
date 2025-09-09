import { Course } from 'src/app/interfaces/course.model';

export interface Speciality {
  id?: number;
  label: string;
  description: string;
  cycles?: string;
  courses?: Course[];
  // selected?: boolean;
}
