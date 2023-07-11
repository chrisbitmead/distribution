import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {SearchService} from '../../services/search/search.service';
import {PlantdataService} from '../../services/data/plantdata.service';

@Component({
    selector: 'search-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.css']
})
/*
The status line up the top of the screen
 */
export class StatusComponent implements OnInit, OnChanges {
    @Input() jsonData: any = {};
    @Input() version = 0;
    @Input() ntnl: boolean = false;
    description: string;

    constructor(private search: SearchService
                // private plantdataService: PlantdataService
    ) {
        this.reset();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.createDescription();
    }

    createDescription() {
        const jsonData = this.jsonData;
        this.description = '';
        if (jsonData && jsonData[PlantdataService.RESULT]) {
            // this.description += jsonData[PlantdataService.RESULT].plantsGrouped.length + ' locations';
        //     this.description += ' at ' + jsonData[PlantdataService.RESULT].mappedPlants.features.length + ' mapped locations';
        //     this.description += ' and ' + jsonData[PlantdataService.RESULT].unmappedPlants.features.length + ' unmapped locations';
        //     this.description += ' with ' + jsonData[PlantdataService.RESULT].plants.qty + ' plants';
        //
        //     if (jsonData[PlantdataService.RESULT].sections.length === 1) {
        //         this.description += ' in section ' + jsonData[PlantdataService.RESULT].sections[0];
        //     } else {
        //         this.description += ' in ' + jsonData[PlantdataService.RESULT].sections.length + ' sections';
        //     }
        //     if (jsonData[PlantdataService.LANDSCAPE].plants.qty > 0) {
        //         this.description += ' plus ' + jsonData[PlantdataService.LANDSCAPE].plants.qty + ' kept, unaccessioned plants';
        //     }
        //     if (jsonData[PlantdataService.NTNL].plants.qty > 0 && this.ntnl) {
        //         this.description += ' plus ' + jsonData[PlantdataService.NTNL].plants.qty + ' NTNL';
        //     }
        //     if (jsonData[PlantdataService.RESULT].plants.features.length < jsonData.total) {
        //         this.description += ' (total of ' + jsonData.total + ' locations limited to ' + jsonData[PlantdataService.RESULT].plants.features.length + '. Try being more specific.)';
        //     }
        }
    }

    reset() {
        this.description = '';
    }

    ngOnInit() {
    }
}
