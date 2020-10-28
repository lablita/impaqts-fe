import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuerypocComponent } from './querypoc/querypoc.component';

const routes: Routes = [
  {
    path: 'poc',
    component: QuerypocComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
