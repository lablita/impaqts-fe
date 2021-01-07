import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AllWordsOrLemmasComponent } from './all-words-or-lemmas/all-words-or-lemmas.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CollocationOptionsPanelComponent } from './collocation-options-panel/collocation-options-panel.component';
import { ConcordanceComponent } from './concordance/concordance.component';
import { ContextConcordanceComponent } from './context-concordance/context-concordance.component';
import { CorpusInfoComponent } from './corpus-info/corpus-info.component';
import { FilterOptionsPanelComponent } from './filter-options-panel/filter-options-panel.component';
import { FrequencyOptionsPanelComponent } from './frequency-options-panel/frequency-options-panel.component';
import { MainComponent } from './main/main.component';
import { MenuComponent } from './menu/menu.component';
import { MetadataPanelComponent } from './metadata-panel/metadata-panel.component';
import { PrimeNgModule } from './modules/prime-ng/prime-ng.module';
import { QuerypocComponent } from './querypoc/querypoc.component';
import { RightComponent } from './right/right.component';
import { SortOptionsPanelComponent } from './sort-options-panel/sort-options-panel.component';
import { TopComponent } from './top/top.component';
import { ViewOptionsPanelComponent } from './view-options-panel/view-options-panel.component';
import { WordListOptionsPanelComponent } from './word-list-options-panel/word-list-options-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    QuerypocComponent,
    MainComponent,
    MenuComponent,
    TopComponent,
    ConcordanceComponent,
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
    YouTubePlayerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
