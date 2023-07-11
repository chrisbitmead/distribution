import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {PlantdataService} from '../../services/data/plantdata.service';
import {MapService} from '../../services/map/map.service';
import {ConfigService} from '../../services/config/config.service';
import {DOCUMENT} from '@angular/common';
import {Marker} from 'leaflet';

@Component({
    selector: 'mapped-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.css']
})
export class ItemComponent {
    @Input('item') item: any;
    @Input() groupColor: string;
    @Output() selectedRequest = new EventEmitter<ItemComponent>();

    constructor(public plantdataService: PlantdataService,
                private mapService: MapService,
                public configService: ConfigService,
                @Inject(DOCUMENT) public document: Document) {
    }

    /*
    Find the icon and section outline that relates to the plant you just click on and highlight them both
     */
    highlight() {
        console.log('Clicked item ' + this.item.properties.name);
        this.plantdataService.resetAllPlants();
        // const sectionlayers = this.plantdataService.highlightSections(new Set([this.item.properties.section]), this.item.group);
        // const layers: Marker = this.plantdataService.selectPlant(this.item);
        // if (layers) {
        //     this.mapService.fitFeatures([layers], 21);
        // } else {
        //     this.mapService.fitFeatures(sectionlayers, 21);
        //
        // }
        this.item.selected = true;
        this.item.clicked = true;
        this.selectedRequest.emit(this);
    }

    unselect() {
        this.item.selected = false;
    }
}
