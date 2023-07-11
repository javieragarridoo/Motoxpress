import { Injectable } from '@angular/core';
import { Address } from 'src/app/models/address.model';
import { Category } from 'src/app/models/category.model';
import { Entrega } from 'src/app/models/entrega.model';
import { Order } from 'src/app/models/order.model';
import { Recogida } from 'src/app/models/recogida.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { switchMap } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import * as geofirestore from 'geofirestore';
import { Banner } from 'src/app/models/banner.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  radius = 20;// in km
  firestore = firebase.firestore();
  GeoFirestore = geofirestore.initializeApp(this.firestore);

  recogidas: Recogida[] = [];
  allRecogidas: Recogida[] = [];
  recogidas1: Recogida[] = [];  
  categories: Category[] = [];
  allEntregas: Entrega[] = [];
  addresses: Address[] = [];
  orders: Order[] = [];


  constructor(
    private adb: AngularFirestore
  ) {}

  collection(path, queryFn?) {
    return this.adb.collection(path, queryFn);
  }

  geoCollection(path) {
    return this.GeoFirestore.collection(path);
  }

  randomString() {
    const id = Math.floor(100000000 + Math.random() * 900000000);
    return id.toString();
  }

  // banner apis
  async addBanner(data) {
    try {
      const id = this.randomString();
      // data.id = id;
      const bannerData = new Banner(
        id, 
        data.banner, 
        data.status
      );
      let banner = Object.assign({}, bannerData);
      delete banner.res_id;
      await this.collection('banners').doc(id).set(banner);
      return true;
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  async getBanners() {
    try {
      const banners: Banner[] = await this.collection('banners').get().pipe(
        switchMap(async(data: any) => {
          let bannerData = await data.docs.map(element => {
            const entrega = element.data();
            return entrega;
          });
          console.log(bannerData);
          return bannerData;
        })
      ).toPromise();
      console.log(banners);
      return banners;
    } catch(e) {
      throw(e);
    }
  }

  // comuna apis
  async getComunas() {
    try {
      const comunas = await this.collection('comunas').get().pipe(
        switchMap(async(data: any) => {
          let comunaData = await data.docs.map(element => {
            let entrega = element.data();
            entrega.uid = element.id;
            return entrega;
          });
          console.log(comunaData);
          return comunaData;
        })
      ).toPromise();
      console.log(comunas);
      return comunas;
    } catch(e) {
      throw(e);
    }
  }

  //  recogida apis
  async addRecogida(data: any, uid) {
    try {
      let recogida = Object.assign({}, data);
      delete recogida.g;
      delete recogida.distance;
      console.log(recogida);
      const response = await this.geoCollection('recogidas').doc(uid).set(recogida);
      return response;
    } catch(e) {
      throw(e);
    }
  }

  async getRecogidas() {
    try {
      const recogidas = await this.collection('recogidas').get().pipe(
        switchMap(async(data: any) => {
          let recogidaData = await data.docs.map(element => {
            const entrega = element.data();
            return entrega;
          });
          console.log(recogidaData);
          return recogidaData;
        })
      ).toPromise();
      console.log(recogidas);
      return recogidas;
    } catch(e) {
      throw(e);
    }
  }

  async getRecogidaById(id): Promise<any> {
    try {
      const recogida = (await (this.collection('recogidas').doc(id).get().toPromise())).data();
      console.log(recogida);
      return recogida;
    } catch(e) {
      throw(e);
    }
  }

  async getOrdenById(usuarioId, id): Promise<any> {
    try {
      const orden = (await (this.collection('orders').doc(usuarioId).collection('all').doc(id).get().toPromise())).data();
      console.log(orden);
      return orden;
    } catch(e) {
      throw(e);
    }
  }

  /*
  async getNearbyRecogidas(lat, lng): Promise<any> {
    try {
      const center = new firebase.firestore.GeoPoint(lat, lng);
      const radius = this.radius;
      const data = await (await this.geoCollection('recogidas').near({ center, radius: this.radius })
      .get()).docs.sort((a, b) => a.distance - b.distance).map(element => {
        let entrega: any = element.data();
        entrega.id = element.id;
        entrega.distancia = element.distance;
        return entrega;
      });
      return data;
    } catch(e) {
      throw(e);
    }
  }
 */
  async getAllRecogidas(): Promise<any> {
    try {
      const data = await (await this.geoCollection('recogidas')
      .get()).docs.sort().map(element => {
        let entrega: any = element.data();
        entrega.id = element.id;
        return entrega;
      });
      return data;
    } catch(e) {
      throw(e);
    }
  }
  // categories
  async getRecogidaCategories(uid) {
    try {
      const categories = await this.collection(
        'categories',
        ref => ref.where('uid', '==', uid)
      ).get().pipe(
        switchMap(async(data: any) => {
          let categoryData = await data.docs.map(element => {
            const entrega = element.data();
            return entrega;
          });
          console.log(categoryData);
          return categoryData;
        })
      ).toPromise();
      console.log(categories);
      return categories;
    } catch(e) {
      throw(e);
    }
  }

  async addCategories(categories, uid) {
    try {
      categories.forEach(async(element) => {
        const id = this.randomString();
        const data = new Category(
          id,
          element,
          uid
        );
        const result = await this.collection('categories').doc(id).set(Object.assign({}, data));        
      });
      return true;
    } catch(e) {
      throw(e);
    }
  }

  // menu
  async addMenuEntrega(data) {
    try {
      const id = this.randomString();
      const entrega = new Entrega(
        id,
        data.recogida_id,
        this.firestore.collection('categories').doc(data.categoria_id),
        data.cover,
        data.nombre,
        data.descripcion,
        data.precio,
        data.estado,
        false,
        0
      );
      let entregaData = Object.assign({}, entrega);
      delete entregaData.cantidad;
      console.log(entregaData);
      const result = await this.collection('menu').doc(data.recogida_id).collection('allEntregas').doc(id).set(entregaData);
      return true;
    } catch(e) {
      throw(e);
    }
  }

  async getRecogidaMenu(uid) {
    try {
      const entregasRef = await this.collection('menu').doc(uid)
          .collection('allEntregas', ref => ref.where('estado', '==', true));
      const entregas = entregasRef.get().pipe(
        switchMap(async(data: any) => {
          let entregaData = await data.docs.map(element => {
            let entrega = element.data();
            entrega.category_id.get()
            .then(cData => {
              entrega.category_id = cData.data();
            })
            .catch(e => { throw(e); });
            return entrega;
          });
          console.log(entregaData);
          return entregaData;
        })
      )
      .toPromise();
      console.log(entregas);
      return entregas;
    } catch(e) {
      throw(e);
    }
  }

}