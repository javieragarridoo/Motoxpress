import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Order } from 'src/app/models/order.model';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  uid: string;

  private _orders = new BehaviorSubject<Order[]>([]);

  public rider_id?: string; // Agrega el campo rider_id
  

  get orders() {
    return this._orders.asObservable();
  }

  constructor(private auth: AuthService, private api: ApiService) { }

  getRadius() {
    return this.api.radius;
  }

  async getUid() {
    if(!this.uid) return await this.auth.getId();
    else return this.uid;
  }

  async getOrderRef() {
    this.uid = await this.getUid();
    return this.api.collection('orders').doc(this.uid).collection('all');
  }

  async getOrders() {
    try {
      const orders: Order[] = await (await this.getOrderRef()).get().pipe(
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
      const orderRef = await (await this.getOrderRef()).add(data);
      const order_id = await orderRef.id;
      console.log('Ultimas ordenes: ', param);
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
        uid,
        param.instrucciones    
      ));
      console.log('Ordenes recientes: ', currentOrders);
      currentOrders = currentOrders.concat(this._orders.value);
      console.log('ordenes: ', currentOrders);
      this._orders.next(currentOrders);
      return currentOrders;
    } catch(e) {
      throw(e);
    }
  }

  async asignarRider(orderId: string, riderId: string) {
    try {
      const orderRef = this.api.collection('orders').doc(orderId);
      await orderRef.update({ rider_id: riderId });
  
      // Obtener el nombre del rider a partir del riderId
      const riderData = await this.api.collection('users').doc(riderId).get().toPromise();
      const riderName = (riderData.data() as { name: string })?.name;
  
      // Actualizar el nombre del rider en la orden correspondiente
      const orders = this._orders.value;
      const orderIndex = orders.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        orders[orderIndex].rider = riderName;
        this._orders.next(orders);
      }
    } catch (error) {
      throw error;
    }
  }

}
