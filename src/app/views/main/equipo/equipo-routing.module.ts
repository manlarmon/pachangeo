import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EquipoPage } from './equipo.page';

const routes: Routes = [
  {
    path: '',
    component: EquipoPage
  },
  {
    path: 'crear-equipo',
    loadChildren: () => import('./crear-equipo/crear-equipo.module').then(m => m.CrearEquipoPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipoPageRoutingModule { }
