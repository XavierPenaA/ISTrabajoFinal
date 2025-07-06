import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstadisticasYDatosPageRoutingModule } from './estadisticas-y-datos-routing.module';

import { EstadisticasYDatosPage } from './estadisticas-y-datos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstadisticasYDatosPageRoutingModule,
    EstadisticasYDatosPage
  ],
})
export class EstadisticasYDatosPageModule {}
