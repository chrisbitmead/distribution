import {Component, Inject, OnInit} from '@angular/core';
import {ConfigService} from '../../services/config/config.service';
import {LivingService} from '../../services/living/living.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheet} from '@angular/material/bottom-sheet';
import * as L from 'leaflet';
import {PlantdataService} from '../../services/data/plantdata.service';
import {Marker} from 'leaflet';
import {ComponentService} from '../../services/component/component.service';
import {TriggerService} from "../../services/trigger/trigger.service";

@Component({
    selector: 'app-plant-popup',
    templateUrl: './plant-popup.component.html',
    styleUrls: ['./plant-popup.component.css']
})
export class PlantPopupComponent implements OnInit {
    public layer: L.LayerGroup;
    public feature: any;
    public canStocktake: boolean;
    public context: string;

    constructor(private livingService: LivingService,
                public configService: ConfigService,
                private snackBar: MatSnackBar,
                private bottomSheet: MatBottomSheet,
                private plantdataService: PlantdataService,
                private triggerService: TriggerService,
                private componentService: ComponentService) {
        this.context = ConfigService.context();
    }

    ngOnInit(): void {
    }


    requestTag(item_sit_id) {
        const that = this
        this.livingService.requestTag(item_sit_id).subscribe(function (jsonData) {
            const message = jsonData['success'] ? 'successful' : jsonData['message']
            that.snackBar.open(message, 'Tag request', {duration: 2000});
        });
    }

    /*
    Navigate to a view showing all the plants that are a clone of this one.
     */
    clones(item_sit_id) {
        const criteria = this.plantdataService.clear();
        criteria['herbCode'] = this.feature.properties.herbCode;
        criteria['accessionNumber'] = this.feature.properties.accessionNumber;
        criteria['suffix'] = this.feature.properties.suffix;
        criteria['clones'] = true;
        this.plantdataService.searchEventEmitter.emit(criteria);
    }

}
