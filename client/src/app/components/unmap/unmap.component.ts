import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {StockTakeComponent} from '../stocktake/stocktake.component';
import {LivingService} from '../../services/living/living.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MapService} from '../../services/map/map.service';
import {PlantdataService} from '../../services/data/plantdata.service';
import {TriggerService} from '../../services/trigger/trigger.service';
import {LatLng, Marker} from 'leaflet';

@Component({
    selector: 'app-unmap',
    templateUrl: './unmap.component.html',
    styleUrls: ['./unmap.component.css']
})
export class UnmapComponent implements OnInit {

    public feature: any;

    constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
                private bottomSheetRef: MatBottomSheetRef<StockTakeComponent>,
                private livingService: LivingService,
                private mapService: MapService,
                private triggerService: TriggerService,
                private snackBar: MatSnackBar,
                private plantdataService: PlantdataService) {
        this.feature = data.feature;
    }

    ngOnInit(): void {
    }

    unmapPlant(item_sit_id) {
        const that = this;
        this.livingService.unmap(item_sit_id).subscribe(function (jsonData) {
            const message = jsonData['success'] ? 'successful' : jsonData['message']
            that.snackBar.open(message, 'Unmap', {duration: 2000});
            if (jsonData['success']) {
                that.feature.geometry.coordinates = [0, 0];
                that.feature.unmapped = true;
                const layers: Marker = that.plantdataService.findLayersById(that.feature.properties.id, that.feature.group);
                that.plantdataService.redrawIcon(layers, that.plantdataService.getIcon(that.feature));
                that.plantdataService.summariseAll(that.plantdataService.jsonData);
                that.triggerService.remodel.emit(that.plantdataService.jsonData);
            }
        });
        this.bottomSheetRef.dismiss();
    }

    cancel() {
        this.bottomSheetRef.dismiss();
    }
}
