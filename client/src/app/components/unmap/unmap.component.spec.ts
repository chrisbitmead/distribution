import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UnmapComponent} from './unmap.component';

describe('UnmapComponent', () => {
    let component: UnmapComponent;
    let fixture: ComponentFixture<UnmapComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UnmapComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UnmapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
