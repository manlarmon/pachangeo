import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SinEquipoPageRoutingModule } from './sin-equipo-routing.module';

import { SinEquipoPage } from './sin-equipo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SinEquipoPageRoutingModule
  ],
  declarations: [SinEquipoPage]
})
export class SinEquipoPageModule {}
