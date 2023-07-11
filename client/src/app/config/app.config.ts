import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class AppConfig {

    private config: Object = null;
    private env: Object = null;
    constructor(private http: HttpClient) {
    }

    /**
     * Use to get the data found in the second file (config file)
     */
    public getConfig(key: any) {
        return this.config[key];
    }

    /**
     * Use to get the data found in the first file (env file)
     */
    public getEnv(key: any) {
        return this.env[key];
    }

    /**
     * This method:
     *   a) Loads "env.json" to get the current working environment (e.g.: 'production', 'development')
     *   b) Loads "config.[env].json" to get all env's variables (e.g.: 'config.development.json')
     */
    public load() {
        return new Promise((resolve, reject) => {
            this.http.get('config/env.json').subscribe((envResponse) => {
                this.env = envResponse;
                let request: any = null;

                if (envResponse["env"] && envResponse["env"].length > 0) {
                    request = this.http.get('config/env.' + envResponse["env"] + '.json');
                } else {
                    console.error('Environment file is not set or env attribute invalid');
                    resolve(true);
                }
                if (request) {
                    request.subscribe((responseData: any) => {
                        this.config = responseData;
                        resolve(true);
                    });
                } else {
                    console.error('Env config file cannot be read');
                    resolve(true);
                }
            });
        });
    }
}
