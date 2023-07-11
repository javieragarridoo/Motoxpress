import { Component, OnInit, Input } from '@angular/core';
import { Recogida } from 'src/app/models/recogida.model';

@Component({
  selector: 'app-recogida-detalle',
  templateUrl: './recogida-detalle.component.html',
  styleUrls: ['./recogida-detalle.component.scss'],
})
export class RecogidaDetalleComponent implements OnInit {

  @Input() data: Recogida;
  @Input() isLoading;

  constructor() { }

  ngOnInit() {}

  getSector(sector) {
    return sector.join(', ');
  }

}
