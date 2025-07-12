// src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ¡Asegúrate de que CommonModule esté aquí!
import { RouterModule } from '@angular/router'; // ¡Asegúrate de que RouterModule esté aquí!

@NgModule({
  declarations: [AppComponent], // AppComponent declarado aquí
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule, // Necesario para *ngFor, *ngIf en tus plantillas HTML
    RouterModule // Necesario para routerLink en tus plantillas HTML
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent], // AppComponent es el componente de arranque
})
export class AppModule {}
