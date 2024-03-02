import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FireBaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  logoPrincipal = 'assets/icon/logo-principal.jpg';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  })

  _firebaseService = inject(FireBaseService);
  _utilsService = inject(UtilsService);

  ngOnInit() {
  }

  async submit() {
    if (this.loginForm.valid) {

      const loading = await this._utilsService.loading();
      await loading.present();

      this._firebaseService.signIn(this.loginForm.value as User)
        .then(res => {
          console.log(res);
          console.log('Usuario logeado');
        })
        .catch((error) => {
          console.log('Error al logear usuario', error);
          this._utilsService.presentToast({
            message: 'Error al logear usuario',
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
