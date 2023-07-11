import {Component, Inject, OnInit} from '@angular/core';
import {ConfigService} from '../../services/config/config.service';
import {LivingService} from '../../services/living/living.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheet} from '@angular/material/bottom-sheet';
import {StockTakeComponent} from '../stocktake/stocktake.component';
import {UnmapComponent} from '../unmap/unmap.component';
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

    /*
    Mark this plant as found in the stocktake.
     */
    stocktake(item_sit_id) {
        const bottomSheetRef = this.bottomSheet.open(StockTakeComponent, {
            data:
                {
                    feature: this.feature
                }
        });
        bottomSheetRef.afterDismissed().subscribe(() => {
            console.log('dismissed');
        });
    }

    /*
    Mark an NTNL plant with a different status (could be removed, accessioned, keep etc)
     */
    updateNtnlStatus(feature, status: string) {
        const ntnlId = feature.properties.item_sit_id.replace('N', '');
        const that = this;
        this.livingService.updateNtnlStatus(ntnlId, status).subscribe(function (jsonData) {
            const message = jsonData['success'] ? 'successful' : jsonData['message'];
            if (jsonData['success']) {
                that.plantdataService.unmapPlant(feature);
                // Not sure at this point if it was a NTNL group or LANDSCAPE group, just remove both
                that.plantdataService.jsonData[PlantdataService.RESULT].plants.features = that.plantdataService.jsonData[PlantdataService.RESULT].plants.features.filter(function(i) { return i.properties.item_sit_id !== feature.properties.item_sit_id; });
                that.plantdataService.summariseAll(that.plantdataService.jsonData);
                that.triggerService.redraw.emit(that.plantdataService.jsonData);
                that.snackBar.open('Success', 'NTNL', {
                    duration: 2000
                });
            } else {
                that.snackBar.open(message, 'NTNL', {
                    duration: 2000
                });
            }
        });
    }

    /*
    Remove the geographic mapping location for a plant
     */
    unmap(item_sit_id) {
        const bottomSheetRef = this.bottomSheet.open(UnmapComponent, {
            data:
                {
                    layer: this.layer,
                    feature: this.feature
                }
        });
        bottomSheetRef.afterDismissed().subscribe(() => {
            console.log('dismissed');
        });
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

    /*
    If a user accidently moves a plant, there is a button in the popup that allows them to undo the operation.
     */
    undoMove(feature) {
        const that = this;
        const prev = feature.geometryhistory.pop();
        const position = prev.coordinates;
        this.livingService.moveMarker(feature.properties.item_sit_id, position[1], position[0], prev.map_action_id, prev.stocktake_action_id).subscribe(jsonData => {
            feature.properties.map_date = new Date(jsonData['map_date']);
            feature.geometry.coordinates = position;
            const message = jsonData['success'] ? 'successful' : jsonData['message']
            that.snackBar.open(message, 'Map position restored', {duration: 2000});
            const marker: Marker = that.plantdataService.findLayersById(feature.properties.id, feature.group);
            marker.setLatLng(new L.LatLng(position[1], position[0]));
            that.plantdataService.redrawIcon(marker, that.plantdataService.getIcon(feature));
            marker.bindPopup(() => that.componentService.createCustomPopup(marker, feature, that.configService?.user?.canStocktake, PlantPopupComponent, this.plantdataService)).openPopup();
        });
    }
}
