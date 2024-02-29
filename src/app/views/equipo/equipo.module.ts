import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EquipoPageRoutingModule } from './equipo-routing.module';
import { EquipoPage } from './equipo.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EquipoPageRoutingModule,
    ComponentsModule,
  ],
  declarations: []
})
export class EquipoPageModule { }
