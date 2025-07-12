import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTeachersComponent } from './gestion-teachers.component';

describe('GestionTeachersComponent', () => {
  let component: GestionTeachersComponent;
  let fixture: ComponentFixture<GestionTeachersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionTeachersComponent]
    });
    fixture = TestBed.createComponent(GestionTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
