// src/app/pages/protocolos/select-device/select-device.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para directivas como *ngIf, *ngFor
import { FormsModule } from '@angular/forms';     // Necesario para [(ngModel)]

import { IonicModule } from '@ionic/angular';      // Módulos de Ionic

import { SelectDevicePageRoutingModule } from './select-device-routing.module'; // Importa las rutas de este módulo

import { SelectDevicePage } from './select-device.page'; // Importa el componente de la página

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectDevicePage,
    SelectDevicePageRoutingModule // Importa las rutas específicas de esta página
  ],
})
export class SelectDevicePageModule {}
