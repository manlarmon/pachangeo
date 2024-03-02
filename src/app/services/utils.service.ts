import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingController = inject(LoadingController);
  toastController = inject(ToastController);
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
}
