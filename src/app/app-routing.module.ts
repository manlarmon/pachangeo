import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Inicio',
    pathMatch: 'full'
  },
  {
    path: 'Inicio',
    loadChildren: () => import('./views/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'Equipo',
    loadChildren: () => import('./views/equipo/equipo.module').then(m => m.EquipoPageModule)
  },
  {
    path: 'Perfil',
    loadChildren: () => import('./views/perfil/perfil.module').then(m => m.PerfilPageModule)
  },
  {
    path: 'Ajustes',
    loadChildren: () => import('./views/ajustes/ajustes.module').then(m => m.AjustesPageModule)
  },
  {
    path: 'Solicitudes',
    loadChildren: () => import('./views/solicitudes/solicitudes.module').then(m => m.SolicitudesPageModule)
  },
  {
    path: 'Buscador',
    loadChildren: () => import('./views/buscador/buscador.module').then(m => m.BuscadorPageModule)
  },
  {
    path: 'Login',
    loadChildren: () => import('./views/login/login.module').then(m => m.LoginPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
