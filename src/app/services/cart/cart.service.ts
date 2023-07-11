import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Cart } from 'src/app/interfaces/cart.interface';
// import { Cart } from 'src/app/models/cart.model';
import { Entrega } from 'src/app/models/entrega.model';
import { Order } from 'src/app/models/order.model';
import { Recogida } from 'src/app/models/recogida.model';
import { GlobalService } from '../global/global.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  model = {} as Cart;
  deliveryCharge = 20;
  private _cart = new BehaviorSubject<Cart>(null);

  get cart() {
    return this._cart.asObservable();
  }

  constructor(
    private storage: StorageService, 
    private global: GlobalService,
    private router: Router
  ) { }

  getCart() {
    return this.storage.getStorage('cart');
  }

  async getCartData(val?) {
    let data: any = await this.getCart();
    console.log('data: ', data);
    if(data?.value) {
      this.model = await JSON.parse(data.value);
      console.log('model: ', this.model);
      await this.calculate();
      if(!val) this._cart.next(this.model);
    }
  }

  alertClearCart(index, entregas, data, order?) {
    this.global.showAlert(
      order ? 
      'te gustaria vaciar tu carrito antes de reagendar en esta recogida??' 
      : 
      'tu carrito contiene entregas de distintas direcciones de recogida. te gustaria vaciar el carrito antes de ir a la recogida?',
      'ya hay entregas en el carrito',
      [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            return;
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.clear(index, entregas, data, order);
          }
        }
      ]
    );
  }


  async clear(index, entregas, data, order?) {
    await this.clearCart();
    this.model = {} as Cart;
    if(order) {
      this.orderToCart(order);
    } else this.quantityPlus(index, entregas, data);
  }

  async orderToCart(order: Order) {
    console.log('order: ', order);
    const data = {
      recogida: order.recogida,
      entregas: order.order
    };
    this.model = data;
    await this.calculate();
    this.saveCart();
    console.log('model: ', this.model);
    this._cart.next(this.model);
    this.router.navigate(['/', 'tabs', 'recogidas', order.recogida_id]);
  }

  async quantityPlus(index, entregas?: Entrega[], recogida?: Recogida) {
    try {
      if(entregas) {
        console.log('model: ', this.model);
        this.model.entregas = [...entregas];      
        if(this.model.from) this.model.from = '';
      }
      if(recogida) {
        // this.model.restaurant = {}; 
        this.model.recogida = recogida; 
      }
      console.log('q plus: ', this.model.entregas[index]);
      // this.model.items[index].quantity += 1;
      if(!this.model.entregas[index].cantidad || this.model.entregas[index].cantidad == 0) {
        this.model.entregas[index].cantidad = 1;
      } else {
        this.model.entregas[index].cantidad += 1; // this.model.items[index].quantity = this.model.items[index].quantity + 1
      }
      await this.calculate();
      this._cart.next(this.model);
      return this.model;
    } catch(e) {
      console.log(e);entregas
      throw(e);
    }
  }

  async quantityMinus(index, entregas?: Entrega[]) {
    try {
      if(entregas) {
        console.log('model: ', this.model);
        this.model.entregas = [...entregas];        
        if(this.model.from) this.model.from = '';
      } else {
        this.model.from = 'cart';
      }
      console.log('entrega: ', this.model.entregas[index]);
      if(this.model.entregas[index].cantidad && this.model.entregas[index].cantidad !== 0) {
        this.model.entregas[index].cantidad -= 1; // this.model.items[index].quantity = this.model.items[index].quantity - 1
      } else {
        this.model.entregas[index].cantidad = 0;
      }
      await this.calculate();
      this._cart.next(this.model);
      return this.model;
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  async calculate() {
    let entrega = this.model.entregas.filter(x => x.cantidad > 0);
    this.model.entregas = entrega;
    this.model.totalPrice = 0;
    this.model.totalEntrega = 0;
    this.model.deliveryCharge = 0;
    this.model.grandTotal = 0;
    entrega.forEach(element => {
      this.model.totalEntrega += element.cantidad;
      // this.model.totalPrice += (parseFloat(element.price) * parseFloat(element.quantity));
      this.model.totalPrice += element.precio * element.cantidad;
    });
    this.model.deliveryCharge = this.deliveryCharge;
    // this.model.totalPrice = parseFloat(this.model.totalPrice).toFixed(2);
    // this.model.grandTotal = (parseFloat(this.model.totalPrice) + parseFloat(this.model.deliveryCharge)).toFixed(2);
    this.model.grandTotal = this.model.totalPrice + this.model.deliveryCharge;
    if(this.model.totalEntrega == 0) {
      this.model.totalEntrega = 0;
      this.model.totalPrice = 0;
      this.model.grandTotal = 0;
      await this.clearCart();
      this.model = {} as Cart;
    }
    console.log('cart: ', this.model);
  }

  async clearCart() {
    this.global.showLoader();
    await this.storage.removeStorage('cart');
    this._cart.next(null);
    this.global.hideLoader();
  }

  saveCart(model?) {
    if(model) this.model = model;
    this.storage.setStorage('cart', JSON.stringify(this.model));
    // this._cart.next(this.model);
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  getDistanceFromLatLngInKm(lat1, lng1, lat2, lng2) {
    // 1mile = 1.6 km;
    let radius = 6371; // Radius of earth in km
    let lat = this.deg2rad(lat2 - lat1);
    let lng = this.deg2rad(lng2 - lng1);

    let result = Math.sin(lat/2) * Math.sin(lat/2) +
                  Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
                  Math.sin(lng/2) * Math.sin(lng/2);
                  var c = 2 * Math.atan2(Math.sqrt(result), Math.sqrt(1-result)); 
                  var d = radius * c; // Distance in km
                  console.log(d);
                  return d;
  }

  async checkCart(lat1, lng1, radius) {
    let distancia: number;
    // if(this.model?.restaurant) {
    //   distance = this.getDistanceFromLatLngInKm(
    //     lat1, 
    //     lng1, 
    //     this.model.restaurant.latitude, 
    //     this.model.restaurant.longitude);
    // } else {
    //   await this.getCartData(1);
    //   if(this.model?.restaurant) {
    //     distance = this.getDistanceFromLatLngInKm(
    //       lat1, 
    //       lng1, 
    //       this.model.restaurant.latitude, 
    //       this.model.restaurant.longitude);
    //   }
    // }
    await this.getCartData(1);
    if(this.model?.recogida) {
      distancia = this.getDistanceFromLatLngInKm(
        lat1, 
        lng1, 
        this.model.recogida.g.geopoint.latitude, 
        this.model.recogida.g.geopoint.longitude
        );
        console.log('distancia: ', distancia);
        if(distancia > radius) {
          return true;
        } else return false;
    } else return false;
  }

}
