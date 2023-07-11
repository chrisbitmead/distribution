import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSetComponent } from './info-set.component';

describe('InfoSetComponent', () => {
  let component: InfoSetComponent;
  let fixture: ComponentFixture<InfoSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
