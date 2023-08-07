import {Observable} from 'rxjs';
import {ComponentFactoryResolver, EventEmitter, Injectable, Injector, Output} from '@angular/core';
// import * as L from 'leaflet';
declare const L: any;
import 'leaflet';
import * as turf from '@turf/turf';
import 'leaflet.locatecontrol';
// import topojson as topojsonClient from "topojson-client"
import {LatLng} from 'leaflet';
import {FeatureGroup} from 'leaflet';
import * as topojson from 'topojson-client'
import * as topojsonServer from 'topojson-server'
// import {isUndefined} from 'util';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../config/config.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LivingService} from '../living/living.service';
import '@geoman-io/leaflet-geoman-free';
// import {
//     Map,
//     MapOptions,
//     TileLayer,
//     PM,
//     Rectangle,
//     Circle,
//     Marker,
//     Polygon,
//     Polyline
// } from 'leaflet';

L.PM.initialize({ optIn: false });

@Injectable()
export class MapService {
    static  colors = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f']
    static stylelayer = {
        defecto: function (f) {
            return {
                weight: 1,
                opacity: 1,
                color: 'white',
                dashArray: '5,5',
                dashOffset: '0',
                fillOpacity: 0.7,
                fillColor: MapService.colors[f.properties.colorIndex]
            }
        },
        // reset: function (f) {
        //     return {
        //         color: 'red',
        //         opacity: 0.4,
        //         weight: 1
        //     }
        // },
        highlight: function(f) {
            return {
                weight: 5,
                opacity: 1,
                color: 'red',
                dashArray: '',
                fillOpacity: 0.7,
                fillColor: MapService.colors[f.properties.colorIndex]
            }
        },
        selected: function(f) {
            return {
                weight: 5,
                opacity: 1,
                color: 'blue',
                dashArray: '5,5',
                dashOffset: '5',
                fillOpacity: 0.7,
                fillColor: MapService.colors[f.properties.colorIndex]
            }
        }
    }
    @Output() selectedEvent = new EventEmitter<any>();

    public map: L.Map;
    public baseMaps: any;
    private boundingLayer: L.GeoJSON;
    private geojson;
    private resizeableTTLayer: L.GeoJSON;
    public lastZoom: number;
    http: HttpClient;
    configService: ConfigService;
    // These two variables aren't really used, but can be fun for debugging.
    private autoBoundsRect;
    private currentBoundsRect;
    // IBRA7RegionLayer: L.Layer;
    // IBRA7SubregionLayer: L.Layer;
    // IMCRALayer: L.Layer;
    private overlays = new Map<string, L.Layer>();
    public featuresSelected = [];
    // private info;
    // private detailsselected;
    // private arrayBounds = [];

