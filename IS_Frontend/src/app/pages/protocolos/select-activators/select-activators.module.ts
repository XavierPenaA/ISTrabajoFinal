import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectActivatorsPageRoutingModule } from './select-activators-routing.module';

import { SelectActivatorsPage } from './select-activators.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectActivatorsPageRoutingModule,
    SelectActivatorsPage
  ],
})
export class SelectActivatorsPageModule {}
