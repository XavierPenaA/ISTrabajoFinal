// src/app/app.component.ts

import { Component } from '@angular/core';
// No necesitas importar CommonModule, IonicModule, RouterModule aquí
// porque AppComponent NO es standalone y su módulo (AppModule) ya los importa.

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false, // ¡IMPORTANTE: MANTENER EN FALSE!
})
export class AppComponent {
  // Estas propiedades son cruciales para que tu app.component.html funcione.
  public appPages = [
    { title: 'Inicio', url: '/home', icon: 'home' },
    { title: 'Estadísticas y Datos', url: '/estadisticas-y-datos', icon: 'stats-chart' },
    { title: 'Control de Protocolos', url: '/protocolos', icon: 'git-compare' },
    { title: 'Registrar Mantenimiento', url: '/registrar-mantenimiento', icon: 'build' },
    { title: 'Crear Dispositivo', url: '/crear-dispositivo', icon: 'add-circle' },
  ];

  public adminPages = [
    { title: 'Gestión de Zonas', url: '/zonas', icon: 'map' },
    { title: 'Gestión de Usuarios', url: '/usuarios', icon: 'people' },
  ];

  constructor() {}
}
