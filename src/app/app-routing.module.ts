import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Auth',
    pathMatch: 'full'
  },
  {
    path: 'Auth',
    loadChildren: () => import('./views/auth/auth.module').then(m => m.AuthPageModule), canActivate: [NoAuthGuard]
  },

  {
    path: 'Main',
    loadChildren: () => import('./views/main/main.module').then(m => m.MainPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'Inicio',
    loadChildren: () => import('./views/main/home/home.module').then(m => m.HomePageModule), canActivate: [AuthGuard]
  },
  {
    path: 'Equipo',
    loadChildren: () => import('./views/main/equipo/equipo.module').then(m => m.EquipoPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'Perfil',
    loadChildren: () => import('./views/main/perfil/perfil.module').then(m => m.PerfilPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'Ajustes',
    loadChildren: () => import('./views/main/ajustes/ajustes.module').then(m => m.AjustesPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'Solicitudes',
    loadChildren: () => import('./views/main/menu-solicitudes/solicitudes/solicitudes.module').then(m => m.SolicitudesPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'Buscador',
    loadChildren: () => import('./views/main/menu-solicitudes/buscador/buscador.module').then(m => m.BuscadorPageModule), canActivate: [AuthGuard]
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
