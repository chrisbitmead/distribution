import {of as observableOf, from, Observable} from 'rxjs';
import {filter, map, take, toArray} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ConfigService} from '../config/config.service';
import {HttpClient} from '@angular/common/http';
import {URLEncoder} from "../../util/URLEncoder";

@Injectable()
export class SearchService {
    private sectionItems: any;
    suggestData: string[] = [];

    constructor(private http: HttpClient,
                private config: ConfigService) {
    }

    private makeSuggestUri(query: string) {
        return this.config.apiHost() + '/plant/search?id=' + encodeURIComponent(query);
    }

    private makeSuggestAllUri() {
        return this.config.apiHost() + '/plant/searchAll';
    }

    private makeFindUri(section: string, determination: string, herbCode: string, accession: string, suffix: string, max: number) {
        let ue: URLEncoder = new URLEncoder(this.config.apiHost(), '/plant/find');
        ue.addArg('section', section);
        ue.addArg('determination', determination);
        ue.addArg('herbCode', herbCode);
        ue.addArg('accessionNumber', accession);
        ue.addArg('suffix', suffix);
        ue.addArg('max', max);
        return  ue.make()
    }



    find(section: string, determination: string, herbCode: string, accessionNumber: string, suffix: string, max: number): Observable<Object> {
        const uri = this.makeFindUri(section, determination, herbCode, accessionNumber, suffix, max);
        console.log(uri)
        const obs = this.http.get(uri);
        return obs;
    }


    suggest(query: string) {
        if (query === '') {
            return observableOf([]);
        }
        // It takes 10 seconds or so to slurp into memory all the names
        // from the server and process them. So until that happens we
        // have a fast track: only get the names we need
        if (this.suggestData.length === 0) {
            const uri = this.makeSuggestUri(query);
            return this.http.get(uri).pipe(
                map(resp => <string[]>resp['data'])
            );
        }
        // However it's still good to slurp all the names into memory
        // because then it's super fast from then on. It's only around 125000 bytes,
        // which isn't much in the scheme of things.
        const re = new RegExp('^' + query.split('%').join('.*'), 'i');
        const data$ = from(this.suggestData);
        return data$.pipe(filter(s => re.test(s))).pipe(take(20), toArray());
    }

    /*
    Slurp every known plant name into the client front end.
     */
    loadSuggestData() {
        console.log('initiate suggestion load');
        const uri = this.makeSuggestAllUri();
        const obs = this.http.get(uri);
        const that = this;
        obs.subscribe(jsonData => {
            that.suggestData = jsonData['data'];
            console.log('suggestData is loaded: ' + this.suggestData.length);
        });
        return obs;
    }
}
