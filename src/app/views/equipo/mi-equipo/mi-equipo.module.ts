import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiEquipoPageRoutingModule } from './mi-equipo-routing.module';

import { MiEquipoPage } from './mi-equipo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MiEquipoPageRoutingModule
  ],
  declarations: [MiEquipoPage]
})
export class MiEquipoPageModule {}
