import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectZonePageRoutingModule } from './select-zone-routing.module';

import { SelectZonePage } from './select-zone.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectZonePage,
    SelectZonePageRoutingModule
  ],

})
export class SelectZonePageModule {}
