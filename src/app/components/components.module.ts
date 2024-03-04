import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddUpdateSolicitudesComponent } from './add-update-solicitudes/add-update-solicitudes.component';



@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    AddUpdateSolicitudesComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    ReactiveFormsModule,
    

  ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    AddUpdateSolicitudesComponent
  ]
})
export class ComponentsModule { }
