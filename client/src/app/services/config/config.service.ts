import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {TriggerService} from '../trigger/trigger.service';
import {AppConfig} from "../../config/app.config";

declare var myContext: string;

/*
The way you configure the core parameters for FAP is that in tomcat, in the webapps directory, you have
another directory called config, and in there you have two files, env.json and env.{environment-name}.json.
The reason to do it this way is it's nice not to have to rebuild for different environments, and this being
an Angular (client side app), serving up the config via something in webapps is the obvious way to do it.
So here's an example of an env.json that tells FAP this is the test environment:
{
  "env": "test"
}
And here is an env.test.json that gives the configuration for test:
{
  "server": "Tomcat",
  "apiHost": "/nsldist-server",
  "showInfo": true
}
Don't forget to edit your server.xml file to configure your config directory, as mentioned in the README.
 */
@Injectable()
export class ConfigService {
    user: any
    version = "0.1"

    static context(): string {
        // a way of discovering the machine name without resorting to a config item.
        return window.location.pathname.substring(0, window.location.pathname.indexOf('/', 2));
    }

    constructor(private http: HttpClient,
                private triggerService: TriggerService,
                private envconfig: AppConfig) {
    }

    apiHost(): string {
        return this.envconfig.getConfig("apiHost")
    }

    lcHost(): string {
        return this.envconfig.getConfig("lcHost")
    }

    login(username: string, password: string) {
        const uri = this.apiHost() + '/fapAuth/login';
        console.log(uri)
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        const obs = this.http.post(uri, formData)
        console.log('login()');
        return obs;
    }

    logout() {
        const uri = this.apiHost() + '/fapAuth/logout';
        console.log(uri)
        const obs = this.http.get(uri);
        this.user = null;
        return obs;
    }
}
