import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionRegistrationComponent } from './gestion-registration.component';

describe('GestionRegistrationComponent', () => {
  let component: GestionRegistrationComponent;
  let fixture: ComponentFixture<GestionRegistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionRegistrationComponent]
    });
    fixture = TestBed.createComponent(GestionRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
