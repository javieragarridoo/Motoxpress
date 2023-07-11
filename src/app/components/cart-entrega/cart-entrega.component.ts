import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Entrega } from 'src/app/models/entrega.model';

@Component({
  selector: 'app-cart-entrega',
  templateUrl: './cart-entrega.component.html',
  styleUrls: ['./cart-entrega.component.scss'],
})
export class CartEntregaComponent implements OnInit {

  @Input() entrega: Entrega;
  @Input() index: any;
  @Output() add: EventEmitter<any> = new EventEmitter();
  @Output() minus: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  quantityPlus() {
    this.add.emit(this.index);
  }

  quantityMinus() {
    this.minus.emit(this.index);
  }

}
