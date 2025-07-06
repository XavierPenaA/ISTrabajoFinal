import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearDispositivoPage } from './crear-dispositivo.page';

const routes: Routes = [
  {
    path: '',
    component: CrearDispositivoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearDispositivoPageRoutingModule {}
