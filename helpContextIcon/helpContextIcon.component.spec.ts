import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpContextIconComponent } from './helpContextIcon.component';

describe('HelpContextIconComponent', () => {
  let component: HelpContextIconComponent;
  let fixture: ComponentFixture<HelpContextIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpContextIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpContextIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
