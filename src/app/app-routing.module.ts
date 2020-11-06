import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { QuerypocComponent } from './querypoc/querypoc.component';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      {
        path: 'poc',
        component: QuerypocComponent
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
