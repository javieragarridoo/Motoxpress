import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMenuEntregaPageRoutingModule } from './add-menu-entrega-routing.module';

import { AddMenuEntregaPage } from './add-menu-entrega.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMenuEntregaPageRoutingModule
  ],
  declarations: [AddMenuEntregaPage]
})
export class AddMenuEntregaPageModule {}
