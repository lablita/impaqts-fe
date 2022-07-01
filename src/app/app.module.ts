import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localeIt from '@angular/common/locales/it';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
import { AllWordsOrLemmasComponent } from './all-words-or-lemmas/all-words-or-lemmas.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CollocationOptionsPanelComponent } from './collocation-options-panel/collocation-options-panel.component';
import { CollocationTableComponent } from './collocation-table/collocation-table.component';
import { ConcordanceTableComponent } from './concordance-table/concordance-table.component';
import { ContextConcordanceComponent } from './context-concordance/context-concordance.component';
import { CopyrightComponent } from './copyright/copyright.component';
import { CorpusInfoComponent } from './corpus-info/corpus-info.component';
import { CreditsComponent } from './credits/credits.component';
import { RoleDirective } from './directives/role.directive';
import { DispalyPanelOptionsComponent } from './dispaly-panel-options/dispaly-panel-options.component';
import { FilterOptionsPanelComponent } from './filter-options-panel/filter-options-panel.component';
import { FrequencyOptionsPanelComponent } from './frequency-options-panel/frequency-options-panel.component';
import { KwicLinesViewComponent } from './kwic-lines-view/kwic-lines-view.component';
import { MainComponent } from './main/main.component';
import { MenuComponent } from './menu/menu.component';
import { MetadataPanelComponent } from './metadata-panel/metadata-panel.component';
import { PrimeNgModule } from './modules/prime-ng/prime-ng.module';
import { QueriesContainerComponent } from './queries-container/queries-container.component';
import { QueryTagComponent } from './query-tag/query-tag.component';
import { QueryTokenComponent } from './query-token/query-token.component';
import { RightComponent } from './right/right.component';
import { AppInitializerService } from './services/app-initializer.service';
import { SortOptionsPanelComponent } from './sort-options-panel/sort-options-panel.component';
import { TestPaginationComponent } from './test-pagination/test-pagination.component';
import { TopComponent } from './top/top.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { ViewOptionsPanelComponent } from './view-options-panel/view-options-panel.component';
import { VisualQueryComponent } from './visual-query/visual-query.component';
import { WordListOptionsPanelComponent } from './word-list-options-panel/word-list-options-panel.component';
import { FrequencyComponent } from './frequency/frequency.component';

registerLocaleData(localeIt);

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    MenuComponent,
    TopComponent,
    QueriesContainerComponent,
    CorpusInfoComponent,
    AllWordsOrLemmasComponent,
    ViewOptionsPanelComponent,
    WordListOptionsPanelComponent,
    RightComponent,
    SortOptionsPanelComponent,
    FrequencyOptionsPanelComponent,
    MetadataPanelComponent,
    CollocationOptionsPanelComponent,
    FilterOptionsPanelComponent,
    ContextConcordanceComponent,
    CreditsComponent,
    CopyrightComponent,
    VisualQueryComponent,
    QueryTokenComponent,
    QueryTagComponent,
    VideoPlayerComponent,
    RoleDirective,
    KwicLinesViewComponent,
    DispalyPanelOptionsComponent,
    ConcordanceTableComponent,
    CollocationTableComponent,
    TestPaginationComponent,
    FrequencyComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    HttpClientModule,
    YouTubePlayerModule,
    AuthModule.forRoot({
      domain: environment.auth0Domain,
      clientId: environment.auth0ClientId,
      cacheLocation: 'localstorage',
      audience: 'https://impaqts.eu.auth0.com/api/v2/',
      httpInterceptor: {
        allowedList: [
          '/'
        ]
      }
    }),
    FontAwesomeModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadInstallation,
      deps: [AppInitializerService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'it-IT' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function loadInstallation(appInitializerService: AppInitializerService) {
  return () => appInitializerService.loadInstallation();
}
