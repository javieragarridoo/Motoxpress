import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Order } from 'src/app/models/order.model';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import db from 'src/environments/configfb';



@Injectable({
  providedIn: 'root'
})
export class AllorderService {

  uid: string;

  private _orders = new BehaviorSubject<Order[]>([]);

  get orders() {
    return this._orders.asObservable();
  }

  constructor(private auth: AuthService, private api: ApiService) { }

  getRadius() {
    return this.api.radius;
  }


  async getUid() {
    return this.uid;
  }

  async getOrderRef(uid) {
    uid= await this.getUid();
    return this.api.collection('orders').doc(uid).collection('all');
  }

  async getOrders() {
    try {
      const orders: Order[] = await (await this.getOrderRef(this.uid)).get().pipe(
        switchMap(async(data: any) => {
          let entregaData = await data.docs.map(element => {
            let entrega = element.data();
            entrega.id = element.id;
            entrega.order = JSON.parse(entrega.order);
            entrega.recogida.get()
            .then(rData => {
              entrega.recogida = rData.data();
            })
            .catch(e => { throw(e); });
            return entrega;
          });
          console.log(entregaData);
          return entregaData;
        })
      )
      .toPromise(); 
      console.log('orders', orders);
      this._orders.next(orders);
      return orders;
    } catch(e) {
      throw(e);
    }
  }

  async placeOrder(param) {
    try {
      
      let data = {...param};
      data.order = JSON.stringify(param.order);
      const uid = await this.getUid();
      data.recogida = await this.api.firestore.collection('recogidas').doc(param.recogida_id);
      const orderRef = await (await this.getOrderRef(uid)).add(data);
      const order_id = await orderRef.id;
      console.log('latest order: ', param);
      let currentOrders: Order[] = [];
      currentOrders.push(new Order(
        param.direccion,
        param.recogida,
        param.recogida_id,
        param.order,
        param.total,
        param.grandTotal,
        param.deliveryCharge,
        param.estado,
        param.hora,
        param.paid,    
        order_id,
        param.instrucciones    
      ));
      console.log('latest order: ', currentOrders);
      currentOrders = currentOrders.concat(this._orders.value);
      console.log('orders: ', currentOrders);
      this._orders.next(currentOrders);
      return currentOrders;
    } catch(e) {
      throw(e);
    }
  }

}
