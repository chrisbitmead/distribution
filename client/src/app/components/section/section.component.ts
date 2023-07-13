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
}
