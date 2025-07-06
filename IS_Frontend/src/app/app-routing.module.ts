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
    path: 'modificar-rol/:id', // ¡Esta es la nueva ruta con parámetro ID!
    loadChildren: () => import('./pages/modificar-rol/modificar-rol.module').then( m => m.ModificarRolPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
