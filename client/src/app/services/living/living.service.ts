import {Injectable} from '@angular/core';
import {ConfigService} from '../config/config.service';
import {HttpClient} from '@angular/common/http';
import {LatLng} from 'leaflet';
import {MatSnackBar} from '@angular/material/snack-bar';
import {URLEncoder} from "../../util/URLEncoder";

@Injectable({
    providedIn: 'root'
})
export class LivingService {

    constructor(private http: HttpClient,
                private snackBar: MatSnackBar,
                private config: ConfigService) {
    }

    stocktake(item_sit_id: bigint, quantity: bigint, notes: string) {
        console.log('stocktake service');
        let ue: URLEncoder = new URLEncoder(this.config.apiHost(), '/living/stocktake/' + item_sit_id);
        ue.addArg('quantity', quantity);
        ue.addArg('notes', notes);
        // const uri = this.config.apiHost() + '/living/stocktake/' + item_sit_id + '?quantity=' + quantity + '&notes=' + (notes ? notes : '');
        const obs = this.http.get(ue.make());
        return obs;
    }

    updateNtnlStatus(ntnlId: bigint, status: string) {
        console.log('updateNtnlStatus service');
        let ue: URLEncoder = new URLEncoder(this.config.apiHost(), '/living/updateNtnlStatus/' + ntnlId);
        ue.addArg('status', status);
        const obs = this.http.get(ue.make());
        return obs;
    }

    newNtnl(name: string, notes: string, lat, lng) {
        console.log('stocktake service');

        const ue: URLEncoder = new URLEncoder(this.config.apiHost(), '/living/newNtnl');
        ue.addArg('name', name);
        ue.addArg('notes', notes);
        ue.addArg('lat', lat);
        ue.addArg('lng', lng);
        const obs = this.http.get(ue.make());
        return obs;
    }

    moveMarker(item_sit_id: bigint, lat, lng, oldMapActionId, oldStocktakeActionId) {
        console.log('moveMarker');

        let ue: URLEncoder = new URLEncoder(this.config.apiHost(), '/living/moveMarker/' + item_sit_id);
        ue.addArg('lat', lat);
        ue.addArg('lng', lng);
        ue.addArg('oldMapActionId', oldMapActionId);
        ue.addArg('oldStocktakeActionId', oldStocktakeActionId)
        // const uri = this.config.apiHost() + '/living/moveMarker/' + item_sit_id + '?lat=' + lat + '&lng=' + lng + '&oldMapActionId=' + oldMapActionId + '&oldStocktakeActionId=' + oldStocktakeActionId;
        const obs = this.http.get(ue.make());
        return obs;
    }

    unmap(item_sit_id: bigint) {
        console.log('unmap');

        const uri = this.config.apiHost() + '/living/unmap/' + item_sit_id;
        const obs = this.http.get(uri)
        return obs;
    }

    requestTag(item_sit_id: bigint) {
        console.log('requestTag');

        const uri = this.config.apiHost() + '/living/requestTag/' + item_sit_id;
        const obs = this.http.get(uri)
        return obs;
    }

    clones(item_sit_id: bigint) {
        console.log('clones');

        const uri = this.config.apiHost() + '/living/clones/' + item_sit_id;
        const obs = this.http.get(uri)
        return obs;
    }
}
