import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
      },
      {
        path: 'account',
        loadChildren: () => import('./account/account.module').then( m => m.AccountPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/account',
        pathMatch: 'full'
      },
      {
        path: 'ver-asignadas',
        loadChildren: () => import('./ver-asignadas/ver-asignadas.module').then( m => m.VerAsignadasPageModule)
      },
    
    ]
  },
  {
    path: 'ver-asignadas/geo/:lat/:lng',
    loadChildren: () => import('./geo/geo.module').then( m => m.GeoPageModule)
  },
  {
    path: 'recogidas/:recogidaId',
    loadChildren: () => import('./entregas/entregas.module').then( m => m.EntregasPageModule)
  },
  {
    path: 'address',
    loadChildren: () => import('./address/address.module').then( m => m.AddressPageModule)
  },
  {
    path: 'rider-asignado',
    loadChildren: () => import('./rider-asignado/rider-asignado.module').then( m => m.RiderAsignadoPageModule)
  },
  

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
