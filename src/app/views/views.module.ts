import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipoPage } from './main/equipo/equipo.page';
import { PerfilPage } from './main/perfil/perfil.page';
import { HomePage } from './main/home/home.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../components/components.module';
import { BuscadorPage } from './main/menu-solicitudes/buscador/buscador.page';
import { SolicitudesPage } from './main/menu-solicitudes/solicitudes/solicitudes.page';
import { AjustesPage } from './main/ajustes/ajustes.page';
import { AuthPage } from './auth/auth.page';
import { RouterModule } from '@angular/router';
import { SignUpPage } from './auth/sign-up/sign-up.page';
import { ForgotPasswordPage } from './auth/forgot-password/forgot-password.page';
import { FiltroProvinciaPipe } from '../pipes/filtro-provincia.pipe';



@NgModule({
  declarations: [
    EquipoPage,
    PerfilPage,
    HomePage,
    BuscadorPage,
    SolicitudesPage,
    AjustesPage,
    AuthPage,
    SignUpPage,
    ForgotPasswordPage,
    FiltroProvinciaPipe

  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class ViewsModule { }
