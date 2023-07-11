import {Component, Input, OnInit} from '@angular/core';
import {ItemComponent} from '../item/item.component';
import {SearchService} from '../../services/search/search.service';
import {Subscription} from 'rxjs';
import {PlantdataService} from "../../services/data/plantdata.service";

@Component({
    selector: 'info-set',
    templateUrl: './info-set.component.html',
    styleUrls: ['./info-set.component.css']
})
export class InfoSetComponent {
    @Input() name: string;
    @Input() groupColor: string;
    @Input() results: any;
    @Input() version = 0;
    selectedItem: ItemComponent;

    constructor(private plantdataService: PlantdataService) {
    }

    selectItem(item: ItemComponent) {
        if (this.selectedItem) {
            this.selectedItem.unselect();
        }
        this.selectedItem = item;
    }
    get jsonData(): any {
        return this.plantdataService.jsonData;
    }
}
