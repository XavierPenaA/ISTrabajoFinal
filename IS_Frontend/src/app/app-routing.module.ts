import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  // Rutas existentes que parecen ser de módulos tradicionales (loadChildren)
  {
    path: 'zonas',
    loadChildren: () => import('./pages/zonas/zonas.module').then( m => m.ZonasPageModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./pages/usuarios/usuarios.module').then( m => m.UsuariosPageModule)
  },
  {
    path: 'usuarios-crear',
    loadChildren: () => import('./pages/usuarios-crear/usuarios-crear.module').then( m => m.UsuariosCrearPageModule)
  },
  {
    path: 'modificar-rol/:id',
    loadChildren: () => import('./pages/modificar-rol/modificar-rol.module').then( m => m.ModificarRolPageModule)
  },
  {
    path: 'registrar-mantenimiento',
    loadChildren: () => import('./pages/registrar-mantenimiento/registrar-mantenimiento.module').then( m => m.RegistrarMantenimientoPageModule)
  },
  {
    path: 'crear-dispositivo',
    loadChildren: () => import('./pages/crear-dispositivo/crear-dispositivo.module').then( m => m.CrearDispositivoPageModule)
  },

  // **********************************************
  // RUTAS DE PROTOCOLOS (TODAS CONFIGURADAS COMO STANDALONE)
  // ¡ELIMINANDO DUPLICADOS Y loadChildren PARA STANDALONE!
  // **********************************************

  {
    path: 'protocolos', // <-- Esta es la ruta base que llevará a ProtocolosMainPage
    loadComponent: () => import('./pages/protocolos/protocolos-main/protocolos-main.page').then( m => m.ProtocolosMainPage)
  },
  {
    path: 'protocolos/select-zone',
    loadComponent: () => import('./pages/protocolos/select-zone/select-zone.page').then( m => m.SelectZonePage)
  },
  {
    path: 'protocolos/select-device/:zoneId',
    loadComponent: () => import('./pages/protocolos/select-device/select-device.page').then( m => m.SelectDevicePage)
  },
  {
    // Solo una ruta para select-sensors, que recibe deviceIds
    path: 'protocolos/select-sensors/:deviceIds',
    loadComponent: () => import('./pages/protocolos/select-sensors/select-sensors.page').then( m => m.SelectSensorsPage)
  },
  {
    // Solo una ruta para select-activators, que recibe deviceIds
    path: 'protocolos/select-activators/:deviceIds',
    loadComponent: () => import('./pages/protocolos/select-activators/select-activators.page').then( m => m.SelectActivatorsPage)
  },
  {
    path: 'estadisticas-y-datos',
    loadChildren: () => import('./pages/estadisticas-y-datos/estadisticas-y-datos.module').then( m => m.EstadisticasYDatosPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
