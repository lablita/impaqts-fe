import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { AllWordsOrLemmasComponent } from './all-words-or-lemmas/all-words-or-lemmas.component';
import { ConcordanceComponent } from './concordance/concordance.component';
import { CopyrightComponent } from './copyright/copyright.component';
import { CorpusInfoComponent } from './corpus-info/corpus-info.component';
import { CreditsComponent } from './credits/credits.component';
import { HasRoleGuard } from './guards/has-role.guard';
import { LoginComponent } from './login/login/login.component';
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
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'poc',
        component: QuerypocComponent,
        canActivate: [AuthGuard, HasRoleGuard]
      },
      {
        path: 'concordance',
        component: ConcordanceComponent
      },
      {
        path: 'corpus_info',
        component: CorpusInfoComponent,
        canActivate: [AuthGuard, HasRoleGuard]
      },
      {
        path: 'all_words',
        component: AllWordsOrLemmasComponent,
        canActivate: [AuthGuard, HasRoleGuard]
      },
      {
        path: 'all_lemmans',
        component: AllWordsOrLemmasComponent,
        canActivate: [AuthGuard, HasRoleGuard]
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
        component: VisualQueryComponent,
        canActivate: [AuthGuard, HasRoleGuard]
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
