import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddRecogidaPage } from './add-recogida.page';

const routes: Routes = [
  {
    path: '',
    component: AddRecogidaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddRecogidaPageRoutingModule {}
