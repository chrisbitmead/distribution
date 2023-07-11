import {Component, EventEmitter, Input, OnInit, Output, Type} from '@angular/core';
import {PlantdataService} from '../../services/data/plantdata.service';
import {FeatureGroup, LeafletMouseEvent} from 'leaflet';
import * as L from 'leaflet';
import {MapService} from '../../services/map/map.service';
import {ConfigService} from '../../services/config/config.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LivingService} from '../../services/living/living.service';
import {ComponentService} from '../../services/component/component.service';
import {TriggerService} from '../../services/trigger/trigger.service';
import {PlantPopupComponent} from '../plant-popup/plant-popup.component';
import {ConfirmComponent} from '../confirm/confirm.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {SearchService} from '../../services/search/search.service';

@Component({
    selector: 'section-item',
    templateUrl: './section.component.html',
    styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {
    @Input('item') item: any;
    @Input() groupColor: string;

    @Output() selectedRequest = new EventEmitter<SectionComponent>();
    selected: boolean;

    constructor(private searchService: SearchService,
                public plantdataService: PlantdataService,
                private mapService: MapService,
                public configService: ConfigService,
                private snackBar: MatSnackBar,
                private livingService: LivingService,
                private triggerService: TriggerService,
                private bottomSheet: MatBottomSheet,
                private componentService: ComponentService) {
        this.selected = false;
    }

    ngOnInit() {
    }

    /*
    Find the section outline that relates to the plant you just click on and highlight it
     */
    highlight() {
        console.log('Clicked item ' + this.item.properties.name);
        this.plantdataService.resetAllPlants();
        // const layers = this.plantdataService.highlightSections(new Set([this.item.properties.section]), this.item.group);
        // this.mapService.fitFeatures(layers, 21);
        this.selected = true;
        this.selectedRequest.emit(this);
    }

    unselect() {
        this.selected = false;
    }

    /*
    Map button. Allow the user to place an unmapped item onto the map.
     */
    mapPlant() {
        const that = this;
        // const sectionLayers: any[] = this.plantdataService.findLayersBySections([that.item.properties.section]);
        // this.mapService.fitFeatures(sectionLayers, 21, false)
        // this.plantdataService.highlightSections(new Set([that.item.properties.section]), this.item.group);
        //
        // this.plantdataService.makeSectionsUnclickable();
        this.snackBar.open('Locate the plant on the map', 'Map', {
            duration: 2000
        });
        this.mapService.map.on('click', function (e: LeafletMouseEvent) {
            that.mapService.map.off('click');
            // that.plantdataService.makeSectionsClickable();
            // if (!that.plantdataService.pointIsInSection(that.item.properties.section, e.latlng)) {
            //     that.bottomSheet.open(ConfirmComponent, {
            //         data: {
            //             text: 'warning - this accession is registered in a different section (' + that.item.properties.section + '), continue mapping?',
            //             action: function () {
            //                 that.placeMapMarker(e);
            //             },
            //             argument: e
            //         }
            //     });
            // } else {
                that.placeMapMarker(e);
            // }
        });
    }

    placeMapMarker(e) {
        const that = this;
        // We don't have a separate API to create a map marker, we just call the move API.
        that.livingService.moveMarker(that.item.properties.item_sit_id, e.latlng.lat, e.latlng.lng, null, null).subscribe(jsonData => {
            const message = jsonData[
                'success'] ? 'successful' : jsonData['message']
            that.snackBar.open(message, 'Map position placed', {duration: 2000});
            if (jsonData['success']) {
                that.item.properties.map_date = new Date();
                that.item.unmapped = false;
                // Differing standards, GeoJSON uses [ longitude, latitude ] aka X, Y
                // but leaflet uses longitude, latitude
                that.item.geometry.coordinates = [e.latlng.lng, e.latlng.lat];
                that.plantdataService.summariseAll(that.plantdataService.jsonData);
                const marker = that.plantdataService.createMarker(that.item, e.latlng, PlantPopupComponent).addTo(that.mapService.map);
                that.plantdataService.mapNewPlant(marker, that.item);
                that.triggerService.remodel.emit(that.plantdataService.jsonData);
            }
        });
    }
}
