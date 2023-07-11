import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Order } from 'src/app/models/order.model';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { GlobalService } from 'src/app/services/global/global.service';
import firebase from 'firebase/compat/app';
import db from 'src/environments/configfb';
import { OrderService } from 'src/app/services/order/order.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';

declare var google;

@Component({
  selector: 'app-geo',
  templateUrl: './geo.page.html',
  styleUrls: ['./geo.page.scss'],
})
export class GeoPage implements OnInit {


  tiempoTranscurrido: number = 0;
  timer: any;


  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  ordersSub: Subscription;
  profileSub: Subscription;

  usuario: any;
  cantidad: number;
  lat: any;
  lng: any;
  boton_recarga: boolean = false;

  id_rider: any;
  entrega: any = {}
  id_orden_asig: string;
  id_usuario_asig: string;
  orders: any = {};
  direccion_llegada: any;

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private api: ApiService,
    private cartService: CartService,
    private global: GlobalService,
    private orderService: OrderService,
    private authService: AuthService) { }


  async ngOnInit() {

    this.ordersSub = this.orderService.orders.subscribe(order => {
      console.log('order data: ', order);
      this.orders = order;
    }, e => {
      console.log(e);
    });


    this.lat = this.route.snapshot.paramMap.get('lat');
    this.lng = this.route.snapshot.paramMap.get('lng');

    console.log('check id: ', this.lat);
    if (!this.lat) {
      this.navCtrl.back();
      return;
    }

    console.log('LAT:', this.lat);
    console.log('LNG: ', this.lng);

    await this.cargarMapa();
    this.autocompletado(this.map, this.marker);
    this.getData();
  }

  //VARIABLES PARA EL MAPA:
  latitud: number;
  longitud: number;
  //VARIABLE MAP: variable a través de la cual se carga el mapa de google.
  map: any;
  marker: any;
  search: any;
  //NECESITAMOS 2 VARIABLES GLOBALES PARA CALCULAR Y MOSTRAR RUTA EN EL MAPA:
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  async cargarMapa() {
    //obtengo latitud y longitud del navegador:

    this.lat = parseFloat(this.route.snapshot.paramMap.get('lat'));
    this.lng = parseFloat(this.route.snapshot.paramMap.get('lng'));


    //mapa: toma el elemento div llamado map desde el HTML:
    const mapa: HTMLElement = document.getElementById('map');

    this.map = new google.maps.Map(mapa, {
      center: {
        lat: this.lat,
        lng: this.lng
      },
      zoom: 14
    });
    this.directionsRenderer.setMap(this.map);
    const indicacionesHTML: HTMLElement = document.getElementById('indicaciones');
    this.directionsRenderer.setPanel(indicacionesHTML);

    this.marker = new google.maps.Marker({
      position: { lat: this.lat, lng: this.lng },
      map: this.map,
      title: 'Ubicacion inicial'
    });
  }

  obtenerUbicacion(): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    );
  }
  autocompletado(mapaLocal, marcadorLocal) {
    const input = document.getElementById('input-autocomplete');
    const autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.bindTo('bounds', this.map);
    this.search = autocomplete;

    autocomplete.addListener('place_changed', function () {
      var place = autocomplete.getPlace().geometry.location;
      mapaLocal.setCenter(place);
      mapaLocal.setZoom(15);

      marcadorLocal.setPosition(place);
      marcadorLocal.setMap(mapaLocal);

    });
  }
  async calcularRuta() {
    var geolocation = await this.obtenerUbicacion();
    this.latitud = geolocation.coords.latitude;
    this.longitud = geolocation.coords.longitude;

    var request = {
      origin: { lat: this.latitud, lng: this.longitud },
      destination: { lat: this.lat, lng: this.lng },
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (resultado, status) => {
      this.directionsRenderer.setDirections(resultado);
    });
    this.marker.setPosition(null);

  }

  async marcarRecogida() {
    await this.getData();

    if (this.direccion_llegada && this.direccion_llegada.lat) {
      this.latitud = parseInt(this.direccion_llegada.lat, 10);
    }

    this.longitud = this.direccion_llegada && this.direccion_llegada.ln;
    this.boton_recarga = true;

  }

  async getData() {
    // OBTENEMOS EL ID DEL RIDER LOGUEADO
    this.id_rider = this.authService.getId();
    this.id_rider = this.id_rider.__zone_symbol__value;
    this.id_rider = this.id_rider.toString(); // Convertir a cadena

    console.log('ID RIDER:', this.id_rider);

    const userRef = db.collection('users').doc(this.id_rider);
    const userSnapshot = await userRef.get();
    this.entrega = userSnapshot.data(); // Obtener los datos del documento

    this.id_orden_asig = this.entrega.orden_asignada.id_orden;
    this.direccion_llegada = this.entrega.orden_asignada.lugar;
    console.log('ORDER LUGAR ', this.direccion_llegada);

    const orderRef = db.collection('orders').doc(this.id_usuario_asig).collection('all').doc(this.id_orden_asig);
    const orderSnapshot = await orderRef.get();
    this.orders = orderSnapshot.data();
  }


  startTimer() {
    this.timer = interval(1000).subscribe(() => {
      this.tiempoTranscurrido++;
    });
  }

  stopTimer() {
    if (this.timer) {
      this.timer.unsubscribe();
      this.timer = null;
    }
  }



  finalizarPedido() {
    db.collection('users').doc(this.id_rider)
      .update({
        orden_asignada: {},
        entrega: {}
      })
      .then(() => {
        console.log('Orden entregada correctamente');
      })
      .catch((error) => {
        console.log('Error al entregar la orden:', error);
      });

    db.collection('orders').doc(this.id_usuario_asig).collection('all').doc(this.id_orden_asig)
      .update({
        status: 'completed'
      })
      .catch((error) => {
        console.log('Error al entregar la orden:', error);
      });
  }

  ngOnDestroy() {
    if (this.ordersSub) this.ordersSub.unsubscribe();
    if (this.profileSub) this.profileSub.unsubscribe();
  }
}

