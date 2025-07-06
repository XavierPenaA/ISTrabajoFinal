import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariosCrearPage } from './usuarios-crear.page';

describe('UsuariosCrearPage', () => {
  let component: UsuariosCrearPage;
  let fixture: ComponentFixture<UsuariosCrearPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosCrearPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
