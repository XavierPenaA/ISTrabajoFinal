import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearDispositivoPage } from './crear-dispositivo.page';

describe('CrearDispositivoPage', () => {
  let component: CrearDispositivoPage;
  let fixture: ComponentFixture<CrearDispositivoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearDispositivoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
