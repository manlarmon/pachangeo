import { Pipe, PipeTransform } from '@angular/core';
import { Solicitud } from '../models/solicitud.model';

@Pipe({
  name: 'filtroProvincia'
})
export class FiltroProvinciaPipe implements PipeTransform {
  transform(solicitudes: Solicitud[], provincia: string): Solicitud[] {
    if (!solicitudes || !provincia) {
      return solicitudes;
    }
    return solicitudes.filter(solicitud => solicitud.province === provincia);
  }
}