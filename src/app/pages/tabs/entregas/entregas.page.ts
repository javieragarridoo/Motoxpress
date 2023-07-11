import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';
// import { take } from 'rxjs/operators';
import { Recogida } from 'src/app/models/recogida.model';
import { Category } from 'src/app/models/category.model';
import { Entrega } from 'src/app/models/entrega.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { Cart } from 'src/app/interfaces/cart.interface';
// import { Cart } from 'src/app/models/cart.model';

@Component({
  selector: 'app-entregas',
  templateUrl: './entregas.page.html',
  styleUrls: ['./entregas.page.scss'],
})
export class EntregasPage implements OnInit, OnDestroy {

  id: any;
  data = {} as Recogida;
  entregas: Entrega[] = [];
  isLoading: boolean;
  cartData = {} as Cart;
  storedData = {} as Cart;
  model = {
    icon: 'receipt-outline',
    title: 'No Available'
  };
  categories: Category[] = [];
  allEntregas: Entrega[] = [];
  cartSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private cartService: CartService,
    private global: GlobalService
  ) { }

  ngOnInit() {    
    const id = this.route.snapshot.paramMap.get('recogidaId');
    console.log('check id: ', id);
    if(!id) {
      this.navCtrl.back();
      return;
    } 
    this.id = id;
    console.log('id: ', this.id);
    // this.route.paramMap.pipe(take(1)).subscribe(paramMap => {
    //   console.log('route data: ', paramMap);
    //   if(!paramMap.has('restaurantId')) {
    //     this.navCtrl.back();
    //     return;
    //   }
    //   this.id = paramMap.get('restaurantId');
    //   console.log('id: ', this.id);
    // });
    this.cartSub = this.cartService.cart.subscribe(cart => {
      console.log('cart entregas: ', cart);
      this.cartData = {} as Cart;
      this.storedData = {} as Cart;
      if(cart && cart?.totalEntrega > 0) {
        this.storedData = cart;
        this.cartData.totalEntrega = this.storedData.totalEntrega;
        this.cartData.totalPrice = this.storedData.totalPrice;
        if(cart?.recogida?.uid === this.id) {
          this.allEntregas.forEach(element => {
            let qty = false;
            cart.entregas.forEach(element2 => {
              if(element.id != element2.id) {
                // if((cart?.from && cart?.from == 'cart') && element?.quantity) element.quantity = 0;
                return;
              }
              element.cantidad = element2.cantidad;
              qty = true;
            });
            console.log(`element check (${qty}): `, element?.nombre + ' | ' + element?.cantidad);
            if(!qty && element?.cantidad) element.cantidad = 0;
          });
          console.log('allEntregas: ', this.allEntregas);
          this.cartData.entregas = this.allEntregas.filter(x => x.cantidad > 0);
        } else {
          this.allEntregas.forEach(element => {            
              element.cantidad = 0;
          });
        }
      } else {
        this.allEntregas.forEach(element => {            
          element.cantidad = 0;
        });
      }
    });    
    this.getEntregas();
  }

  async getEntregas() {
    try {      
      this.isLoading = true;
      this.data = {} as Recogida;
      this.cartData = {} as Cart;
      this.storedData = {} as Cart;
      this.data = await this.api.getRecogidaById(this.id);
      this.categories = await this.api.getRecogidaCategories(this.id);
      this.allEntregas = await this.api.getRecogidaMenu(this.id);
      this.entregas = [...this.allEntregas];
      console.log('entregas: ', this.entregas);
      console.log('recogida: ', this.data);
      await this.cartService.getCartData();
      this.isLoading = false;
      // this.allItems.forEach((element, index) => {
        //     this.allItems[index].quantity = 0;
        //   });
    } catch(e) {
      console.log(e);
      this.isLoading = false;
      this.global.errorToast();
    }
  }

  quantityPlus(entrega) {
    const index = this.allEntregas.findIndex(x => x.id === entrega.id);
    console.log(index);
    if(!this.allEntregas[index].cantidad || this.allEntregas[index].cantidad == 0) {
      if(!this.storedData.recogida || (this.storedData.recogida && this.storedData.recogida.uid == this.id)) {
        console.log('index item: ', this.allEntregas);
        this.cartService.quantityPlus(index, this.allEntregas, this.data);
      } else {
        // alert for clear cart
        this.cartService.alertClearCart(index, this.allEntregas, this.data);
      }
    } else {
      this.cartService.quantityPlus(index, this.allEntregas, this.data);
    }  
  }

  quantityMinus(entrega) {
    const index = this.allEntregas.findIndex(x => x.id === entrega.id);
    this.cartService.quantityMinus(index, this.allEntregas);
  }

  saveToCart() {
    try {
      this.cartData.recogida = {} as Recogida;
      this.cartData.recogida = this.data;
      console.log('save cartData: ', this.cartData);
      this.cartService.saveCart();
    } catch(e) {
      console.log(e);
    }
  }

  async viewCart() {
    console.log('save cartdata: ', this.cartData);
    if(this.cartData.entregas && this.cartData.entregas.length > 0) await this.saveToCart();
    console.log('router url: ', this.router.url);
    this.router.navigate([this.router.url + '/cart']);
  }

  checkCategoriaEntrega(id) {
    const entrega = this.entregas.find(x => x.category_id.id == id);
    if(entrega) return true;
    return false;
  }

  async ionViewWillLeave() {
    console.log('ionViewWillLeave EntregasPage');
    if(this.cartData?.entregas && this.cartData?.entregas.length > 0) await this.saveToCart();
  }

  ngOnDestroy() {
    if(this.cartSub) this.cartSub.unsubscribe();
  }

}
