import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllWordsOrLemmasComponent } from './all-words-or-lemmas/all-words-or-lemmas.component';
import { ALL_LEMMAS, ALL_WORDS, COPYRIGHT_ROUTE, CORPUS_INFO, CREDITS_ROUTE, QUERY, VISUAL_QUERY } from './common/routes-constants';
import { CopyrightComponent } from './copyright/copyright.component';
import { CorpusInfoComponent } from './corpus-info/corpus-info.component';
import { CreditsComponent } from './credits/credits.component';
import { EMMACorpGuard } from './guards/emmacorp.guard';
import { MainComponent } from './main/main.component';
import { QueriesContainerComponent } from './queries-container/queries-container.component';
import { TestPaginationComponent } from './test-pagination/test-pagination.component';
import { VisualQueryComponent } from './visual-query/visual-query.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: QUERY,
        pathMatch: 'full'
      },
      {
        path: QUERY,
        component: QueriesContainerComponent,
        canActivate: [EMMACorpGuard]
      },
      {
        path: CORPUS_INFO,
        component: CorpusInfoComponent,
        canActivate: [EMMACorpGuard]
      },
      {
        path: ALL_WORDS,
        component: AllWordsOrLemmasComponent,
        canActivate: [EMMACorpGuard]
      },
      {
        path: ALL_LEMMAS,
        component: AllWordsOrLemmasComponent,
        canActivate: [EMMACorpGuard]
      },
      {
        path: CREDITS_ROUTE,
        component: CreditsComponent,
        canActivate: [EMMACorpGuard]
      },
      {
        path: COPYRIGHT_ROUTE,
        component: CopyrightComponent,
        canActivate: [EMMACorpGuard]
      },
      {
        path: VISUAL_QUERY,
        component: VisualQueryComponent,
        canActivate: [EMMACorpGuard]
      },
      // {
      //   path: FREQUENCY,
      //   component: FrequencyComponent,
      //   canActivate: [EMMACorpGuard]
      // },
      {
        path: 'test',
        component: TestPaginationComponent
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
