import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarRolPage } from './modificar-rol.page';

describe('ModificarRolPage', () => {
  let component: ModificarRolPage;
  let fixture: ComponentFixture<ModificarRolPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarRolPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
