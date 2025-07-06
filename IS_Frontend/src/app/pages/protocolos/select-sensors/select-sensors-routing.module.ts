import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectSensorsPage } from './select-sensors.page';

const routes: Routes = [
  {
    path: '',
    component: SelectSensorsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectSensorsPageRoutingModule {}
