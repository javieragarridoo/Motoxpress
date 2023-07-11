import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  isLoading = false;

  constructor(
    private navCtrl: NavController,
    private auth: AuthService, 
    private global: GlobalService) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    if(!form.valid) return;
    this.isLoading = true;
    this.auth.resetPassword(form.value.email).then(() => {     
      this.global.successToast('Link para cambiar contraseña ha sido enviado a la dirección de correo electrónico');
      this.isLoading = false;
      this.navCtrl.back();
    })
    .catch(e => {
      console.log(e);   
      this.isLoading = false;
      this.global.showAlert('Algo ha salido mal');
    });
  }

}
