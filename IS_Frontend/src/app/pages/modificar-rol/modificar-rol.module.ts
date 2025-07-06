import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarRolPageRoutingModule } from './modificar-rol-routing.module';

import { ModificarRolPage } from './modificar-rol.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarRolPage,
    ModificarRolPageRoutingModule
  ],
})
export class ModificarRolPageModule {}
