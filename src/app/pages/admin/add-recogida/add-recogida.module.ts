import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddRecogidaPageRoutingModule } from './add-recogida-routing.module';

import { AddRecogidaPage } from './add-recogida.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddRecogidaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AddRecogidaPage]
})
export class AddRecogidaPageModule {}
