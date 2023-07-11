import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {

    leftClosed = false;
    rightClosed = false;

    constructor() {
    }

    ngOnInit() {
        if (window.innerWidth < 500) {
            this.leftClosed = true;
            this.rightClosed = true;
            window.dispatchEvent(new Event('resize'));
        } else if (window.innerWidth < 1000) {
            this.rightClosed = true;
            window.dispatchEvent(new Event('resize'));
        }
    }

    toggleLeft() {
        this.leftClosed = !this.leftClosed;
        window.dispatchEvent(new Event('resize'));
    }

    toggleRight() {
        this.rightClosed = !this.rightClosed;
        window.dispatchEvent(new Event('resize'));
    }
}

