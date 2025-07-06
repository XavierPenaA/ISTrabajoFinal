import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearDispositivoPageRoutingModule } from './crear-dispositivo-routing.module';

import { CrearDispositivoPage } from './crear-dispositivo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearDispositivoPageRoutingModule,
    CrearDispositivoPage,
  ],
})
export class CrearDispositivoPageModule {}
