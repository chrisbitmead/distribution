import {Component, Inject, NgModule, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn
} from "@angular/forms";
import {PlantdataService} from "../../services/data/plantdata.service";

@Component({
  selector: 'app-new-ntnl',
  templateUrl: './new-ntnl.component.html',
  styleUrls: ['./new-ntnl.component.css']
})
export class NewNtnlComponent implements OnInit {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
              private bottomSheetRef: MatBottomSheetRef<NewNtnlComponent>,
              private fb: FormBuilder) {
    this.notes = data.notes;
  }
  // myForm: FormGroup;

  public name: string;
  public notes: string;

  ngOnInit(): void {
  }

  /*
  Create a new NTNL plant in the database.
   */
  confirm() {
    this.data.action(this.name, this.notes);
    this.bottomSheetRef.dismiss();
  }

  cancel() {
    this.bottomSheetRef.dismiss();
  }
}
