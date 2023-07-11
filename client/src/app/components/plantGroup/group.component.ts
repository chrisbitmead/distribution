import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {PlantdataService} from '../../services/data/plantdata.service';
import {MapService} from '../../services/map/map.service';
import {TriggerService} from '../../services/trigger/trigger.service';
import {DOCUMENT} from '@angular/common';
import {Marker} from 'leaflet';

@Component({
    selector: 'group-item',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.css']
})
/*
When in summary mode, this represents a group of plants
 */
export class GroupComponent implements OnInit {
    @Input('item') item: any;
    @Input() groupColor: string;
    @Input() mapped: boolean;
    @Output() selectedRequest = new EventEmitter<GroupComponent>();

    constructor(private plantdataService: PlantdataService,
                private mapService: MapService,
                private triggerService: TriggerService,
                @Inject(DOCUMENT) public document: Document) {
    }

    ngOnInit() {
    }

    /*
    Highlight all the plants in this group, and the sections they are in.
     */
    highlight() {
        const that = this;
        console.log('Clicked item ' + this.item.groupName);
        this.plantdataService.resetAllPlants()
        const sections: Set<string> = new Set<string>();
        this.item.features.forEach(f => sections.add(f.properties.section));

        // const sectionlayers = this.plantdataService.highlightSections(sections, this.item.group);
        // if (this.mapped) {
            const layers = [];
            this.item.features.forEach(function (feature) {
                const ls: Marker = that.plantdataService.selectPlant(feature);

                if (ls) {
                    layers.push(ls)
                }
            });
            this.mapService.fitFeatures(layers, 21)
        // } else {
        //     this.mapService.fitFeatures(sectionlayers, 21)
        // }
        this.item.features.forEach(f => f.selected = true);
        this.item.features.forEach(f => f.clicked = true);
    }

    isSelected(): boolean {
        return this.item.features.some(f => f.selected);
    }

    isClicked(): boolean {
        return this.item.features.some(f => f.clicked);
    }

    unselect() {
        this.item.features.forEach(f => f.selected = false);
    }
}
