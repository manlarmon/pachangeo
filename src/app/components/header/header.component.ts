import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() title: string = "";
  @Input() color: string = "";

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
      },
    },
  ];


  constructor() { }

  ngOnInit() { }


}
