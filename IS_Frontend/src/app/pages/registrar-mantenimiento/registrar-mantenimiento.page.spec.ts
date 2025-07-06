import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarMantenimientoPage } from './registrar-mantenimiento.page';

describe('RegistrarMantenimientoPage', () => {
  let component: RegistrarMantenimientoPage;
  let fixture: ComponentFixture<RegistrarMantenimientoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarMantenimientoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
