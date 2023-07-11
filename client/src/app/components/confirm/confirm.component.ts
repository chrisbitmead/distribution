import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

    constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
                private bottomSheetRef: MatBottomSheetRef<ConfirmComponent>) {
    }

    ngOnInit(): void {
    }

    confirm() {
        this.data.action();
        this.bottomSheetRef.dismiss();
    }

    cancel() {
        this.bottomSheetRef.dismiss();
    }
}
