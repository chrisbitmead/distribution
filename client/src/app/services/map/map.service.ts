import {Observable} from 'rxjs';
import {ComponentFactoryResolver, Injectable, Injector} from '@angular/core';
import * as L from 'leaflet';
import {LatLng} from 'leaflet';
import 'leaflet.locatecontrol'
// import topojson as topojsonClient from "topojson-client"
import * as topojson from 'topojson-client'
import * as topojsonServer from 'topojson-server'
// import {isUndefined} from 'util';
import {FeatureGroup} from 'leaflet';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../config/config.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LivingService} from '../living/living.service';

@Injectable()
export class MapService {
    public map: L.Map;
    public baseMaps: any;
    private boundingLayer: L.GeoJSON;
    private resizeableTTLayer: L.GeoJSON;
    public lastZoom: number;
    http: HttpClient;
    configService: ConfigService;
    // These two variables aren't really used, but can be fun for debugging.
    private autoBoundsRect
    private currentBoundsRect
    // IBRA7RegionLayer: L.Layer;
    // IBRA7SubregionLayer: L.Layer;
    // IMCRALayer: L.Layer;
    overlays = new Map<string, L.Layer>();

    constructor(http: HttpClient,
                private livingService: LivingService,
                configService: ConfigService) {
        this.http = http;
        this.configService = configService;
        this.baseMaps = {
            OpenStreetMap: new L.TileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="https://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
            })
            // Esri: new L.TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
            //     attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
            // }),
            // CartoDB: new L.TileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
            // })
        };
    }

    makeMap() {
        this.map = new L.Map('map', {
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

        // const miniMapLayer = new L.TileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="https://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
        // });
        const self = this;
        this.map.on('zoomend', function (event) {
            self.zoomEndHandler();
        });

    }



    addLayer(resizeToolTips: boolean, setMaxBounds: boolean, uri: string, styleObject: any, onFeature: any, pointTo: any): Observable<any> {
        const that = this;
        const observable = new Observable(function subscribe(obs) {
            if (styleObject == null) {
                styleObject = function (feature) {
                    return {
                        weight: 0.5, // feature.properties['stroke-width'],
                        color: '#6e6e6e', // feature.properties.stroke,
                        fillColor: '#c7fceb', // feature.properties.fill,
                        content: feature.properties.name
                    };
                }
            }

            that.http.get(uri).subscribe(data => {
                const geojson = that.extractGeoJson(data);
                const customLayer = L.geoJSON(geojson, {
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
                obs.next(customLayer);
                obs.complete();
            });
        });
        return observable;
    }


    removeLayer(layer: L.GeoJSON) {
        layer.eachLayer((l) => {
            this.map.removeLayer(l);
        });
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
            // console.log("BZ: " + this.map.getZoom() + " " + this.map.getBoundsZoom(bounds, true) + "  " + this.map.getBoundsZoom(bounds, false));
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


    public addMapOverlay(geojsonName: string) {
        const that = this;
        if (this.overlays.has(geojsonName)) {
            this.overlays.get(geojsonName).addTo(this.map);
        } else {
            return new Promise(function (resolve, reject) {
                    that.addLayer(true, false, ConfigService.context() + '/assets/' + geojsonName + '.json', function (feature) {
                        return {
                            weight: 0.5, // feature.properties['stroke-width'],
                            color: '#6e6e6e', // feature.properties.stroke,
                            fillColor: '#cebcf5', // feature.properties.fill,
                            content: feature.properties.Display_Name
                        }
                    }, function (feature, layer: L.GeoJSON) {
                        // layer.bindPopup(feature.properties.publicDisplayName);
                        layer.bindTooltip(feature.properties.publicDisplayName, {
                            className: 'zoom_16',
                            permanent: true,
                            direction: 'center'
                        });
                    }, null).subscribe(layer => {
                        that.overlays.set(geojsonName, layer);
                        layer.addTo(that.map);
                        resolve('done');
                    });
                }
            );
        }
    }

    public removeMapOverlay(geojsonName: string) {
        if (this.overlays.has(geojsonName)) {
            this.overlays.get(geojsonName).removeFrom(this.map);
        }
    }

    public removeAllMapOverlays() {
        this.overlays.forEach((value: boolean, key: string) => {
            this.removeMapOverlay(key)
        });
    }
    public toggleOnMapOverlay(geojsonName: string, propertyName) {
        this.removeAllMapOverlays();
        this.addMapOverlayTopo(geojsonName, propertyName);
    }

    public toggleMapOverlay(geojsonName: string, propertyName) {
        if (this.overlays.has(geojsonName)) {
            if (this.map.hasLayer(this.overlays.get(geojsonName))) {
                this.removeMapOverlay(geojsonName);
            } else {
                this.addMapOverlayTopo(geojsonName, propertyName)
            }
        } else {
            this.addMapOverlayTopo(geojsonName, propertyName)
        }
    }

    addLayerTopo(resizeToolTips: boolean, setMaxBounds: boolean, uri: string, propertyName, styleObject: any, onFeature: any, pointTo: any): Observable<any> {
        const that = this;
        const observable = new Observable(function subscribe(obs) {
            if (styleObject == null) {
                styleObject = function (feature) {
                    return {
                        weight: 0.5, // feature.properties['stroke-width'],
                        color: '#6e6e6e', // feature.properties.stroke,
                        fillColor: '#c7fceb', // feature.properties.fill,
                        content: feature.properties.publicDisplayName
                    };
                }
            }

            that.http.get(uri).subscribe(data => {
                const geojson = that.extractGeoJson(data);
                const topoJSON = topojsonServer.topology([geojson], 1e4);
                const neighbors = topojson.neighbors(topoJSON.objects[0].geometries);
                const featureColors = [];
                geojson.features.forEach((feature, index) => {
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
                const customLayer = L.geoJSON(geojson, {
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
                obs.next({ layer: customLayer, geojson: geojson, topo: topoJSON, neighbors: neighbors });
                obs.complete();
            });
        });
        return observable;
    }

    public addMapOverlayTopo(geojsonName: string, propertyName: string) {
        const that = this;
        const colors = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f']
        function style (feature) {
            return {
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7,
                fillColor: colors[feature.properties.colorIndex]
            }
        }
        if (this.overlays.has(geojsonName)) {
            this.overlays.get(geojsonName).addTo(this.map);
        } else {
            return new Promise(function (resolve, reject) {
                    that.addLayerTopo(true, false, ConfigService.context() + '/assets/' + geojsonName + '.json', propertyName, style,
                    function (feature, layer: L.GeoJSON) {
                        layer.bindPopup(feature.properties.publicDisplayName);
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
