import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariosCrearPageRoutingModule } from './usuarios-crear-routing.module';

import { UsuariosCrearPage } from './usuarios-crear.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosCrearPageRoutingModule,
    UsuariosCrearPage
  ],
})
export class UsuariosCrearPageModule {}
