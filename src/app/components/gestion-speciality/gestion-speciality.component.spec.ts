import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionSpecialityComponent } from './gestion-speciality.component';

describe('GestionSpecialityComponent', () => {
  let component: GestionSpecialityComponent;
  let fixture: ComponentFixture<GestionSpecialityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionSpecialityComponent]
    });
    fixture = TestBed.createComponent(GestionSpecialityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should have  a title', () => {
  //   const compiled = fixture.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('Gestion Speciality');
  // })
});
