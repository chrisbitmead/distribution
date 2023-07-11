import {Directive, forwardRef} from '@angular/core';
import {PlantdataService} from "../services/data/plantdata.service";
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from "@angular/forms";

@Directive({
  selector: '[appSicbitmeadtuationDirective]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => SituationDirective), multi: true }
  ]
})
export class SituationDirective implements Validator {

  constructor(private plantdataService: PlantdataService) { }

  // public forbiddenSectionCodeValidator(plantdataService: PlantdataService): ValidatorFn {
  //   return (control: AbstractControl): {[key: string]: any} | null => {
  //     const section = control.value;
  //     if (!this.plantdataService.jsonData.sections.includes(section)) {
  //       return { forbiddenSection: section};
  //     }
  //     return null;
  //   };
  // }

  validate(control: AbstractControl): ValidationErrors | null {
    const section = control.value;
    // if (!Object.keys(this.plantdataService.sectionData).includes(section)) {
    //   return { forbiddenSection: section};
    // }
    return undefined;
  }


}
