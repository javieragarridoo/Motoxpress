import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EntregasPageRoutingModule } from './entregas-routing.module';

import { EntregasPage } from './entregas.page';
import { EntregaComponent } from 'src/app/components/entrega/entrega.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { RecogidaDetalleComponent } from 'src/app/components/recogida-detalle/recogida-detalle.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EntregasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EntregasPage, EntregaComponent, RecogidaDetalleComponent]
})
export class EntregasPageModule {}