    constructor(http: HttpClient,
                private livingService: LivingService,
                configService: ConfigService) {
        this.http = http;
        this.configService = configService;
        this.baseMaps = {
            OpenStreetMap: new L.TileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="https://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
            })
        };
        // this.info = L.control({
        //     position: 'bottomleft'
        // });
        // this.info.onAdd = function (map) {
        //     this._div = L.DomUtil.create('div', 'info');
        //     this.update();
        //     return this._div;
        // };
        //
        // this.info.update = function (properties) {
        //     this._div.innerHTML =
        //
        //         '<h4>Properties</h4>' + (properties ?
        //             `
        //         Aantal: ${properties.amount}<br>
        //         Gemeente: ${properties.municipality}<br>
        //         Provincie:${properties.province}<br>
        //         Plaats:${properties.town}<br>
        //         Postcode:${properties.zipcode}
        //         ` : 'Hover over a state');
        // };
        // this.detailsselected = L.control();
        // this.detailsselected.onAdd = function (map) {
        //     this._div = L.DomUtil.create('div', 'info scroller');
        //     this.update();
        //     return this._div;
        // };
    }

    makeMap() {
        this.map = new L.Map('map', {
            // drawControl: true,
            zoomControl: false,
            center: new LatLng(-28.0, 134.0),
            zoom: 5,
            // minZoom: 16,
            // maxZoom: 24,
            layers: [this.baseMaps.OpenStreetMap]
        });
        L.Icon.Default.imagePath = '/images';
        L.control.zoom({position: 'topright'}).addTo(this.map);
        L.control.scale().addTo(this.map);
        L.control.locate({position: 'topright'}).addTo(this.map);


        this.map.pm.addControls({
            position: 'topleft',
            drawMarker: false,
            drawCircleMarker: false,
            drawPolyline: false,
            drawRectangle: true,
            drawPolygon: true,
            drawCircle: true,
            drawText: false,
            editMode: false,
            dragMode: false,
            cutPolygon: false,
            removalMode: false,
            rotateMode: false,
            drawControls: true,
            editControls: false,
            customControls: false,
            optionsControls: false,
            pinningOption: false,
            snappingOption: false,
            splitMode: false,
            scaleMode: false
        });
        this.map.on('pm:create',
            (event: {shape: string, layer}) => {
                // (event) => {
                // window.alert('element awas added ' + event.layer.getLatLngs());
                if (!this.geojson) {
                } else if (event.shape === 'Circle') {
                    this.searchInCircle(event.layer.getLatLng(), event.layer.getRadius());
                } else if (event.shape === 'Rectangle' || event.shape === 'Polygon') {
                    this.searchInPolygon(event.layer.getLatLngs());
                }
                this.map.removeLayer(event.layer);
            }); // pm:drawend, pm:drawstart, pm:create

    }

    searchInCircle(centre: LatLng, radius: number): any[] {
        const rtn = [];
        const point = [centre.lng, centre.lat];
        for (const feature of this.geojson.features) {
            if (feature.geometry.type === 'Polygon') {
                for (const coords of feature.geometry.coordinates[0]) {
                    const distance: number = turf.distance(point, coords, { units: 'meters'});
                    if (distance < radius) {
                        rtn.push(feature);
                        this.addLayers(feature, this.setStyleLayer, feature.layer, MapService.stylelayer.selected);
                    }
                }
            } else if (feature.geometry.type === 'MultiPolygon') {
                for (const poly of feature.geometry.coordinates) {
                    for (const coords of poly[0]) {
                        const distance: number = turf.distance(point, coords, { units: 'meters'});
                        if (distance < radius) {
                            rtn.push(feature);
                            this.addLayers(feature, this.setStyleLayer, feature.layer, MapService.stylelayer.selected);
                        }
                    }
                }
            }
        }
        return rtn;
    }


    searchInPolygon(latlngs: LatLng[][]): any[] {
        const rtn = [];
        const multipoly = [];
        latlngs.forEach(function (latlngx: LatLng[]) {
            const poly = [];
            latlngx.forEach(function (latlng: LatLng) {
                poly.push([latlng.lng, latlng.lat]);
            });
            poly.push(poly[0]);
            multipoly.push(poly);
        });
        const poly1 = turf.polygon([multipoly[0]]);
        for (const feature of this.geojson.features) {
            if (feature.geometry.type === 'Polygon') {
                if (!turf.booleanDisjoint(poly1, feature)) {
                    rtn.push(feature);
                    this.addLayers(feature, this.setStyleLayer, feature.layer, MapService.stylelayer.selected);
                    // this.featuresSelected.push({
                    //     publicDisplayName: feature.properties.publicDisplayName,
                    //     feature: feature
                    // });
                }
            } else if (feature.geometry.type === 'MultiPolygon') {
                for (const coords of feature.geometry.coordinates) {
                    const subfeat = {
                        'type': 'Polygon',
                        'coordinates': coords,
                        layer: feature.layer,
                        properties: feature.properties
                    };
                    if (!turf.booleanDisjoint(poly1, subfeat)) {
                        rtn.push(subfeat);
                        this.addLayers(subfeat, this.setStyleLayer, subfeat.layer, MapService.stylelayer.selected);
                        // this.featuresSelected.push({
                        //     publicDisplayName: subfeat.properties.publicDisplayName,
                        //     feature: subfeat
                        // });
                        break;
                    }
                }
            }
        }
        return rtn;
    }

    clearSelected() {
        for (const sel of this.featuresSelected) {
            this.removeLayers(sel.feature, this.setStyleLayer, sel.feature.layer, MapService.stylelayer.defecto);
        }
    }

    public removeLayers(feature, callback, layer, defecto) {
        this.featuresSelected = this.featuresSelected.filter(obj => obj.publicDisplayName !== feature.properties.publicDisplayName);
        callback(layer, defecto);
    }

    public addLayers(feature, callback, layer, highlight) {
        this.featuresSelected = this.featuresSelected.filter(obj => obj.publicDisplayName !== feature.properties.publicDisplayName);
        this.featuresSelected.push({
            publicDisplayName: feature.properties.publicDisplayName,
            feature: feature
        });
        this.featuresSelected = this.featuresSelected.sort((a, b) => a.publicDisplayName.localeCompare(b.publicDisplayName));
        callback(layer, highlight);
    }

    // public addBounds(layer) {
    //     this.arrayBounds.push(layer.getBounds());
    // }
    //
    // public removeBounds(layer) {
    //     this.arrayBounds = this.arrayBounds.filter(bounds => bounds !== layer.getBounds());
    // }

    public checkExistsLayers(feature: { properties: { publicDisplayName: any; }; }): boolean {
        let result = false
        for (let i = 0; i < this.featuresSelected.length; i++) {
            if (this.featuresSelected[i].publicDisplayName === feature.properties.publicDisplayName) {
                result = true;
                break;
            }
        };
        return result
    }

    public zoomToFeature(e) {
        const layer = e.target;
        const feature = e.target.feature;

        if (this.checkExistsLayers(feature)) {
            this.removeLayers(feature, this.setStyleLayer, layer, MapService.stylelayer.defecto)
            // this.removeBounds(layer)

        } else {
            this.addLayers(feature, this.setStyleLayer, layer, MapService.stylelayer.highlight)
            // this.addBounds(layer)
        }
        // this.map.fitBounds(this.arrayBounds);
        // this.detailsselected.update(this.featuresSelected)
    }

    fitFeatures(layers: any[], maxZoom: number, zoomEvenIfWithinBoundsAlready: boolean = true) {
        if (layers.length === 0) {
            return // nothing displayed right now
        }
        const fg = new FeatureGroup(layers);
        const bounds = fg.getBounds();
        const currentBounds = this.map.getBounds()
        if (this.autoBoundsRect) {
            this.autoBoundsRect.removeFrom(this.map)
        }
        if (this.currentBoundsRect) {
            this.currentBoundsRect.removeFrom(this.map)
        }
        // If you uncomment these four lines, easy debugging of what's happening.
        // this.autoBoundsRect = L.rectangle(bounds, {color: 'Red', weight: 2})
        // this.currentBoundsRect = L.rectangle(currentBounds, {color: 'Blue', weight: 2})
        // this.autoBoundsRect.addTo(this.map)
        // this.currentBoundsRect.addTo(this.map)
        if (!bounds.intersects(currentBounds)) { // || zoomEvenIfWithinBoundsAlready) {
            // const bounds = layers[0].getBounds();
            if (bounds.isValid()) {
                console.log('bounds: ' + bounds.toBBoxString());
                this.map.fitBounds(bounds, {padding: new L.Point(50, 50), maxZoom: maxZoom});
                // this.map.fitBounds(bounds, {maxZoom: maxZoom});
                // this.map.fitBounds(bounds);
            }
        } else {
            if (bounds.isValid() && this.map.getZoom() < this.map.getBoundsZoom(bounds) && maxZoom > this.map.getZoom()) {
                this.map.fitBounds(bounds, {padding: new L.Point(50, 50), maxZoom: maxZoom});
            }
        }
    }

    disableMouseEvent(tag: string) {
        const html = L.DomUtil.get(tag);
        if (html) {
            L.DomEvent.disableClickPropagation(html);
            L.DomEvent.on(html, 'mousewheel', L.DomEvent.stopPropagation);
        }
    };

    isUndefined(o: any) {
        return typeof o === 'undefined';
    }

    private extractGeoJson(geojson: any) {
        // let geojson = res.json();
        // if (geojson['type']) {
        //     if (!geojson['features']['type']) {
        //         return geojson['features'];
        if (this.isUndefined(geojson.type)) {
            if (!this.isUndefined(geojson.features.type)) {
                return geojson.features;
            } else {
                console.error('No GeoJSON data');
                return null;
            }
        }
        return geojson;
    }

    public zoomEndHandler() {
        const zoom = this.map.getZoom();
        const tclass = 'zoom_' + zoom;
        if (!this.lastZoom || this.lastZoom !== zoom) {
            // this.resizeableTTLayer.eachLayer(function (layer: any) {
            //     if (layer.getTooltip()) {
            //         const tooltip = layer.getTooltip();
            //         tooltip._container.className = 'leaflet-tooltip leaflet-zoom-animated leaflet-tooltip-center ' + tclass
            //         console.log('size: ' + tooltip._container.className);
            //     }
            // })
        }
        this.lastZoom = zoom;
    }


    // public addMapOverlay(geojsonName: string) {
    //     const that = this;
    //     if (this.overlays.has(geojsonName)) {
    //         this.overlays.get(geojsonName).addTo(this.map);
    //     } else {
    //         return new Promise(function (resolve, reject) {
    //                 that.addLayer(true, false, ConfigService.context() + '/assets/' + geojsonName + '.json', function (feature) {
    //                     return {
    //                         weight: 0.5, // feature.properties['stroke-width'],
    //                         color: '#6e6e6e', // feature.properties.stroke,
    //                         fillColor: '#cebcf5', // feature.properties.fill,
    //                         content: feature.properties.Display_Name
    //                     }
    //                 }, function (feature, layer: L.GeoJSON) {
    //                     // layer.bindPopup(feature.properties.publicDisplayName);
    //                     layer.bindTooltip(feature.properties.publicDisplayName, {
    //                         className: 'zoom_16',
    //                         permanent: true,
    //                         direction: 'center'
    //                     });
    //                 }, null).subscribe(layer => {
    //                     that.overlays.set(geojsonName, layer);
    //                     layer.addTo(that.map);
    //                     resolve('done');
    //                 });
    //             }
    //         );
    //     }
    // }

    public removeMapOverlay(geojsonName: string) {
        if (this.overlays.has(geojsonName)) {
            this.overlays.get(geojsonName).removeFrom(this.map);
        }
    }

    public removeAllMapOverlays() {
        this.overlays.forEach((value: L.Layer, key: string) => {
            this.removeMapOverlay(key)
        });
        this.geojson = null;
    }
    public toggleOnMapOverlay(geojsonName: string, propertyName) {
        this.removeAllMapOverlays();
        this.addMapOverlayTopo(geojsonName, propertyName);
    }

    // public toggleMapOverlay(geojsonName: string, propertyName) {
    //     if (this.overlays.has(geojsonName)) {
    //         if (this.map.hasLayer(this.overlays.get(geojsonName))) {
    //             this.removeMapOverlay(geojsonName);
    //         } else {
    //             this.addMapOverlayTopo(geojsonName, propertyName)
    //         }
    //     } else {
    //         this.addMapOverlayTopo(geojsonName, propertyName)
    //     }
    // }

    addLayerTopo(resizeToolTips: boolean, setMaxBounds: boolean, uri: string, propertyName,
                 styleObject: any, onFeature: any, pointTo: any): Observable<any> {
        const that = this;
        const observable = new Observable(function subscribe(obs) {
            // if (styleObject == null) {
            //     styleObject = function (feature) {
            //         return {
            //             weight: 0.5, // feature.properties['stroke-width'],
            //             color: '#6e6e6e', // feature.properties.stroke,
            //             fillColor: '#c7fceb', // feature.properties.fill,
            //             content: feature.properties.publicDisplayName
            //         };
            //     }
            // }

            that.http.get(uri).subscribe(data => {
                that.geojson = that.extractGeoJson(data);
                const topoJSON = topojsonServer.topology([that.geojson], 1e4);
                const neighbors = topojson.neighbors(topoJSON.objects[0].geometries);
                const featureColors = [];
                that.geojson.features.forEach((feature, index) => {
                    let i = 0;
                    for (;; i++) {
                        let found = false;
                        for (let j = 0; j < neighbors[index].length; j++) {
                            if (featureColors[neighbors[index][j]] === i) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            break;
                        }
                    }
                    featureColors[index] = i;
                    feature.properties.colorIndex = i;
                    feature.properties.publicDisplayName = propertyName(feature);
                });
                const customLayer = L.geoJSON(that.geojson, {
                    style: styleObject,
                    onEachFeature: onFeature,
                    pointToLayer: pointTo
                });
                // customLayer.addTo(that.map);
                if (resizeToolTips) {
                    that.resizeableTTLayer = customLayer;
                }
                if (setMaxBounds) {
                    that.boundingLayer = customLayer;
                    that.map.setMaxBounds(customLayer.getBounds());
                }
                obs.next({ layer: customLayer, geojson: that.geojson, topo: topoJSON, neighbors: neighbors });
                obs.complete();
            });
        });
        return observable;
    }

    // public redraw(b) {
    //     geojson.eachLayer(function (layer) {
    //         if (layer.feature.properties.zipcode == zipcodes[b]) {
    //             selectTypeaheadFeature(layer)
    //         }
    //     })
    // }

    public setStyleLayer(layer, styleSelected) {
        layer.setStyle(styleSelected(layer.feature));
    }

    public highlightFeature(e) {
        const layer = e.target;
        this.setStyleLayer(layer, MapService.stylelayer.highlight);
        // layer.setStyle(MapService.stylelayer.highlight(layer.feature));
        // this.info.update(layer.feature.properties);
    }



    public resetHighlight(e) {
        const layer = e.target;
        const feature = e.target.feature;
        if (this.checkExistsLayers(feature)) {
            this.setStyleLayer(layer, MapService.stylelayer.selected);
        } else {
            this.setStyleLayer(layer, MapService.stylelayer.defecto);
        }
    }

    public addMapOverlayTopo(geojsonName: string, propertyName: string) {
        const that = this;
        // function style (feature) {
        //     return {
        //         weight: 2,
        //         opacity: 1,
        //         color: 'white',
        //         dashArray: '3',
        //         fillOpacity: 0.7,
        //         fillColor: MapService.colors[feature.properties.colorIndex]
        //     }
        // }
        if (this.overlays.has(geojsonName)) {
            this.overlays.get(geojsonName).addTo(this.map);
        } else {
            return new Promise(function (resolve, reject) {
                    that.addLayerTopo(true, false, ConfigService.context() + '/assets/' + geojsonName + '.json', propertyName, MapService.stylelayer.defecto,
                    function (feature, layer: L.GeoJSON) {
                        feature.layer = layer;
                        layer.bindPopup(feature.properties.publicDisplayName);
                        layer.on({
                            mouseover: function(f) {
                                that.highlightFeature(f);
                                this.openPopup();
                            },
                            mouseout: function(f) {
                                that.resetHighlight(f);
                                this.closePopup();
                            },
                            click: function(f) {
                                that.zoomToFeature(f);
                            }
                        });
                    }, null).subscribe(data => {


                        // L.geoJson(data.geojson, {
                        //     style
                        // }).addTo(that.map);

                        that.overlays.set(geojsonName, data.layer);
                        data.layer.addTo(that.map);
                        resolve('done');
                    });
                }
            );
        }
     }
}
