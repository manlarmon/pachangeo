import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipoPage } from './equipo/equipo.page';
import { PerfilPage } from './perfil/perfil.page';
import { HomePage } from './home/home.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../components/components.module';
import { BuscadorPage } from './buscador/buscador.page';
import { LoginPage } from './login/login.page';
import { SolicitudesPage } from './solicitudes/solicitudes.page';
import { AjustesPage } from './ajustes/ajustes.page';



@NgModule({
  declarations: [
    EquipoPage,
    PerfilPage,
    HomePage,
    BuscadorPage,
    LoginPage,
    SolicitudesPage,
    AjustesPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
  ]
})
export class ViewsModule { }
