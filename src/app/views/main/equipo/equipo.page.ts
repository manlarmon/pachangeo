import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Team } from 'src/app/models/team.model';
import { User } from 'src/app/models/user.model';
import { FireBaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.page.html',
  styleUrls: ['./equipo.page.scss'],
})
export class EquipoPage implements OnInit {

  title: string = "Equipo";
  teamImage: string;

  firebaseService = inject(FireBaseService);
  utilsService = inject(UtilsService);
  firestore = inject(AngularFirestore);

  actionSheetController = inject(ActionSheetController);

  user = {} as User;
  team = {} as Team;
  counter: number = 0;
  isTeam: boolean = false;


  teamForm = new FormGroup({
    teamId: new FormControl(''),
    userIdTeamOwner: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    invitationCode: new FormControl('', [Validators.required]),
    favoriteFootballType: new FormControl('', [Validators.required]),
    users: new FormControl([]),
    photo: new FormControl(''),
  });

  joinForm = new FormGroup({
    invitationCode: new FormControl('', [Validators.required]),
  });



  ngOnInit() {

    this.user = this.utilsService.getFromLocalStorage('user');
    this.isTeam = this.hasTeam(this.user);
    console.log(this.isTeam, this.user.teamId);
    if (this.isTeam) {
      this.getTeamById(this.user.teamId);
    }
  }

  //Funcion para ver si tiene equipo
  hasTeam(user: User) {
    if (user.teamId != null && user.teamId != '') {
      return true;
    } else {
      return false;
    }
  }

  //Action Sheet para cancelar la creación de la solicitud
  async cancel() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Descartar creación de Equipo',
      buttons: [
        {
          text: 'Confirmar descarte',
          role: 'cancel',
          handler: () => {
            console.log('Confirm clicked');
            // Add your cancel logic here
            this.utilsService.dismissModal(); // Close the modal
          }
        },
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
      ]
    });
    await actionSheet.present();
  }

  async createSubmit() {
    if (this.teamForm.valid && this.user.userId) {
      const formData = this.teamForm.value;
      const teamPath = `teams`;
      const userTeamOwnerPath = `users/${this.user.userId}`;
      const user = this.user;

      const loading = await this.utilsService.loading();
      await loading.present();

      try {
        await this.firestore.firestore.runTransaction(async (transaction) => {

          //Crea un id para el equipo
          const id = this.firestore.createId();

          formData.userIdTeamOwner = this.user.userId;
          formData.teamId = id;
          user.teamId = id;

          //Actualizamos el teamId del usuario(anteriormente era null)
          this.utilsService.saveInLocalStorage('user', user);
          this.firebaseService.updateDocument(userTeamOwnerPath, user)

          // Añadimos el usuario al equipo
          formData.users.push(user);
          formData.invitationCode = formData.invitationCode + '#' + Math.random().toString(36).substr(2, 5);
          // Agregar el documento al path del equipo
          const teamDocRef = this.firestore.collection(teamPath).doc(id);
          //Añadimos el contenido al path del equipo
          transaction.set(teamDocRef.ref, formData);

          // Se cierra el modal y envia un mensaje de éxito
          this.utilsService.dismissModal({ equipoCreado: true });
          this.utilsService.presentToast({
            message: 'Equipo creado correctamente',
            duration: 2000,
            color: 'success',
            position: 'middle',
            icon: 'checkmark-circle-outline',
          });

          this.teamForm.reset();
        });

      } catch (error) {
        console.log('Error al registrar el equipo', error);
        this.utilsService.presentToast({
          message: 'Error al registrar el equipo',
          duration: 2000,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline',
        });

      } finally {
        loading.dismiss();
        window.location.reload();

      }


    }
  }

  async joinSubmit() {
    if (this.joinForm.valid && this.user.userId) {
      const formData = this.joinForm.value;
      const userPath = `users/${this.user.userId}`;
      const user = this.user;
      let teamDoc = {} as Team;

      const loading = await this.utilsService.loading();
      await loading.present();

      try {
        await this.firestore.firestore.runTransaction(async (transaction) => {


          //Busca el equipo por el código de invitación
          //Snapshot (captura) de la consulta
          const teamQuerySnapshot = await this.firestore.collection('teams', ref => ref.where('invitationCode', '==', formData.invitationCode)).get();
          teamQuerySnapshot.forEach(async (doc) => {
            console.log(doc.docs[0].data());
            teamDoc = doc.docs[0].data() as Team;
          });

          if (teamDoc != null) {
            teamQuerySnapshot.forEach(async (doc) => {
              const teamPath = `teams/${teamDoc.teamId}`;
              //Actualizamos el teamId del usuario
              user.teamId = teamDoc.teamId;
              //Actualizamos el documenteo del usuario
              this.utilsService.saveInLocalStorage('user', user);
              this.firebaseService.updateDocument(userPath, user)
              // Añadimos el usuario al equipo
              teamDoc.users.push(user);
              //Actualizamos el Equipo
              this.firebaseService.updateDocument(teamPath, teamDoc)
              this.utilsService.presentToast({
                message: `Te has unido a ${teamDoc.name} correctamente`,
                duration: 2000,
                color: 'success',
                position: 'middle',
                icon: 'checkmark-circle-outline',
              });
              this.joinForm.reset();
            });
          } else {
            this.utilsService.presentToast({
              message: 'Error al intentar unirse',
              duration: 2000,
              color: 'danger',
              position: 'middle',
              icon: 'alert-circle-outline',
            });
          }

        });

      } catch (error) {
        console.log('Error al registrar el equipo', error);
        this.utilsService.presentToast({
          message: 'Error al registrar el equipo',
          duration: 2000,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline',
        });

      } finally {
        loading.dismiss();
        window.location.reload();

      }

    }

  }

  async getTeamById(teamId: string) {
    const teamPath = `teams/${teamId}`;
    try {
      const teamData = await this.firebaseService.getDocument(teamPath);
      this.team = teamData as Team;
    } catch (error) {
      console.error('Error al obtener el equipo:', error);
      return null;
    }
  }

  async takeTeamPhoto() {

    const dataUrlImage = (await this.utilsService.takePicture('Foto de Equipo')).dataUrl;
    const loading = await this.utilsService.loading();
    await loading.present();

    this.teamImage = dataUrlImage;

    // Subir imagen a Firebase Storage
    let imagePath = `${this.team.teamId}/team`;
    let photoUrl = await this.firebaseService.uploadImage(imagePath, dataUrlImage);
    this.team.photo = photoUrl;

    // Actualizar el equipo
    this.firebaseService.updateDocument(`teams/${this.team.teamId}`, this.team).then(async res => {

      this.utilsService.presentToast({
        message: 'Foto de equipo actualizada',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
      window.location.reload();

    }).catch((error) => {
      this.utilsService.presentToast({
        message: 'Error al actualizar la foto de equipo',
        duration: 1500,
        color: 'danger',
        position: 'middle',
        icon: 'close-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });


  }


}
