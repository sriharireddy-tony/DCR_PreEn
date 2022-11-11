import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiatorpageComponent } from './initiatorpage.component';

describe('InitiatorpageComponent', () => {
  let component: InitiatorpageComponent;
  let fixture: ComponentFixture<InitiatorpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiatorpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiatorpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
