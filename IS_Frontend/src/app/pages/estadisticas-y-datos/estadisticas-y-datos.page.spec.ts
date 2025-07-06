import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstadisticasYDatosPage } from './estadisticas-y-datos.page';

describe('EstadisticasYDatosPage', () => {
  let component: EstadisticasYDatosPage;
  let fixture: ComponentFixture<EstadisticasYDatosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadisticasYDatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
