import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpItemDisplayComponent } from './helpItemDisplay.component';

describe('helpItemDisplayComponent', () => {
    let component: HelpItemDisplayComponent;
    let fixture: ComponentFixture<HelpItemDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [HelpItemDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(HelpItemDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
