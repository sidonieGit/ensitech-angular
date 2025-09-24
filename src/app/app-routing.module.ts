import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GestionCoursComponent } from './components/gestion-cours/gestion-cours.component';
import { GestionStudentsComponent } from './components/gestion-students/gestion-students.component';
import { GestionTeachersComponent } from './components/gestion-teachers/gestion-teachers.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { GestionSpecialityComponent } from './components/gestion-speciality/gestion-speciality.component';
import { GestionEvaluationsComponent } from './components/gestion-evaluations/gestion-evaluations.component';
import { GestionAcademicYearComponent } from './components/gestion-academic-year/gestion-academic-year.component';
// import { GestionPeriodComponent } from './components/gestion-period/gestion-period.component';
import { GestionRegistrationComponent } from './components/gestion-registration/gestion-registration.component';
//import { GenerateRegistrationComponent } from './pdf/registration/generate-registration/generate-registration.component';

const routes: Routes = [
  { path: '', component: LoginPageComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: ['directeur'] },
  },
  {
    path: 'courses',
    component: GestionCoursComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: ['directeur', 'responsable'] },
  },
  {
    path: 'students',
    component: GestionStudentsComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: ['directeur', 'responsable'] },
  },
  {
    path: 'teachers',
    component: GestionTeachersComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: ['directeur', 'responsable'] },
  },
  // ... autres routes ...
  {
    path: 'evaluations',
    component: GestionEvaluationsComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: ['directeur', 'responsable'] },
  },
  { path: 'login-page', component: LoginPageComponent },

  {
    path: 'speciality',
    component: GestionSpecialityComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: ['directeur', 'responsable'] },
  },
  {
    path: 'academic-year',
    component: GestionAcademicYearComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: ['directeur', 'responsable'] },
  },
  // { path: 'period',
  //   component: GestionPeriodComponent,
  //   canActivate: [authGuard, roleGuard],
  //   data: { role: ['directeur', 'responsable'] }
  // }
  {
    path: 'registration',
    component: GestionRegistrationComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: ['directeur', 'responsable'] },
  },
  // { path: 'pdf',
  //   component: GenerateRegistrationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
