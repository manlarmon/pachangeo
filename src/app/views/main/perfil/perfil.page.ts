import { Component, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Team } from 'src/app/models/team.model';
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
  firestore = inject(AngularFirestore)

  user = {} as User;

  perfilForm = new FormGroup({
    name: new FormControl('', Validators.required),
    favoriteFootballType: new FormControl(''),
    role: new FormControl('')
  })

  ngOnInit() {
    this.user = this.localUser();
    this.perfilImage = this.user.photo;
    this.perfilForm.value.name = this.user.name;
  }

  localUser() {
    return this.utilsService.getFromLocalStorage('user');
  }

  // Tomar/Seleccionar foto de perfil

  async takePerfilImage() {

    this.user = this.localUser();
    let userPath = `users/${this.user.userId}`;

    const dataUrlImage = (await this.utilsService.takePicture('Foto de perfil')).dataUrl;

    const loading = await this.utilsService.loading();
    await loading.present();

    this.perfilImage = dataUrlImage;

    // Subir imagen a Firebase Storage
    let imagePath = `${this.user.userId}/profile`;
    let photoUrl = await this.firebaseService.uploadImage(imagePath, dataUrlImage);
    this.user.photo = photoUrl;

    // Actualizar el usuario
    this.firebaseService.updateDocument(`users/${this.user.userId}`, this.user).then(async res => {

      this.utilsService.saveInLocalStorage('user', this.user);

      this.utilsService.presentToast({
        message: 'Foto de perfil actualizada',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });


    }).catch((error) => {
      this.utilsService.presentToast({
        message: 'Error al actualizar la foto de perfil',
        duration: 1500,
        color: 'danger',
        position: 'middle',
        icon: 'close-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });


  }

  // Actualizar perfil
  async perfilSubmit() {
    if (this.perfilForm.valid) {
      const loading = await this.utilsService.loading();
      await loading.present();

      this.user = this.localUser();

      if (this.perfilForm.value.name != null || this.perfilForm.value.name != '') {
        this.user.name = this.perfilForm.value.name;
      }
      this.user.favoriteFootballType = this.perfilForm.value.favoriteFootballType;
      this.user.role = this.perfilForm.value.role;

      try {
        await this.firestore.firestore.runTransaction(async (transaction) => {
          this.utilsService.saveInLocalStorage('user', this.user);
          this.firebaseService.updateDocument(`users/${this.user.userId}`, this.user).then(async res => {

            if (this.user.teamId) {
              let team = {} as Team;
              let teamPath = `teams/${this.user.teamId}`;
              console.log('Equipo encontrado', team);
              let teamQuerySnapshot = await this.firestore.collection('teams', ref => ref.where('teamId', '==', this.user.teamId)).get();
              teamQuerySnapshot.forEach(async (doc) => {

                team = doc.docs[0].data() as Team;
                console.log('Equipo encontrado', team);
                if (team != null) {
                  // Buscamos el usuario en el equipo y lo actualizamos
                  // Recorro el array de usuarios del equipo y busco el usuario con el mismo userId
                  const userIndex = team.users.findIndex(u => u.userId === this.user.userId);
                  // Se valida en -1 porque si no lo encuentra devuelve -1
                  if (userIndex !== -1) {
                    team.users[userIndex] = this.user;
                  }
                  this.firebaseService.updateDocument(teamPath, team).then(async res => {
                    console.log('Equipo actualizado');
                    console.log(team.users);
                  }).catch((error) => {
                    console.log('Error al actualizar el equipo', error);
                  });

                }

              });


            }
            this.utilsService.presentToast({
              message: 'Perfil actualizado',
              duration: 1500,
              color: 'success',
              position: 'middle',
              icon: 'checkmark-circle-outline'
            });
          });
        });

      } catch (error) {
        this.utilsService.presentToast({
          message: 'Error al actualizar el perfil',
          duration: 1500,
          color: 'danger',
          position: 'middle',
          icon: 'close-circle-outline'
        });
      } finally {
        loading.dismiss();
      }



    }
  }
}
