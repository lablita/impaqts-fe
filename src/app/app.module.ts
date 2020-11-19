import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AllWordsOrLemmasComponent } from './all-words-or-lemmas/all-words-or-lemmas.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConcordanceComponent } from './concordance/concordance.component';
import { CorpusInfoComponent } from './corpus-info/corpus-info.component';
import { MainComponent } from './main/main.component';
import { MenuComponent } from './menu/menu.component';
import { PrimeNgModule } from './modules/prime-ng/prime-ng.module';
import { MyJobComponent } from './my-job/my-job.component';
import { QuerypocComponent } from './querypoc/querypoc.component';
import { SaveComponent } from './save/save.component';
import { TopComponent } from './top/top.component';
import { WordListComponent } from './word-list/word-list.component';

@NgModule({
  declarations: [
    AppComponent,
    QuerypocComponent,
    MainComponent,
    MenuComponent,
    TopComponent,
    ConcordanceComponent,
    WordListComponent,
    CorpusInfoComponent,
    MyJobComponent,
    AllWordsOrLemmasComponent,
    SaveComponent
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
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
