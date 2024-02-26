import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipoPage } from './equipo/equipo.page';
import { PerfilPage } from './perfil/perfil.page';
import { HomePage } from './home/home.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../components/components.module';
import { PerfilPageRoutingModule } from './perfil/perfil-routing.module';



@NgModule({
  declarations: [
    EquipoPage,
    PerfilPage,
    HomePage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
  ]
})
export class ViewsModule { }
