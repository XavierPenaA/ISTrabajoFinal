import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectActivatorsPage } from './select-activators.page';

const routes: Routes = [
  {
    path: '',
    component: SelectActivatorsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectActivatorsPageRoutingModule {}
