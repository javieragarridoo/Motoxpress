import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Strings } from 'src/app/enum/strings.enum';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  type: boolean = true;
  isLogin = false;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private global: GlobalService) { }

  ngOnInit() {
  }

  changeType() {
    this.type = !this.type;
  }

  onSubmit(form: NgForm) {
    console.log(form);
    if(!form.valid) return;
    this.login(form);
  }

  login(form) {
    this.isLogin = true;
    this.authService.login(form.value.email, form.value.password).then(data => {
      console.log(data);
      this.navigate(data);
      this.isLogin = false;
      form.reset();
    })
    .catch(e => {
      console.log(e);
      this.isLogin = false;
      let msg: string = 'No te has podido registrar, intenta nuevamente';
      if(e.code == 'auth/user-no-encotrado') msg = 'direccion de email no encontrada';
      else if(e.code == 'auth/clave-incorrecta') msg = 'Ingresa contraseña válida';
      this.global.showAlert(msg);
    });
  }

  navigate(data?) {    
    let url = Strings.TABS;
    if(data == 'admin') url = Strings.ADMIN;
    this.router.navigateByUrl(url);
  }

}
