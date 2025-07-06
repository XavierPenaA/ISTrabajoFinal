import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariosCrearPage } from './usuarios-crear.page';

const routes: Routes = [
  {
    path: '',
    component: UsuariosCrearPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosCrearPageRoutingModule {}
