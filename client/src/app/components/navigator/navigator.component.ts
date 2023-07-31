import {switchMap, distinctUntilChanged, debounceTime} from 'rxjs/operators';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MapService} from '../../services/map/map.service';
import {SearchService} from '../../services/search/search.service';
import {PlantdataService} from '../../services/data/plantdata.service';
import {ConfigService} from '../../services/config/config.service';
import {ComponentService} from '../../services/component/component.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {TriggerService} from '../../services/trigger/trigger.service';
import {IndexComponent} from '../../index/index.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {saveAs} from 'file-saver';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
    selector: 'navigator',
    templateUrl: './navigator.component.html',
    styleUrls: [
        './navigator.component.css'
    ],
    providers: []
})
export class NavigatorComponent implements OnInit, OnChanges {
    @Input() indexComponent: IndexComponent;
    @Input() pushQuery: string;
    @Input() _direction = 'horizontal'
    @Input() ntnl = false
    _queryString: string;
    text: string;
    findingPlants: boolean;
    @Input() advanced: boolean = false;
    _section: string
    _determination: string
    // herbCode: string;
    // accessionNumber: string;
    // suffix: string;
    // detail = false;
    // mapGrouped = true;
    @Input() overlayChoice = 'none';
    // none = true;
    // IBRA7States = false;
    // IBRA7Regions = false;
    // IBRA7Subregions = false;
    // IMCRA = false;
    // AustBoundaries = false;
    ala1 = false;
    // clones = false;
    // ntnl = false;
    max = 1000;

    constructor(private searchService: SearchService,
                private mapService: MapService,
                private configService: ConfigService,
                private plantdataService: PlantdataService,
                private componentService: ComponentService,
                private triggerService: TriggerService,
                private bottomSheet: MatBottomSheet,
                private route: ActivatedRoute,
                private router: Router,
                public snackBar: MatSnackBar) {
        this.findingPlants = false;
    }

    addAlaData(name: string) {
        if (this.ala1) {
            this.plantdataService.addAlaData(name);
        } else {
            this.plantdataService.removeAlaData(name);
        }
    }
    ngOnInit(): void {
        const that = this;
        this.mapService.disableMouseEvent('goto');
        this.mapService.disableMouseEvent('place-input');

        this.triggerService.refresh.subscribe((zoom) => {
            this.find();
        });
        this.plantdataService.searchEventEmitter.subscribe((criteria) => {
            this.setSearchCriteria(criteria);
            this.find();
        });
        this.clear();

        /*
        This is kind of the central point of the whole app, because what happens is driven off the URL.
        When a user does something to the search criteria, instead of doing it directly, we put our parameters
        into the URL, and this event gets triggered. The benefit of this is that URLs can be bookmarked
        with all the information necessary to recreate them.
         */
        this.route.queryParams.subscribe(params => {
            // Why do we use a setTimeout? Because of this:
            // Expression has changed after it was checked error
            // https://blog.angular-university.io/angular-debugging/
            setTimeout(() => {
                that.section = params.section;
                that.determination = params.determination;
                that.indexComponent.advanced = (params.advanced === 'true');
                that.advanced = that.indexComponent.advanced;
                that.max = (params.max ? Number(params.max) : that.max);
                if (that.section || that.determination) {
                    console.log('routing: ' + params);
                    this.findingPlants = true;
                    // here was stuff
                }
            });
        });
    }

    ibra7RegionNames(f) {
        return f.properties['REG_CODE_7'] + ': ' + f.properties['REG_NAME_7'];
    }

    ibra7StateNames(f) {
        return f.properties['STA_CODE'] + ': ' + f.properties['REG_CODE_7'] + ': ' + f.properties['REG_NAME_7'];
    }

    ibra7SubregionNames(f){
        return f.properties['SUB_CODE_7'] + ': ' + f.properties['REG_NAME_7'] + ', ' + f.properties['SUB_NAME_7'];
    }

    imcraNames(f){
        return f.properties['PB_NAME'];
    }

    austBoundaryNames(f) {
        // return (f.properties['ISLAND_NAM'] ? (f.properties['ISLAND_NAM']) : '');
        return f.properties['STATE_ABBR'] + (f.properties['ISLAND_GRO'] ? (': ' + f.properties['ISLAND_GRO']) : '');
    }

    alaNames(f){
        return 'xxx';
    }


    ngOnChanges(changes: SimpleChanges) {
        console.log('ngOnChanges: ' + changes?.pushQuery?.currentValue);
        if (changes?.pushQuery?.currentValue) {
            this.queryString = changes.pushQuery.currentValue
            this.find();
        }
    }

/*
Clear out the search criteria
 */
    clear() {
        const criteria = this.plantdataService.clear();
        this.setSearchCriteria(criteria);
        // this.indexComponent.jsonData = {};
        this.triggerService.redraw.emit(false);
    }

    setSearchCriteria(criteria) {
        if (criteria) {
            this.indexComponent?.setSearchCriteria(criteria);
            this.section = criteria.section;
            this.determination = criteria.determination;
            this.ntnl = criteria.ntnl;
            this.max = criteria.max;
        }
    }

    addCsvField(snippets, s: string) {
        snippets.push('"');
        snippets.push(s);
        snippets.push('"');
    }

