import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPeriodComponent } from './gestion-period.component';

describe('GestionPeriodComponent', () => {
  let component: GestionPeriodComponent;
  let fixture: ComponentFixture<GestionPeriodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionPeriodComponent]
    });
    fixture = TestBed.createComponent(GestionPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
