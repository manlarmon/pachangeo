import { Component, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FireBaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-solicitudes',
  templateUrl: './add-update-solicitudes.component.html',
  styleUrls: ['./add-update-solicitudes.component.scss'],
})
export class AddUpdateSolicitudesComponent implements OnInit {


  firebaseService = inject(FireBaseService);
  utilsService = inject(UtilsService);
  firestore = inject(AngularFirestore)
  user = {} as User

  matchForm = new FormGroup({
    userIdOwner: new FormControl(this.user.userId, [Validators.required]),
    footballType: new FormControl('', [Validators.required]),
    dateTime: new FormControl(new Date().toISOString(), [Validators.required, this.fechaHoraNoAnteriorValidator()]),
    province: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    mapsLocation: new FormControl('', this.googleMapsLinkValidator()),
    numberExtraPlayers: new FormControl('', [Validators.min(0), Validators.max(10)]),
    pricePerson: new FormControl('', [Validators.min(0)]),
    isAccepted: new FormControl(false),
    userIdAccepted: new FormControl('Id por definir'),
  });

  ngOnInit() {
    const userData: User = this.utilsService.getFromLocalStorage('user');
    if (userData) {
      this.user = userData;
      this.matchForm = new FormGroup({
        userIdOwner: new FormControl(this.user.userId, [Validators.required]),
        footballType: new FormControl('', [Validators.required]),
        dateTime: new FormControl(new Date().toISOString(), [Validators.required, this.fechaHoraNoAnteriorValidator()]),
        province: new FormControl('', [Validators.required]),
        location: new FormControl('', [Validators.required]),
        mapsLocation: new FormControl('', this.googleMapsLinkValidator()),
        numberExtraPlayers: new FormControl('', [Validators.min(0), Validators.max(10)]),
        pricePerson: new FormControl('', [Validators.min(0)]),
        isAccepted: new FormControl(false),
        userIdAccepted: new FormControl('Id por definir'),
      });
    }
  }

  title: string = "Agregar solicitud de partido"
  selectedProvince: string;
  provinces: string[] = [
    'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Barcelona',
    'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ceuta', 'Ciudad Real', 'Córdoba',
    'Cuenca', 'Gerona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Islas Baleares',
    'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas', 'León', 'Lérida', 'Lugo', 'Madrid', 'Málaga',
    'Melilla', 'Murcia', 'Navarra', 'Orense', 'Palencia', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife',
    'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya',
    'Zamora', 'Zaragoza'
  ];





  async submit() {
    if (this.matchForm.valid && this.user && this.user.userId) {
      const formData = this.matchForm.value;
      const userOwnPath = `users/${this.user.userId}/user-requests`;
      const solicitudesPath = `solicitudes`;

      const loading = await this.utilsService.loading();
      await loading.present();



      try {
        //runTransaction() es una operación de lectura y escritura en varios documentos. 
        await this.firestore.firestore.runTransaction(async (transaction) => {

          const id = this.firestore.createId(); // Crea un nuevo ID para el documento de ambas colecciones

          // Agregar el documento al path del usuario propietario
          const userDocRef = this.firestore.collection(userOwnPath).doc(id);
          transaction.set(userDocRef.ref, formData);

          // Agregar el documento al path general de las solicitudes
          const solicitudDocRef = this.firestore.collection(solicitudesPath).doc(id);
          transaction.set(solicitudDocRef.ref, formData);
        });

        // Cerrar el modal y enviar un mensaje de éxito
        this.utilsService.dismissModal({ solicitudRegistrada: true });
        this.utilsService.presentToast({
          message: 'Solicitud de partido registrada',
          duration: 2000,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
        this.matchForm.reset();
      } catch (error) {
        console.log('Error al registrar la solicitud', error);
        this.utilsService.presentToast({
          message: 'Error al registrar la solicitud',
          duration: 2000,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      } finally {
        loading.dismiss();
      }
    }
  }

  //-----------------Validaciones Personalizadas-----------------

  // Validación personalizada de fecha y hora
  fechaHoraNoAnteriorValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const selectedDateTime = new Date(control.value);
      const currentDateTime = new Date();

      console.log(selectedDateTime + "" + currentDateTime);
      if (selectedDateTime <= currentDateTime) {
        console.log('Fecha y hora seleccionadas no válidas');
        return { 'fechaHoraNoAnterior': true };
      }
      return null;
    };
  }

  // Función de validación para verificar que la hora seleccionada es al menos una hora posterior a la hora actual


  // Función de validación para verificar si el enlace es un enlace de Google Maps válido
  googleMapsLinkValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const googleMapsLinkPattern = /^(https?:\/\/(www\.)?google\.((com)|(es))\/maps|https?:\/\/maps)/;
      const isValid = googleMapsLinkPattern.test(control.value);

      return isValid ? null : { 'googleMapsLink': true };
    };
  }


  highlightedDates = (isoString, index) => {
    const currentDate = new Date(); // Obtener la fecha actual
    currentDate.setUTCHours(0, 0, 0, 0); // Ajustar a la medianoche en UTC

    const date = new Date(isoString);

    // Si es la primera fecha y coincide con el día actual, establecer el color de fondo
    if (index === 0 && date.toDateString() === currentDate.toDateString()) {
      return {
        textColor: '#ffffff',
        backgroundColor: '#3880ff', // Color de fondo para el día actual
      };
    }

    // Si no es el día actual o no es la primera fecha, devolver undefined
    return undefined;
  };



}
