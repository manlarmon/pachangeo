import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Auth',
    pathMatch: 'full'
  },
  {
    path: 'Inicio',
    loadChildren: () => import('./views/main/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'Equipo',
    loadChildren: () => import('./views/main/equipo/equipo.module').then(m => m.EquipoPageModule)
  },
  {
    path: 'Perfil',
    loadChildren: () => import('./views/main/perfil/perfil.module').then(m => m.PerfilPageModule)
  },
  {
    path: 'Ajustes',
    loadChildren: () => import('./views/main/ajustes/ajustes.module').then(m => m.AjustesPageModule)
  },
  {
    path: 'Solicitudes',
    loadChildren: () => import('./views/main/solicitudes/solicitudes.module').then(m => m.SolicitudesPageModule)
  },
  {
    path: 'Buscador',
    loadChildren: () => import('./views/main/buscador/buscador.module').then(m => m.BuscadorPageModule)
  },
  {
    path: 'Auth',
    loadChildren: () => import('./views/auth/auth.module').then(m => m.AuthPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./views/main/main.module').then(m => m.MainPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./views/main/main.module').then(m => m.MainPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
