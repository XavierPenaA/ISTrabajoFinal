import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarMantenimientoPage } from './registrar-mantenimiento.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarMantenimientoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarMantenimientoPageRoutingModule {}
