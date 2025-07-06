import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProtocolosMainPage } from './protocolos-main.page';

describe('ProtocolosMainPage', () => {
  let component: ProtocolosMainPage;
  let fixture: ComponentFixture<ProtocolosMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtocolosMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
