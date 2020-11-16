import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllWordsOrLemmasComponent } from './all-words-or-lemmas/all-words-or-lemmas.component';
import { ConcordanceComponent } from './concordance/concordance.component';
import { CorpusInfoComponent } from './corpus-info/corpus-info.component';
import { MainComponent } from './main/main.component';
import { MyJobComponent } from './my-job/my-job.component';
import { QuerypocComponent } from './querypoc/querypoc.component';
import { WordListComponent } from './word-list/word-list.component';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      {
        path: 'poc',
        component: QuerypocComponent
      },
      {
        path: 'concordance',
        component: ConcordanceComponent
      },
      {
        path: 'word_list',
        component: WordListComponent
      },
      {
        path: 'corpus_info',
        component: CorpusInfoComponent
      },
      {
        path: 'my_job',
        component: MyJobComponent
      },
      {
        path: 'all_words',
        component: AllWordsOrLemmasComponent
      },
      {
        path: 'all_lemmans',
        component: AllWordsOrLemmasComponent
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
