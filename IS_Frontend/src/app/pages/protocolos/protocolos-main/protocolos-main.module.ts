import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProtocolosMainPageRoutingModule } from './protocolos-main-routing.module';

import { ProtocolosMainPage } from './protocolos-main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProtocolosMainPageRoutingModule,
    ProtocolosMainPage,
  ],
})
export class ProtocolosMainPageModule {}
