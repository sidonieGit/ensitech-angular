import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionStudentsComponent } from './gestion-students.component';

describe('GestionStudentsComponent', () => {
  let component: GestionStudentsComponent;
  let fixture: ComponentFixture<GestionStudentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionStudentsComponent]
    });
    fixture = TestBed.createComponent(GestionStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
