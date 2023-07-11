import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ProfileService } from 'src/app/services/profile/profile.service';


@Component({
  selector: 'app-historial-ordenes',
  templateUrl: './historial-ordenes.page.html',
  styleUrls: ['./historial-ordenes.page.scss'],
})
export class HistorialOrdenesPage implements OnInit {
  profile: any = {};
  isLoading: boolean;
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  profileSub: Subscription;
  searchTerm: string = '';

  constructor(
    private navCtrl: NavController,
    private orderService: OrderService,
    private global: GlobalService,
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.profileSub = this.profileService.profile.subscribe((profile) => {
      this.profile = profile;
    });
    this.getData();
  }

  async getData() {
    try {
      this.isLoading = true;
      await this.profileService.getProfile();
      this.orders = await this.orderService.getOrders();
      this.filteredOrders = [...this.orders];
      this.isLoading = false;
    } catch (error) {
      console.log(error);
      this.isLoading = false;
      this.global.errorToast('Error al obtener las órdenes');
    }
  }
  

  navigateToOrderDetail(orderId: string, usuarioId: string) {
    this.navCtrl.navigateForward(['/admin/ver-ordenes/asignar-orden', orderId, usuarioId]);
  }
}
