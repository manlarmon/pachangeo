import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FireBaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  logoPrincipal = 'assets/icon/logo-principal.jpg';

  loginForm = new FormGroup({
    userId: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    photo: new FormControl(''),
    favoriteFootballType: new FormControl(''),
    teamId: new FormControl(''),
    role: new FormControl('')
  })

  _firebaseService = inject(FireBaseService);
  _utilsService = inject(UtilsService);

  ngOnInit() {
  }

  async submit() {
    if (this.loginForm.valid) {

      const loading = await this._utilsService.loading();
      await loading.present();

      this._firebaseService.signUp(this.loginForm.value as User)
        .then(async res => {
          await this._firebaseService.updateUser(this.loginForm.value.name);

          let userId = res.user.uid;
          this.loginForm.value.userId = userId;
          await this.setUserInfo(userId);

          console.log('Usuario registrado correctamente');
          console.log(res);

        })
        .catch((error) => {
          console.log('Error al registrar usuario', error);
          this._utilsService.presentToast({
            message: 'Error al registrar usuario',
            duration: 2000,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline'
          });
        })
        .finally(() => {
          loading.dismiss();
        })
    }
  }

  async setUserInfo(userId: string) {
    if (this.loginForm.valid) {

      const loading = await this._utilsService.loading();
      await loading.present();

      let path = `users/${userId}`;
      delete this.loginForm.value.password;

      this._firebaseService.setDocument(path, this.loginForm.value)
        .then(async res => {
          this._utilsService.saveInLocalStorage('user', this.loginForm.value);
          this._utilsService.routerLink('/Inicio');
          this.loginForm.reset();
          this._utilsService.presentToast({
            message: `Bienvenido a PachanGeo`,
            duration: 1200,
            color: 'success',
            position: 'middle',
            icon: 'person-circle-outline'
          });

        })
        .catch((error) => {
          console.log('Error al registrar usuario', error);
          this._utilsService.presentToast({
            message: 'Error al registrar usuario',
            duration: 2000,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline'
          });
        })
        .finally(() => {
          loading.dismiss();
        })
    }
  }


}
