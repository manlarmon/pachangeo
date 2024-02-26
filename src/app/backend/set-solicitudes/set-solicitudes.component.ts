import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-set-solicitudes',
  templateUrl: './set-solicitudes.component.html',
  styleUrls: ['./set-solicitudes.component.scss'],
})
export class SetSolicitudesComponent implements OnInit {

  constructor(public menuController: MenuController) { }

  ngOnInit() { }

}
