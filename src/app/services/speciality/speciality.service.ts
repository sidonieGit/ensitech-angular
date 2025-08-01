import { Injectable } from '@angular/core';
import { Speciality } from 'src/app/interfaces/speciality.interface';
import { SPECIALITY } from 'src/app/mock-speciality';

@Injectable({
  providedIn: 'root',
})
export class SpecialityService {

  private speciality!: Speciality[];

  private apiUrl = 'http://localhost:8084/api/speciality';


  constructor() {
    this.speciality = SPECIALITY

  }

  getSpeciality():Speciality[]{
    return this.speciality;
  }

}
