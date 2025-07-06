import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectSensorsPage } from './select-sensors.page';

describe('SelectSensorsPage', () => {
  let component: SelectSensorsPage;
  let fixture: ComponentFixture<SelectSensorsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSensorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
