import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectDevicePage } from './select-device.page';

describe('SelectDevicePage', () => {
  let component: SelectDevicePage;
  let fixture: ComponentFixture<SelectDevicePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDevicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
