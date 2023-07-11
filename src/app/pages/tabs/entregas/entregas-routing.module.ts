import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntregasPage } from './entregas.page';

const routes: Routes = [
  {
    path: '',
    component: EntregasPage
  },  
  {
    path: 'cart',
    loadChildren: () => import('../cart/cart.module').then( m => m.CartPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntregasPageRoutingModule {}
