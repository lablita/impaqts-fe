import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { MenuComponent } from './menu/menu.component';
import { QuerypocComponent } from './querypoc/querypoc.component';
import { TopComponent } from './top/top.component';
import { ConcordanceComponent } from './concordance/concordance.component';
import { WordListComponent } from './word-list/word-list.component';
import { CorpusInfoComponent } from './corpus-info/corpus-info.component';
import { MyJobComponent } from './my-job/my-job.component';
import { AllWordsOrLemmasComponent } from './all-words-or-lemmas/all-words-or-lemmas.component';

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
    AllWordsOrLemmasComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PanelMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
