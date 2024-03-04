import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingController = inject(LoadingController);
  toastController = inject(ToastController);
  modalController = inject(ModalController);
  router = inject(Router);

  // Loading (animación de carga)
  loading() {
    return this.loadingController.create({ spinner: 'bubbles', message: 'Cargando...' })
  }

  // Toast (mensaje emergente)
  async presentToast(options?: ToastOptions) {
    const toast = await this.toastController.create(options);
    toast.present();
  }

  // Navegación a cualquier página disponible
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  //Guarda un valor en el Local (Para guardar los datos del usuario)
  //value puede ser un arreglo, un objeto, un string, key, etcun número, etc.
  //Todo lo que se guarda en localStorage es un string => JSON.stringify(value)
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  //Obtiene un valor del LocalStorage
  //Lo volvemos a convertir a su tipo original => JSON.parse(localStorage.getItem(key))
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }


  //-------------------Modal-------------------

  //Un modal es una ventana emergente que se superpone a la aplicación principal.
  async presentModal(options: ModalOptions) {
    const modal = await this.modalController.create(options);
    await modal.present();

    //Espera a que el modal se cierre y devuelve los datos
    const { data } = await modal.onWillDismiss();
    if (data) return data;

  }

  //Cierra el modal
  //Data es cualquier dato que se quiera enviar al componente que abrió el modal
  dismissModal(data?: any) {
    return this.modalController.dismiss(data);
  }


  //Cámara

  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Seleccionar foto de la galería',
      promptLabelPicture: 'Tomar una foto',
    });

  };


}
