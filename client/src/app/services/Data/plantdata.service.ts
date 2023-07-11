import {ComponentFactoryResolver, EventEmitter, Injectable, Injector, Output, Type} from '@angular/core';
import {MapService} from '../map/map.service';
import {ConfigService} from '../config/config.service';
import * as L from 'leaflet';
import {HttpClient} from '@angular/common/http';
import {ComponentService} from '../component/component.service';
import {LivingService} from '../living/living.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as classifyPoint from 'robust-point-in-polygon';
import * as moment from 'moment';
import {TriggerService} from '../trigger/trigger.service';
import {DivIcon, LatLng, Marker} from 'leaflet';

@Injectable()
export class PlantdataService {
    static RESULT = 'results';
    // static CLONE = 'clones';
    // static DO_MAP_SECTION = 'do_map_section';
    static SECTION_CONTEXT = 'section_context';
    // static NTNL = 'ntnl';
    // static LANDSCAPE = 'landscape'
    // static GROUPS = [PlantdataService.RESULT, PlantdataService.CLONE, PlantdataService.DO_MAP_SECTION, PlantdataService.SECTION_CONTEXT];
    static GROUPS = [PlantdataService.RESULT];
    static sectionDefaultColor = '#c7fceb';
    static sectionFoundColors: any = {results: '#e8ccaf', clones: '#e8ccaf', section_context: '#e8ccaf', landscape: '#e8ccaf', ntnl: '#e8ccaf'};
    static sectionSelectedColors: any = {results: '#e8af73', clones: '#e8af73', section_context: '#e8af73', landscape: '#e8af73', ntnl: '#e8af73'};

