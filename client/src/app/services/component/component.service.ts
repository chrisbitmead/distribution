import {ComponentFactoryResolver, EventEmitter, Injectable, Injector, Output, Type} from '@angular/core';
import {PlantPopupComponent} from '../../components/plant-popup/plant-popup.component';
import {PlantdataService} from '../data/plantdata.service';
import {TriggerService} from '../trigger/trigger.service';
import * as L from 'leaflet';


@Injectable({
    providedIn: 'root'
})
export class ComponentService {

    constructor(private componentFactoryResolver: ComponentFactoryResolver,
                private injector: Injector,
                private triggerService: TriggerService) {
    }


    public createCustomPopup(layer: L.Layer, feature, canStocktake: boolean, plantPopupClass: Type<any>, plantdataService: PlantdataService) {
        /*
        Why is plantPopupClass passed in here? Because that's the only way I could figure out to avoid
        annoying circular dependencies, which are the bane of Angular.
         */
        const factory = this.componentFactoryResolver.resolveComponentFactory(plantPopupClass);
        const component = factory.create(this.injector);
        // Set the component inputs manually
        component.instance.layer = layer;
        component.instance.feature = feature;
        component.instance.canStocktake = canStocktake;

        //Manually invoke change detection, automatic wont work, but this is Ok if the component doesn't change
        component.changeDetectorRef.detectChanges();

        plantdataService.resetAllPlants();
        plantdataService.selectPlant(feature);
        this.triggerService.remodel.emit(plantdataService.jsonData);
        return component.location.nativeElement;
    }
}
