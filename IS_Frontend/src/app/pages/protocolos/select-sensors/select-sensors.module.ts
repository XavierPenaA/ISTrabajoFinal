import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectSensorsPageRoutingModule } from './select-sensors-routing.module';

import { SelectSensorsPage } from './select-sensors.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectSensorsPageRoutingModule,
    SelectSensorsPage
  ],
})
export class SelectSensorsPageModule {}
