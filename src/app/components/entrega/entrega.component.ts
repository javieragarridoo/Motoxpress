import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Entrega } from 'src/app/models/entrega.model';

@Component({
  selector: 'app-entrega',
  templateUrl: './entrega.component.html',
  styleUrls: ['./entrega.component.scss'],
})
export class EntregaComponent implements OnInit {

  fallbackImage = 'assets/imgs/1.jpg';
  @Input() entrega: Entrega;
  @Input() index;
  @Output() add: EventEmitter<Entrega> = new EventEmitter();
  @Output() minus: EventEmitter<Entrega> = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  onImgError(event) {
    event.target.src = this.fallbackImage;
  }

  quantityPlus() {
    this.add.emit(this.entrega);
  }

  quantityMinus() {
    this.minus.emit(this.entrega);
  }

}
