import {NgModule} from '@angular/core';
import { APP_INITIALIZER } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {IndexComponent} from './index/index.component';
import {AppComponent} from './app.component';
import {rootRouterConfig} from './app.routes';
import {MapService} from './services/map/map.service';
import {NavigatorComponent} from './components/navigator/navigator.component';
import {SearchService} from './services/search/search.service';
import {StatusComponent} from './components/status/status.component';
import {ConfigService} from './services/config/config.service';
import {InfoComponent} from './components/info/info.component';
import {ItemComponent} from './components/item/item.component';
import {SectionComponent} from './components/section/section.component';
import {GroupComponent} from './components/plantGroup/group.component';
import {PlantdataService} from './services/data/plantdata.service';
import {LayoutComponent} from './components/layout/layout.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './services/auth/AuthInterceptor';
import { PlantPopupComponent } from './components/plant-popup/plant-popup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { InfoSetComponent } from './components/info-set/info-set.component';
import {AngularSplitModule} from 'angular-split';
import { ConfirmComponent } from './components/confirm/confirm.component';
import {AppConfig} from "./config/app.config";
import { NewNtnlComponent } from './components/new-ntnl/new-ntnl.component';
import { SituationDirective } from './directives/situation.directive';
import {SafePipeModule} from 'safe-pipe';
import {NgEncodeURIComponentPipeModule, NgPipesModule} from 'angular-pipes';

export function initConfig(config: AppConfig) {
    return () => config.load();
}

@NgModule({
    declarations: [
        AppComponent,
        IndexComponent,
        NavigatorComponent,
        StatusComponent,
        InfoComponent,
        ItemComponent,
        SectionComponent,
        GroupComponent,
        LayoutComponent,
        PlantPopupComponent,
        InfoSetComponent,
        ConfirmComponent,
        NewNtnlComponent,
        SituationDirective
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule, //XXXX
        MatSnackBarModule,
        MatBottomSheetModule,
        RouterModule.forRoot(rootRouterConfig),
        NgbModule,
        BrowserAnimationsModule,
        AngularSplitModule,
        SafePipeModule,
        NgPipesModule,
        NgEncodeURIComponentPipeModule
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        MapService,
        SearchService,
        ConfigService,
        PlantdataService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        AppConfig,
        { provide: APP_INITIALIZER, useFactory: initConfig, deps: [AppConfig], multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
