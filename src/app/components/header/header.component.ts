import { Component, Input, OnInit, inject } from '@angular/core';
import { FireBaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() title: string = "";
  @Input() color: string = "";
  @Input() buttonPerfil: boolean;
  @Input() backButton: string;
  @Input() isModal: boolean;

  firebaseService = inject(FireBaseService);
  utilsService = inject(UtilsService);

  public alertButtons = [
    {
      text: 'Cancelar',
      cssClass: 'log-out-cancel',
      handler: () => {
        console.log('Log out canceled');
      },
    },
    {
      text: 'Salir',
      cssClass: 'log-out-confirm',
      handler: () => {
        console.log('Log out confirmed');
        this.signOut()
      },
    },
  ];

  ngOnInit() { }

  // Cerrar sesión
  async signOut() {
    console.log('Cerrando sesión');
    await this.firebaseService.signOut();
  }

  // Cerrar modal
  dismissModal() {
    this.utilsService.dismissModal();
  }

}
