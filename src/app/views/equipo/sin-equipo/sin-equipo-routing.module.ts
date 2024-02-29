import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SinEquipoPage } from './sin-equipo.page';

const routes: Routes = [
  {
    path: '',
    component: SinEquipoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SinEquipoPageRoutingModule {}
