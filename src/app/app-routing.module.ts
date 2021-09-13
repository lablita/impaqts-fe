import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllWordsOrLemmasComponent } from './all-words-or-lemmas/all-words-or-lemmas.component';
import { ConcordanceComponent } from './concordance/concordance.component';
import { CopyrightComponent } from './copyright/copyright.component';
import { CorpusInfoComponent } from './corpus-info/corpus-info.component';
import { CreditsComponent } from './credits/credits.component';
import { MainComponent } from './main/main.component';
import { QuerypocComponent } from './querypoc/querypoc.component';
import { VisualQueryComponent } from './visual-query/visual-query.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'concordance',
        pathMatch: 'full'
      },
      {
        path: 'poc',
        component: QuerypocComponent
      },
      {
        path: 'concordance',
        component: ConcordanceComponent
      },
      {
        path: 'corpus_info',
        component: CorpusInfoComponent
      },
      {
        path: 'all_words',
        component: AllWordsOrLemmasComponent
      },
      {
        path: 'all_lemmans',
        component: AllWordsOrLemmasComponent
      },
      {
        path: 'credits',
        component: CreditsComponent
      },
      {
        path: 'copyright',
        component: CopyrightComponent
      },
      {
        path: 'visual_query',
        component: VisualQueryComponent
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
