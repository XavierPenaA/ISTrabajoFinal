import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectActivatorsPage } from './select-activators.page';

describe('SelectActivatorsPage', () => {
  let component: SelectActivatorsPage;
  let fixture: ComponentFixture<SelectActivatorsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectActivatorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
