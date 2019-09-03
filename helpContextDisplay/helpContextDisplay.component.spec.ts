import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpContextDisplayComponent } from './helpContextDisplay.component';

describe('HelpContextDisplayComponent', () => {
  let component: HelpContextDisplayComponent;
  let fixture: ComponentFixture<HelpContextDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpContextDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpContextDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