    // The vanish symbol for unmapped
    unmappedIcon = L.divIcon({ html: '<i class="mapIconCls">&#xE018;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    unmappedSelectedIcon = this.unmappedIcon;

    ntnlIcon = L.divIcon({ html: '<i class="mapIconCls">&#xFFFD;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'mapIcon' })
    ntnlIconSelected = L.divIcon({ html: '<i class="mapIconCls" style="color:yellow;">&#xFFFD;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'mapIcon' })

    // Landscape Plant
    // tree1IconLandscape = L.divIcon({html: '<i style="color:#56b033;opacity:0.75;font-size:20px;" class="mapIconCls">&#x2BC1;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon'})
    // tree1IconLandscapeSelected = L.divIcon({html: '<i style="color:yellow;font-size:25px;" class="mapIconCls">&#x2BC1;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon'})
    tree1IconLandscape = L.divIcon({ html: '<i class="mapIconCls">&#xE020;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'mapIcon' })
    tree1IconLandscapeSelected = L.divIcon({ html: '<i class="mapIconCls">&#xE021;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'mapIcon' })

    // Hollow section context
    // Invisible
    tree1IconSecContext = L.divIcon({ html: '<i class="mapIconCls">&#xE000;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'mapIcon' })
    tree2IconSecContext = L.divIcon({ html: '<i class="mapIconCls">&#xE001;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'mapIcon' })
    massIconSecContext = L.divIcon({ html: '<i class="mapIconCls">&#xE002;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'mapIcon' })
    iconSecContext = {tree1: this.tree1IconSecContext, tree2: this.tree2IconSecContext, mass: this.massIconSecContext}; // section context


    // What plants normally look like
    // Regular 56b0Green: #56b033 75% alpha
    tree1IconResults = L.divIcon({ html: '<i class="mapIconCls">&#xE003;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'mapIcon' })
    tree2IconResults = L.divIcon({ html: '<i class="mapIconCls">&#xE004;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'mapIcon' })
    massIconResults = L.divIcon({ html: '<i class="mapIconCls">&#xE005;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'mapIcon' })
    iconResults = {tree1: this.tree1IconResults, tree2: this.tree2IconResults, mass: this.massIconResults}; // regular icons
    // Clones Purple: #b898d0 75% alpha
    tree1IconClone = L.divIcon({ html: '<i class="mapIconCls">&#xE009;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    tree2IconClone = L.divIcon({ html: '<i class="mapIconCls">&#xE00A;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    massIconClone = L.divIcon({ html: '<i class="mapIconCls">&#xE00B;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    iconClones = {tree1: this.tree1IconClone, tree2: this.tree2IconClone, mass: this.massIconClone}; // clone icons
    basicIcons = {results: this.iconResults, clones: this.iconClones, section_context: this.iconSecContext}
    // basicIcons = {results: this.iconResults, clones: this.iconClones, do_map_section: this.iconResults, section_context: this.iconSecContext}

    // What it looks like when not stocktaked for a medium time (6 months)
    // Tan: #fdae61 75% alpha
    tree1IconStocktake = L.divIcon({ html: '<i class="mapIconCls">&#xE00F;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    tree2IconStocktake = L.divIcon({ html: '<i class="mapIconCls">&#xE010;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    massIconStocktake = L.divIcon({ html: '<i class="mapIconCls">&#xE011;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    iconStocktake = {tree1: this.tree1IconStocktake, tree2: this.tree2IconStocktake, mass: this.massIconStocktake}; // stock icons 6 month
    stocktakeIcons = {results: this.iconStocktake, clones: this.iconClones, section_context: this.iconSecContext}
    // stocktakeIcons = {results: this.iconStocktake, clones: this.iconClones, do_map_section: this.iconResults, section_context: this.iconSecContext}

    // What it looks like when not stocktaked for a long time (3 years)
    // Red: #d7191c 75% alpha
    tree1IconStocktakeLong = L.divIcon({ html: '<i class="mapIconCls">&#xE012;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    tree2IconStocktakeLong = L.divIcon({ html: '<i class="mapIconCls">&#xE013;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    massIconStocktakeLong = L.divIcon({ html: '<i class="mapIconCls">&#xE014;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    iconStocktakeLong = {tree1: this.tree1IconStocktakeLong, tree2: this.tree2IconStocktakeLong, mass: this.massIconStocktakeLong}; // stock icons 6 month
    stocktakeIconsLong = {results: this.iconStocktakeLong, clones: this.iconClones, section_context: this.iconSecContext}
    // stocktakeIconsLong = {results: this.iconStocktakeLong, clones: this.iconClones, do_map_section: this.iconResults, section_context: this.iconSecContext}

    // What it looks like when no tree assessment for a medium time (6 months)
    // Tan: #fdae61 75% alpha
    tree1IconTreeAssessment = L.divIcon({ html: '<i class="mapIconCls">&#xE00F;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    tree2IconTreeAssessment = L.divIcon({ html: '<i class="mapIconCls">&#xE010;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    massIconTreeAssessment = L.divIcon({ html: '<i class="mapIconCls">&#xE011;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    iconTreeAssessment = {tree1: this.tree1IconTreeAssessment, tree2: this.tree2IconTreeAssessment, mass: this.massIconTreeAssessment}; // stock icons 6 month
    treeAssessmentIcons = {results: this.iconTreeAssessment, clones: this.iconClones, section_context: this.iconSecContext}

    // What it looks like when no tree assessment for a long time (3 years)
    tree1IconTreeAssessmentLong = L.divIcon({ html: '<i class="mapIconCls">&#xE012;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    tree2IconTreeAssessmentLong = L.divIcon({ html: '<i class="mapIconCls">&#xE013;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    massIconTreeAssessmentLong = L.divIcon({ html: '<i class="mapIconCls">&#xE014;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    iconTreeAssessmentLong = {tree1: this.tree1IconTreeAssessmentLong, tree2: this.tree2IconTreeAssessmentLong, mass: this.massIconTreeAssessmentLong}; // stock icons 6 month
    treeAssessmentIconsLong = {results: this.iconTreeAssessmentLong, clones: this.iconClones, section_context: this.iconSecContext}


    // What it looks like when recently mapped
    // Blue: #1572ce 75% alpha
    tree1IconRm = L.divIcon({html: '<i class="mapIconCls">&#xE00C;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon'})
    tree2IconRm = L.divIcon({html: '<i class="mapIconCls">&#xE00D;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon'})
    massIconRm = L.divIcon({html: '<i class="mapIconCls">&#xE00E;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon'})
    iconsRm = {tree1: this.tree1IconRm, tree2: this.tree2IconRm, mass: this.massIconRm}; // Recently mapped
    recentlyMappedIcons = {results: this.iconsRm, clones: this.iconClones, section_context: this.iconSecContext}
    // recentlyMappedIcons = {results: this.iconsRm, clones: this.iconClones, do_map_section: this.iconResults, section_context: this.iconSecContext}

    // What it looks like when it's the selected plant
    // Yellow: #ffff00 100% alpha
    tree1Iconb = L.divIcon({html: '<i class="mapIconCls">&#xE006;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon'})
    tree2Iconb = L.divIcon({html: '<i class="mapIconCls">&#xE007;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon'})
    massIconb = L.divIcon({html: '<i class="mapIconCls">&#xE008;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon'})
    iconsb = {tree1: this.tree1Iconb, tree2: this.tree2Iconb, mass: this.massIconb}; // selected icons
    selectedIcons = {results: this.iconsb, clones: this.iconsb, section_context: this.iconSecContext}
    // selectedIcons = {results: this.iconsb, clones: this.iconsb, do_map_section: this.iconResults, section_context: this.iconSecContext}

    // What it looks like with various assessment priorities
    // Priority 1
    // Red: #d7191c 75% alpha
    tree1IconP1 = L.divIcon({ html: '<i class="mapIconCls">&#xE012;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    tree2IconP1 = L.divIcon({ html: '<i class="mapIconCls">&#xE013;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    massIconP1 = L.divIcon({ html: '<i class="mapIconCls">&#xE014;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    iconP1 = {tree1: this.tree1IconP1, tree2: this.tree2IconP1, mass: this.massIconP1}; // stock icons 6 month
    p1Icons = {results: this.iconP1, clones: this.iconP1, section_context: this.iconSecContext}
    // Priority 2
    // Tan: #fdae61 75% alpha
    tree1IconP2 = L.divIcon({ html: '<i class="mapIconCls">&#xE00F;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    tree2IconP2 = L.divIcon({ html: '<i class="mapIconCls">&#xE010;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    massIconP2 = L.divIcon({ html: '<i class="mapIconCls">&#xE011;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'myDivIcon' })
    iconP2 = {tree1: this.tree1IconP2, tree2: this.tree2IconP2, mass: this.massIconP2}; // stock icons 6 month
    p2Icons = {results: this.iconP2, clones: this.iconP2, section_context: this.iconSecContext}
    // Priority3
    // Regular 56b0Green: #56b033 75% alpha
    tree1IconP3 = L.divIcon({ html: '<i class="mapIconCls">&#xE003;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'mapIcon' })
    tree2IconP3 = L.divIcon({ html: '<i class="mapIconCls">&#xE004;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'mapIcon' })
    massIconP3 = L.divIcon({ html: '<i class="mapIconCls">&#xE005;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'mapIcon' })
    iconP3 = {tree1: this.tree1IconP3, tree2: this.tree2IconP3, mass: this.massIconP3}; // stock icons 6 month
    p3Icons = {results: this.iconP3, clones: this.iconP3, section_context: this.iconSecContext}

    // Priority Other
    // Regular 56b0Green: #56b033 75% alpha
    tree1IconP0 = L.divIcon({ html: '<i class="mapIconCls">&#xE000;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'mapIcon' })
    tree2IconP0 = L.divIcon({ html: '<i class="mapIconCls">&#xE001;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'mapIcon' })
    massIconP0 = L.divIcon({ html: '<i class="mapIconCls">&#xE002;</i>', iconSize: [20, 20], iconAnchor: [10, 10], className: 'mapIcon' })
    iconP0 = {tree1: this.tree1IconP0, tree2: this.tree2IconP0, mass: this.massIconP0}; // stock icons 6 month
    p0Icons = {results: this.iconP0, clones: this.iconP0, section_context: this.iconSecContext}


    plantLayer = {};
    featureLayerById = {};
    sections: L.GeoJSON;
    // There can be multiple layers per section because some map sections
    // are not contiguous.
    namedSections: any;
    namedLayerGroups: any = {};
    IBRA7Data: any = {};
    jsonData: any = {}
    stocktakeDate: Date;
    stocktakeDateLong: Date;
    treeAssessmentDate: Date;
    treeAssessmentDateLong: Date;

    @Output() sectionClick = new EventEmitter<string>();
    @Output() searchEventEmitter = new EventEmitter<any>();

    constructor(private mapService: MapService,
                private configService: ConfigService,
                private http: HttpClient,
                private componentFactoryResolver: ComponentFactoryResolver,
                private injector: Injector,
                private componentService: ComponentService,
                private livingService: LivingService,
                private snackBar: MatSnackBar,
                private triggerService: TriggerService
    ) {
        const today = new Date();
        this.stocktakeDate = moment().subtract(6, 'months').toDate();
        this.stocktakeDateLong = moment().subtract(36, 'months').toDate();
        this.treeAssessmentDate = moment().subtract(6, 'months').toDate();
        this.treeAssessmentDateLong = moment().subtract(36, 'months').toDate();
        this.clear();
    }

    redrawMap(zoom: boolean, plantPopupClass: Type<any>) {
        console.log('redrawMap');
        const that = this;
        // const layers = this.resetSectionsAllGroups();
        this.removeAllPlantGroups();
        this.jsonData.criteria?.groups?.forEach(function (group) {
            // We create an empty layer even when mapped is not selected, in case you start mapping stuff.
            that.plantLayer[group] = L.layerGroup([]);
            that.featureLayerById[group] = {};
            that.addPlantGroup(group, plantPopupClass);
        });
        // if (zoom) {
        //     this.mapService.fitFeatures(layers, 21);
        // }
    }

    zoom() {
        // const layers = this.findLayersBySections(this.findAllFoundSections());
        // this.mapService.fitFeatures(layers, 21);
    }

    /*
    The default state for the criteria when the app starts
     */
    clear() {
        const that = this;
        Object.keys(that.jsonData).forEach(function(key) { delete that.jsonData[key]; });
        PlantdataService.GROUPS.forEach(function (group) {
            that.jsonData[group] = {plants: {features: []}};
        });
        const c = {};
        c['max'] = 1000;
        c['detail'] = false;
        c['mapGrouped'] = true;
        c['mapped'] = true;
        c['unmapped'] = true;
        c['clones'] = false;
        c['stocktake'] = false;
        c['recentlyMapped'] = false;
        c['recentlyMappedDate'] = moment().subtract(7, 'days').toDate();
        c['groups'] = [PlantdataService.RESULT];
        c['mappedUnmapped'] = [];
        this.jsonData['criteria'] = c;
        this.summariseAll(this.jsonData);
        that.triggerService.redraw.emit(true);
        return c;
    }

    addPlantGroup(group: string, plantPopupClass: Type<any>): L.GeoJSON {
        const that = this;
        if (that.jsonData[group]) {
            // We create an empty layer even when mapped is not selected, in case you start mapping stuff.
            this.plantLayer[group] = L.layerGroup([]);
            this.featureLayerById[group] = {};
            if (that.jsonData[group].plants?.features.length > 0) {
                that.jsonData[group].plants?.features?.forEach(function (feature) {
                    const latlng = new LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
                    const layer = that.createMarker(feature, latlng, plantPopupClass);
                    that.mapNewPlant(layer, feature);
                });
                this.plantLayer[group].addTo(that.mapService.map);
            }
            return this.plantLayer[group];
        }
    }

    getIcon(feature): DivIcon {
        if (!feature) {
            console.log('unknown');
        }
        const icons = this.basicIcons[feature.group];
        return icons.mass;
    }

    getIconSelected(feature): DivIcon {
        // unmappedSelected icon doesn't have an opportunity to get used at this time.
        const icons = this.selectedIcons[feature.group];
        return icons.mass;
    }

    createMarker(feature, latlng, plantPopupClass: Type<any>) {
        const that = this;
        const marker = L.marker(latlng, {
                icon: that.getIcon(feature),
                opacity: 1.0,
                draggable: that.configService?.user?.canStocktake,
                autoPan: true
            }
        );
        marker.feature = feature;
        marker.on('dragend', function (event) {
            const position = event.target.getLatLng();
            that.livingService.moveMarker(feature.properties.item_sit_id, position.lat, position.lng, null, null).subscribe(jsonData => {
                feature.properties.map_date = new Date();
                // Conflicting standards. GeoJSON specifies [ longitude, latitude ] (aka X, Y)
                // whereas leaflet works with [ latitude, longitude ]
                if (!feature.geometryhistory) {
                    feature.geometryhistory = [];
                }
                feature.geometryhistory.push({
                    coordinates: feature.geometry.coordinates,
                    map_action_id: jsonData['map_action_id'],
                    stocktake_action_id: jsonData['stocktake_action_id']
                });
                feature.geometry.coordinates = [position.lng, position.lat];
                const message = jsonData['success'] ? 'successful' : jsonData['message']
                that.snackBar.open(message, 'Map position changed', {duration: 2000});

                const layers: Marker = that.findLayersById(feature.properties.id, feature.group);
                that.redrawIcon(layers, that.getIcon(feature));
            });
        });
        marker.bindPopup(() => that.componentService.createCustomPopup(marker, feature, that.configService?.user?.canStocktake, plantPopupClass, this)).openPopup();
        marker.bindTooltip(feature.properties.label, {className: 'tt', direction: 'right'});
        return marker;
    }

    removePlantGroup(group: string) {
        if (this.plantLayer[group]) {
            this.mapService.removeLayer(this.plantLayer[group]);
            this.plantLayer[group].clearLayers();
            delete this.plantLayer[group];
        }
    }

    removeAllPlantGroups() {
        const that = this;
        PlantdataService.GROUPS.forEach(function (group) {
            that.removePlantGroup(group);
        });
    }

    // setSections(layer: any) {
    //     this.sections = layer;
    //     this.namedSections = this.sectionNames();
    // }

    findLayersById(id: string, group: string): Marker {
        console.log('Finding accession: ' + id);
        if (this.featureLayerById[group]) {
            const layers: Marker = this.featureLayerById[group][id];
            return layers;
        } else {
            console.log('ERROR: trying to find layer by accession when layer not set. ')
            return null;
        }
    };

    // removeAccession(accession: string, group: string): Marker {
    //     console.log('Removing accession: ' + accession);
    //     if (this.plantLayerByAccession[group]) {
    //         const layer: Marker = this.plantLayerByAccession[group][accession];
    //         this.plantLayerByAccession[group].removeLayer(layer);
    //     } else {
    //         console.log('ERROR: trying to find layer by accession when layer not set. ')
    //         return null;
    //     }
    // };

    // findLayersBySection(sectionName: string): any {
    //     if (this.namedSections) {
    //         const layers: any[] = this.namedSections[sectionName];
    //         return layers;
    //     }
    //     return null
    // }
    //
    // setAllSections(style: any, content: any) {
    //     if (this.sections) {
    //         this.sections.eachLayer(function (layer: any) {
    //             layer.setStyle(style);
    //             if (content) {
    //                 layer.bindPopup(content(layer));
    //             }
    //         });
    //     }
    // }
    //
    // findAllFoundSections() {
    //     const that = this;
    //     const rtn = new Set<string>();
    //     this.jsonData.criteria.groups.forEach(function (group) {
    //         that.jsonData.criteria.mappedUnmapped.forEach(function (mUm) {
    //             if (that.jsonData[group] && that.jsonData[group][mUm + 'Sections']) {
    //                 that.jsonData[group][mUm + 'Sections'].forEach(rtn.add, rtn);
    //                 // layers = layers.concat(that.colorSections(that.jsonData[group][mUm + 'Sections'], {
    //                 //     fillColor: PlantdataService.sectionFoundColors[group],
    //                 //     fillOpacity: '1.0'
    //                 // }));
    //             }
    //         });
    //     });
    //     return Array.from(rtn);
    // }

    // allDisplayedSectionsWithGroup(): Array<any> {
    //     const that = this;
    //     let rtn = [];
    //     this.jsonData?.criteria?.groups?.forEach(function (group) {
    //         if (group != 'ntnl' || that?.jsonData?.criteria?.ntnl) {
    //             that.jsonData.criteria.mappedUnmapped.forEach(function (mUm) {
    //                 if (that.jsonData[group] && that.jsonData[group][mUm + 'Sections']) {
    //                     rtn = rtn.concat({ sections: that.jsonData[group][mUm + 'Sections'], group: group });
    //                 }
    //             });
    //         }
    //     });
    //     return rtn;
    // }

    // allDisplayedSections() {
    //     return this.allDisplayedSectionsWithGroup().map(function (f) { return f.section; });
    // }

    // allDisplayedLayers() {
    //     return this.findLayersBySections(this.allDisplayedSections());
    // }

    // fitDisplayed() {
    //     this.mapService.fitFeatures(this.allDisplayedLayers(), 21);
    // }

    // resetSectionsAllGroups() {
    //     const that = this;
    //     this.setAllSections({
    //             fillColor: PlantdataService.sectionDefaultColor,
    //             fillOpacity: '0.2'
    //         },
    //         null
    //     );
    //     let layers: any[] = [];
    //     // this.allDisplayedSections().forEach(function (section) {
    //     this.allDisplayedSectionsWithGroup().map(function (f) {
    //         layers = layers.concat(that.colorSections(f.sections, {
    //             fillColor: PlantdataService.sectionFoundColors[f.group],
    //             fillOpacity: '1.0'
    //         }));
    //
    //     });
    //     // });
    //     // this.jsonData?.criteria?.groups?.forEach(function (group) {
    //     //     that.jsonData.criteria.mappedUnmapped.forEach(function (mUm) {
    //     //         if (that.jsonData[group] && that.jsonData[group][mUm + 'Sections']) {
    //     //             layers = layers.concat(that.colorSections(that.jsonData[group][mUm + 'Sections'], {
    //     //                 fillColor: PlantdataService.sectionFoundColors[group],
    //     //                 fillOpacity: '1.0'
    //     //             }));
    //     //         }
    //     //     });
    //     // });
    //     return layers;
    // }

    // findLayersBySections(sections) {
    //     const that = this;
    //     let layers: any[] = [];
    //     sections.forEach(function (section) {
    //         const sectionLayers = that.findLayersBySection(section);
    //         if (sectionLayers) {
    //             layers = layers.concat(sectionLayers);
    //         }
    //     });
    //     return layers;
    // }

    // colorSections(sections, style: any) {
    //     const that = this;
    //     const layers: any[] = this.findLayersBySections(sections);
    //     this.setStyle(layers, style);
    //     return layers;
    // }
    //
    // highlightSections(sections, group: string) {
    //     const style = {
    //         fillColor: PlantdataService.sectionSelectedColors[group]
    //     };
    //     const that = this;
    //     this.resetSectionsAllGroups();
    //     this.colorSections(sections, style);
    //     const layers: any[] = this.findLayersBySections(sections);
    //     return layers;
    // }

    resetAllPlants() {
        console.log('resetAllPlants');
        const that = this;

        PlantdataService.GROUPS.forEach(function (group) {
            if (that.plantLayer[group]) {
                that.plantLayer[group].eachLayer(function (layer: any) {
                    if (layer.feature) {
                        delete layer.feature.selected;
                        delete layer.feature.clicked;
                        const i = that.getIcon(layer.feature);
                        // Checking before resetting seems to speed it up
                        if (i !== layer.getIcon()) {
                            layer.setIcon(i);
                        }
                        layer.setZIndexOffset(0);
                    }
                });
            }
        });
        console.log('resetAllPlants: end');
    }

    setStyle(layers: any[], style: any) {
        let layer: any;
        if (layers) {
            for (layer of layers) {
                layer.setStyle(style);
            }
        }
    }

    selectPlant(feature): Marker {
        const layers: Marker = this.findLayersById(feature.properties.id, feature.group);
        feature.selected = false;
        if (layers) {
            feature.selected = true;
            this.redrawIcon(layers, this.getIconSelected(feature));
        }
        return layers;
    }

    redrawIcon(marker: Marker, icon: DivIcon) {
        if (marker) {
            marker.setIcon(icon);
            marker.setZIndexOffset(1000);
        }
    }

    loadSectionData() {
        const uri = this.configService.apiHost() + '/assets/IBRA7.json';
        // let obs = this.getData(uri);
        const obs = this.http.get(uri);
        // obs.subscribe(jsonData => {
        //     this.sectionData = jsonData;
        // });
        return obs;
    }

    // makeSectionsUnclickable() {
    //     const that = this;
    //     Object.keys(this.sectionData).forEach(function (section) {
    //         // const section = feature.properties.name;
    //         const layers = that.findLayersBySection(section);
    //         // const feature = that.sectionData[section];
    //         if (layers) {
    //             layers.forEach(function (layer) {
    //                 layer.unbindPopup();
    //                 layer.unbindTooltip();
    //                 layer.off('click');
    //             });
    //         }
    //     });
    // }

    // makeSectionsClickable() {
    //     const that = this;
    //     Object.keys(this.sectionData).forEach(function (section) {
    //         // const section = feature.properties.name;
    //         const layers = that.findLayersBySection(section);
    //         const feature = that.sectionData[section];
    //         if (layers) {
    //             layers.forEach(function (layer) {
    //                 if (feature.theme) {
    //                     const description = '<b>section ' + section + ':</b> ' + feature.name + '<br><b>Theme(s):</b> ' + feature.theme + '<br><b>Purpose:</b> ' + feature.purpose;
    //                     layer.bindPopup(description);
    //                     layer.on('click', event1 => {
    //                         that.sectionClick.emit(section);
    //                     })
    //                     layer.bindTooltip('section ' + section + ':' + feature.name, {className: 'tt', direction: 'right'});
    //                 } else {
    //                     layer.bindPopup('section ' + feature.name);
    //                 }
    //             });
    //         }
    //     });
    // }

    pointIsInPolygon(polygon, coordinate: LatLng) {
        const latLngs = polygon.coordinates[0].map(ll => [ll[1], ll[0]]);
        return classifyPoint(latLngs, [coordinate.lat, coordinate.lng]) <= 0;
    }

    pointIsInLayer(layer, coordinate: LatLng) {
        const that = this;
        if (layer.feature.geometry['type'] === 'Polygon') {
            return this.pointIsInPolygon(layer.feature.geometry, coordinate);
        } else if (layer.feature.geometry['type'] === 'GeometryCollection') {
            return layer.feature.geometry.geometries.find(function (polygon) {
                return that.pointIsInPolygon(polygon, coordinate);
            });
        }
        return false;
    }

    // pointIsInSection(section: string, coordinate: LatLng): boolean {
    //     const that = this;
    //     const layers = that.findLayersBySection(section);
    //     if (layers) {
    //         return layers.find(function (layer) {
    //             return that.pointIsInLayer(layer, coordinate);
    //         });
    //     }
    //     return false;
    // }

    // sectionForPoint(coordinate: LatLng): string {
    //     const that = this;
    //     for (let key of Object.keys(this.namedSections)) {
    //         const layers = that.findLayersBySection(key);
    //         if (layers) {
    //             if (layers.find(function (layer) {
    //                 return that.pointIsInLayer(layer, coordinate);
    //             })) {
    //                 return key;
    //             }
    //         }
    //     }
    //     return null;
    // }

    // private sectionNames(): any {
    //     let layer: any;
    //     const layers: L.Layer[] = this.sections.getLayers();
    //     const layerNameMap: any = {};
    //     for (let i = layers.length - 1; i >= 0; i--) {
    //         layer = layers[i];
    //         // log("*** adding -- " + layer.feature.properties.name);
    //         if (layerNameMap[layer.feature.properties.name]) {
    //             layerNameMap[layer.feature.properties.name].push(layer);
    //         } else {
    //             layerNameMap[layer.feature.properties.name] = [layer];
    //         }
    //     }
    //     return layerNameMap
    // }

    mapNewPlant(layer: Marker, feature) {
        const that = this;
        layer.feature = feature;
        this.plantLayer[feature.group].addLayer(layer);
        const id = layer.feature.properties.id;
        if (this.featureLayerById[feature.group][id]) {
            that.plantLayer[feature.group].removeLayer(this.featureLayerById[feature.group][id]);
        }
        this.featureLayerById[feature.group][id] = layer;
        this.plantLayer[feature.group].addLayer(layer);
    }

    unmapPlant(feature) {
        const that = this;
        const id = feature.properties.id;
        const layer: Marker = this.featureLayerById[feature.group][id];
        that.plantLayer[feature.group].removeLayer(layer);
        delete this.featureLayerById[feature.group][id];
    }

    summarise(data, group: string) {
        data.plants.features.forEach(function (f) {
           f.group = group;
        });
        return data;
    }

    summariseAll(jsonData) {
        const that = this;
        PlantdataService.GROUPS.forEach(function (group) {
            if (jsonData[group]) {
                that.summarise(jsonData[group], group);
            }
        });
    }
}
