import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProtocolosMainPage } from './protocolos-main.page';

const routes: Routes = [
  {
    path: '',
    component: ProtocolosMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProtocolosMainPageRoutingModule {}
