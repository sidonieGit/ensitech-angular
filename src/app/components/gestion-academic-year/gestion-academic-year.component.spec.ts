import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAcademicYearComponent } from './gestion-academic-year.component';

describe('GestionAcademicYearComponent', () => {
  let component: GestionAcademicYearComponent;
  let fixture: ComponentFixture<GestionAcademicYearComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionAcademicYearComponent]
    });
    fixture = TestBed.createComponent(GestionAcademicYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
