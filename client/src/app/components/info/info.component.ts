import {Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {SearchService} from '../../services/search/search.service';
import {PlantdataService} from '../../services/data/plantdata.service';
import {Subscription} from 'rxjs';
import {ItemComponent} from '../item/item.component';
import {InfoSetComponent} from '../info-set/info-set.component';
import {ConfigService} from "../../services/config/config.service";
import {TriggerService} from "../../services/trigger/trigger.service";
// import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';

@Component({
    selector: 'info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.css'],
    animations: []
})

export class InfoComponent implements OnInit, OnDestroy {
    // Version is a bit of a hack to force Angular to update its tree and view.
    // There may be a better way to force this, but needs some deep thought.
    @Input() version = 0;
    @ViewChildren('info-set') components: QueryList<InfoSetComponent>;
    @ViewChild('scrollBottom') private scrollBottom: ElementRef;
    @ViewChild('scrollTop') private scrollTop: ElementRef;
    private advancedSub: Subscription;
    selectedItem: ItemComponent;

    constructor(private search: SearchService,
                public plantdataService: PlantdataService,
                public configService: ConfigService,
                public triggerService: TriggerService) {
    }

    ngOnInit() {
        this.triggerService.scrollToTop.subscribe((zoom) => {
            this.gotoTop('infoPane');
        });
        this.triggerService.scrollToBottom.subscribe((zoom) => {
            this.gotoBottom('infoPane');
        });
    }

    get jsonData(): any {
        return this.plantdataService.jsonData;
    }

    stringify(data) {
        console.log(data);
    }

    ngOnDestroy() {
        this.advancedSub.unsubscribe();
    }

    selectItem(item: ItemComponent) {
        console.log('Item selected ' + item);
        if (this.selectedItem) {
            this.selectedItem.unselect();
        }
        this.selectedItem = item;
    }

    gotoBottom(id){
        this.scrollBottom.nativeElement.scrollIntoView();
        // this.scrollMe.nativeElement.scrollTop = this.scrollMe.nativeElement.scrollHeight;
        // const element = document.getElementById('scroll-top');
        // element.scrollIntoView();
        // element.scrollTop = element.scrollHeight;
    }

    gotoTop(id){
        this.scrollTop.nativeElement.scrollIntoView();
        // this.scrollMe.nativeElement.scrollTop = 0;
        // const element = document.getElementById('scoll-bottom');
        // element.scrollIntoView();
        // element.scrollTop = 0;
    }
}