    trunc(str, num) {
        if (str.length <= num) {
            return str;
        }
        return str.slice(0, num);
    }

    downloadFileName() {
        let rtn = '';
        const criteria = this.plantdataService.jsonData.criteria;
        if (criteria.section) {
            rtn += 'Sec' + criteria.section;
        }
        if (criteria.determination) {
            rtn += this.trunc(criteria.determination, 10);
        }
        if (criteria.herbCode) {
            rtn += criteria.herbCode;
        }
        if (criteria.accessionNumber) {
            rtn += criteria.accessionNumber;
        }
        if (criteria.suffix) {
            rtn += '-' + criteria.suffix;
        }
        return rtn + '.csv';
    }

    /*
    User can download the raw data as a CSV
     */
    download() {
        if (!this.plantdataService.jsonData.criteria) {
            this.snackBar.open('Do a search first', 'error', {duration: 1500});
            return;
        }
        const snippets = [];
        const that = this;
        this.addCsvField(snippets, 'Determination');
        snippets.push(',');
        this.addCsvField(snippets, 'Taxon Name');
        snippets.push(',');
        this.addCsvField(snippets, 'Label');
        snippets.push(',');
        this.addCsvField(snippets, 'Quantity');
        snippets.push(',');
        this.addCsvField(snippets, 'Section');
        snippets.push(',');
        this.addCsvField(snippets, 'Accession');
        snippets.push(',');
        this.addCsvField(snippets, 'Type');

        snippets.push(',');
        this.addCsvField(snippets, 'Size');
        snippets.push(',');
        this.addCsvField(snippets, 'Latitude');
        snippets.push(',');
        this.addCsvField(snippets, 'Longitude');
        snippets.push('\n');
        this.plantdataService.jsonData.criteria?.groups?.forEach(function (group) {
            that.plantdataService.jsonData[group].plants.features.forEach(function (feature) {
                that.addCsvField(snippets, feature.properties.name);
                snippets.push(',');
                that.addCsvField(snippets, feature.properties.taxon_name);
                snippets.push(',');
                that.addCsvField(snippets, feature.properties.label);
                snippets.push(',');
                that.addCsvField(snippets, feature.properties.qty);
                snippets.push(',');
                that.addCsvField(snippets, feature.properties.section);
                snippets.push(',');
                that.addCsvField(snippets, feature.properties.accession);
                snippets.push(',');
                that.addCsvField(snippets, feature.properties.item_type);
                snippets.push(',');
                that.addCsvField(snippets, feature.properties.item_size);
                snippets.push(',');
                that.addCsvField(snippets, feature.geometry.coordinates[1]);
                snippets.push(',');
                that.addCsvField(snippets, feature.geometry.coordinates[0]);
                snippets.push('\n');
            });
        });
        const blob = new Blob(snippets, {type: 'text/csv;charset=utf-8'});
        saveAs(blob, this.downloadFileName());
    }

    scrollToTop() {
        this.triggerService.scrollToTop.emit(null);
    }

    scrollToBottom() {
        this.triggerService.scrollToBottom.emit(null);
    }

    changeAdvanced() {
        this.advanced = !this.advanced;
        this.indexComponent.advanced = this.advanced;
    }

    set direction(nd: string) {
        this._direction = nd;
        window.dispatchEvent(new Event('resize'));
    }

    /*
    I experimented with the ability for the user to switch the panels from horizontal to vertical.
    Disabled for now, but might be worth resurrecting.
     */
    get direction() {
        return this._direction;
    }

    getSearchCriteria(c) {
        this.indexComponent.getSearchCriteria(c);
        const groups = [PlantdataService.RESULT];
        c.groups = groups;
        c.section = this.section;
        c.determination = this.determination;
        c.ntnl = this.ntnl;
        c.max = this.max;
        c.advanced = this.advanced;
    }

    change(zoom) {
        console.log('change');
        this.getSearchCriteria(this.plantdataService.jsonData.criteria);
         // We have to redraw rather than just remodel because mapped and unmapped
         // change the view.
        this.triggerService.redraw.emit(zoom);

    }

    public get section() {
        return this._section;
    }

    public set section(val) {
        this._section = val;
        if (!this._determination) {
            this._queryString = val;
        }
    }

    public get determination() {
        return this._determination;
    }

    public set determination(val) {
        this._determination = val;
        if (!this._section) {
            this._queryString = val;
        }
    }

    public get queryString() {
        return this._queryString;
    }

    public set queryString(val) {
        this._queryString = val;
        // const sectionLayers = this.plantdataService.findLayersBySection(`${this.queryString}`);
        // if (!val || sectionLayers) {
        //     this._section = val;
        //     this._determination = null;
        // } else {
            this._determination = val;
            this._section = null;
        // }
    }

    /*
    When the user presses search, instead of doing it directly, we shove the parameters into the URL and trigger
    a change.
     */
    find() {
        console.log('find()');
        this.router.navigate(['/'], {
            queryParams: {
                section: this.section,
                determination: this.determination,
                advanced: this.advanced,
                ntnl: this.ntnl,
                // This is not super elegant, but seems more elegant than the force refresh alternatives.
                refresh: Date.now()
            }
        });
    }

    typeAheadSearch = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(100),
            distinctUntilChanged(),
            switchMap(term =>
                this.searchService.suggest(term)
            ));
}
