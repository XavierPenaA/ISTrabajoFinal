import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadisticasYDatosPage } from './estadisticas-y-datos.page';

const routes: Routes = [
  {
    path: '',
    component: EstadisticasYDatosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstadisticasYDatosPageRoutingModule {}
