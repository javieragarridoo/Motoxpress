import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Category } from 'src/app/models/category.model';
import { Recogida } from 'src/app/models/recogida.model';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-menu-entrega',
  templateUrl: './add-menu-entrega.page.html',
  styleUrls: ['./add-menu-entrega.page.scss'],
})
export class AddMenuEntregaPage implements OnInit {

  @ViewChild('filePicker', {static: false}) filePickerRef: ElementRef;
  recogidas: Recogida[] = [];
  categories: Category[] = [];
  image: any;
  isLoading: boolean = false;
  veg = true;
  estado = true;
  imageFile: any;
  category: any;

  constructor(
    public global: GlobalService,
    public apiService: ApiService,
    private afStorage: AngularFireStorage,
    private router: Router
  ) { }

  ngOnInit() {
    this.getRecogidas();
  }

  async getRecogidas() {
    try {
      this.global.showLoader();
      this.recogidas = await this.apiService.getRecogidas();
      this.global.hideLoader();
    } catch(e) {
      console.log(e);
      this.global.hideLoader();
      this.global.errorToast();
    }
  }

  async changeRecogida(event) {
    try {
      console.log(event);
      this.global.showLoader();
      this.categories = await this.apiService.getRecogidaCategories(event.detail.value);
      this.category = '';
      this.global.hideLoader();
    } catch(e) {
      console.log(e);
      this.global.hideLoader();
      this.global.errorToast();
    }

  }

  async onSubmit(form: NgForm) {
    if(!form.valid || !this.image) return;
    try {
      this.isLoading = true;
      const url = await this.uploadImage(this.imageFile);
      console.log(url);      
      if(!url) {
        this.isLoading = false;
        this.global.errorToast('No se pudo cargar la imagen, intenta otra vez');
        return;
      }
      const data = {
        cover: url,
        estado: this.estado,
        ...form.value
      };
      console.log('data: ', data);      
      await this.apiService.addMenuEntrega(data);
      this.isLoading = false;
      this.global.successToast('Menu de entrega agregado correctamente');
      this.router.navigate(['/admin/admin-cruds']);
    } catch(e) {
      console.log(e);
      this.isLoading = false;
      this.global.errorToast();
    }
  }

  changeImage() {
    this.filePickerRef.nativeElement.click();
  }

  onFileChosen(event) {
    const file = event.target.files[0];
    if(!file) return;
    console.log('file: ', file);
    this.imageFile = file;
    const reader = new FileReader();
    console.log(reader);
    reader.onload = () => {
      const dataUrl = reader.result.toString();
      this.image = dataUrl;
      console.log('image: ', this.image);
    };
    reader.readAsDataURL(file);
  }

  uploadImage(imageFile) {
    return new Promise((resolve, reject) => {
      const mimeType = imageFile.type;
      if(mimeType.match(/image\/*/) == null) return;
      const file = imageFile;
      const filePath = 'menu/' + Date.now() + '_' + file.name;
      const fileRef = this.afStorage.ref(filePath);
      const task = this.afStorage.upload(filePath, file);
      task.snapshotChanges()
      .pipe(
        finalize(() => {
          const downloadUrl = fileRef.getDownloadURL();
          downloadUrl.subscribe(url => {
            console.log('url: ', url);
            if(url) {
              resolve(url);
            }
          })
        })
      ).subscribe(url => {
        console.log(url);
      });
    });
  }

}
