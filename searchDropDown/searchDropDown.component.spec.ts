import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDropDownComponent } from './searchDropDown.component';

describe('SearchDropDownComponent', () => {
  let component: SearchDropDownComponent;
  let fixture: ComponentFixture<SearchDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
