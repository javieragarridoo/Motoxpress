import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMenuEntregaPage } from './add-menu-entrega.page';

const routes: Routes = [
  {
    path: '',
    component: AddMenuEntregaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMenuEntregaPageRoutingModule {}
