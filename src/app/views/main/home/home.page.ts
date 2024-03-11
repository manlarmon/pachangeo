import { Component, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Solicitud } from 'src/app/models/solicitud.model';
import { User } from 'src/app/models/user.model';
import { FireBaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  title: string = "Inicio";
  misSolicitudes: Solicitud[] = [];
  proximoPartido: Solicitud;
  firebaseService = inject(FireBaseService);
  utilsService = inject(UtilsService);
  firestore = inject(AngularFirestore)

  user = {} as User;

  ngOnInit() {
    this.user = this.localUser();
    this.getSolicitudes();
    this.getProximoPartido();
  }

  localUser() {
    return this.utilsService.getFromLocalStorage('user');
  }


  // Obtener solicitudes (Partidos)
  getSolicitudes() {

    const userOwnPath = `users/${this.user.userId}/user-requests`;


    // Me desuscribo del observable para tener un control de cuando se ejecuta 
    // Para ello guardo el observable en una variable
    let sub = this.firebaseService.getCollectionData(userOwnPath).subscribe({
      next: (data: any) => {
        console.log(data);
        // Guardo los datos(objetos solicitud) en la variable misSolicitudes
        this.misSolicitudes = data;
        this.misSolicitudes.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
        // Me desuscribo del observable 
        sub.unsubscribe();
      }
    })


  }


  getProximoPartido() {
    // Ordena el array misSolicitudes por fecha en orden ascendente
    this.misSolicitudes.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());


    if (this.misSolicitudes.length > 0) {
      // Encuentra la primera solicitud con una fecha mayor a la fecha actual
      this.proximoPartido = this.misSolicitudes.find(solicitud => new Date(solicitud.dateTime) > new Date());
    } else {
      // Maneja el caso cuando no hay partidos próximos
      console.log("No se encontraron partidos próximos");
    }


  }

  highlightedDates: Date[] = [];
  getCurrentDate() {
    const currentDate = new Date();
    const isoDateString = currentDate.toISOString();
    this.highlightedDates = this.misSolicitudes.map(solicitud => new Date(solicitud.dateTime));
    return isoDateString;
  }
}
