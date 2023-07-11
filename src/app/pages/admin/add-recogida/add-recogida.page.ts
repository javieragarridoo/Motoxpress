import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Recogida } from 'src/app/models/recogida.model';
import db from 'src/environments/configfb';


@Component({
  selector: 'app-add-recogida',
  templateUrl: './add-recogida.page.html',
  styleUrls: ['./add-recogida.page.scss'],
})
export class AddRecogidaPage implements OnInit {

  isLoading: boolean = false;
  coverImage: any;
  comunas: any[] = [];
  location: any = {};
  category: string;
  isSector: boolean = false;
  sectores: any[] = [];
  categories: any[] = [];
  docRef: any;

  constructor(
    private authService: AuthService, 
    public afStorage: AngularFireStorage,
    public apiService: ApiService,
    private global: GlobalService) { }

  ngOnInit() {
    this.getComunas();
  }

  async getComunas() {
    try {
      this.comunas = await this.apiService.getComunas();
    } catch(e) {
      console.log(e);
      this.global.errorToast();
    }
  }

  async buscarUbicacion() {
    try {
      const options = {
        component: SearchLocationComponent,
      };
      const modal = await this.global.createModal(options);
      if(modal) {
        console.log(modal);
        this.location = modal;
      }
    } catch(e) {
      console.log(e);

    }
  }

  addCategoria() {
    console.log(this.category);
    if(this.category.trim() == '') return;
    console.log(this.isSector);
    const checkString = this.categories.find(x => x == this.category);
    if(checkString) {
      this.global.errorToast('Categoria ya agregada');
      return;
    }
    this.categories.push(this.category);
    if(this.isSector) this.sectores.push(this.category);
  }

  clearCategoria() {
    this.categories = [];
    this.sectores = [];
  }

  getArrayAsString(array) {
    return array.join(', ');
  }

  preview(event) {
    console.log(event);
    const files = event.target.files;
    if(files.length == 0) return;
    const mimeType = files[0].type;
    if(mimeType.match(/image\/*/) == null) return;
    const file = files[0];
    const filePath = 'recogidas/' + Date.now() + '_' + file.name;
    const fileRef = this.afStorage.ref(filePath);
    const task = this.afStorage.upload(filePath, file);
    task.snapshotChanges()
    .pipe(
      finalize(() => {
        const downloadUrl = fileRef.getDownloadURL();
        downloadUrl.subscribe(url => {
          console.log('url: ', url);
          if(url) {
            this.coverImage = url;
          }
        })
      })
    )
    .subscribe(url => {
      console.log('data: ', url);
    });
  }

  onSubmit(form: NgForm) {
    if(!form.valid) return;
    if(!this.coverImage || this.coverImage == '') {
      this.global.errorToast('Selecciona una imagen de portada');
      return;
    }
    if(this.location && this.location?.lat) this.addRecogida(form);
    else this.global.errorToast('Selecciona una imagen para la direccion de recogida');
  }

  getID() {
    const id_recogida = {
      Nombre: 'TEST'
    };
  
    db.collection('recogidas')
      .add(id_recogida)
      .then(docRef => {
        console.log('UID del documento:', docRef.id);
        this.docRef = docRef
        console.log('UID del documento INSTANCIADO:', this.docRef.id);
      });
  }
  


  async addRecogida(form: NgForm) {
    try {
      this.isLoading = true;
      console.log(form.value);
      const data = this.docRef
      if(data?.id) {
        const position = new firebase.firestore.GeoPoint(this.location.lat, this.location.lng);
        const recogida = new Recogida(
          data.id,
          this.coverImage ? this.coverImage : '',
          form.value.recogida_nombre,
          (form.value.recogida_nombre).toLowerCase(),
          this.sectores,
          0,
          form.value.tiempo_entrega,
          form.value.precio,
          false,
          form.value.descripcion,
          form.value.hora_recogida,
          form.value.hora_entrega,
          form.value.comuna,
          this.location.address,
          'active',
          0,
          position
        );
        const result = await this.apiService.addRecogida(recogida, data.id);
        console.log(result);
        await this.apiService.addCategories(this.categories, data.id);
        // form.reset();
        this.global.successToast('Recogida agregada exitosamente!');
      } else {
        this.global.showAlert('Error al agregar una recogida');
      }
      this.isLoading = false;       
    } catch(e) {
      console.log(e);
      this.isLoading = false;
      let msg: string = 'No se pudo registrar una recogida, reintenta';
      if(e.code == 'auth/email-en-uso') {
        msg = e.message;
      }
      this.global.showAlert(msg);
    }
  }
}
