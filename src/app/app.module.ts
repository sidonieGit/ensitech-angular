import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardMainComponent } from './components/dashboard-main/dashboard-main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GestionCoursComponent } from './components/gestion-cours/gestion-cours.component';
import { GestionEvaluationsComponent } from './components/gestion-evaluations/gestion-evaluations.component';
import { GestionSpecialityComponent } from './components/gestion-speciality/gestion-speciality.component';
import { GestionStudentsComponent } from './components/gestion-students/gestion-students.component';
import { GestionTeachersComponent } from './components/gestion-teachers/gestion-teachers.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Requis pour ngx-toastr
import { ToastrModule } from 'ngx-toastr'; // Importer le module

import { HttpErrorInterceptor } from './interceptors/http-error.interceptor'; // Importer notre intercepteur

import { TopbarComponent } from './components/topbar/topbar.component';
import { FiltercoursePipe } from './filtercourse.pipe';
import { FilterpipePipe } from './filterpipe.pipe';
import { AuthService } from './services/auth/auth.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { ReactiveFormsModule } from '@angular/forms'; // Pour les formulaires réactifs
import { DatePipe } from '@angular/common'; // Pour le pipe date

export function initializeApp(authService: AuthService) {
  return () => {
    // Vérifier l'authentification au démarrage
    authService.checkAuthentication();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    GestionCoursComponent,
    SidebarComponent,
    TopbarComponent,
    DashboardComponent,
    DashboardMainComponent,
    GestionStudentsComponent,
    GestionTeachersComponent,
    FilterpipePipe,
    FiltercoursePipe,
    GestionSpecialityComponent,
    GestionEvaluationsComponent,
  ],
  imports: [
     CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
     ReactiveFormsModule,
    NgChartsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      // Configurer Toastr
      timeOut: 5000, // 5 secondes
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    // Provider pour initialiser l'application
        DatePipe,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
      multi: true,
    },
    // Provider pour l'intercepteur d'authentification (ajoute le token)
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },

    // Provider pour l'intercepteur d'erreurs (affiche les notifications)
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
