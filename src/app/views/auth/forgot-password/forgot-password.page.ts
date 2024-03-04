import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FireBaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  logoPrincipal = 'assets/icon/logo-principal.jpg';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  })

  _firebaseService = inject(FireBaseService);
  _utilsService = inject(UtilsService);

  ngOnInit() {
  }

  async submit() {
    if (this.loginForm.valid) {

      const loading = await this._utilsService.loading();
      await loading.present();

      this._firebaseService.forgotPasswordEmail(this.loginForm.value.email)
        .then(res => {

          console.log('Email de recuperación enviado');

          this._utilsService.presentToast({
            message: `Email de recuperación enviado`,
            duration: 1500,
            color: 'success',
            position: 'middle',
            icon: 'mail-outline'
          });

          this._utilsService.routerLink('/Auth');
          this.loginForm.reset();

        })

        .catch((error) => {
          console.log(error);
          this._utilsService.presentToast({
            message: 'Error al enviar el email de recuperación',
            duration: 2200,
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
