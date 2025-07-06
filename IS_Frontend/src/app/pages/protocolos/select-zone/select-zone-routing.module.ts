import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectZonePage } from './select-zone.page';

const routes: Routes = [
  {
    path: '',
    component: SelectZonePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectZonePageRoutingModule {}
