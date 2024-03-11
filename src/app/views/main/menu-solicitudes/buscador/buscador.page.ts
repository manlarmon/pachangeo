import { Component, Input, OnInit, inject, input } from '@angular/core';
import { Solicitud } from 'src/app/models/solicitud.model';
import { User } from 'src/app/models/user.model';
import { FireBaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FiltroProvinciaPipe } from 'src/app/pipes/filtro-provincia.pipe';


@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.page.html',
  styleUrls: ['./buscador.page.scss'],
})
export class BuscadorPage implements OnInit {

  title: string = "Solicitudes";
  provincias: string[] = [
    'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Barcelona',
    'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ceuta', 'Ciudad Real', 'Córdoba',
    'Cuenca', 'Gerona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Islas Baleares',
    'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas', 'León', 'Lérida', 'Lugo', 'Madrid', 'Málaga',
    'Melilla', 'Murcia', 'Navarra', 'Orense', 'Palencia', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife',
    'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya',
    'Zamora', 'Zaragoza'
  ];
  provinciaSeleccionada: string = '';

  @Input() solicitud: Solicitud;

  firebaseService = inject(FireBaseService);
  utilsService = inject(UtilsService);

  solicitudes: Solicitud[] = [];
  solicitudesFiltradas: any[] = []; // Aquí almacenaremos las solicitudes filtradas


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
    const solicitudesPath = `solicitudes`;
    // Me desuscribo del observable para tener un control de cuando se ejecuta 
    // Para ello guardo el observable en una variable
    let sub = this.firebaseService.getCollectionData(solicitudesPath).subscribe({
      next: (data: any) => {

        // Guardo los datos(objetos solicitud) en la variable solicitudes
        this.solicitudes = data;

        // Filtro las solicitudes 
        // No aparecen las del propio usuario
        // No aparecen las ya aceptadas
        // No aparecen solicitudes de fechas pasadas
        const user = this.user();
        this.solicitudesFiltradas = this.solicitudes.filter(solicitud => solicitud.userIdOwner != user.userId && !solicitud.isAccepted && new Date(solicitud.dateTime) >= new Date());
        console.log(this.solicitudesFiltradas);
        // Me desuscribo del observable
        sub.unsubscribe();
      }
    })
  }

  aceptarSolicitud(solicitud?: Solicitud) {
    // Realiza las actualizaciones necesarias en la solicitud
    solicitud.isAccepted = true; // Cambia el estado a ACEPTADA
    solicitud.userIdAccepted = this.user().userId; // Guarda el id del usuario que acepta la solicitud

    let solicitudesPath = `solicitudes/${solicitud.id}`;
    let userOwnPath = `users/${solicitud.userIdOwner}/user-requests/${solicitud.id}`;
    let userAcceptedPath = `users/${solicitud.userIdAccepted}/user-requests`;

    // Actualiza la solicitud
    this.firebaseService.updateDocument(solicitudesPath, solicitud)
      .then(() => {
        // Actualiza la solicitud en el usuario que la ha creado
        this.firebaseService.updateDocument(userOwnPath, solicitud)
          .then(() => {
            // Añade la solicitud en "mis solicitudes" en el usuario que la ha aceptado
            this.firebaseService.addDocument(userAcceptedPath, solicitud)
              .then(() => {
                // Actualiza la solicitud en la coleccion de solicitudes
                this.firebaseService.updateDocument(solicitudesPath, solicitud).then(() => {
                  //toast
                  this.utilsService.presentToast({
                    message: `Solicitud aceptada`,
                    duration: 1200,
                    color: 'success',
                    position: 'middle',
                    icon: 'checkmark-circle-outline'
                  });

                  // Actualiza la lista de solicitudes
                  this.getSolicitudes();
                  window.location.reload();
                })
              })
          })
      })
  }
}
