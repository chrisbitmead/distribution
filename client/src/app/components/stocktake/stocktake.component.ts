import {Component, Inject, OnInit} from '@angular/core';
import {ConfigService} from '../../services/config/config.service';
import {LivingService} from '../../services/living/living.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {TriggerService} from '../../services/trigger/trigger.service';
import {MapService} from '../../services/map/map.service';
import {PlantdataService} from '../../services/data/plantdata.service';
import {Marker} from 'leaflet';

@Component({
    selector: 'app-stocktake',
    templateUrl: './stocktake.component.html',
    styleUrls: ['./stocktake.component.css']
})
export class StockTakeComponent implements OnInit {
    public feature: any;
    public canStocktake: boolean;
    public notes: string;

    constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
                private bottomSheetRef: MatBottomSheetRef<StockTakeComponent>,
                private livingService: LivingService,
                private snackBar: MatSnackBar,
                private triggerService: TriggerService,
                public configService: ConfigService,
                private plantdataService: PlantdataService,
                private mapService: MapService) {
        this.feature = data.feature;
    }

    ngOnInit(): void {
    }

    /*
    Mark plant as found in the stocktake.
     */
    stocktake(item_sit_id) {
        const that = this;
        this.livingService.stocktake(this.feature.properties.item_sit_id, this.feature.properties.qty, this.notes).subscribe(function (jsonData) {
            const message = jsonData['success'] ? 'successful' : jsonData['message'];
            that.snackBar.open(message, 'Stocktake', {
                duration: 2000
            });
            if (jsonData['success']) {
                that.feature.properties.stock_date = new Date();
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
