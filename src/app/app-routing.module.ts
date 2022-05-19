import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { AllWordsOrLemmasComponent } from './all-words-or-lemmas/all-words-or-lemmas.component';
import { ConcordanceComponent } from './concordance/concordance.component';
import { CopyrightComponent } from './copyright/copyright.component';
import { CorpusInfoComponent } from './corpus-info/corpus-info.component';
import { CreditsComponent } from './credits/credits.component';
import { HasRoleGuard } from './guards/has-role.guard';
import { MainComponent } from './main/main.component';
import {
  ALL_LEMMANS, ALL_WORDS, CONCORDANCE, COPYRIGHT_ROUTE, CORPUS_INFO, CREDITS_ROUTE, MENU_ALL_LEMMANS,
  MENU_ALL_WORDS, MENU_CONCORDANCE, MENU_COPYRIGHT, MENU_CORPUS_INFO, MENU_CREDITS, MENU_VISUAL_QUERY, VISUAL_QUERY
} from './model/constants';
import { VisualQueryComponent } from './visual-query/visual-query.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: CONCORDANCE,
        pathMatch: 'full'
      },
      {
        path: CONCORDANCE,
        component: ConcordanceComponent,
        canActivate: environment.menuNoRole.findIndex(m => m === MENU_CONCORDANCE) > 0 ? [] : [AuthGuard, HasRoleGuard]
      },
      {
        path: CORPUS_INFO,
        component: CorpusInfoComponent,
        canActivate: environment.menuNoRole.findIndex(m => m === MENU_CORPUS_INFO) > 0 ? [] : [AuthGuard, HasRoleGuard]
      },
      {
        path: ALL_WORDS,
        component: AllWordsOrLemmasComponent,
        canActivate: environment.menuNoRole.findIndex(m => m === MENU_ALL_WORDS) > 0 ? [] : [AuthGuard, HasRoleGuard]
      },
      {
        path: ALL_LEMMANS,
        component: AllWordsOrLemmasComponent,
        canActivate: environment.menuNoRole.findIndex(m => m === MENU_ALL_LEMMANS) > 0 ? [] : [AuthGuard, HasRoleGuard]
      },
      {
        path: CREDITS_ROUTE,
        component: CreditsComponent,
        canActivate: environment.menuNoRole.findIndex(m => m === MENU_CREDITS) > 0 ? [] : [AuthGuard, HasRoleGuard]
      },
      {
        path: COPYRIGHT_ROUTE,
        component: CopyrightComponent,
        canActivate: environment.menuNoRole.findIndex(m => m === MENU_COPYRIGHT) > 0 ? [] : [AuthGuard, HasRoleGuard]
      },
      {
        path: VISUAL_QUERY,
        component: VisualQueryComponent,
        canActivate: environment.menuNoRole.findIndex(m => m === MENU_VISUAL_QUERY) > 0 ? [] : [AuthGuard, HasRoleGuard]
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
