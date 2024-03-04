import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FireBaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  title: string = "Perfil"
  perfilImage: string;

  firebaseService = inject(FireBaseService);
  utilsService = inject(UtilsService);

  user = {} as User

  ngOnInit() {
    this.user = this.utilsService.getFromLocalStorage('user');
  }

  // Tomar/Seleccionar foto de perfil

  async takePerfilImage() {
    const dataUrlImage = (await this.utilsService.takePicture('Foto de perfil')).dataUrl;
    this.perfilImage = dataUrlImage;

    // Subir imagen a Firebase Storage
    let imagePath = `perfil/${this.user.userId}/${Date.now()}`;
    let imageUrl = await this.firebaseService.uploadImage(dataUrlImage, imagePath);

    
  }



}
