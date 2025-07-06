import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarMantenimientoPageRoutingModule } from './registrar-mantenimiento-routing.module';

import { RegistrarMantenimientoPage } from './registrar-mantenimiento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarMantenimientoPage,
    RegistrarMantenimientoPageRoutingModule
  ],
})
export class RegistrarMantenimientoPageModule {}
