import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantPopupComponent } from './plant-popup.component';

describe('PlantPopupComponent', () => {
  let component: PlantPopupComponent;
  let fixture: ComponentFixture<PlantPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
