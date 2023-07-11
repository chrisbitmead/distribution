import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNtnlComponent } from './new-ntnl.component';

describe('NewNtnlComponent', () => {
  let component: NewNtnlComponent;
  let fixture: ComponentFixture<NewNtnlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewNtnlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewNtnlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
