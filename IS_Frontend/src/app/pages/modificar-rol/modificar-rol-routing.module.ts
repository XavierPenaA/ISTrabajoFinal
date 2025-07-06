import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarRolPage } from './modificar-rol.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarRolPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarRolPageRoutingModule {}
