import { Component, OnInit, inject } from '@angular/core';
import { AddUpdateSolicitudesComponent } from 'src/app/components/add-update-solicitudes/add-update-solicitudes.component';
import { Solicitud } from 'src/app/models/solicitud.model';
import { User } from 'src/app/models/user.model';
import { FireBaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.page.html',
  styleUrls: ['./solicitudes.page.scss'],
})
export class SolicitudesPage implements OnInit {

  title: string = "Mis solicitudes"

  firebaseService = inject(FireBaseService);
  utilsService = inject(UtilsService);

  misSolicitudes: Solicitud[] = [];

  ngOnInit() {

  }

  user(): User {
    return this.utilsService.getFromLocalStorage('user');
  }

  // ionViewWillEnter() se ejecuta cada vez que se entra en la vista
  ionViewWillEnter() {
    this.getSolicitudes();
  }


  // Obtener solicitudes (Partidos)
  getSolicitudes() {

    const userOwnPath = `users/${this.user().userId}/user-requests`;


    // Me desuscribo del observable para tener un control de cuando se ejecuta 
    // Para ello guardo el observable en una variable
    let sub = this.firebaseService.getCollectionData(userOwnPath).subscribe({
      next: (data: any) => {
        console.log(data);
        // Guardo los datos(objetos solicitud) en la variable misSolicitudes
        this.misSolicitudes = data;
        // Me desuscribo del observable 
        sub.unsubscribe();
      }
    })
  }

  // Agregar o actualizar Solicitud (Partido)
  async addOrEditSolicitud() {
    this.utilsService.presentModal({
      component: AddUpdateSolicitudesComponent,
      cssClass: 'custom-add-update-modal',
    })
  }


}
